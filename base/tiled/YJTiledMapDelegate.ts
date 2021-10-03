// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { YJComponent } from "../YJComponent";
import YJTiledMapData from "./YJTiledMapData";

const { ccclass, menu } = cc._decorator;
/**
 * SetTileMap的代理，需要子类实现具体逻辑
 */
@ccclass
@menu('NoUi/ui/YJTileMapDelegate(SetTileMap的代理)')
export default class YJTiledMapDelegate extends YJComponent {
    /**
     * 地图初始化前
     */
    public onBeforeInitMap(): void { }

    /**
     * 地图初始化时
     * @param mapInfo tiled数据
     */
    public onInitMap(mapInfo: YJTiledMapData) { }

    /**
     * 初始化tiled中设置的object
     * @param type 在tiled中添加的自定义属性key为type的值
     * @param info object对象数据
     */
    public onInitObjects(type: string, info: any) { }

    /**
     * 初始化完成时
     */
    public onInitComplete(): void { }
}
