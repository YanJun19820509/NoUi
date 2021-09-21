// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SetHeight from "./SetHeight";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetWidth(设置宽:number)')
export default class SetWidth extends SetHeight {

    protected onDataChange(data: any) {
        this.node.width = this.caculate(data);
    }
}
