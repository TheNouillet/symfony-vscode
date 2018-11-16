import * as vscode from "vscode";
import { ContainerStore } from "../symfony/ContainerStore";

export class FileWatchController {
    private _containerStore: ContainerStore
    private _disposable: vscode.Disposable
    private _configuration = vscode.workspace.getConfiguration("symfony-vscode")

    constructor(containerStore: ContainerStore) {
        this._containerStore = containerStore
        let fileNameRegExp = this._getFileNameRegExp()

        let subscriptions: vscode.Disposable[] = []
        vscode.workspace.onDidSaveTextDocument(e => {
            if(e.fileName.match(fileNameRegExp)) {
                this._containerStore.refreshAll()
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