
import SetHeight from "./SetHeight";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetWidth(设置宽:number)')
export default class SetWidth extends SetHeight {

    protected onDataChange(data: any) {
        this.node.width = this.caculate(data);
    }
}
