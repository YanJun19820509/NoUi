// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../../no";
import YJCacheObject from "../YJCacheObject";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/node/YJPanel(面板基类)')
export default class YJPanel extends YJCacheObject {

    /**面板打开事件 */
    public static PanelOpenEvent = '_PanelOpen';
    /**面板关闭事件 */
    public static PanelCloseEvent = '_PanelClose';

    @property
    panelType: string = 'popup_panel';

    onEnable() {
        no.Evn.emit(YJPanel.PanelOpenEvent, this.panelType);
    }

    onDisable() {
        no.Evn.emit(YJPanel.PanelCloseEvent, this.panelType);
    }

    public a_close() {
        this.recycle();
    }
}
