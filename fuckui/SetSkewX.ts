
import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetSkewX(设置 X 轴倾斜角度:number)')
export default class SetSkewX extends FuckUi {

    protected onDataChange(data: any) {
        this.node.skewX = Number(data);
    }
}
