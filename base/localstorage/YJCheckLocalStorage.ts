// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../../no";

const { ccclass, property, menu } = cc._decorator;

@ccclass('CheckLocalStorageInfo')
export class CheckLocalStorageInfo {
    @property()
    value: string = '';
    @property(no.EventHandlerInfo)
    handlers: no.EventHandlerInfo[] = [];
}

@ccclass
@menu('NoUi/localstorage/YJCheckLocalStorage(检测本地缓存数据)')
export default class YJCheckLocalStorage extends cc.Component {

    @property
    key: string = '';

    @property({ displayName: '默认值' })
    defaultValue: string = '';

    @property(CheckLocalStorageInfo)
    infos: CheckLocalStorageInfo[] = [];

    @property({ tooltip: '自动执行检测并监听数据变更' })
    auto: boolean = true;

    private _value: string;

    start() {
        if (this.key == '') return;
        if (this.auto) {
            this.a_check();
        }
    }

    public a_check() {
        if (this.key == '') return;
        let v = localStorage.getItem(this.key) || this.defaultValue;
        if (this._value == v) return;
        this._value = v;
        this.infos.forEach(info => {
            if (info.value == v) {
                no.EventHandlerInfo.execute(info.handlers);
            }
        });
    }

    update() {
        if (!this.auto) return;
        this.a_check();
    }
}
