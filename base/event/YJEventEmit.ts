
import { no } from "../../no";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/event/YJEventEmit(消息发送:string(type:value))')
export default class YJEventEmit extends cc.Component {

    public a_emit(e: any, v?: string) {
        let args = (v || e).split(':');
        no.Evn.emit.call(no.Evn, args[0], args);
    }
}
