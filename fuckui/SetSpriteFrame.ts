
import { no } from "../no";
import FuckUi from "./FuckUi";
import SetShader from "./SetShader";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetSpriteFrame(设置精灵:string)')
export default class SetSpriteFrame extends FuckUi {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    onLoad() {
        this.sprite = this.sprite || this.getComponent(cc.Sprite);
    }

    protected onDataChange(data: any) {
        if (this.sprite == null) return;
        no.assetBundleManager.decRef(this.sprite.spriteFrame);
        this.sprite.spriteFrame = null;
        no.assetBundleManager.loadSprite(String(data), spriteFrame => {
            this.sprite.spriteFrame = spriteFrame;
            this.checkShader();
        });
    }

    private checkShader() {
        this.scheduleOnce(() => {
            this.getComponent(SetShader)?.work();
        }, 0);
    }
}
