
import FuckUi from "./FuckUi";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu('NoUi/ui/SetPageCurrentShow(设置当前显示的页面:number)')
export default class SetPageCurrentShow extends FuckUi {

    @property(cc.PageView)
    pageView: cc.PageView = null;

    protected onDataChange(data: any) {
        this.pageView?.setCurrentPageIndex(Number(data));
    }
}
