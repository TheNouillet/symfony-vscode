import { ServiceDefintionViewProvider } from "./ServiceDefintionViewProvider";
import { RouteDefintionViewProvider } from "./RouteDefinitionViewProvider";
import * as vscode from "vscode";

export class FileWatchController {
    private _serviceDefinitionViewProvider: ServiceDefintionViewProvider
    private _routeDefinitionViewProvider: RouteDefintionViewProvider
    private _disposable: vscode.Disposable

    constructor(serviceDefinitionViewProvider: ServiceDefintionViewProvider, routeDefinitionViewProvider: RouteDefintionViewProvider) {
        this._serviceDefinitionViewProvider = serviceDefinitionViewProvider
        this._routeDefinitionViewProvider = routeDefinitionViewProvider

        let subscriptions: vscode.Disposable[] = []
        vscode.workspace.onDidSaveTextDocument(e => {
            if(e.fileName.match(/(.yml|.yaml)$/)) {
                this._serviceDefinitionViewProvider.refresh()
                this._routeDefinitionViewProvider.refresh()
            }
        }, this, subscriptions)

        this._disposable = vscode.Disposable.from(...subscriptions)
    }

    public dispose() {
        this._disposable.dispose()
    }
}