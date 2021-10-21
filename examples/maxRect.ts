// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import YJCreateNode from "../base/YJCreateNode";
import YJDataWork from "../base/YJDataWork";
import { MaxRects } from "../engine/MaxRects";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('examples/MaxRectTest')
export default class MaxRectTest extends cc.Component {

    @property(cc.EditBox)
    w: cc.EditBox = null;
    @property(cc.EditBox)
    h: cc.EditBox = null;
    @property(YJCreateNode)
    createNode: YJCreateNode = null;

    private maxRect: MaxRects;

    onLoad() {
        this.maxRect = new MaxRects(960, 640);
    }

    public async a_add() {
        let w = Number(this.w.string || 10),
            h = Number(this.h.string || 10);
        let p = this.maxRect.find(w, h);
        if (!p) return;
        let node = await this.createNode.createNode();
        node.getComponent(YJDataWork).setValue('pos', [p.x, -p.y]);
        node.getComponent(YJDataWork).setValue('size', [w, h]);
        node.getComponent(YJDataWork).setValue('title', `${w}x${h}`);
    }
}
