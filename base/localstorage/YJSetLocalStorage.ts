
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
