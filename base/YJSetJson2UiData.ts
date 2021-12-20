
import FuckUi from "../fuckui/FuckUi";

const { ccclass, property, menu } = cc._decorator;

@ccclass('Json2UiDataInfo')
export class Json2UiDataInfo {
    @property({ multiline: true })
    json: string = '';
    @property(FuckUi)
    ui: FuckUi = null;
}
/**
 * 将json string转any,并在start时给fuckui赋值
 */
@ccclass
@menu('NoUi/base/YJSetJson2UiData(json转ui data:string)')
export default class YJSetJson2UiData extends cc.Component {

    @property(Json2UiDataInfo)
    infos: Json2UiDataInfo[] = [];

    start() {
        this.infos.forEach(info => {
            if (info.json == '' || !info.ui) return;
            let data = JSON.parse(info.json);
            info.ui.setData(data);
        });
    }
}
