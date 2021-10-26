// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FuckUi from "../fuckui/FuckUi";

const { ccclass } = cc._decorator;

@ccclass
export default class YJFuckUiRegister extends cc.Component {

    private _data2ui: object = {};

    public onNewUiRegister: (key: string, ui: FuckUi) => void;

    public register(ui: FuckUi): void {
        let keys = ui.bindKeys;
        keys.forEach(key => {
            this._data2ui[key] = this._data2ui[key] || [];
            this._data2ui[key][this._data2ui[key].length] = ui;
            this.onNewUiRegister?.(key, ui);
        });
    }

    public getUis(key: string): FuckUi[] {
        return this._data2ui[key];
    }

    public remove(ui: FuckUi) {
        let keys = ui.bindKeys;
        keys.forEach(key => {
            let a: FuckUi[] = this._data2ui[key];
            if (a) {
                let i = a.indexOf(ui);
                a.splice(i, 1);
            }
        });
    }
}
