
import { no } from "../no";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/node/YJNodeTarget(节点目标)')
export default class YJNodeTarget extends cc.Component {

    @property
    type: string = '';

    onEnable() {
        no.nodeTargetManager.register(this.type, this);
    }

    onDisable() {
        no.nodeTargetManager.remove(this.type);
    }

    /**
     * 目标节点的世界坐标
     */
    public get nodeWorldPosition(): cc.Vec3 {
        let p = cc.v3();
        this.node.parent?.convertToWorldSpaceAR(this.node.position, p);
        return p;
    }

    /**
     * 触摸检测
     * @param touchPosition 触摸的世界坐标
     * @param trigger 是否触发touch事件，默认true
     * @returns boolean
     */
    public checkTouch(touchPosition: cc.Vec2, trigger = true): boolean {
        let rect = no.nodeBoundingBox(this.node);
        let a = rect.contains(touchPosition);
        if (a && trigger) {
            let btn = this.getComponent(cc.Button);
            if (btn) {
                if (btn.clickEvents.length > 0) no.executeHandlers(btn.clickEvents);
                else {
                    let tgl = this.getComponent(cc.Toggle);
                    if (tgl && tgl.checkEvents.length > 0) no.executeHandlers(tgl.checkEvents);
                }
            }
        }
        return a;
    }
}
