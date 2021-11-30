// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass('SetUiGroupSwitchInfo')
export class SetUiGroupSwitchInfo {
    @property()
    condition: string = '';
    @property(cc.Node)
    node: cc.Node = null;
}

@ccclass
@menu('NoUi/ui/SetUiGroupSwitch(根据条件切换ui模块:string)')
export default class SetUiGroupSwitch extends FuckUi {

    @property(SetUiGroupSwitchInfo)
    infos: SetUiGroupSwitchInfo[] = [];

    protected onDataChange(data: any) {
        this.infos.forEach(info => {
            if (info.node) {
                info.node.active = info.condition === data;
            }
        });
    }
}
