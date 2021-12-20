
import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetToggleCheck(设置复选框选中状态:bool)')
export default class SetToggleCheck extends FuckUi {

    protected onDataChange(data: any) {
        this.getComponent(cc.Toggle).isChecked = Boolean(data);
    }
}
