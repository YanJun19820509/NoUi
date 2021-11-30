// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";
import FuckUi from "./FuckUi";
import SetShader from "./SetShader";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetText(设置文本内容:string)')
export default class SetText extends FuckUi {

    @property({ displayName: '格式化模板' })
    formatter: string = '{0}';

    @property({ displayName: '数值显示单位' })
    showUnit: boolean = true;

    private label: cc.Label | cc.RichText;

    protected onDataChange(data: any) {
        if (typeof data == 'object') {
            for (let k in data) {
                if (data[k] == null) return;
            }
        }
        if (!this.label){
            this.label = this.node.getComponent(cc.Label) || this.node.getComponent(cc.RichText);
        }
        this.setLabel(data);
        this.checkShader();
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

    private checkShader() {
        this.scheduleOnce(() => {
            this.getComponent(SetShader)?.work();
        }, 0);
    }
}
