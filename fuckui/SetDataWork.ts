
import YJDataWork from "../base/YJDataWork";
import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetDataWork(将数据赋值给YJDataWork:any)')
export default class SetDataWork extends FuckUi {

    @property(YJDataWork)
    dataWork: YJDataWork = null;

    protected onDataChange(data: any) {
        if (this.dataWork) {
            this.dataWork.data = data;
        }
    }
}
