
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetHint(设置红点:number)')
export default class SetHint extends FuckUi {

    @property({ displayName: '红点', type: cc.Node })
    targetNode: cc.Node = null;
    @property
    isNumber: boolean = true;

    @property({ type: cc.Label, displayName: '显示红点数量', visible() { return this.isNumber; } })
    label: cc.Label = null;

    onLoad() {
        this.targetNode = this.targetNode || this.node;
    }

    protected onDataChange(data: any) {
        let v = Number(data);
        this.targetNode.active = v > 0;
        if (this.isNumber && this.label != null)
            this.label.string = data;
    }
}
