// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { no } from "../no";

const { ccclass, property , menu} = cc._decorator;

@ccclass
@menu('NoUi/audio/YJLoadAudioClip(动态加载音频剪辑)')
export default class YJLoadAudioClip extends cc.Component {

    @property({ type: cc.AudioClip, editorOnly: true })
    clip: cc.AudioClip = null;
    @property({ editorOnly: true })
    clipUrl: string = '';
    @property({ readonly: true })
    clipUuid: string = '';
    @property
    autoLoad: boolean = true;

    public loadedAudioClip: cc.AudioClip;
    public loaded: boolean = false;

    public async loadClip(): Promise<cc.AudioClip> {
        if (this.clipUuid == '') return null;
        if (this.loadedAudioClip != null) return this.loadedAudioClip;
        return new Promise<cc.AudioClip>(resolve => {
            no.assetBundleManager.loadByUuid<cc.AudioClip>({ uuid: this.clipUuid, type: cc.AudioClip }, (p) => {
                if (p == null) resolve(null);
                else {
                    this.loadedAudioClip = p;
                    this.loaded = true;
                    resolve(this.loadedAudioClip);
                }
            });
        });
    }

    lateUpdate() {
        if (CC_EDITOR) {
            if (this.clip != null && this.clipUrl == '') {
                let name = this.clip.name;
                Editor.log(name);
                Editor.assetdb.queryAssets(`db://assets/**/${name}.mp3`, null, (err: Error, assetInfos: any[]) => {
                    if (err != null) {
                        Editor.log(err.stack);
                    } else {
                        let a = assetInfos[0] || {};
                        this.clipUrl = a.url;
                        this.clipUuid = a.uuid;
                    }
                });
            } else if (this.clipUrl != '' && this.clipUuid != '')
                this.clip = null;
        }
    }
}
