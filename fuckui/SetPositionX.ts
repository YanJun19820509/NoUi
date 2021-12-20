
import FuckUi from "./FuckUi";

const {ccclass, menu} = cc._decorator;

@ccclass
@menu('NoUi/ui/SetPositionX(设置x坐标:number)')
export default class SetPositionX extends FuckUi{

    protected onDataChange(data: any){
        this.node.x = Number(data);
    }
}
