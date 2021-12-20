
import YJLoadPrefab from "../base/YJLoadPrefab";
import FuckUi from "./FuckUi";
import SetCreateNode from "./SetCreateNode";

const { ccclass, property, menu } = cc._decorator;

/**
 * 设置PageView
 * 数据类型可为object|[object]|[number]
 * object|[object]表示要增加1个或多个页面
 * [number]表示要删除页面的index，如果为空数组则清空
 * 也可[object,number]混搭，表示增加一个删除一个
 */
@ccclass
@menu('NoUi/ui/SetPage(设置PageView的Page:object|[object]|[number])')
export default class SetPage extends FuckUi {

    @property({ type: YJLoadPrefab, displayName: '页面', tooltip: '需要挂载SetCreateNode组件' })
    page: YJLoadPrefab = null;

    @property(cc.PageView)
    view: cc.PageView = null;

    protected onDataChange(data: any) {
        data = [].concat(data);
        if (data.length == 0) this._clear();
        else {
            data.forEach((d: any) => {
                if (d instanceof Object) this._add(d);
                else if (typeof d == 'number') this._remove(d);
            });
        }
    }

    private async _add(data: any) {
        if (!this.page.loaded) {
            await this.page.loadPrefab();
        }
        let node = cc.instantiate(this.page.loadedNode);
        this.view.addPage(node);
        (node.getComponent(SetCreateNode) || node.getComponentInChildren(SetCreateNode))?.setData(data);
    }

    private _remove(index: number) {
        this.view?.removePageAtIndex(index);
    }

    private _clear() {
        this.view?.removeAllPages();
    }
}
