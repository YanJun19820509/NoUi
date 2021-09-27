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
@menu('NoUi/ui/SetSliderProgress(设置滑块进度:number(0-1))')
export default class SetSliderProgress extends FuckUi {

    @property(no.EventHandlerInfo)
    onProgressChange: no.EventHandlerInfo[] = [];
    @property(no.EventHandlerInfo)
    onProgressChangeEnd: no.EventHandlerInfo[] = [];

    onLoad() {
        let e = new cc.Component.EventHandler();
        e.target = this.node;
        e.component = 'SetSlider';
        e.handler = 'onSliderEvent';
        this.getComponent(cc.Slider).slideEvents.push(e);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onEnd, this);
    }

    protected onDataChange(data: any) {
        if (this.getComponent(cc.Slider) == null) return;
        this.getComponent(cc.Slider).progress = Number(data);
    }

    private onSliderEvent(slider: cc.Slider) {
        no.EventHandlerInfo.execute(this.onProgressChange, slider.progress);
    }

    private onEnd() {
        no.EventHandlerInfo.execute(this.onProgressChangeEnd);
    }
}
