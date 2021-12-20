
import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetBlockInputEvents(设置输入拦截:bool)')
export default class SetBlockInputEvents extends FuckUi {

    protected onDataChange(data: any) {
        data = Boolean(data);
        let bie = this.getComponent(cc.BlockInputEvents);
        if (data === true) {
            if (bie == null) bie = this.addComponent(cc.BlockInputEvents);
            bie.enabled = true;
        } else {
            if (bie != null) bie.enabled = false;
        }
    }
}
