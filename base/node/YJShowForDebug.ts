// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/node/YJShowForDebug(debug模式下显示)')
export default class YJShowForDebug extends cc.Component {

    onLoad() {
        !CC_DEBUG && this.node.destroy();
    }
}
