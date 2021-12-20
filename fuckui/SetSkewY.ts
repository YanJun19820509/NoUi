
import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetSkewY(设置 Y 轴倾斜角度:number)')
export default class SetSkewY extends FuckUi {

    protected onDataChange(data: any) {
        this.node.skewY = Number(data);
    }
}
