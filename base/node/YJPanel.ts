// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../../no";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/node/YJPanel(面板基类)')
export default class YJPanel extends cc.Component {

    /**面板打开事件 */
    public static PanelOpenEvent = '_PanelOpen';
    /**面板关闭事件 */
    public static PanelCloseEvent = '_PanelClose';

    /**所属预制体uuid */
    public static prefabUuid: string;

    @property
    panelType: string = 'popup_panel';

    onEnable() {
        no.Evn.emit(YJPanel.PanelOpenEvent, this.panelType);
    }

    onDisable() {
        no.Evn.emit(YJPanel.PanelCloseEvent, this.panelType);
    }

    /**
     * 可在prefab实例化时调用，进行界面内容的初始化
     */
    public initPanel() {
        this.onInitPanel();
    }

    public closePanel() {
        this.onClosePanel();
        this.node.destroy();
    }

    //////由子类实现
    protected onInitPanel() {

    }

    protected onClosePanel() {

    }
}
