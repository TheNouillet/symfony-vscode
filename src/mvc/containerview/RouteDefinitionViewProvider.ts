import * as vscode from "vscode"
import { ContainerStore } from "../../symfony/ContainerStore";
import { RouteDefinition } from "../../symfony/RouteDefinition";
import { RouteDefinitionTreeItem } from "./RouteDefinitionTreeItem";

export class RouteDefintionViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;
    private _containerStore: ContainerStore
    private _displayPaths: boolean = false

    constructor(containerStore: ContainerStore) {
        this._containerStore = containerStore
        this.refresh()
    }

    refresh(): void {
        this._containerStore.refreshRouteDefinitions().then(() => {
            this._onDidChangeTreeData.fire();
        }).catch(reason => {
            vscode.window.showErrorMessage(reason)
        })
    }

    togglePathsDisplay(): void {
        this._displayPaths = !this._displayPaths
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element
    }

    getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
        return new Promise(resolve => {
            if (!element) {
                let routeDefinitions: RouteDefinition[] = this._containerStore.routeDefinitionList
                let result: vscode.TreeItem[] = []

                routeDefinitions.forEach(routeDefinition => {
                    result.push(new RouteDefinitionTreeItem(routeDefinition, this._displayPaths))
                });
                result.sort((a, b) => {
                    if(a.label < b.label) {
                        return -1
                    }
                    if(a.label > b.label) {
                        return 1
                    }
                    return 0
                })
                resolve(result)
            } else {
                if(element instanceof RouteDefinitionTreeItem) {
                    resolve(element.childrenItems)
                } else {
                    resolve([])
                }
            }
        })
    }
}