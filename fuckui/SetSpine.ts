
import { no } from "../no";
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetSpine(设置spine动画:{path, animation, loop, timeScale})')
export default class SetSpine extends FuckUi {

    @property({ type: no.EventHandlerInfo, displayName: '动画播放结束回调' })
    endCall: no.EventHandlerInfo = new no.EventHandlerInfo();

    protected onDataChange(data: any) {
        let { path, animation, loop, timeScale }: { path: string, animation: string, loop: boolean, timeScale: number } = data;
        let spine = this.getComponent(sp.Skeleton);
        if (path) {
            no.assetBundleManager.loadSpine(path, res => {
                spine.skeletonData = res;
                spine.setAnimation(0, animation, loop);
                spine.timeScale = timeScale || 1;
            });
        } else if (animation) {
            spine.setAnimation(0, animation, loop);
            spine.timeScale = timeScale || 1;
        } else {
            spine.clearTrack(0);
        }

        if (!loop) {
            spine.setCompleteListener(() => {
                this.endCall.execute();
            });
        }
    }
}
