// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass("SwitchInfo")
export class SwitchInfo {
    @property()
    condition: string = '';

    @property({ type: cc.Node, displayName: '显示节点' })
    nodes: cc.Node[] = [];

    public show(v: boolean) {
        this.nodes.forEach(node => {
            node.active = v;
        });
    }
}

@ccclass
@menu('NoUi/ui/SetSwitch(设置显隐切换:string)')
export default class SetSwitch extends FuckUi {

    @property(SwitchInfo)
    infos: SwitchInfo[] = [];

    protected onDataChange(data: any) {
        if (data == null) return;
        this.infos.forEach(info => {
            info.show(info.condition == data);
        });
    }
}
