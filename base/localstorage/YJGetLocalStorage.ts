// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../../no";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/localstorage/YJGetLocalStorage(获取本地缓存数据)')
export default class YJGetLocalStorage extends cc.Component {

    @property({ displayName: '本地缓存数据的key', tooltip: '多个key用 , 分割' })
    keys: string = '';
    @property(no.EventHandlerInfo)
    calls: no.EventHandlerInfo[] = [];

    onLoad() {
        let v = new Object();
        let ks = this.keys.split(',');
        ks.forEach(key => {
            v[key] = localStorage.getItem(key);
        });
        no.EventHandlerInfo.execute(this.calls, v);
    }
}
