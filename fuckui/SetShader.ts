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
 * 如果要给合图中的部分纹理加shader，则需要在shader中定义外部参数factRect, ratio，（因为在合图中纹理的宽高值已经不是1.0，需要重新计算），setOriginalSize方法会重新计算并将新值传给材质
 */
@ccclass
@menu('NoUi/ui/SetShader(设置shader:{path:string,properties:{}})')
export default class SetShader extends FuckUi {

    private _renderComp: cc.RenderComponent;
    private _loaded: boolean = false;

    protected onDataChange(data: any) {
        if (!this._renderComp) {
            this._renderComp = this.getComponent(cc.RenderComponent);
            if (!this._renderComp) return;
        }
        let { path, properties, defines }: { path: string, properties: {}, defines: {} } = data;
        this.setMaterial(path, properties, defines);
    }

    public work() {
        if (!this._loaded) {
            this.scheduleOnce(() => {
                this.work();
            }, 0);
            return;
        }
        let m = this._renderComp.getMaterial(0);
        this.setOriginalSize(m);
    }

    private setMaterial(path: string, properties: any, defines: any) {
        if (path) {
            no.assetBundleManager.loadMaterial(path, (item: cc.Material) => {
                let m = this._renderComp.setMaterial(0, item);
                this.setProperties(m, properties, defines);
            });
        } else {
            let m = this._renderComp.getMaterial(0);
            this.setProperties(m, properties, defines);
        }
    }

    private setProperties(material: cc.Material, properties = {}, defines = {}) {
        for (const key in properties) {
            if (material.getProperty(key, 0) !== undefined)
                material.setProperty(key, properties[key]);
        }
        for (const key in defines) {
            if (material.getDefine(key) != undefined)
                material.define(key, defines[key]);
        }
        this._loaded = true;
    }

    //对于合图内的纹理，需要重新计算纹理在合图内的宽高并传给材质中的shader
    private setOriginalSize(material: cc.Material) {
        let a: cc.Sprite = this.getComponent(cc.Sprite);
        if (a) {
            let sf = a.spriteFrame;
            if (!sf['_original']) {
                return;
            }
            this.caculateFact(material, sf);
        } else {
            let b: cc.Label = this.getComponent(cc.Label);
            if (b) {
                let f = b['_frame'];
                if (!f['_original']) {
                    return;
                }
                this.caculateFact(material, f);
            }
        }
    }

    private caculateFact(material: cc.Material, f: any) {
        let rect = f._rect;
        let texture = f._texture;
        let w = f.isRotated() ? rect.height : rect.width;
        let h = f.isRotated() ? rect.width : rect.height;
        material.setProperty('factRect', new cc.Vec4(rect.x / texture.width, rect.y / texture.height, w / texture.width, h / texture.height));
        material.setProperty('ratio', texture.width / texture.height);
    }
}
