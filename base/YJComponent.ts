import { no } from "../no";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu('NoUi/base/YJComponent')
export class YJComponent extends cc.Component {
    private updateHandlers: Map<number, any>;
    private updateHandlersNum: number = 0;
    private needRemoveHandlerKeys: number[] = [];

    /**
     * 设置在lateUpdate中执行的方法，如果方法返回false，则移除
     * @param f 
     * @param frequency 频率，每隔n帧执行一次
     * @returns handler key
     */
    public addUpdateHandlerByFrame(f: Function, frequency: number): number {
        return this.addHandler({ f: f, fre: frequency, n: 0 });
    }

    /**
     * 设置在lateUpdate中执行的方法，如果方法返回false，则移除
     * @param f 
     * @param duration 间隔时长，每隔n秒执行一次
     * @returns handler key
     */
    public addUpdateHandlerByTime(f: Function, duration: number): number {
        return this.addHandler({ f: f, dur: duration, dt: 0 });
    }

    private addHandler(v: any): number {
        this.updateHandlers = this.updateHandlers || new Map<number, any>();
        this.updateHandlers.set(this.updateHandlersNum, v);
        return this.updateHandlersNum++;
    }

    /**
     * 根据handler key移除某方法
     * @param handlerKey 设置时反回的key
     */
    public removeUpdateHandler(handlerKey: number): void {
        this.needRemoveHandlerKeys.push(handlerKey);
    }

    public clearUpdateHandlers(): void {
        this.updateHandlers = null;
    }

    private executeUpdateHandlers(dt: number): void {
        if (this.updateHandlers == null) return;

        this.removeHandlers(this.needRemoveHandlerKeys);
        this.needRemoveHandlerKeys = [];
        let keys = [];
        this.updateHandlers.forEach((v, k) => {
            let run = false;
            if (v.dur != undefined) {
                v.dt += dt;
                run = v.dt >= v.dur;
                run && (v.dt = 0);
            } else {
                v.n++;
                run = v.n >= v.fre;
                run && (v.n = 0);
            }
            if (run) {
                if (v.f.call(this, dt) === false) {
                    keys.push(k);
                }
            }
        });
        this.removeHandlers(keys);
    }

    private removeHandlers(keys: number[]): void {
        keys.forEach(k => {
            this.updateHandlers?.delete(k);
        });
    }

    lateUpdate(dt: number) {
        this.executeUpdateHandlers(dt);
    }

    /**
     * 等待表达式成立
     * @param express 
     * @returns 
     */
    public async waitFor(express: (dt?: number) => boolean): Promise<void> {
        return new Promise<void>(resolve => {
            this.callUntil(express, resolve);
        });
    }

    /**
     * 直到表达式成立后执行回调
     * @param express 表达式
     * @param callback 回调
     */
    public callUntil(express: (dt?: number) => boolean, callback: () => void, dt = 0): void {
        if (express(dt)) {
            callback?.();
            return;
        }
        this.scheduleOnce((dt: number) => {
            this.callUntil(express, callback, dt);
        }, 0);
    }

    /**
     * 等待几帧
     * @param n 
     * @returns 
     */
    public async waitForFrames(n?: number): Promise<void> {
        return new Promise<void>(resolve => {
            let repeat = !n ? 0 : (n < 0 ? Infinity : n - 1);
            this.schedule(resolve, 0, repeat);
        });
    }

    /**
     * 等待一段时间
     * @param duration 秒
     * @returns 
     */
    public async waitForTime(duration: number): Promise<void> {
        return new Promise<void>(resolve => {
            this.scheduleOnce(resolve, duration);
        });
    }

    public clearWaits(): void {
        this.unscheduleAllCallbacks();
    }
}