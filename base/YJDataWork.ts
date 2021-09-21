// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FuckUi from "../fuckui/FuckUi";
import { no } from "../no";
import { YJComponent } from "./YJComponent";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/base/YJDataWork(数据处理基类)')
export default class YJDataWork extends YJComponent {

    @property(cc.Node)
    target: cc.Node = null;

    private _data: no.Data = new no.Data();
    private _data2ui: object;

    onLoad() {
        if (this.target == null) this.target = this.node;
        this.init();
    }

    public get data(): any {
        return this._data.data;
    }

    public set data(d: any) {
        for (let key in d) {
            this.setValue(key, d[key]);
        }
    }

    public getValue(key: string): any {
        return this._data.get(key);
    }

    public setValue(key: string, value: any) {
        this._data.set(key, value);
        this.onValueChange(key, value);
    }

    private findAllFunckUis() {
        this._data2ui = {};
        let a = this.target.getComponentsInChildren(FuckUi);
        a.forEach(ui => {
            let keys = ui.bindKeys;
            keys.forEach(key => {
                this._data2ui[key] = this._data2ui[key] || [];
                this._data2ui[key][this._data2ui[key].length] = ui;
            });
        });
    }

    private onValueChange(key: string, value: any) {
        if (this._data2ui == null)
            this.findAllFunckUis();
        let ui: FuckUi[] = this._data2ui[key];
        this.setUiData(ui, value);
        if (value instanceof Array) {
            value.forEach((v, i) => {
                let ui: FuckUi[] = this._data2ui[`${key}.${i}`];
                this.setUiData(ui, v);
            });
        } else if (value instanceof Object) {
            for (let k in value) {
                this.onValueChange(`${key}.${k}`, value[k]);
            }
        }
    }

    private setUiData(uis: FuckUi[], data: any) {
        if (uis == null) return;
        uis.forEach(ui => {
            let keys = ui.bindKeys;
            if (keys.length == 1) {
                ui.setData(data);
            } else {
                let a = {};
                keys.forEach(key => {
                    a[key] = this._data.get(key);
                });
                ui.setData(a);
            }
        });
    }

    protected init() {

    }
}
