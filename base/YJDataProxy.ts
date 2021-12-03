// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";
import YJDataWork from "./YJDataWork";
import YJFuckUiRegister from "./YJFuckUiRegister";

const { ccclass, property, menu, requireComponent } = cc._decorator;
/**
 * YJDataProxy继承YJDataWork，提供一个代理，可直接通过.的方式来代替setValue方法，但仅支持第一层数据
 */
@ccclass
@menu('NoUi/base/YJDataProxy(数据代理基类)')
@requireComponent(YJFuckUiRegister)
export default class YJDataProxy extends YJDataWork {

    private _proxy: any;

    public get proxy(): any {
        if (!this._proxy) {
            this._proxy = new Proxy(this._data.data, {
                get: function (target: any, property: string) {
                    return target[property];
                },
                set: function (target: any, property: string, value: any): boolean {
                    this.setValue(property, value);
                    return true;
                }
            });
        }
        return this._proxy;
    }
}
