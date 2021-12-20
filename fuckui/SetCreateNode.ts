
import YJDataWork from "../base/YJDataWork";
import YJLoadPrefab from "../base/YJLoadPrefab";
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetCreateNode(动态创建节点:object|array)')
export default class SetCreateNode extends FuckUi {

    @property({ type: YJLoadPrefab, displayName: '元素预制体' })
    loadPrefab: YJLoadPrefab = null;
    @property({ type: cc.Node, displayName: '元素模板' })
    template: cc.Node = null;

    @property({ type: cc.Node, displayName: '容器' })
    container: cc.Node = null;
    @property({ tooltip: 'disable时清除子节点' })
    clearOnDisable: boolean = false;

    onDisable() {
        if (this.clearOnDisable){
            this.a_clearData();
            this.container.removeAllChildren();
        }
    }

    protected onDataChange(data: any) {
        this.setItems([].concat(data));
    }

    private async setItems(data: any[]) {
        if (!this.template) {
            this.template = await this.loadPrefab.loadPrefab();
        }
        if (!this.container) this.container = this.node;

        let n = data.length
        if (this.container.childrenCount < n) {
            for (let i = this.container.childrenCount; i < n; i++) {
                cc.instantiate(this.template).parent = this.container;
            }
        }
        n = this.container.childrenCount;
        for (let i = 0; i < n; i++) {
            let item = this.container.children[i];
            if (data[i] == null) item.active = false;
            else {
                item.active = true;
                (item.getComponent(YJDataWork) || item.getComponentInChildren(YJDataWork)).data = data[i];
            }
        }
    }
}
