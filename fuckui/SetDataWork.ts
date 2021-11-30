// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import YJDataWork from "../base/YJDataWork";
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetDataWork(将数据赋值给YJDataWork:any)')
export default class SetDataWork extends FuckUi {

    @property(YJDataWork)
    dataWork: YJDataWork = null;

    protected onDataChange(data: any) {
        if (this.dataWork) {
            this.dataWork.data = data;
        }
    }
}
