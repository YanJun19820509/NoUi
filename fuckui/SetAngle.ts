
import FuckUi from "./FuckUi";

const {ccclass, menu} = cc._decorator;

@ccclass
@menu('NoUi/ui/SetAngle(设置旋转角度:number)')
export default class SetAngle extends FuckUi {

    protected onDataChange(data: any){
        this.node.angle = Number(data);
    }
}
