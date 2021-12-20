
import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetSize(设置宽高:object)')
export default class SetSize extends FuckUi {

    protected onDataChange(data: any) {
        let a = [];
        for (let k in data) {
            a.push(data[k]);
        }
        this.node.setContentSize(cc.size(a[0], a[1]));
    }
}
