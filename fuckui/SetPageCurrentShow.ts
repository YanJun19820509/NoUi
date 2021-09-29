// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
