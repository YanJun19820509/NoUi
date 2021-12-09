// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../../no";

const { ccclass, property, requireComponent, menu, executeInEditMode } = cc._decorator;
/**
 * 解析css,设置label的样式
 */
@ccclass
@requireComponent(cc.Label)
@menu('NoUi/css/YJLabelCss(将css转为label属性)')
@executeInEditMode()
export default class YJLabelCss extends cc.Component {

    @property({ multiline: true })
    cssText: string = '';

    private _cssText: string = '';

    onLoad() {
        if (!CC_EDITOR) {
            this.destroy();
        }
    }

    update() {
        if (!CC_EDITOR) return;
        if (this.cssText != this._cssText) {
            this._cssText = this.cssText;
            this.onCssChange();
        }
    }

    private onCssChange() {
        let s = this._cssText?.trim();
        if (s == '' || s == null) return;
        let a = this.parse(s);
        this.setLabelAttr(a);
    }

    private setLabelAttr(attr: any): void {
        let label = this.getComponent(cc.Label);
        label.cacheMode = cc.Label.CacheMode.BITMAP;
        label.fontSize = attr.fontSize;
        label.lineHeight = attr.lineHeight;
        label.enableBold = attr.enableBold;
        label.fontFamily = attr.fontFamily;

        if (attr.font) {
            no.loadAnyInEditor<cc.Font>(`Font/${attr.font}`, (item) => {
                label.font = item;
            });
        }
        this.node.color = attr.color;
        if (attr.shadow != null) {
            let shadow = this.getComponent(cc.LabelShadow) || this.addComponent(cc.LabelShadow);
            shadow.offset = cc.v2(attr.shadow.x, attr.shadow.y);
            shadow.blur = attr.shadow.blur;
            shadow.color = attr.shadow.color;
        } else {
            this.getComponent(cc.LabelShadow)?.destroy();
        }
        if (attr.stroke != null) {
            let stroke = this.getComponent(cc.LabelOutline) || this.addComponent(cc.LabelOutline);
            stroke.width = attr.stroke.width;
            stroke.color = attr.stroke.color;
        } else {
            this.getComponent(cc.LabelOutline)?.destroy();
        }
    }

    // width: 22px;
    // height: 14px;
    // font-size: 18px;
    // font-family: Source Han Serif CN;
    // font-weight: 800;
    // color: #FFFFFF;
    // line-height: 32px;
    // -webkit-text-stroke: 2px #464A57;
    // text-stroke: 2px #464A57;
    private parse(s: string): any {
        s = s.replace(new RegExp('\n|\r|px|', 'g'), '');
        let a = s.split(';');
        let r: any = {};
        a.forEach(b => {
            let c = b.split(': ');
            switch (c[0].trim()) {
                case 'font-size':
                    r.fontSize = Number(c[1]);
                    break;
                case 'font-family':
                    r.fontFamily = c[1];
                    break;
                case 'font-weight':
                    r.enableBold = c[1] == 'bold';
                    break;
                case 'line-height':
                    r.lineHeight = Number(c[1]);
                    break;
                case 'color':
                    r.color = no.str2Color(c[1]);
                    break;
                case 'text-shadow':
                    r.shadow = this.parseShadow(c[1]);
                    break;
                case 'text-stroke':
                    r.stroke = this.parseStroke(c[1]);
                    break;
            }
        });
        return r;
    }

    private parseShadow(s: string): any {
        s = s.replace(new RegExp(', ', 'g'), ',');
        let b = s.split(' ');
        return {
            x: Number(b[0]),
            y: -Number(b[2]),
            blur: Number(b[1]),
            color: this.parseColor(b[3])
        };
    }

    private parseStroke(s: string): any {
        s = s.replace(new RegExp(', ', 'g'), ',');
        let a = s.split(' ');
        return {
            width: Number(a[0]),
            color: this.parseColor(a[1])
        };
    }

    private parseRGBA(s: string): cc.Color {
        s = s.replace(new RegExp('rgba(|)', 'g'), '');
        let a = s.split(',');
        return cc.color(Number(a[0]), Number(a[1]), Number(a[2]), 255 * Number(a[3]));
    }

    private parseColor(s: string): cc.Color {
        if (s.includes('rgba')) {
            return this.parseRGBA(s);
        } else {
            return no.str2Color(s);
        }
    }
}
