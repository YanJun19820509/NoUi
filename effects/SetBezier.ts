// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SetNodeTweenAction from "../fuckui/SetNodeTweenAction";

const { ccclass, menu } = cc._decorator;
/**
 * 设置贝塞尔曲线动效
 * @data {
 * delay?: 1,
*      duration: 1,
*      to_by?: 'to',
*      points: [cc.Vec2,cc.Vec2,cc.Vec2],
*      repeat?: 0
 * }
 */
@ccclass
@menu('NoUi/effects/SetBezier(贝塞尔曲线动效:object)')
export default class SetBezier extends SetNodeTweenAction {

    protected createAction(data: any): cc.Tween<cc.Node> {
        let a = cc.tween(this.node);
        if (data.delay) {
            a = a.delay(data.delay);
        }
        if (data.to_by == 'by') {
            a = a.bezierBy(data.duration, data.points[0], data.points[1], data.points[2]);
        } else {
            a = a.bezierTo(data.duration, data.points[0], data.points[1], data.points[2]);
        }
        if (data.repeat != undefined) {
            a = a.repeat(data.repeat || 999);
        }
        return a;
    }
}
