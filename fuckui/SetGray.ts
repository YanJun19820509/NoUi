
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetGray(设置灰态:bool)')
export default class SetGray extends FuckUi {

    @property(cc.Material)
    grayMaterial: cc.Material = null;
    @property({ displayName: '默认置灰' })
    autoGray: boolean = false;
    @property({ displayName: '取反' })
    reverse: boolean = false;

    private _normalMaterial: cc.Material;

    onLoad() {
        this._normalMaterial = this.getComponent(cc.RenderComponent).getMaterial(0);
    }

    protected onDataChange(data: any) {
        data = Boolean(data);
        if (this.reverse) data = !data;
        let m = data ? this.grayMaterial : this._normalMaterial;
        this.getComponent(cc.RenderComponent).setMaterial(0, m);
    }
}
