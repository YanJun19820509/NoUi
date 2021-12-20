
import SetScrollToPercent from "./SetScrollToPercent";

const { ccclass, property, menu } = cc._decorator;
/**
 * scrollview滚动到某个节点
 */
@ccclass
@menu('NoUi/ui/SetScrollToNode(设置scrollView滚动到节点:string)')
export default class SetScrollToNode extends SetScrollToPercent {

    protected onDataChange(data: any) {
        this.a_scrollToNode(data);
    }

    public a_scrollToNode(name: string) {
        if (this.scrollView == null) return;
        let node = this.scrollView.content.getChildByName(name);
        if (node == null) return;
        let size = this.scrollView.content.getContentSize();
        let rect = node.getBoundingBox();
        let percent = 0;
        if (this.scrollView.vertical) {
            percent = -rect.origin.y / size.height;
        } else {
            percent = rect.origin.x / size.width;
        }
        this.a_scrollToPercent(percent);
    }
}
