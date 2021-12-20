
import { no } from "../../no";

const { ccclass, property, menu } = cc._decorator;


export const YJPanelPrefabMetaKey = 'prefabPath';

/**
 * 注解，向YJPanel添加prefab path 元数据
 * @param path
 * @returns
 */
export function panelPrefabPath(path: string){
     return no.addMeta(YJPanelPrefabMetaKey, path);
}

@ccclass
@menu('NoUi/node/YJPanel(面板基类)')
@panelPrefabPath('')
export default class YJPanel extends cc.Component {

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
