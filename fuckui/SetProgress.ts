
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetProgress(设置进度条:number)')
export default class SetProgress extends FuckUi {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property({ displayName: '缓动速度', step: 50, min: 0, tooltip: '从0到1所需要毫秒时间' })
    motionSpeed: number = 500;
    @property({ displayName: '小最进度', min: 0, max: 1, step: 0.1 })
    initValue: number = 0;

    private speed: number;
    private dir: number;
    private targetValue: number = -1;

    onLoad() {
        this.speed = 1000 / this.motionSpeed;
    }

    protected onDataChange(data: any) {
        if (data > 0 && data < this.initValue)
            data = this.initValue;
        if (this.motionSpeed == 0) {
            this.progressBar.progress = data;
        } else {
            this.targetValue = data;
            this.dir = data > this.progressBar.progress ? 1 : -1;
        }
    }

    update(dt: number): void {
        if (this.targetValue >= 0) {
            let p = this.progressBar.progress + this.speed * this.dir * dt;
            if (this.dir > 0 && p >= this.targetValue || this.dir < 0 && p <= this.targetValue) {
                p = this.targetValue;
                this.targetValue = -1;
            }
            this.progressBar.progress = p;
        }
    }
}
