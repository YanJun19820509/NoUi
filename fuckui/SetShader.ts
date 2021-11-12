// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";
import FuckUi from "./FuckUi";



const { ccclass, menu } = cc._decorator;
/**
 * 动态设置shader
 * path为material的资源路径
 * properties给shader定义的外部参数赋值
 * 如果要给合图中的部分纹理加shader，则需要在shader中定义外部参数o_width、o_height，（因为在合图中纹理的宽高值已经不是1.0，需要重新计算），setOriginalSize方法会重新计算并将新值传给材质
 */
@ccclass
@menu('NoUi/ui/SetShader(设置shader:{path:string,properties:{}})')
export default class SetShader extends FuckUi {

    private _renderComp: cc.RenderComponent;

    protected onDataChange(data: any) {
        if (!this._renderComp) {
            this._renderComp = this.getComponent(cc.RenderComponent);
            if (!this._renderComp) return;
        }
        let { path, properties }: { path: string, properties: {} } = data;
        this.setMaterial(path, properties);
    }

    private setMaterial(path: string, properties: any) {
        if (path) {
            no.assetBundleManager.loadMaterial(path, (item: cc.Material) => {
                this.setProperties(item, properties);
            });
        } else {
            let m = this._renderComp.getMaterial(0);
            this.setProperties(m, properties);
        }
    }

    private setProperties(material: cc.Material, properties: any) {
        for (const key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                const element = properties[key];
                material.setProperty(key, element);
            }
        }
        this.setOriginalSize(material);
        this._renderComp.setMaterial(0, material);
    }

    //对于合图内的纹理，需要重新计算纹理在合图内的宽高并传给材质中的shader
    private setOriginalSize(material: cc.Material) {
        let a: cc.Sprite = this.getComponent(cc.Sprite);
        if (a) {
            let sf = a.spriteFrame;
            if (!sf['_original']) return;
            let rect = sf.getRect();
            let texture = sf.getTexture();
            material.setProperty('o_width', rect.width / texture.width);
            material.setProperty('o_height', rect.height / texture.height);
        } else {
            let b: cc.Label = this.getComponent(cc.Label);
            if (b) {
                let f = b['_frame'];
                if (!f['_original']) return;
                let rect = f._rect;
                let texture = f._texture;
                material.setProperty('o_width', rect.width / texture.width);
                material.setProperty('o_height', rect.height / texture.height);
            }
        }

    }
}
