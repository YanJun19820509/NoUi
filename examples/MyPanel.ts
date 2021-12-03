// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import YJPanel, { panelPrefabPath } from "../base/node/YJPanel";

const { ccclass } = cc._decorator;

@ccclass
@panelPrefabPath('Script/NoUi/examples/panel.prefab')
export default class MyPanel extends YJPanel {

}
