// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetNodeTweenAction(设置节点缓动效果:object|[object])')
export default class SetNodeTweenAction extends FuckUi {

    @property({ type: no.EventHandlerInfo, displayName: '缓动开始前回调' })
    beforeCall: no.EventHandlerInfo[] = [];

    @property({ type: no.EventHandlerInfo, displayName: '缓动完成回调' })
    endCall: no.EventHandlerInfo[] = [];

    private _action: cc.Tween<cc.Node>;

    protected onDataChange(data: any) {
        this.stop();
        no.EventHandlerInfo.execute(this.beforeCall);
        this._action = this.createAction(data)?.call(() => {
            no.EventHandlerInfo.execute(this.endCall);
        }).start();
    }

    protected createAction(data: any): cc.Tween<cc.Node> {
        return no.parseTweenData(data, this.node);
    }

    private stop() {
        this._action?.stop();
        this._action = null;
    }
}
