import * as vscode from "vscode"
import { ContainerStore } from "../../symfony/ContainerStore";
import { ServiceDefinition } from "../../symfony/ServiceDefinition";
import { ServiceDefinitionTreeItem } from "./ServiceDefinitionTreeItem";

export class ServiceDefintionViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;
    private _containerStore: ContainerStore

    constructor(containerStore: ContainerStore) {
        this._containerStore = containerStore
        this.refresh()
    }

    refresh(): void {
        vscode.window.withProgress({location: vscode.ProgressLocation.Window, title: "Symfony is refreshing..."}, (progress, token) => {
            return this._containerStore.refreshServiceDefinitions().then(() => {
                this._onDidChangeTreeData.fire();
            }).catch(reason => {
                vscode.window.showErrorMessage(reason)
            })
        })
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element
    }

    getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
        return new Promise(resolve => {
            if (!element) {
                let serviceDefinitions: ServiceDefinition[] = this._containerStore.serviceDefinitionList
                let result: vscode.TreeItem[] = []

                serviceDefinitions.forEach(serviceDefinition => {
                    result.push(new ServiceDefinitionTreeItem(serviceDefinition))
                });

                resolve(result)
            } else {
                if(element instanceof ServiceDefinitionTreeItem) {
                    resolve(element.childrenItems)
                } else {
                    resolve([])
                }
            }
        })
    }
}