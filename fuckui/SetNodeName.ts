
import FuckUi from "./FuckUi";

const {ccclass, menu} = cc._decorator;

@ccclass
@menu('NoUi/ui/SetNodeName(设置节点名称:string)')
export default class SetNodeName extends FuckUi {

    protected onDataChange(data: any){
        this.node.name = String(data);
    }
}
