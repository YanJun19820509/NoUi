// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/node/YJHideChildrenOutOfEdge(隐藏可视区域范围外的子节点)')
export default class YJHideChildrenOutOfEdge extends cc.Component {

    @property({ type: cc.Node, displayName: '可见区域节点' })
    viewNode: cc.Node = null;

    private viewRect: cc.Rect;
    private lastPos: cc.Vec2;

    update() {
        this.checkChildrenVisible();
    }

    private checkChildrenVisible() {
        if (this.viewNode == null) return;
        if (this.viewRect == null) {
            this.viewRect = cc.rect();
            this.viewRect.width = this.viewNode.width;
            this.viewRect.height = this.viewNode.height;
            this.viewRect.center = cc.v2(this.node.x + this.viewRect.width * (0.5 - this.node.anchorX), this.node.y + this.viewRect.height * (0.5 - this.node.anchorY));
        }
        let pos = cc.v2();
        this.node.getPosition(pos);
        if (this.lastPos == null) {
            this.lastPos = pos;
            return;
        }
        if (pos.equals(this.lastPos)) return;
        let center = this.viewRect.center;
        this.viewRect.center = cc.v2(center.x + this.lastPos.x - pos.x, center.y + this.lastPos.y - pos.y);
        this.lastPos = pos;
        for (let i = 0, n = this.node.childrenCount; i < n; i++) {
            let child = this.node.children[i];
            let size = child.getContentSize();
            let minX = child.x - size.width * child.anchorX;
            let minY = child.y - size.height * child.anchorY;
            if (minX > this.viewRect.xMax || minY > this.viewRect.yMax) {
                child.opacity = 0;
                continue;
            }
            let maxX = child.x + size.width * (1 - child.anchorX);
            let maxY = child.y + size.height * (1 - child.anchorY);
            if (maxX < this.viewRect.xMin || maxY < this.viewRect.yMin) {
                child.opacity = 0;
                continue;
            }
            child.opacity = 255;
        }
    }
}
