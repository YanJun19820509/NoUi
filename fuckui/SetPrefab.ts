// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import YJDataWork from "../base/YJDataWork";
import YJLoadPrefab from "../base/YJLoadPrefab";
import { no } from "../no";
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetPrefab(动态创建节点:object|array)')
export default class SetPrefab extends FuckUi {

    @property(YJLoadPrefab)
    loadPrefab: YJLoadPrefab = null;

    @property(cc.Node)
    target: cc.Node = null;

    protected _list: Object;

    protected onDataChange(data: any) {
        if (data == null) return;
        this.setItems(data);
    }

    private async setItems(data: any) {
        await this.loadPrefab.loadPrefab();
        this.createItems(data);
    }

    protected async createItems(data: any) {
        if (this._list == null)
            this._list = new Object();
        let arr = [].concat(data);
        let len = arr.length;
        if (len == 0) {
            for (const key in this._list) {
                this._list[key].destroy();
            }
            this._list = null;
            return;
        }
        for (const key in this._list) {
            this._list[key].active = false;
        }
        for (let i = 0; i < len; i++) {
            if (arr[i] == null) continue;
            let id = String(i);
            if (!this._list[id]) {
                let item = cc.instantiate(this.loadPrefab.loadedNode);
                item.active = false;
                item.parent = this.target || this.node;
                this._list[id] = item;
                await no.sleep(0.1);
            }

            let dataWork = this._list[id].getComponent(YJDataWork) || this._list[id].getComponentInChildren(YJDataWork);
            if (dataWork)
                dataWork.data = arr[i];
        }
    }
}
