// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 临时动态合图管理器
 */
export class TmpAtlasManager {
    private static _excludes = [];
    private _duration = 3;
    private _canCreate = true;

    private static _ins: TmpAtlasManager;
    public static get ins(): TmpAtlasManager {
        if (!this._ins) {
            this._ins = new TmpAtlasManager();
        }
        return this._ins;
    }

    /**
     * 添加不需要创建合图的界面
     * @param name
     */
    public static addExclude(name: string) {
        this._excludes[this._excludes.length] = name;
    }

    /**
     * 临时动态合图数量
     */
    public get tmpAtlasNum(): number {
        if (!this._enable) { return 0; }
        return cc.dynamicAtlasManager['tmpAtlasNum'];
    }
    /**
     * 创建临时动态合图
     */
    public create(type: string, bigger = 1) {
        if (!this._cd()) { return; }
        if (!this._enable || TmpAtlasManager._excludes.includes(type)) { return; }
        // if (this._lastRemove == type) {
        //     this._lastRemove = null
        //     return;
        // }
        if (!cc.dynamicAtlasManager['tmpAtlasByName'](type)) {
            cc.dynamicAtlasManager['setTmpAtlas'](type, bigger);
            console.error(`setTmpAtlas${this.tmpAtlasNum}---${type}`);
        }
    }
    /**
     * 删除临时动态合图
     */
    public remove(type: string) {
        // if (this._lastRemove && this._lastRemove == type) { return; }
        // this._remove(this._lastRemove);
        // this._lastRemove = type;
        this._remove(type);
    }

    private _remove(type: string) {
        if (!type || !this._enable || TmpAtlasManager._excludes.includes(type)) { return; }
        console.error(`removeTmpAtlas${this.tmpAtlasNum}---${type}`);
        cc.dynamicAtlasManager['removeTmpAtlas'](type);
        console.error(`currentAtlasName---${cc.dynamicAtlasManager['currentAtlasName']}`);
    }

    private _cd(): boolean {
        if (!this._canCreate) {
            return false;
        }
        this._canCreate = false;
        setTimeout(() => {
            this._canCreate = true;
        }, this._duration * 1000);
        return true;
    }

    private get _enable(): boolean {
        return cc.dynamicAtlasManager['setTmpAtlas'] != undefined && cc.dynamicAtlasManager.enabled;;
    }
}
