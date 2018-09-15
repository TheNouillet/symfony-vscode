import * as vscode from "vscode";
import { ContainerStore } from "../symfony/ContainerStore";

export class FileWatchController {
    private _containerStore: ContainerStore
    private _disposable: vscode.Disposable

    constructor(containerStore: ContainerStore) {
        this._containerStore = containerStore

        let subscriptions: vscode.Disposable[] = []
        vscode.workspace.onDidSaveTextDocument(e => {
            if(e.fileName.match(/(.yml|.yaml)$/)) {
                this._containerStore.refreshAll()
            }
        }, this, subscriptions)

        this._disposable = vscode.Disposable.from(...subscriptions)
    }

    public dispose() {
        this._disposable.dispose()
    }
}