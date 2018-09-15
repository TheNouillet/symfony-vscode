import * as vscode from "vscode"
import { ContainerStore } from "../../symfony/ContainerStore";
import { ServiceDefinition } from "../../symfony/ServiceDefinition";
import { ServiceDefinitionTreeItem } from "./ServiceDefinitionTreeItem";
import { AbstractContainerStoreListener } from "../../symfony/AbstractContainerStoreListener";

export class ServiceDefintionViewProvider extends AbstractContainerStoreListener implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;
    private _containerStore: ContainerStore
    private _servicesDefinitions: ServiceDefinition[] = []
    private _displayClasses: boolean = false

    constructor(containerStore: ContainerStore) {
        super()
        this._containerStore = containerStore
        this._containerStore.subscribeListerner(this)
    }

    onServicesChanges(servicesDefinitions: ServiceDefinition[]) {
        this._servicesDefinitions = servicesDefinitions
        this._onDidChangeTreeData.fire()
    }

    toggleClassDisplay(): void {
        this._displayClasses = !this._displayClasses
        this._onDidChangeTreeData.fire()
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element
    }

    getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
        return new Promise(resolve => {
            if (!element && this._servicesDefinitions.length > 0) {
                let result: ServiceDefinitionTreeItem[] = []

                this._servicesDefinitions.forEach(serviceDefinition => {
                    result.push(new ServiceDefinitionTreeItem(serviceDefinition, this._displayClasses))
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
                if (element instanceof ServiceDefinitionTreeItem) {
                    resolve(element.childrenItems)
                } else {
                    resolve([])
                }
            }
        })
    }
}