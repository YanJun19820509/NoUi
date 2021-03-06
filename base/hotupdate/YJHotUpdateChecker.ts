
import { no } from "../../no";
import { YJComponent } from "../YJComponent";
import YJDataWork from "../YJDataWork";
import YJHotUpdate from "./YJHotUpdate";

const { ccclass, property, requireComponent, menu } = cc._decorator;

@ccclass
@requireComponent(YJHotUpdate)
@menu('NoUi/hotUpdate/YJHotUpdateChecker(热更新检查下载器)')
export default class YJHotUpdateChecker extends YJComponent {

    @property({ type: YJDataWork, tooltip: '设置相关数据：需要更新文件大小updateSize，已下载文件大小downloadedBytes，下载进度progress' })
    dataWork: YJDataWork = null;

    @property({ type: no.EventHandlerInfo, displayName: '需要更新时触发的回调' })
    triggers: no.EventHandlerInfo[] = [];

    @property({ type: no.EventHandlerInfo, displayName: '不需要更新时触发的回调' })
    triggers1: no.EventHandlerInfo[] = [];

    @property({ type: no.EventHandlerInfo, displayName: '下载完成回调' })
    downloadCompleteCall: no.EventHandlerInfo[] = [];


    onLoad() {
        if (cc.sys.isNative) this.check();
        else no.EventHandlerInfo.execute(this.triggers1);
    }

    private async check() {
        await this.waitFor(() => { return YJHotUpdate.ins.checkState == -99; });
        if (!YJHotUpdate.ins.checkUpdate()) no.EventHandlerInfo.execute(this.triggers1);
        else {
            let size = YJHotUpdate.ins.needUpdateFilesSize;
            if (size > 0) {
                this.dataWork.setValue('updateSize', size);
                no.EventHandlerInfo.execute(this.triggers);
            } else no.EventHandlerInfo.execute(this.triggers1);
        }
    }

    public a_download() {
        console.log('start updateFiles');
        YJHotUpdate.ins.updateFiles();
        this.addUpdateHandlerByFrame(this.checkDownload);
    }

    public a_cancel() {
        cc.audioEngine.stopAll();
        cc.game.restart();
    }

    private checkDownload(): boolean {
        let d = YJHotUpdate.ins.updateProgressInfo;
        if (d && d.state == 0) {
            if (this.dataWork) {
                this.dataWork.data = {
                    downloadedBytes: d.downloadedBytes,
                    progress: Math.floor(d.bytesPer * 100)
                };
            }
            console.log('update progress' + d.bytesPer);
            return true;
        } else {
            no.EventHandlerInfo.execute(this.downloadCompleteCall);
            return false;
        }
    }
}
