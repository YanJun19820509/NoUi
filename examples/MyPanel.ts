// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import YJPanel from "../base/node/YJPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MyPanel extends YJPanel {

    public static prefabUuid = '59b035aa-fc1c-4ae2-ac8a-40ea291888f1';
}
