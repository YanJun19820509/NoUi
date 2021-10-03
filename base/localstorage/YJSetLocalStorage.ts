// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/localstorage/YJSetLocalStorage(设置本地缓存数据)')
export default class YJSetLocalStorage extends cc.Component {

    @property({ displayName: '本地缓存数据的key' })
    key: string = '';

    public a_set(e: any, v?: string) {
        localStorage.setItem(this.key, v || e);
    }
}
