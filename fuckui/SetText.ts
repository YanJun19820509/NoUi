// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetText(设置文本内容)')
export default class SetText extends FuckUi {

    @property({ displayName: '格式化模板' })
    formatter: string = '{0}';

    @property({ displayName: '数值显示单位' })
    showUnit: boolean = true;

    @property({ displayName: '是否为富文本' })
    isRichText: boolean = false;

    @property({ type: cc.Label, visible() { return !this.isRichText; } })
    label: cc.Label = null;

    @property({ type: cc.RichText, visible() { return this.isRichText; } })
    richLabel: cc.RichText = null;

    start() {
        if (!this.isRichText) {
            this.label = this.label || this.node.getComponent(cc.Label);
            if (this.label == null) return;
        } else {
            this.richLabel = this.richLabel || this.node.getComponent(cc.RichText);
            if (this.richLabel == null) return;
        }
    }


    protected onDataChange(data: any) {
        if (data == null) return;
        if (typeof data == 'object') {
            for (let k in data) {
                if (data[k] == null) return;
            }
        }
        if (!this.isRichText) {
            this.setLabel(data);
        } else {
            this.setRichLabel(data);
        }
    }

    private setLabel(data: any): void {
        if (this.label == null) return;
        if (data == '') this.label.string = '';
        if (this.showUnit && typeof data == 'number') {
            data = no.num2str(data);
        }
        if (typeof data == 'string') {
            this.label.string = no.formatString(this.formatter, data.split('|'));
        } else if (typeof data == 'number') {
            this.label.string = no.formatString(this.formatter, { '0': data });
        } else {
            this.label.string = no.formatString(this.formatter, data);
        }
    }

    private setRichLabel(data: any): void {
        if (this.richLabel == null) return;
        if (data == '') this.richLabel.string = '';
        if (typeof data == 'string') {
            this.richLabel.string = no.formatString(this.formatter, data.split('|'));
        } else if (typeof data == 'number') {
            this.label.string = no.formatString(this.formatter, { '0': data });
        } else {
            this.richLabel.string = no.formatString(this.formatter, data);
        }
    }
}
