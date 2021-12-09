// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SetShader from "../../fuckui/SetShader";
import { no } from "../../no";

const { ccclass, property, requireComponent, menu, executeInEditMode } = cc._decorator;

// 皮肤更换方案设计：不同皮肤资源按包管理，皮肤包下的目录结构及资源名称都一致，
// 通过切换包名来实现皮肤的更替，由皮肤组件管理的Sprite不要默认加载资源

/** 皮肤管理器 */
export class YJUiSkinManager {
    private static _currentSkinBundle: string = '';

    /**当前皮肤包名 */
    public static get currentSkinBundle(): string {
        return this._currentSkinBundle;
    }

    /**设置皮肤包名，同时通知皮肤组件加载新资源 */
    public static set currentSkinBundle(name: string) {
        if (this._currentSkinBundle == name) return;
        no.assetBundleManager.loadBundle(name, () => {
            this._currentSkinBundle = name;
            no.Evn.emit('skin_bundle_change', name);
        });
    }
}

@ccclass
@requireComponent(cc.Sprite)
@menu('NoUi/skin/YJSkin(皮肤组件，自动更换图片)')
@executeInEditMode()
export default class YJUiSkin extends cc.Component {

    @property({ tooltip: '图片路径，从包的一级子目录开始，不含包名' })
    path: string = '';

    protected onLoad(): void {
        this.onChange();
    }

    protected onEnable(): void {
        no.Evn.on('skin_bundle_change', this.onChange, this);
    }

    protected onDisable(): void {
        no.Evn.targetOff(this);
    }

    private onChange() {
        if (YJUiSkinManager.currentSkinBundle == '') return;
        no.assetBundleManager.loadSprite(YJUiSkinManager.currentSkinBundle + '/' + this.path, (sf) => {
            let sprite = this.getComponent(cc.Sprite);
            no.assetBundleManager.decRef(sprite.spriteFrame);
            sprite.spriteFrame = null;
            sprite.spriteFrame = sf;
            this.checkShader();
        });
    }

    private checkShader() {
        this.scheduleOnce(() => {
            this.getComponent(SetShader)?.work();
        }, 0);
    }
}
