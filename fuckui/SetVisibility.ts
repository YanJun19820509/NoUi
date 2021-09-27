// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetVisibility(设置显隐:bool)')
export default class SetVisibility extends FuckUi {

    @property({ displayName: '设置Opacity' })
    isOpacity: boolean = false;

    @property({ displayName: '取反' })
    reverse: boolean = false;

    protected onDataChange(data: any) {
        if (data instanceof Object) {
            let a = true;
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (!data[key]) {
                        a = false;
                        break;
                    }
                }
            }
            this.show(a);
        } else {
            this.show(Boolean(data));
        }
    }

    private show(v: boolean) {
        this.reverse && (v = !v);
        if (this.isOpacity) {
            this.node.opacity = v ? 255 : 0;
        } else {
            this.node.active = v;
        }
    }
}
