// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import YJLoadPrefab from "../base/YJLoadPrefab";
import { no } from "../no";
import FuckUi from "./FuckUi";
import SetPrefab from "./SetPrefab";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetList(设置列表:array)')
export default class SetList extends FuckUi {

    @property({ type: YJLoadPrefab, displayName: '元素容器', tooltip: '管理列表子项布局的容器，需要挂载SetPrefab组件' })
    itemPanel: YJLoadPrefab = null;

    @property({ displayName: '列数', step: 1, min: 1 })
    columnNumber: number = 1;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property({ displayName: '数据更新时自动回滚到第1个' })
    autoScrollBack: boolean = false;

    private listData: any[];
    private listItems: cc.Node[] = [];
    private viewSize: cc.Size;
    private itemSize: cc.Size;
    private itemPanelNode: cc.Node;
    private isVertical: boolean;
    private content: cc.Node;
    /**
     * 横向时指宽，纵向时指高
     */
    private contentSize: number;
    private showMax: number;//可视区域内最多可显示的itemPanel个数
    private showNum: number;//实际最多可显示的itemPanel个数
    private allNum: number;
    /**
     * node最后的位置，横向时指x，纵向时指y
     */
    private lastIndex: number = 0;
    private _loaded: boolean = false;

    async onLoad() {
        let node = await this.itemPanel.loadPrefab();
        this.itemSize = node.getBoundingBox().size;
        this.viewSize = this.scrollView.node.getBoundingBox().size;
        this.isVertical = this.scrollView.vertical;
        this.content = this.scrollView.content;

        if (this.isVertical) {
            this.showMax = Math.ceil(this.viewSize.height / this.itemSize.height);
        } else {
            this.showMax = Math.ceil(this.viewSize.width / this.itemSize.width);
        }
        this._loaded = true;
    }

    protected async onDataChange(data: any) {
        await no.waitFor(() => { return this._loaded; });
        let a = [].concat(data);
        if (this.columnNumber > 1) {
            a = no.arrayToArrays(a, this.columnNumber);
        }
        this.allNum = a.length;
        if (this.listData?.length != this.allNum) {
            if (this.showMax >= this.allNum) this.showNum = this.allNum;
            else this.showNum = this.showMax + 2;
            this.initItems();
        }
        this.listData = a;
        this.setList(this.autoScrollBack ? 0 : this.lastIndex);
    }

    private async initItems() {
        await no.waitFor(() => { return this.itemPanel.loaded; });
        if (this.isVertical) {
            this.contentSize = this.allNum * this.itemSize.height;
            this.content.width = this.itemSize.width;
            this.content.height = this.contentSize;
        } else {
            this.contentSize = this.allNum * this.itemSize.width;
            this.content.width = this.contentSize;
            this.content.height = this.itemSize.height;
        }
        for (let i = this.listItems.length; i < this.showNum; i++) {
            let item = cc.instantiate(this.itemPanel.loadedNode);
            item.parent = this.content;
            this.listItems[this.listItems.length] = item;
        }
    }

    private async setList(start: number) {
        await no.waitFor(() => { return this.listItems.length == this.showNum });
        if (start != this.lastIndex) {
            if (this.allNum - start < this.showMax) {
                start = this.allNum - this.showMax;
            }
            if (start < 0) start = 0;
            if (this.isVertical) {
                this.content.y = start * this.itemSize.height;
            } else {
                this.content.x = start * this.itemSize.width;
            }
            this.lastIndex = start;
        }

        for (let i = 0, n = this.listItems.length; i < n; i++) {
            let item = this.listItems[i];
            this.setItemPosition(item, start + i);
            this.setItemData(item, this.listData[start + i]);
        }
    }

    private setItemData(item: cc.Node, data: any) {
        (item.getComponent(SetPrefab) || item.getComponentInChildren(SetPrefab)).setData(data);
    }

    private setItemPosition(item: cc.Node, index: number) {
        item['__dataIndex'] = index;
        if (this.isVertical) {
            item.y = -(index + 1 - item.anchorY) * this.itemSize.height + this.content.height * (1 - this.content.anchorY);
        } else {
            item.x = (index + item.anchorX) * this.itemSize.width - this.content.height * this.content.anchorX;
        }
    }

    update() {
        if (this.listData == null || this.listItems == null || this.listItems.length == 0) return;
        let curPos = 0;
        let startIndex = 0;
        if (this.isVertical) {
            curPos = this.content.y;
            startIndex = Math.floor(curPos / this.itemSize.height);
        } else {
            curPos = this.content.x;
            startIndex = Math.floor(-curPos / this.itemSize.width);
        }
        //到左或到顶
        if (this.lastIndex == 0 && startIndex <= this.lastIndex) return;
        //到右或到底
        if (this.lastIndex == this.allNum - (this.showNum - 2) && startIndex >= this.lastIndex) return;

        let diff = startIndex - this.lastIndex;
        if (diff != 0) {
            this.lastIndex = startIndex;
            let n = this.listItems.length;
            for (let i = 0; i < n; i++) {
                let item = this.listItems[i];
                let dataIndex = item['__dataIndex'];
                if (diff < 0) {//向右
                    if (dataIndex - startIndex > this.showNum - 1 && dataIndex - n >= 0) {
                        this.setItemData(item, this.listData[dataIndex - n]);
                        this.setItemPosition(item, dataIndex - n);
                    }
                } else if (diff > 0) {//向左
                    if (dataIndex < startIndex && dataIndex + n < this.allNum) {
                        this.setItemData(item, this.listData[dataIndex + n]);
                        this.setItemPosition(item, dataIndex + n);
                    }
                }
            }
        }
    }
}
