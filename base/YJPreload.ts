
import { no } from "../no";
import { YJComponent } from "./YJComponent";
import YJDataWork from "./YJDataWork";

const { ccclass, property, menu } = cc._decorator;

enum PreloadState {
    End = -1,
    LoadingBundles = 0,
    LoadingFiles,
    LoadingBundleFiles,
    LoadingFolderFiles,
    LoadingScene
}

@ccclass
@menu('NoUi/base/YJPreload(资源预加载)')
export default class YJPreload extends YJComponent {

    @property({ type: cc.String, displayName: '加载包' })
    bundles: string[] = [];

    @property({ type: cc.String, displayName: '加载单个文件' })
    files: string[] = [];

    @property({ type: cc.String, displayName: '加载包下所有文件' })
    bundleFiles: string[] = [];

    @property({ type: cc.String, displayName: '加载文件夹下所有文件' })
    folderFiles: string[] = [];

    @property({ displayName: '跳转的场景' })
    scene: string = '';

    @property({ displayName: '自动运行' })
    auto: boolean = true;

    @property({ type: YJDataWork, tooltip: '设置加载进度相关数据：总量total，完成量finished，阶段进度progress' })
    dataWork: YJDataWork = null;

    @property({ type: no.EventHandlerInfo, displayName: '加载前' })
    beforeCall: no.EventHandlerInfo[] = [];

    // @property({ type: no.EventHandlerInfo, displayName: '加载中',  })
    // progressingCall: no.EventHandlerInfo[] = [];

    @property({ type: no.EventHandlerInfo, displayName: '加载完成' })
    completeCall: no.EventHandlerInfo[] = [];

    private fileInfo: Map<string, string[]>;
    private state: PreloadState;
    private loadNext: boolean;
    private progress: number = 0;
    private total: number = 0;
    private finished: number = 0;
    private showNewScene: boolean = false;

    protected onEnable(): void {
        this.auto && this.a_startLoad();
    }

    public a_startLoad(): void {
        no.EventHandlerInfo.execute(this.beforeCall);
        this.addUpdateHandlerByFrame(this.checkState, 1);
        this.init();
        this.loadBundles();
    }

    public showScene() {
        this.showNewScene && this.scheduleOnce(() => {
            no.assetBundleManager.loadScene(this.scene, null);
        }, 0.5);
    }

    private init() {
        this.finished = 0;
        this.progress = 0;
        this.fileInfo = new Map<string, string[]>();
        this.files.forEach(path => {
            let p = no.assetBundleManager.assetPath(path);
            let b = p.bundle;
            if (!this.bundles.includes(b)) {
                this.bundles.push(b);
            }
            if (!this.fileInfo.has(b)) {
                this.fileInfo.set(b, []);
            }
            let f = p.file;
            let i = this.fileInfo.get(b);
            if (!i.includes(f)) {
                i.push(f);
            }
        });
        this.total = 1 + this.fileInfo.size + this.bundleFiles.length + this.folderFiles.length + (this.scene != '' ? 1 : 0);
    }

    protected loadBundles() {
        this.state = PreloadState.LoadingBundles;
        if (this.bundles.length == 0) {
            this.loadNext = true;
            return;
        }
        no.assetBundleManager.loadBundles(this.bundles, (p) => {
            if (p == 1) {
                this.finished++;
                this.loadNext = true;
            }
        });
    }

    protected loadFiles() {
        this.state = PreloadState.LoadingFiles;
        if (this.fileInfo.size == 0) {
            this.loadNext = true;
            this.progress = 0;
        } else {
            this.loadFilesInFileInfo(0);
        }
    }

    protected loadBundleFiles() {
        this.state = PreloadState.LoadingBundleFiles;
        if (this.bundleFiles.length == 0) {
            this.loadNext = true;
            this.progress = 0;
        } else {
            this.loadFilesInBundle(0);
        }
    }

    protected loadFolderFiles() {
        this.state = PreloadState.LoadingFolderFiles;
        if (this.folderFiles.length == 0) {
            this.loadNext = true;
            this.progress = 0;
        } else {
            this.loadFilesInFolder(0);
        }
    }

    protected loadScene() {
        this.showNewScene = false;
        this.state = PreloadState.LoadingScene;
        if (this.scene == '') {
            this.finished = this.total;
            return;
        }
        this.progress = 0.9 / this.total;
        no.assetBundleManager.preloadScene(this.scene, (p) => {
            if (p == 1) {
                this.progress = 0;
                this.finished++;
                this.showNewScene = true;
            } else {
                this.progress = p / this.total;
            }
        });
    }

    update() {
        if (this.loadNext) {
            this.loadNext = false;
            switch (this.state) {
                case PreloadState.LoadingBundles:
                    this.loadFiles();
                    break;
                case PreloadState.LoadingFiles:
                    this.loadBundleFiles();
                    break;
                case PreloadState.LoadingBundleFiles:
                    this.loadFolderFiles();
                    break;
                case PreloadState.LoadingFolderFiles:
                    this.loadScene();
                    break;
            }
        }
    }

    private checkState(): boolean {
        if (this.finished >= this.total) {
            // no.EventHandlerInfo.execute(this.progressingCall, this.total, this.finished, this.progress);
            if (this.dataWork) {
                this.dataWork.data = {
                    total: this.total,
                    finished: this.finished,
                    progress: this.progress
                }
            }
            no.EventHandlerInfo.execute(this.completeCall);
            return false;
        } else {
            // no.EventHandlerInfo.execute(this.progressingCall, this.total, this.finished, this.progress);
            if (this.dataWork) {
                this.dataWork.data = {
                    total: this.total,
                    finished: this.finished,
                    progress: this.progress
                }
            }
            return true;
        }
    }

    private loadFilesInFileInfo(index: number) {
        let b = this.bundles[index];
        if (b == null) {
            this.loadNext = true;
            return;
        }
        let files = this.fileInfo.get(b);
        if (files == null) {
            this.loadFilesInFileInfo(index + 1);
            return;
        }
        no.assetBundleManager.preloadFiles(b, files, (p) => {
            if (p == 1) {
                this.progress = 0;
                this.finished++;
                this.loadFilesInFileInfo(index + 1);
            } else {
                this.progress = p / this.total;
            }
        });
    }

    private loadFilesInBundle(index: number) {
        let b = this.bundleFiles[index];
        if (b == null) {
            this.loadNext = true;
            return;
        }
        if (b == '') {
            this.loadFilesInBundle(index + 1);
            return;
        }
        no.assetBundleManager.preloadAllFilesInBundle(b, (p) => {
            if (p == 1) {
                this.progress = 0;
                this.finished++;
                this.loadFilesInBundle(index + 1);
            } else {
                this.progress = p / this.total;
            }
        });
    }

    private loadFilesInFolder(index: number) {
        let b = this.folderFiles[index];
        if (b == null) {
            this.loadNext = true;
            return;
        }
        if (b == '') {
            this.loadFilesInFolder(index + 1);
            return;
        }
        no.assetBundleManager.preloadAllFilesInFolder(b, (p) => {
            if (p == 1) {
                this.progress = 0;
                this.finished++;
                this.loadFilesInFolder(index + 1);
            } else {
                this.progress = p / this.total;
            }
        });
    }
}
