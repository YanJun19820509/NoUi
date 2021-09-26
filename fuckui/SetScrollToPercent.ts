// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FuckUi from "./FuckUi";

const { ccclass, property, menu } = cc._decorator;
/**
 * scrollview滚动到百分比位置
 */
@ccclass
@menu('NoUi/ui/SetScrollToPercent(设置scrollView滚动到:number(0-1))')
export default class SetScrollToPercent extends FuckUi {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property({ displayName: '目标位置在可视范围内0-1', min: 0, max: 1 })
    at: number = 0.5;

    @property({ displayName: '滚动动画时长(秒)', min: 0 })
    duration: number = 0;

    protected onDataChange(data: any) {
        this.a_scrollToPercent(data);
    }

    public a_scrollToPercent(per: number) {
        if (this.scrollView == null) return;
        let size = this.scrollView.content.getContentSize();
        let offset = cc.v2();
        if (this.scrollView.vertical) {
            offset.y = size.height * per - this.scrollView.node.height * this.at;
        } else {
            offset.x = size.width * per + this.scrollView.node.width * this.at;
        }
        this.scrollToOffset(offset);
    }

    protected scrollToOffset(offset: cc.Vec2) {
        if (this.scrollView == null) return;
        let maxOffset = this.scrollView.getMaxScrollOffset();
        if (offset.x < 0) offset.x = 0;
        else if (offset.x > maxOffset.x) offset.x = maxOffset.x;
        if (offset.y < 0) offset.y = 0;
        else if (offset.y > maxOffset.y) offset.y = maxOffset.y;
        this.scrollView.scrollToOffset(offset, this.duration);
    }
}
