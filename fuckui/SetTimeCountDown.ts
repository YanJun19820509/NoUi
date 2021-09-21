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
@menu('NoUi/ui/SetTimeCountDown(设置倒计时:number)')
export default class SetTimeCountDown extends FuckUi {

    @property({ displayName: '显示倒计时' })
    isLabel: boolean = true;
    @property({ type: cc.Label, visible() { return this.isLabel; } })
    label: cc.Label = null;
    @property({ displayName: '格式化模板', visible() { return this.isLabel; } })
    formatter: string = '{h}:{m}:{s}';
    @property({ displayName: '用0补位', visible() { return this.isLabel; } })
    show0: boolean = true;

    @property({ type: FuckUi, tooltip: '将倒计时转换成百分比，传给对应组件', visible() { return !this.isLabel; } })
    fuckUiComponents: FuckUi[] = [];
    @property({ displayName: '由0到1', visible() { return !this.isLabel; } })
    is0_1: boolean = true;

    @property({ type: no.EventHandlerInfo, displayName: '每秒回调' })
    secondCalls: no.EventHandlerInfo[] = [];

    @property({ type: no.EventHandlerInfo, displayName: '结束回调' })
    endCalls: no.EventHandlerInfo[] = [];

    @property({ displayName: '定时触发' })
    isTime: boolean = false;
    @property({ min: 1, step: 1, displayName: '定时触发时间', visible() { return this.isTime; } })
    time: number = 60;
    @property({ type: no.EventHandlerInfo, displayName: '定时回调', visible() { return this.isTime; } })
    timeCalls: no.EventHandlerInfo[] = [];

    private _countDown: number;
    private _max: number;

    protected onDataChange(data: any) {
        let a = Number(data);
        this._countDown = a;
        this._max = a;
        this.unschedule(this.countdown);
        this.schedule(this.countdown, 1, a);

    }

    private countdown() {
        let a = this._countDown--;
        if (this.isLabel) {
            this.setLabel(no.sec2time(a, this.formatter, this.show0));
            if (a <= 0) {
                no.EventHandlerInfo.execute(this.endCalls);
            } else {
                no.EventHandlerInfo.execute(this.secondCalls);
                if (this.isTime && a == this.time) {
                    no.EventHandlerInfo.execute(this.timeCalls);
                }
            }
        } else {
            this.setPercent(a / this._max);
        }
    }

    private setLabel(str: string): void {
        if (this.label)
            this.label.string = str || '';
    }

    private setPercent(v: number) {
        if (this.is0_1) v = 1 - v;
        this.fuckUiComponents.forEach(ui => {
            ui.setData(v);
        });
    }
}
