
import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetScale(设置scale:number)')
export default class SetScale extends FuckUi {

    protected onDataChange(data: any) {
        this.node.scale = Number(data);
    }
}
