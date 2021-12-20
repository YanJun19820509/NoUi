
import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetScaleY(设置scaleY:number)')
export default class SetScaleY extends FuckUi {

    protected onDataChange(data: any) {
        this.node.scaleY = Number(data);
    }
}
