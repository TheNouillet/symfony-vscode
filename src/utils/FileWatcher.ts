import * as vscode from "vscode";
import * as fs from "graceful-fs";
import { FileWatcherListenerInterface } from "./FileWatcherListenerInterface";

export class FileWatcher {
    protected _listeners: FileWatcherListenerInterface[] = []
    protected _fileUri: vscode.Uri
    protected _watcher: fs.FSWatcher = null

    constructor(uri: vscode.Uri) {
        this._fileUri = uri
    }

    startWatching() {
        let callback = (eventType, fileName) => {
            if(eventType === "change") {
                this._listeners.forEach(listener => {
                    listener.onFileChanged(this._fileUri)
                })
            } else {
                this._watcher.close()
                this._watcher = fs.watch(this._fileUri.fsPath, callback)
            }
        }
        this._watcher = fs.watch(this._fileUri.fsPath, callback)
    }

    stopWatching() {
        this._watcher.close()
    }

    subscribeListener(listener: FileWatcherListenerInterface) {
        this._listeners.push(listener)
    }
}