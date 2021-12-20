
import { no } from "../../no";

const { ccclass, property, menu } = cc._decorator;

@ccclass('ListenerInfo')
export class ListenerInfo {
    @property()
    type: string = '';
    @property(no.EventHandlerInfo)
    calls: no.EventHandlerInfo[] = [];
}
@ccclass
@menu('NoUi/event/YJEventListener(消息监听)')
export default class YJEventListener extends cc.Component {

    @property(ListenerInfo)
    infos: ListenerInfo[] = [];

    @property({ displayName: '受节点active影响' })
    nodeActiveEffect: boolean = true;

    @property({ displayName: '仅监听一次' })
    once: boolean = false;

    onLoad() {
        if (!this.nodeActiveEffect) this.init();
    }

    onEnable() {
        if (this.nodeActiveEffect) this.init();
    }

    public a_trigger(e: any, type?: string) {
        this._on(type || e);
    }

    private init() {
        this.infos.forEach(info => {
            if (info.type == '') return;
            if (this.once) {
                no.Evn.once(info.type, this._on, this);
            } else {
                no.Evn.on(info.type, this._on, this);
            }
        });
    }

    private _on(type: string, ...args: string[]) {
        for (let i = 0, n = this.infos.length; i < n; i++) {
            let info = this.infos[i];
            if (info.type == type) {
                no.EventHandlerInfo.execute(info.calls, type, args);
                break;
            }
        }
    }
}
