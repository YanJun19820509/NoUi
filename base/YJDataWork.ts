
import FuckUi from "../fuckui/FuckUi";
import { no } from "../no";
import YJFuckUiRegister from "./YJFuckUiRegister";

const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@menu('NoUi/base/YJDataWork(数据处理基类)')
@requireComponent(YJFuckUiRegister)
export default class YJDataWork extends cc.Component {

    @property(YJFuckUiRegister)
    register: YJFuckUiRegister = null;

    private _ready: boolean = false;

    protected _data: no.Data = new no.Data();

    onLoad() {
        this.init();
    }

    /**
     * 初始化，可手动执行，或在onLoad时自动执行，若希望当节点在场景中显示出来之前数据就初始化好，就要在创建节点时（加入场景前）执行init并执行数据相关操作
     * @returns
     */
    public init() {
        if (this._ready) return;
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
                ui.setData(JSON.stringify(data));
            } else {
                let a = {};
                keys.forEach(key => {
                    a[key] = this._data.get(key);
                });
                ui.setData(JSON.stringify(a));
            }
        });
    }
}
