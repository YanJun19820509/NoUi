// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../../no";
import YJLoadAudioClip from "./YJLoadAudioClip";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('NoUi/audio/YJAudioPlayer(音频播放组件)')
export default class YJAudioPlayer extends cc.Component {

    @property(YJLoadAudioClip)
    loadClip: YJLoadAudioClip = null;

    @property({ displayName: '需要停止当前音乐' })
    needStop: boolean = false;

    @property({ displayName: '循环播放' })
    loop: boolean = true;

    @property({ type: no.EventHandlerInfo, visible() { return !this.loop; } })
    endCalls: no.EventHandlerInfo[] = [];

    @property
    autoPlay: boolean = true;

    onEnable() {
        this.autoPlay && this.a_play();
    }

    public async a_play() {
        this.needStop && no.audioManager.stopBGM();
        await no.waitFor(() => { return this.loadClip.loaded; });
        if (this.loop)
            no.audioManager.playClip(this.loadClip.loadedAudioClip);
        else {
            await no.audioManager.playClipOnceAsync(this.loadClip.loadedAudioClip);
            no.EventHandlerInfo.execute(this.endCalls);
        }
    }
}
