// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";
import YJCacheObject from "./YJCacheObject";
import YJLoadPrefab from "./YJLoadPrefab";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/base/YJCreateNode(创建节点)')
export default class YJCreateNode extends cc.Component {

    @property(YJLoadPrefab)
    loadPrefab: YJLoadPrefab = null;

    @property(cc.Node)
    target: cc.Node = null;

    @property
    autoCreate: boolean = false;

    private _recycleType: string;

    start() {
        this.autoCreate && this.a_create();
    }

    public async a_create() {
        let a = await this.createNode();
        if (a != null) {
            a.parent = this.target;
            a.active = true;
        }
    }

    public async createNode(): Promise<cc.Node> {
        let a: cc.Node;
        if (this._recycleType != null) {
            a = no.cachePool.reuse(this._recycleType);
        }

        if (a == null) {
            let node = await this.loadPrefab.loadPrefab();
            if (node == null) return null;
            a = cc.instantiate(node);
            this._recycleType = node.getComponent(YJCacheObject)?.recycleType;
        }
        return a;
    }
}
