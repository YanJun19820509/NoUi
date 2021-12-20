
import { no } from "../no";

const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@menu('NoUi/fix/YJButton(防连点及trigger)')
@requireComponent(cc.Button)
export default class YJButton extends cc.Component {

    @property({ displayName: '防连点间隔时长(s)' })
    delay: number = 1;

    private _waiting = false;
    private _clickEvents: cc.Component.EventHandler[] = [];

    onLoad() {
        if (CC_EDITOR) return;
        let btn = this.getComponent(cc.Button);
        btn.clickEvents.forEach(e => {
            this._clickEvents[this._clickEvents.length] = e;
        });
        let a = new cc.Component.EventHandler();
        a.target = this.node;
        a.component = 'YJButton';
        a.handler = 'a_trigger';
        btn.clickEvents = [a];
    }

    public a_trigger() {
        if (this._waiting) return;
        no.executeHandlers(this._clickEvents);
        if (this.delay > 0) {
            this._waiting = true;
            this.scheduleOnce(() => {
                this._waiting = false;
            }, this.delay);
        }
    }
}
