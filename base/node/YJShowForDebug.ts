
const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/node/YJShowForDebug(debug模式下显示)')
export default class YJShowForDebug extends cc.Component {

    onLoad() {
        !CC_DEBUG && this.node.destroy();
    }
}
