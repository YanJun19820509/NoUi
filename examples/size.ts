// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import YJDataWork from "../base/YJDataWork";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('examples/size')
export default class size extends YJDataWork {

    protected init() {
        this.data = {
            size: { w: 200, h: 200 }
        };
    }

    public a_change() {
        this.setValue('size', { w: 300, h: 150 });
    }
}
