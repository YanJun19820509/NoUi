// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetToggleCheck(设置复选框选中状态:bool)')
export default class SetToggleCheck extends FuckUi {

    protected onDataChange(data: any) {
        this.getComponent(cc.Toggle).isChecked = Boolean(data);
    }
}
