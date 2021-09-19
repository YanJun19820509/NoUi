// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import YJDataWork from "../base/YJDataWork";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('examples/text')
export default class text extends YJDataWork {

    protected init() {
        this.data = {
            result: { v: 9 }
        };
    }

    public a_add() {
        let r = this.data.result.v;
        this.setValue('result', { v: r + 2 });
    }
}
