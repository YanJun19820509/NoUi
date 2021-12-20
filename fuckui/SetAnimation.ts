
import { no } from "../no";
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;
/**
 * 设置帧动画，数据结构为
 * @data {
 * clipPath:string,
 * clipName:string,
 * repeat: number
 * }
 * @clipPath 为帧动画文件路径，如果当前已加载动画可忽略
 * @clipName 为帧动画剪辑名，如果没有设置则默认为当前动画
 * @repeat 为重复次数，不设置或-1为无限次（最多999次），0为停止，>0为有限次
 *  默认支持多个动画同时播放，如果只要播放一个动画，需要手动停止其他动画
 */
@ccclass
@menu('NoUi/ui/SetAnimation(设置帧动画:object)')
export default class SetAnimation extends FuckUi {

    @property({ type: no.EventHandlerInfo, displayName: '播放开始前的回调' })
    beforeStartHandlers: no.EventHandlerInfo[] = [];

    @property({ type: no.EventHandlerInfo, displayName: '播放完成后的回调' })
    afterEndHandlers: no.EventHandlerInfo[] = [];

    @property({ type: no.EventHandlerInfo, displayName: '帧事件触发的回调' })
    eventHandlers: no.EventHandlerInfo[] = [];

    private needReleaseClips: cc.AnimationClip[] = [];

    onDisable() {
        let ani = this.getComponent(cc.Animation);
        let n = this.needReleaseClips.length;
        while (n-- > 0) {
            let clip = this.needReleaseClips.shift();
            ani.removeClip(clip, true)
            no.assetBundleManager.decRef(clip);
        }
    }

    protected async onDataChange(data: any) {
        let ani = this.getComponent(cc.Animation);
        await no.waitFor(() => { return ani.enabled; });
        let path = data.clipPath,
            name = data.clipName || (ani.currentClip || ani.defaultClip)?.name,
            repeat = data.repeat;

        if (name) {
            if (!ani.getAnimationState(name) && path) {
                await this._loadClip(path, name);
            }
            this._play(name, repeat);
        }
    }

    private async _loadClip(path: string, name: string): Promise<void> {
        return new Promise<void>(resolve => {
            no.assetBundleManager.loadAnimationClip(path, (clip) => {
                no.addToArray(this.needReleaseClips, clip);
                this.getComponent(cc.Animation).addClip(clip, name);
                resolve();
            });
        });
    }

    private _play(name: string, repeat?: number) {
        let ani: cc.Animation = this.getComponent(cc.Animation);
        if (repeat == 0) {
            ani.stop(name);
            return;
        }
        let state = ani.getAnimationState(name);
        if (state) {
            ani.on('play', this.onPlay, this);
            ani.on('finished', this.onFinished, this);
            if (repeat == null || repeat == -1)
                repeat = 999;
            state.wrapMode = cc.WrapMode.Loop;
            state.repeatCount = repeat;
            ani.playAdditive(name, 0);
        }
    }

    private onPlay() {
        no.EventHandlerInfo.execute(this.beforeStartHandlers);
    }

    private onFinished() {
        no.EventHandlerInfo.execute(this.afterEndHandlers);
    }

    public onFrameEvent(v: any): void {
        no.EventHandlerInfo.execute(this.eventHandlers, v);
    }
}
