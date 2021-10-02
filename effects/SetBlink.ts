// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SetNodeTweenAction from "../fuckui/SetNodeTweenAction";
import { no } from "../no";

const { ccclass, property, menu } = cc._decorator;
/**
 * 设置闪烁动效
 * @data {
 *  frequency: 3,
 *  repeat?: 0 
 * }
 * @frequency 频率，每秒闪动次数
 * @repeat 重复次数，0表示无限次（最多999次），>0表示有限次，为null则不重复
 */
@ccclass
@menu('NoUi/effects/SetBlink(闪烁动效:object)')
export default class SetBlink extends SetNodeTweenAction {

    protected createAction(data: any): cc.Tween<cc.Node> {
        let d = [{
            duration: 0.5 / data.frequency,
            props: {
                opacity: 0
            }
        }, {
            duration: 0.5 / data.frequency,
            props: {
                opacity: 255
            }
        }];
        let a = no.parseTweenData(d, this.node);
        let b = cc.tween(this.node).repeat(data.frequency, a);
        if (data.repeat != undefined) {
            return cc.tween(this.node).repeat(data.repeat || 999, b);
        }
        return b;
    }
}
