
import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetScaleX(设置scaleX:number)')
export default class SetScaleX extends FuckUi {

    protected onDataChange(data: any) {
        this.node.scaleX = Number(data);
    }
}
