
import FuckUi from "./FuckUi";

const {ccclass, menu} = cc._decorator;

@ccclass
@menu('NoUi/ui/SetPositionY(设置y坐标:number)')
export default class SetPositionY extends FuckUi{

    protected onDataChange(data: any){
        this.node.y = Number(data);
    }
}
