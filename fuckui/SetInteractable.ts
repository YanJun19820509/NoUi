
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetInteractable(设置交互状态:boolean)')
export default class SetInteractable extends FuckUi {

    @property({ displayName: '取反' })
    reverse: boolean = false;

    protected onDataChange(data: any) {
        data = Boolean(data);
        if (this.reverse) data = !data;
        data ? this.a_enable() : this.a_disable();
    }

    public a_enable(): void {
        (this.getComponent(cc.Button) || this.getComponent(cc.Toggle)).interactable = true;
    }

    public a_disable(): void {
        (this.getComponent(cc.Button) || this.getComponent(cc.Toggle)).interactable = false;
    }
}
