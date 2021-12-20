
import YJTouchDispatcher from "./YJTouchDispatcher";

const { ccclass, property, menu } = cc._decorator;
/**
 * touch控制器
 */
@ccclass
@menu('NoUi/touch/YJTouchController(控制器)')
export default class YJTouchController extends cc.Component {

    @property(YJTouchDispatcher)
    dispatcher: YJTouchDispatcher = null;

    @property({ displayName: '多点触控' })
    multiable: boolean = false;
    @property({ displayName: '需要先选中' })
    selected: boolean = true;
    @property({ displayName: '处理取消' })
    needCancel: boolean = true;
    @property({ displayName: '吞没事件' })
    swallowTouches: boolean = true;
    @property({ displayName: '捕获' })
    useCapture: boolean = true;

    protected _touched: boolean;
    protected currentTouch: cc.Touch;

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onStart, this, this.useCapture);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMove, this, this.useCapture);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEnd, this, this.useCapture);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onCancel, this, this.useCapture);
        this.node['_touchListener'].swallowTouches = this.swallowTouches;
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onCancel, this);
    }

    private checkTouched(event: cc.Event): boolean {
        if (this._touched && !this.multiable && this.currentTouch != null) {
            let e = event as cc.Event.EventTouch;
            if (e.getTouches().length == 1) return true;
            return this.currentTouch?.getID() == e.touch.getID();
        }
        return true;
    }

    protected onStart(event: cc.Event.EventTouch) {
        if (!this.checkTouched(event)) return;
        this.currentTouch = event.touch;
        this._touched = true;
        this.dispatcher?.onStart(event)
    }

    protected onMove(event: cc.Event.EventTouch) {
        if (this.selected && !this._touched) return;
        this.dispatcher?.onMove(event)
    }

    protected onEnd(event: cc.Event.EventTouch) {
        if (this.selected && !this._touched) return;
        // if (!this.checkTouched(event)) return;
        this._touched = false;
        this.currentTouch = null;
        this.dispatcher?.onEnd(event)
    }

    protected onCancel(event: cc.Event.EventTouch) {
        if (this.selected && !this._touched || !this.needCancel) return;
        this._touched = false;
        this.currentTouch = null;
        this.dispatcher?.onCancel(event)
    }

    public trigger(type: cc.Node.EventType, event: cc.Event.EventTouch): void {
        switch (type) {
            case cc.Node.EventType.TOUCH_START:
                this.onStart(event);
                break;
            case cc.Node.EventType.TOUCH_MOVE:
                this.onMove(event);
                break;
            case cc.Node.EventType.TOUCH_END:
                this.onEnd(event);
                break;
            case cc.Node.EventType.TOUCH_CANCEL:
                this.onCancel(event);
                break;
        }
    }
}
