// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FuckUi from "../fuckui/FuckUi";
import { no } from "../no";
import { YJComponent } from "./YJComponent";
import YJFuckUiRegister from "./YJFuckUiRegister";

const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@menu('NoUi/base/YJDataWork(数据处理基类)')
@requireComponent(YJFuckUiRegister)
export default class YJDataWork extends YJComponent {

    @property(cc.Node)
    target: cc.Node = null;
    @property(YJFuckUiRegister)
    register: YJFuckUiRegister = null;

    private _ready: boolean = false;

    private _data: no.Data = new no.Data();

    onLoad() {
        this.init();
    }

    onEnable() {
        this.initData();
    }

    public init() {
        if (this._ready) return;
        if (this.target == null) this.target = this.node;
        this.register.onNewUiRegister = (key: string, ui: FuckUi) => {
            this.setUiData([ui], this.getValue(key));
        };
        this._ready = true;
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

    private async onValueChange(key: string, value: any) {
        await no.waitFor(() => { return this._ready; });
        let ui: FuckUi[] = this.register?.getUis(key) || [];
        this.setUiData(ui, value);
        if (value instanceof Array) {
            value.forEach((v, i) => {
                let ui: FuckUi[] = this.register?.getUis(`${key}.${i}`) || [];
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

    protected initData() {

    }
}
