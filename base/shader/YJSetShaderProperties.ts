
import SetShader from "../../fuckui/SetShader";

const { ccclass, property } = cc._decorator;

@ccclass('DefineInfo')
export class DefineInfo {
    @property()
    type: string = '';
    @property()
    isWork: boolean = false;
}

@ccclass('PropertyInfo')
export class PropertyInfo {
    @property()
    type: string = '';
    @property({ step: 0.01 })
    value: number = 0.0;
}


@ccclass
export default class YJSetShaderProperties extends cc.Component {
    @property
    path: string = '';

    @property(DefineInfo)
    defines: DefineInfo[] = [];

    @property(PropertyInfo)
    properties: PropertyInfo[] = [];

    start() {
        let ss = this.getComponent(SetShader);
        let properties = {};
        this.properties.forEach(p => {
            properties[p.type] = p.value;
        });
        let defines = {};
        this.defines.forEach(d => {
            defines[d.type] = d.isWork;
        });
        let d = {
            path: this.path,
            properties: properties,
            defines: defines
        };
        ss.setData(JSON.stringify(d));
    }
}
