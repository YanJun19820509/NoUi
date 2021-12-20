
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/fix/YJPageView(修正拖动问题)')
export default class YJPageView extends cc.PageView {

    @property({ displayName: '触发切换的偏移量' })
    offset: number = 30;

    private max: number;

    public a_onTouchDown(event: cc.Event, start: cc.Vec2, end: cc.Vec2) {
        this.max = this.getPages().length;
    }

    public a_onTouchMove(event: cc.Event.EventTouch, start: cc.Vec2, end: cc.Vec2) {
        if (this.direction == cc.PageView.Direction.Horizontal) {
            let x = this.content.x;
            x += event.getDeltaX();
            if (x > 0) x = 0;
            else if (x < this.node.width - this.content.width) x = this.node.width - this.content.width;
            this.content.x = x;
        } else if (this.direction == cc.PageView.Direction.Vertical) {
            let y = this.content.y;
            y += event.getDeltaY();
            if (y < 0) y = 0;
            else if (y > this.content.height - this.node.height) y = this.content.height - this.node.height;
            this.content.y = y;
        }
    }

    public a_onTouchEnd(event: cc.Event.EventTouch, start: cc.Vec2, end: cc.Vec2) {
        let i = this.getCurrentPageIndex();
        if (this.direction == cc.PageView.Direction.Horizontal) {
            if (end.x - start.x > this.offset) i--;
            else if (start.x - end.x > this.offset) i++;
            if (i < 0) i = 0;
        }
        else if (this.direction == cc.PageView.Direction.Vertical) {
            if (end.y - start.y > this.offset) i++;
            else if (start.y - end.y > this.offset) i--;
            if (i < 0) i = 0;
        }

        else if (i >= this.max) i = this.max - 1;
        this.scrollToPage(i, 0.1);
    }

    public a_onTouchCancel(event: cc.Event.EventTouch, start: cc.Vec2, end: cc.Vec2) {
        this.a_onTouchEnd(event, start, end);
    }
}
