// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";
import FuckUi from "./FuckUi";

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
        no.assetBundleManager.loadSprite(String(data), spriteFrame => {
            this.sprite.spriteFrame = spriteFrame;
        });
    }
}
