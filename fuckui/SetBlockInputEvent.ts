// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetBlockInputEvents(设置输入拦截:bool)')
export default class SetBlockInputEvents extends FuckUi {

    protected onDataChange(data: any) {
        let bie = this.getComponent(cc.BlockInputEvents);
        if (data === true) {
            if (bie == null) bie = this.addComponent(cc.BlockInputEvents);
            bie.enabled = true;
        } else {
            if (bie != null) bie.enabled = false;
        }
    }

    public a_setData(e: any, v: any) {
        v = v || e;
        this.setData(JSON.parse(v));
    }
}
