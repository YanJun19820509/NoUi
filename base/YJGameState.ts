
import { no } from "../no";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/base/YJGameState(游戏状态)')
export default class YJGameState extends cc.Component {

    @property({ type: no.EventHandlerInfo, displayName: '进入后台时回调' })
    onHideCalls: no.EventHandlerInfo[] = [];

    @property({ type: no.EventHandlerInfo, displayName: '回到前台时回调' })
    onShowCalls: no.EventHandlerInfo[] = [];

    @property({ displayName: '进入后台多长时间执行回到前台回调(秒)' })
    duration: number = 30;

    @property({ displayName: '触发游戏重启的事件类型' })
    type: string = 'game_restart'

    private time: number;

    onLoad() {
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
        no.Evn.on(this.type, this.restart, this);
    }

    onDestroy() {
        cc.game.targetOff(this);
    }

    private onHide(): void {
        this.time = no.timestamp();
        no.EventHandlerInfo.execute(this.onHideCalls);
    }

    private onShow(): void {
        if (no.timestamp() - this.time >= this.duration)
            no.EventHandlerInfo.execute(this.onShowCalls);
    }

    private restart() {
        if (CC_JSB)
            cc.game.restart();
        else if (cc.sys.isBrowser)
            window.document.location.reload();
    }
}
