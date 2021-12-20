
import { no } from "../no";
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetPlayParticle(粒子播放控制:bool)')
export default class SetPlayParticle extends FuckUi {

    @property({ type: no.EventHandlerInfo, displayName: '播放完回调' })
    endCalls: no.EventHandlerInfo[] = [];

    protected onDataChange(data: any) {
        if (Boolean(data)) this._play();
        else this._stop();
    }

    private _play() {
        let p = this.getComponent(cc.ParticleSystem);
        p.resetSystem();
        if (p.duration > -1) {
            this.scheduleOnce(this._onEnd, p.duration);
        }
    }

    private _stop() {
        this.getComponent(cc.ParticleSystem).stopSystem();
        this.unschedule(this._onEnd);
    }

    private _onEnd() {
        no.EventHandlerInfo.execute(this.endCalls);
    }
}
