
import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetPosition(设置坐标:object|array)')
export default class SetPosition extends FuckUi {

    protected onDataChange(data: any) {
        let a = [];
        for (const key in data) {
            a[a.length] = data[key];
        }
        this.node.position = cc.v3(a[0], a[1]);
    }
}
