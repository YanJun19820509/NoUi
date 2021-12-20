
import YJTiledMapData from "../base/tiled/YJTiledMapData";
import YJTiledMapDelegate from "../base/tiled/YJTiledMapDelegate";
import { no } from "../no";
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetTiledMap(设置瓦片地图:string(jsonFilePath))')
export default class SetTiledMap extends FuckUi {

    @property({ type: YJTiledMapDelegate, displayName: '代理' })
    delegate: YJTiledMapDelegate = null;

    private mapData: YJTiledMapData;

    protected onDataChange(data: any) {
        this.delegate?.onBeforeInitMap();
        no.assetBundleManager.loadJSON(data, (jsonAsset: cc.JsonAsset) => {
            this.mapData = new YJTiledMapData(jsonAsset.json);
            this.initMap();
            no.assetBundleManager.decRef(jsonAsset);
        });
    }

    private async initMap() {
        this.delegate?.onInitMap(this.mapData);
        let layers = this.mapData.layerTypes;
        for (let i = 0, n = layers.length; i < n; i++) {
            this.delegate?.onInitObjects(layers[i], this.mapData.getLayerObjects(layers[i]));
        }
        await no.sleep(0, this);
        this.delegate?.onInitComplete();
    }
}
