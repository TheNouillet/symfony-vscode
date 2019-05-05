import * as vscode from "vscode"
import { DIDumpFileExtractor } from "../symfony/provider/diDump/DIDumpFileExtractor";
import { ContainerStore } from "../symfony/ContainerStore";
import { FileWatcher } from "../utils/FileWatcher";
import { FileWatcherListenerInterface } from "../utils/FileWatcherListenerInterface";

export class DumpFileWatchController implements FileWatcherListenerInterface {
    private _store: ContainerStore
    private _watcher: FileWatcher

    constructor(extractor: DIDumpFileExtractor, containerStore: ContainerStore) {
        this._store = containerStore
        let dumpFileUri = extractor.getDIDumpFileUri()
        if(dumpFileUri !== null) {
            this._watcher = new FileWatcher(dumpFileUri)
            this._watcher.subscribeListener(this)
            this._watcher.startWatching()
        }
    }

    onFileChanged(uri: vscode.Uri) {
        this._store.clearCacheAndRefreshAll()
    }

    dispose() {
        this._watcher.stopWatching()
    }
}