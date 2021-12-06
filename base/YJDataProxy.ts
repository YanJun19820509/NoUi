// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import YJDataWork from "./YJDataWork";
import YJFuckUiRegister from "./YJFuckUiRegister";

const { ccclass, menu, requireComponent } = cc._decorator;
/**
 * YJDataProxy继承YJDataWork，提供一个代理，可直接通过.的方式来代替setValue方法
 */
@ccclass
@menu('NoUi/base/YJDataProxy(数据代理基类)')
@requireComponent(YJFuckUiRegister)
export default class YJDataProxy extends YJDataWork {

    private _proxyMap: any = {};

    public get proxyData(): any {
        if (!this._data) return null;
        if (!this._proxyMap['__root']) {
            this.setProxy(this._data.data, '__root');
        }
        return this._proxyMap['__root'];
    }

    private setProxy(d: any, key: string) {
        if (d instanceof Array) return;
        if (d instanceof Object) {
            let me = this;
            d['__path'] = key;
            this._proxyMap[key] = new Proxy(d, {
                get: function (target: any, property: string) {
                    let a = target[property];
                    if (a && a['__path']) {
                        return me._proxyMap[a['__path']] || a;
                    }
                    return a;
                },
                set: function (target: any, property: string, value: any): boolean {
                    if (target[property] == undefined && value) {
                        target[property] = value;
                        me.setProxy(target, target['__path']);
                    } else {
                        if (value instanceof Object && !(value instanceof Array))
                            me.setProxy(value, target[property]['__path']);
                        target[property] = value;
                    }

                    me.setValue(`${target['__path']}.${property}`, value);
                    return true;
                }
            });
            for (const k in d) {
                if (k == '__path') continue;
                this.setProxy(d[k], key != '__root' ? `${key}.${k}` : k);
            }
        } else return;
    }
}
