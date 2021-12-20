
import { no } from "../no";
import FuckUi from "./FuckUi";

const { ccclass, menu, property } = cc._decorator;

@ccclass("ConditionHandlerInfo")
export class ConditionHandlerInfo {
    @property()
    condition: string = '';

    @property(no.EventHandlerInfo)
    handlers: no.EventHandlerInfo[] = [];

}

@ccclass
@menu('NoUi/ui/SetConditionHandler(设置条件处理:string)')
export default class SetConditionHandler extends FuckUi {

    @property(ConditionHandlerInfo)
    infos: ConditionHandlerInfo[] = [];

    protected onDataChange(data: any) {
        this.infos.forEach(info => {
            if (info.condition == data){
                no.EventHandlerInfo.execute(info.handlers);
            }
        });
    }
}
