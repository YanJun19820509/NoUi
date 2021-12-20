
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;
@ccclass('ColorInfo')
export class ColorInfo {
    @property()
    condition: string = '';
    @property(cc.Color)
    color: cc.Color = cc.Color.BLACK;
}
@ccclass
@menu('NoUi/ui/SetColorsSwitch(根据条件设置颜色:string)')
export default class SetColorsSwitch extends FuckUi {

    @property({ type: ColorInfo, displayName: '状态信息' })
    infos: ColorInfo[] = [];

    protected onDataChange(data: any) {
        data = String(data);
        for (let i = 0, n = this.infos.length; i < n; i++) {
            let info = this.infos[i];
            if (info.condition === data) {
                this.node.color = info.color;
                break;
            }
        }
    }
}
