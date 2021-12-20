
import FuckUi from "./FuckUi";

const {ccclass, menu} = cc._decorator;

@ccclass
@menu('NoUi/ui/SetOpacity(设置透明度:number)')
export default class SetOpacity extends FuckUi {

    protected onDataChange(data: any){
        this.node.opacity = Number(data);
    }
}
