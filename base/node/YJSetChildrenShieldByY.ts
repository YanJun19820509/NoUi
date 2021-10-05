// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/node/YJSetChildrenShieldByY(设置子节点之间的遮挡关系)')
export default class YJSetChildrenShieldByY extends cc.Component {

    @property({ displayName: '更新频率(帧)' })
    frameNum: number = 10;

    private _num = 0;

    update() {
        if (this._num == 0) {
            this.sortSibling();
            this._num = this.frameNum;
        } else {
            this._num--;
        }
    }

    private sortSibling() {
        let children = this.node.children;
        children.sort((a, b) => {
            return b.y - a.y;
        });
        for (let i = 0, n = children.length; i < n; i++) {
            children[i].setSiblingIndex(i);
        }
    }
}
