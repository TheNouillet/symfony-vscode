import * as vscode from "vscode";
import { ContainerStore } from "../symfony/ContainerStore";
import { PHPClassStore } from "../php/PHPClassStore";

export class FileWatchController {
    private _containerStore: ContainerStore
    private _phpClassStore: PHPClassStore
    private _disposable: vscode.Disposable
    private _configuration = vscode.workspace.getConfiguration("symfony-vscode")

    constructor(containerStore: ContainerStore, phpClassStore: PHPClassStore) {
        this._containerStore = containerStore
        this._phpClassStore = phpClassStore
        let fileNameRegExp = this._getFileNameRegExp()

        let subscriptions: vscode.Disposable[] = []
        vscode.workspace.onDidSaveTextDocument(e => {
            if(e.fileName.match(fileNameRegExp)) {
                this._containerStore.clearCacheAndRefreshAll()
            }
            if(e.fileName.match(/\.php$/)) {
                this._phpClassStore.clearCacheAndRefresh(e.uri)
            }
        }, this, subscriptions)

        this._disposable = vscode.Disposable.from(...subscriptions)
    }

    protected _getFileNameRegExp(): RegExp {
        let extensions: string[] = this._configuration.get('fileWatchingPatterns')
        extensions = extensions.map((ext) => {
            return '.' + ext
        })
        return new RegExp("(" + extensions.join('|') + ")$")
    }

    public dispose() {
        this._disposable.dispose()
    }
}