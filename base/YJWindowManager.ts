
import { no } from "../no";
import YJPanel, { YJPanelPrefabMetaKey } from "./node/YJPanel";

const { ccclass, property, menu } = cc._decorator;

@ccclass('LayerInfo')
export class LayerInfo {
    @property({ displayName: '层级别名', tooltip: '创建panel时根据别名指定panel在场景中的层级' })
    type: string = '';
    @property({ displayName: '容器', type: cc.Node })
    content: cc.Node = null;
}

@ccclass
@menu('NoUi/base/YJWindowManager')
export default class YJWindowManager extends cc.Component {

    @property(LayerInfo)
    infos: LayerInfo[] = [];

    private static _ins: YJWindowManager;

    onLoad() {
        YJWindowManager._ins = this;
    }

    onDestroy() {
        YJWindowManager._ins = null;
    }

    /**
     * 创建功能面板
     * @param comp 功能组件类
     * @param to 所属层级
     * @returns
     */
    public static async createPanel<T extends YJPanel>(comp: typeof YJPanel, to: string): Promise<T> {
        if (!comp) return null;
        await no.waitFor(() => { return YJWindowManager._ins != null; });
        let self = YJWindowManager._ins;
        let content: cc.Node;
        for (let i = 0, n = self.infos.length; i < n; i++) {
            if (self.infos[i].type == to) {
                content = self.infos[i].content;
                break;
            }
        }

        let a: T = content.getComponentInChildren(comp.name);
        if (a != null) {
            return a;
        }
        return new Promise<T>(resolve => {
            no.assetBundleManager.loadPrefab(comp.prototype[YJPanelPrefabMetaKey], (pf: cc.Prefab) => {
                let node = cc.instantiate(pf);
                a = node.getComponent(comp.name);
                a.initPanel();
                content.addChild(node);
                resolve(a);
            });
        });
    }
}
