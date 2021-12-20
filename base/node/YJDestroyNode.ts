
const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/node/YJDestroyNode(删除节点)')
export default class YJDestroyNode extends cc.Component {

    public a_destroy() {
        this.node.destroy();
    }
}
