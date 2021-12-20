
import { no } from "../no";
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;
/** 设置子项点击事件，需要在EventHandler中绑定本组件的a_onClick方法，点击时会发出指定事件类型的全局消息
 * @example 在列表item中挂载该组件，并绑定item的id，设置领取奖励的事件监听类型，当点击领取按钮时，发送领取事件，在主逻辑中监听领取事件，可获得item id
*/
@ccclass
@menu('NoUi/ui/SetClickEvent(设置子项点击事件:string|number)')
export default class SetClickEvent extends FuckUi {

    @property({ displayName: '事件类型' })
    type: string = '';

    private _v: any;

    protected onDataChange(data: any) {
        this._v = data;
    }

    public a_onClick() {
        no.Evn.emit(this.type, this._v);
    }
}
