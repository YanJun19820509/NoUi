// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../../no";
import YJTouchListener from "./YJTouchListener";

const { ccclass, menu } = cc._decorator;
/**
 * touch事件分发器，配合YJTouchListener使用
 */
@ccclass
@menu('NoUi/touch/YJTouchDispatcher(分发器)')
export default class YJTouchDispatcher extends cc.Component {

    private listeners: YJTouchListener[] = [];

    private static _ins: YJTouchDispatcher;

    /**
     * 单例
     */
    public static get ins(): YJTouchDispatcher {
        return this._ins;
    }

    onLoad() {
        YJTouchDispatcher._ins = this;
    }

    onDestroy() {
        YJTouchDispatcher._ins = null;
    }

    public onStart(event: cc.Event.EventTouch) {
        for (let i = 0, n = this.listeners.length; i < n; i++) {
            this.listeners[i].onStart(event);
        }
    }

    public onMove(event: cc.Event.EventTouch) {
        for (let i = 0, n = this.listeners.length; i < n; i++) {
            this.listeners[i].onMove(event);
        }
    }

    public onEnd(event: cc.Event.EventTouch) {
        for (let i = 0, n = this.listeners.length; i < n; i++) {
            this.listeners[i].onEnd(event);
        }
    }

    public onCancel(event: cc.Event.EventTouch) {
        for (let i = 0, n = this.listeners.length; i < n; i++) {
            this.listeners[i].onCancel(event);
        }
    }

    public addListener(listener: YJTouchListener) {
        no.addToArray(this.listeners, listener, 'uuid');
    }

    public removeListener(listener: YJTouchListener) {
        no.removeFromArray(this.listeners, listener, 'uuid');
    }
}
