
import YJCreateNode from "../base/YJCreateNode";
import YJDataWork from "../base/YJDataWork";
import { MaxRects } from "../engine/MaxRects";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('examples/MaxRectTest')
export default class MaxRectTest extends cc.Component {

    @property(cc.EditBox)
    w: cc.EditBox = null;
    @property(cc.EditBox)
    h: cc.EditBox = null;
    @property(YJCreateNode)
    createNode: YJCreateNode = null;
    @property(YJCreateNode)
    createNode1: YJCreateNode = null;
    @property(cc.Node)
    parent: cc.Node = null;

    private maxRect: MaxRects;

    onLoad() {
        this.maxRect = new MaxRects(1024, 1024);
        // this.autoCreate();
    }

    public async a_add() {
        let w = Number(this.w.string || 10),
            h = Number(this.h.string || 10);
        this._create(w, h);
    }

    private async _create(w, h) {
        let p = this.maxRect.find(w, h);
        if (!p) return;
        let node = await this.createNode.createNode();
        node.getComponent(YJDataWork).setValue('pos', [p.x, -p.y]);
        node.getComponent(YJDataWork).setValue('size', [w, h]);
        node.getComponent(YJDataWork).setValue('title', `${w}x${h}`);
        // this.showLastRects();
    }

    private autoCreate() {
        let a = [[428, 273], [600, 238], [112, 112], [122, 122], [106, 107], [98, 98], [130, 130], [99, 98], [98, 98], [99, 98], [98, 98], [99, 98], [98, 98], [99, 98], [98, 98]];//];
        a.forEach(b => {
            this._create(b[0], b[1]);
        });
    }

    private async showLastRects() {
        let rects:cc.Rect[] = this.maxRect.lastRects;
        this.parent.removeAllChildren();
        for(let i = 0, n = rects.length; i<n; i++){
            let r = rects[i];
            let node = await this.createNode1.createNode();
            node.getComponent(YJDataWork).setValue('pos', [r.x, -r.y]);
            node.getComponent(YJDataWork).setValue('size', [r.width, r.height]);
            node.getComponent(YJDataWork).setValue('title', `${r.width}x${r.height}`);
        }
    }
}
