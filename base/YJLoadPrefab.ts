
import { no } from "../no";

const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@menu('NoUi/base/YJLoadPrefab(加载预制体)')
@executeInEditMode
export default class YJLoadPrefab extends cc.Component {

    @property({ type: cc.Prefab, editorOnly: true })
    prefab: cc.Prefab = null;
    @property({ editorOnly: true })
    prefabUrl: string = '';
    @property({ readonly: true })
    prefabUuid: string = '';
    @property
    autoLoad: boolean = true;

    public loaded: boolean = false;
    public loadedNode: cc.Node = null;

    onLoad() {
        if (CC_EDITOR || !this.autoLoad || this.prefabUuid == '') return;
        this.loadPrefab();
    }

    onDestroy() {
        if (CC_EDITOR) return;
        this.loadedNode?.destroy();
    }

    lateUpdate(dt) {
        if (CC_EDITOR) {
            if (this.prefab != null && this.prefabUrl == '') {
                let name = this.prefab.data['_prefab'].asset._name;
                Editor.log(name);
                Editor.assetdb.queryAssets(`db://assets/**/${name}.prefab`, null, (err: Error, assetInfos) => {
                    if (err != null) {
                        Editor.log(err.stack);
                    } else {
                        let a = assetInfos[0] || {};
                        this.prefabUrl = a.url;
                        this.prefabUuid = a.uuid;
                    }
                });
            } else if (this.prefabUrl != '' && this.prefabUuid != '')
                this.prefab = null;
        }
    }

    public async loadPrefab(): Promise<cc.Node> {
        if (this.prefabUuid == '') return null;
        if (this.loadedNode != null && this.loadedNode.isValid) return this.loadedNode;
        return new Promise<cc.Node>(resolve => {
            no.assetBundleManager.loadByUuid<cc.Prefab>(this.prefabUuid, cc.Prefab, (p) => {
                if (p == null) resolve(null);
                else {
                    this.loadedNode = cc.instantiate(p);
                    this.loaded = true;
                    no.assetBundleManager.decRef(p);
                    resolve(this.loadedNode);
                }
            });
        });
    }

    public clone(): cc.Node {
        if (!this.loadedNode) return null;
        return cc.instantiate(this.loadedNode);
    }

    public clear(): void {
        this.loadedNode = null;
        this.loaded = false;
    }
}
