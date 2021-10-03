// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/base/YJAutoCall(自动执行)')
export default class YJAutoCall extends cc.Component {

    @property({ displayName: '延时(ms)', min: 0, step: 1 })
    delay: number = 0;

    @property(no.EventHandlerInfo)
    calls: no.EventHandlerInfo[] = [];

    @property({ displayName: '加载时执行' })
    callOnLoad: boolean = false;

    @property({ displayName: '仅执行一次' })
    once: boolean = false;

    private _done = false;
    onLoad() {
        this.callOnLoad && this.a_call();
    }

    public async a_call() {
        if (this.once && this._done) return;
        this._done = true;
        if (this.delay > 0) {
            await no.sleep(this.delay / 1000);
        }
        no.EventHandlerInfo.execute(this.calls);
    }
}
