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
        let list = [];
        for (let i = 0; i < 100; i++) {
            list[list.length] = {
                name: `listItem${i}`
            };
        }
        this.data = {
            angle: 0,
            color: '303030',
            size: { w: 100, h: 100 },
            gray: false,
            text: 'Hello NoUi',
            deadline: 60,
            list: list
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

    public a_setPosition() {
        this.setValue('pos', [50, 50]);
    }

    public a_setOpacity() {
        this.setValue('opacity', 100);
    }

    public a_setProgress() {
        this.setValue('progress', 0.6);
    }

    public a_setScale() {
        this.setValue('scale', 1.5);
    }
}
