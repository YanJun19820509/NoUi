
import SetHint from "../fuckui/SetHint";
import { no } from "../no";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/base/YJHintWatcher(红点监听)')
export default class YJHintWatcher extends cc.Component {

    @property({ type: SetHint })
    hint: SetHint = null;

    @property({ displayName: '红点key', tooltip: '多个key用逗号分隔' })
    types: string = '';

    private typeList: string[] = new Array();

    onEnable() {
        if (this.hint == null) return;
        this.bind();
    }

    onDisable() {
        no.hintCenter.offHint(this);
    }

    private bind() {
        if (this.types == '') return;
        let types = this.types.split(',');
        this.typeList = types;
        types.forEach(type => {
            this.bindHint(type);
        });
    }

    protected bindHint(type: string): void {
        no.hintCenter.onHint(type, this.setHint, this);
    }

    protected setHint(v: number): void {
        let n = 0;
        if (this.hint.isNumber) {
            this.typeList.forEach(type => {
                n += no.hintCenter.getHintValue(type);
            });
        } else if (v < 1) {
            let len = this.typeList.length;
            for (let i = 0; i < len; i++) {
                let type = this.typeList[i];
                if (no.hintCenter.getHintValue(type) > 0) {
                    n = 1;
                    break;
                }
            }
        } else n = 1;
        this.hint.setData(n);
    }
}
