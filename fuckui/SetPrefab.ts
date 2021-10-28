// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import YJDataWork from "../base/YJDataWork";
import YJLoadPrefab from "../base/YJLoadPrefab";
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetPrefab(动态创建节点:object|array)')
export default class SetPrefab extends FuckUi {

    @property({ type: YJLoadPrefab, displayName: '元素预制体' })
    loadPrefab: YJLoadPrefab = null;
    @property({ type: cc.Node, displayName: '元素模板' })
    template: cc.Node = null;

    @property({ type: cc.Node, displayName: '容器' })
    container: cc.Node = null;

    onLoad() {
        this.container = this.container || this.node;
    }

    protected onDataChange(data: any) {
        this.setItems([].concat(data));
    }

    private async setItems(data: any[]) {
        if (!this.template) {
            this.template = await this.loadPrefab.loadPrefab();
        }
        let n = data.length
        if (this.container.childrenCount < n) {
            for (let i = this.container.childrenCount; i < n; i++) {
                cc.instantiate(this.template).parent = this.container;
            }
        }
        n = this.container.childrenCount;
        for (let i = 0; i < n; i++) {
            let item = this.container.children[i];
            if (data[i] == null) item.active = false;
            else {
                item.active = true;
                (item.getComponent(YJDataWork) || item.getComponentInChildren(YJDataWork)).data = data[i];
            }
        }
    }
}
