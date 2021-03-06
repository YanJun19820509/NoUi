
import { no } from "../../no";

const { ccclass } = cc._decorator;


export class UpdateProgressInfo {
    /**[0下载中，1完成，2失败] */
    public state: number = 0;
    public totalBytes: number = 0;
    public totalFiles: number = 0;
    public downloadedBytes: number = 0;
    public downloadedFiles: number = 0;
    public bytesPer: number = 0;
    public filesPer: number = 0;

    constructor(totalBytes: number, totalFiles: number) {
        this.totalBytes = totalBytes;
        this.totalFiles = totalFiles;
    }
}

@ccclass
export default class YJHotUpdate extends cc.Component {

    private static _instance: YJHotUpdate;
    private _am: jsb.AssetsManager;
    private _storagePath: string;
    public checkState: number;
    public needUpdateFilesSize: number;
    public updateProgressInfo: UpdateProgressInfo;

    public static get ins(): YJHotUpdate {
        return this._instance;
    }

    onLoad() {
        YJHotUpdate._instance = this;
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'yj-remote-asset');
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        this._am.setVerifyCallback(function (path, asset) {
            // // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            // var compressed = asset.compressed;
            // // Retrieve the correct md5 value.
            // var expectedMD5 = asset.md5;
            // // asset.path is relative path and path is absolute.
            // var relativePath = asset.path;
            // // The size of asset file, but this value could be absent.
            // var size = asset.size;
            return true;
        });
        this.copyFiles();
    }

    protected onDestroy(): void {
        YJHotUpdate._instance = null;
    }

    public copyFiles() {
        if (no.dataCache.getLocal('init_game') == null) {
            let jf = jsb.fileUtils;
            this.checkState = -100;//开始初始化
            if (jf.isDirectoryExist(this._storagePath)) {
                jf.createDirectory(this._storagePath);
            }
            console.log('copy manifest Files');
            let list: string[] = [];
            jf.listFilesRecursively('assets', list);
            let n = list.length;
            for (let i = 0; i < n; i++) {
                let path = list[i];
                let p = path.split('assets')[1];
                if (p[p.length - 1] == '/') {
                    let dir = this._storagePath + p;
                    if (!jf.isDirectoryExist(dir)) {
                        jf.createDirectory(dir);
                    }
                    continue;
                }
                if (path.substr(p.length - 5) == '.json') {
                    if (!jf['writeStringToFile'](jf['getStringFromFile'](path), this._storagePath + p)) {
                        console.log(p, jf.isFileExist(this._storagePath + p));
                    }
                } else {
                    let data = jf['getDataFromFile'](path);
                    if (!jf['writeDataToFile'](data, this._storagePath + p)) {
                        console.log(p, jf.isFileExist(this._storagePath + p));
                    }
                }
            }
            no.dataCache.setLocal('init_game', 'done');
        }
        this.checkState = -99;//初始化完成
    }

    /**
     * 检查更新
     */
    public checkUpdate(): boolean {
        this.checkState = 0;
        this.needUpdateFilesSize = 0;
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            let localVersionManifest = this.getLocalManifest('version.manifest');
            this._am.loadLocalManifest(localVersionManifest, this._storagePath);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            console.error('Failed to load local manifest ...');
            return false;
        }
        this._am.setEventCallback(this.checkUpdateCallback.bind(this));
        this._am.checkUpdate();
        return true;
    }

    /**
     * 执行更新
     */
    public updateFiles(): void {
        if (this._am) {
            this.updateProgressInfo = new UpdateProgressInfo(this._am.getTotalBytes(), this._am.getTotalFiles());
            this._am.setEventCallback(this.updateFilesCallback.bind(this));

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                let localManifest = this.getLocalManifest('project.manifest');
                this._am.loadLocalManifest(localManifest, this._storagePath);
            }
            this._am.update();
        }
    }

    private getLocalManifest(name: string): jsb.Manifest {
        let path = this._storagePath + '/' + name;
        if (!jsb.fileUtils.isFileExist(path)) {
            path = 'assets/' + name;
            console.log(path);
        } else {
            console.log(path);
        }
        return new jsb.Manifest(path);
    }

    private checkUpdateCallback(event) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("Already up to date with the latest remote version.");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                console.log('New version found, please try to update. (' + this._am.getTotalBytes() + ')');
                this.needUpdateFilesSize = this._am.getTotalBytes();
                break;
            default:
                return;
        }
        this._am.setEventCallback(null);
        this.checkState = 1;
    }

    private updateFilesCallback(event) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('No local manifest file found, hot update skipped.');
                this.updateProgressInfo.state = 2;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.updateProgressInfo.downloadedBytes = event.getDownloadedBytes();
                this.updateProgressInfo.downloadedFiles = event.getDownloadedFiles();
                this.updateProgressInfo.bytesPer = event.getPercent();
                this.updateProgressInfo.filesPer = event.getPercentByFile();
                // console.log(JSON.stringify(this.updateProgressInfo));
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log('Fail to download manifest file, hot update skipped.');
                this.updateProgressInfo.state = 2;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('Already up to date with the latest remote version.');
                this.updateProgressInfo.state = 2;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('Update finished. ' + event.getMessage());
                this.updateProgressInfo.state = 1;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log('Update failed. ' + event.getMessage());
                this.updateProgressInfo.state = 2;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log(event.getMessage());
                break;
            default:
                break;
        }

        if (this.updateProgressInfo.state != 0) {
            this._am.setEventCallback(null);
        }

        if (this.updateProgressInfo.state == 1) {
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            newPaths.forEach(path => {
                if (!searchPaths.includes(path)) {
                    searchPaths.unshift(path);
                }
            });
            console.log(JSON.stringify(searchPaths));
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    }

    private versionCompareHandle(versionA, versionB): number {
        console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    }
}
