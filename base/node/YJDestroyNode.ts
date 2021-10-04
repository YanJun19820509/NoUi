// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/node/YJDestroyNode(删除节点)')
export default class YJDestroyNode extends cc.Component {

    public a_destroy() {
        this.node.destroy();
    }
}
