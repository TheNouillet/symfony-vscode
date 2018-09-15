import * as vscode from "vscode"
import { ContainerStore } from "../../symfony/ContainerStore";
import { RouteDefinition } from "../../symfony/RouteDefinition";
import { RouteDefinitionTreeItem } from "./RouteDefinitionTreeItem";
import { AbstractContainerStoreListener } from "../../symfony/AbstractContainerStoreListener";

export class RouteDefintionViewProvider extends AbstractContainerStoreListener implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;
    private _containerStore: ContainerStore
    private _routesDefinitions: RouteDefinition[] = []
    private _displayPaths: boolean = false

    constructor(containerStore: ContainerStore) {
        super()
        this._containerStore = containerStore
        this._containerStore.subscribeListerner(this)
    }

    onRoutesChanges(routesDefinitions: RouteDefinition[]) {
        this._routesDefinitions = routesDefinitions
        this._onDidChangeTreeData.fire()
    }

    togglePathsDisplay(): void {
        this._displayPaths = !this._displayPaths
        this._onDidChangeTreeData.fire()
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element
    }

    getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
        return new Promise(resolve => {
            if (!element && this._routesDefinitions.length > 0) {
                let result: vscode.TreeItem[] = []

                this._routesDefinitions.forEach(routeDefinition => {
                    result.push(new RouteDefinitionTreeItem(routeDefinition, this._displayPaths))
                });
                result.sort((a, b) => {
                    if (a.label < b.label) {
                        return -1
                    }
                    if (a.label > b.label) {
                        return 1
                    }
                    return 0
                })
                resolve(result)
            } else {
                if (element instanceof RouteDefinitionTreeItem) {
                    resolve(element.childrenItems)
                } else {
                    resolve([])
                }
            }
        })
    }
}