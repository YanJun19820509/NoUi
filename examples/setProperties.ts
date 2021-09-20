// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import YJDataWork from "../base/YJDataWork";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu('examples/setProperties')
export default class setProperties extends YJDataWork {

    protected init() {
        this.data = {
            angle: 0,
            color: '303030',
            size: { w: 100, h: 100 },
            gray: false,
            text: 'Hello NoUi',
            deadline: 60
        };
    }

    public a_changeAngle() {
        this.setValue('angle', 30);
    }

    public a_changeColor() {
        this.setValue('color', 'ffffff');
    }

    public a_changeSize() {
        this.setValue('size', { w: 120, h: 80 });
    }

    public a_setGray() {
        this.setValue('gray', true);
    }

    public a_setText() {
        this.setValue('text', 'I Love My Life!');
    }

    public a_changeTime() {
        this.setValue('deadline', 10);
    }
}
