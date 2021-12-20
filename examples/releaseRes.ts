
import YJDataWork from "../base/YJDataWork";
import { no } from "../no";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('examples/releaseRes')
export default class releaseRes extends YJDataWork {

    onLoad() {
        no.assetBundleManager.loadBundle('Texture', () => {
            super.onLoad();
        });
    }

    protected init() {
        this.setValue('img', 'Texture/atlas/tb_bm');
    }

    public a_reset() {
        this.setValue('img', 'Texture/atlas/tb_ds');
    }

    public a_reset1() {
        this.setValue('img', 'Texture/atlas/tb_bm');
    }
}
