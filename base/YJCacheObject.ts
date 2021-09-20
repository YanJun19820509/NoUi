// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('NoUi/base/YJCacheObject(缓存对象)')
export default class YJCacheObject extends cc.Component {

    @property({ displayName: '回收类型' })
    recycleType: string = '';
    @property({ visible() { return !this.resetOnDisable; } })
    recycleOnDisable: boolean = false;

    onDisable() {
        this.recycleOnDisable && this.recycle();
    }

    public recycle(): void {
        no.cachePool.recycle(this.recycleType, this.node);
    }
}
