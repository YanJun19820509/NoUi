// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../../no";
import YJTouchDispatcher from "./YJTouchDispatcher";

const { ccclass, property, menu } = cc._decorator;
/**
 * touch事件监听器，配合YJTouchDispatcher使用
 */
@ccclass
@menu('NoUi/touch/YJTouchListener(监听器)')
export default class YJTouchListener extends cc.Component {

    @property({ type: no.EventHandlerInfo, displayName: '按下事件' })
    startHandlers: no.EventHandlerInfo[] = [];
    @property({ type: no.EventHandlerInfo, displayName: '移动事件' })
    moveHandlers: no.EventHandlerInfo[] = [];
    @property({ type: no.EventHandlerInfo, displayName: '释放事件' })
    endHandlers: no.EventHandlerInfo[] = [];
    @property({ type: no.EventHandlerInfo, displayName: '取消事件' })
    cancelHandlers: no.EventHandlerInfo[] = [];

    //是否在区域内
    private isTouchIn: boolean = false;
    private rect: cc.Rect;

    async onEnable() {
        await no.waitFor(() => { return YJTouchDispatcher.ins != null; })
        YJTouchDispatcher.ins.addListener(this);
    }

    onDisable() {
        YJTouchDispatcher.ins.removeListener(this);
    }

    public onStart(event: cc.Event.EventTouch) {
        if (this.rect == null) this.rect = no.nodeBoundingBox(this.node);
        this.isTouchIn = this.rect.contains(event.getStartLocation());
        if (!this.isTouchIn) return;
        no.EventHandlerInfo.execute(this.startHandlers, event);
    }

    public onMove(event: cc.Event) {
        if (!this.isTouchIn) return;
        no.EventHandlerInfo.execute(this.moveHandlers, event);
    }

    public onEnd(event: cc.Event) {
        if (!this.isTouchIn) return;
        this.isTouchIn = false;
        no.EventHandlerInfo.execute(this.endHandlers, event);
    }

    public onCancel(event: cc.Event) {
        if (!this.isTouchIn) return;
        this.isTouchIn = false;
        no.EventHandlerInfo.execute(this.cancelHandlers, event);
    }
}
