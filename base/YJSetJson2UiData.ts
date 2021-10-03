// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FuckUi from "../fuckui/FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass('')
export class Json2UiDataInfo {
    @property({ multiline: true })
    json: string = '';
    @property(FuckUi)
    ui: FuckUi = null;
}
/**
 * 将json string转any,并在onEnable时给fuckui赋值
 */
@ccclass
@menu('NoUi/base/YJSetJson2UiData(json转ui data:string)')
export default class YJSetJson2UiData extends cc.Component {

    @property(Json2UiDataInfo)
    infos: Json2UiDataInfo[] = [];

    onEnable() {
        this.infos.forEach(info => {
            if (info.json == '' || !info.ui) return;
            let data = JSON.parse(info.json);
            info.ui.setData(data);
        });
    }
}