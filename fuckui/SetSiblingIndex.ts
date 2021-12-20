
import FuckUi from "./FuckUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetSiblingIndex(设置同级节点索引:number)')
export default class SetSiblingIndex extends FuckUi {

    protected onDataChange(data: any) {
        this.node.setSiblingIndex(Number(data));
    }
}
