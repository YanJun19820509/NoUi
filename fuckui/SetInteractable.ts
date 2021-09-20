// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetInteractable(设置按钮交互状态:bool)')
export default class SetInteractable extends FuckUi {

    @property({ displayName: '取反' })
    reverse: boolean = false;

    protected onDataChange(data: any) {
        if (data == null) return;
        if (this.reverse) data = !data;
        data ? this.a_enable() : this.a_disable();
    }

    public a_enable(): void {
        this.getComponent(cc.Button).interactable = true;
    }

    public a_disable(): void {
        this.getComponent(cc.Button).interactable = false;
    }

    public a_setData(e: any, v: any) {
        v = v || e;
        this.setData(JSON.parse(v));
    }
}
