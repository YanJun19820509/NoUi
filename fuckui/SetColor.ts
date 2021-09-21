// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";
import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetColor(设置颜色:string|cc.Color)')
export default class SetColor extends FuckUi {

    protected onDataChange(data: any) {
        if (typeof data == 'string') {
            this.node.color = no.str2Color(data);
        } else if (data instanceof cc.Color) {
            this.node.color = data;
        }
    }
}
