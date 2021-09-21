// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetSize(设置宽高:object)')
export default class SetSize extends FuckUi {

    protected onDataChange(data: any) {
        let a = [];
        for (let k in data) {
            a.push(data[k]);
        }
        this.node.setContentSize(cc.size(a[0], a[1]));
    }
}
