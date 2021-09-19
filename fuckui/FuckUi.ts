// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FuckUi extends cc.Component {

    @property({ displayName: '绑定数据的keys', tooltip: '用.表示key的层级关系，用,分隔多个key' })
    private bind_keys: string = '';

    @property({ displayName: '只赋值一次' })
    private once: boolean = false;

    @property({ displayName: '输出赋值日志' })
    private showValueLog: boolean = false;

    private _oldData: any;

    public setData(d: any) {
        if (d == null) return;
        let a = JSON.stringify(d);
        if (a == this._oldData) return;
        this._oldData = a;
        this.logValue(d);
        this.onDataChange(d);
        if (this.once) this.destroy();
    }

    /**
     * 绑定数据的keys的数组
     */
    public get bindKeys(): string[] {
        return this.bind_keys.split(',');
    }

    private logValue(data: any): void {
        if (!CC_DEBUG || !this.showValueLog) return;
        no.log(this.bind_keys, data);
    }

    /**
     *  给指定property赋值
     * @param propertyName 
     * @param v 
     */
    public setPropertyValue(propertyName: string, v: any): void {
        this[propertyName] = v;
    }

    public a_setData(e: any, v: any) {
        v = v || e;
        this.setData(v);
    }

    /**
     * 需要子类实际具体逻辑
     * @param data 
     */
    protected onDataChange(data: any) {

    }
}
