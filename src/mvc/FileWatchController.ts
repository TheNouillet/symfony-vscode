import { ServiceDefintionViewProvider } from "./containerview/ServiceDefintionViewProvider";
import { RouteDefintionViewProvider } from "./containerview/RouteDefinitionViewProvider";
import * as vscode from "vscode";
import { ParameterViewProvider } from "./containerview/ParameterViewProvider";

export class FileWatchController {
    private _serviceDefinitionViewProvider: ServiceDefintionViewProvider
    private _routeDefinitionViewProvider: RouteDefintionViewProvider
    private _parameterViewProvider: ParameterViewProvider
    private _disposable: vscode.Disposable

    constructor(serviceDefinitionViewProvider: ServiceDefintionViewProvider, routeDefinitionViewProvider: RouteDefintionViewProvider,
        parameterViewProvider: ParameterViewProvider) {
        this._serviceDefinitionViewProvider = serviceDefinitionViewProvider
        this._routeDefinitionViewProvider = routeDefinitionViewProvider
        this._parameterViewProvider = parameterViewProvider

        let subscriptions: vscode.Disposable[] = []
        vscode.workspace.onDidSaveTextDocument(e => {
            if(e.fileName.match(/(.yml|.yaml)$/)) {
                this._serviceDefinitionViewProvider.refresh()
                this._routeDefinitionViewProvider.refresh()
                this._parameterViewProvider.refresh()
            }
        }, this, subscriptions)

        this._disposable = vscode.Disposable.from(...subscriptions)
    }

    public dispose() {
        this._disposable.dispose()
    }
}