
import FuckUi from "./FuckUi";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('NoUi/ui/SetHeight(设置高:number)')
export default class SetHeight extends FuckUi {

    @property({ displayName: '是否百分比' })
    percent: boolean = false;
    @property({ displayName: '最大值', visible() { return this.percent; } })
    max: number = 0;

    protected onDataChange(data: any){
        this.node.height = this.caculate(data);
    }

    protected caculate(data: any): number{
        let h = Number(data);
        if (this.percent) {
            if (h > 1) h = 1;
            h *= this.max;
        }
        return h;
    }
}
