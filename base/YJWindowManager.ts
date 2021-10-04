// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";
import YJLoadPrefab from "./YJLoadPrefab";

const { ccclass, property } = cc._decorator;

@ccclass('WindowInfo')
export class WindowInfo {
    @property({ displayName: '触发类型', tooltip: '触发显示时的事件类型' })
    type: string = '';
    @property(YJLoadPrefab)
    prefabLoader: YJLoadPrefab = null;
    @property({ displayName: '回收类型' })
    recycleType: string = '';
    @property({ displayName: '加载时创建' })
    createOnLoad: boolean = false;
}

@ccclass
export default class YJWindowManager extends cc.Component {

    @property(WindowInfo)
    infos: WindowInfo[] = [];
    @property(cc.Node)
    parent: cc.Node = null;

    onLoad() {
        this.infos.forEach(info => {
            no.Evn.on(info.type, this.onCreate, this);
            if (info.createOnLoad) this.createNode(info.recycleType, info.prefabLoader);
        });
    }

    private onCreate(type: string) {
        for (let i = 0, n = this.infos.length; i < n; i++) {
            let info = this.infos[i];
            if (info.type == type) {
                this.createNode(info.recycleType, info.prefabLoader);
            }
        }
    }

    private async createNode(recycleType: string, loader: YJLoadPrefab) {
        let node = no.cachePool.reuse<cc.Node>(recycleType);
        if (!node) {
            await loader.loadPrefab();
            node = cc.instantiate(loader.loadedNode);
        }
        node.parent = this.parent;
    }
}
