import * as vscode from "vscode"
import { ContainerStore } from "../../symfony/ContainerStore";
import { Parameter } from "../../symfony/Parameter";
import { ParameterTreeItem } from "./ParameterTreeItem";
import { AbstractContainerStoreListener } from "../../symfony/AbstractContainerStoreListener";

export class ParameterViewProvider extends AbstractContainerStoreListener implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;
    private _containerStore: ContainerStore
    private _parameters: Parameter[] = []

    constructor(containerStore: ContainerStore) {
        super()
        this._containerStore = containerStore
        this._containerStore.subscribeListerner(this)
    }

    onParametersChanges(parameters: Parameter[]) {
        this._parameters = parameters
        this._onDidChangeTreeData.fire()
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element
    }

    getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
        return new Promise(resolve => {
            if (!element && this._parameters.length > 0) {
                let result: vscode.TreeItem[] = []

                this._parameters.forEach(parameter => {
                    result.push(new ParameterTreeItem(parameter))
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
                if(element instanceof ParameterTreeItem) {
                    resolve(element.childrenItems)
                } else {
                    resolve([])
                }
            }
        })
    }
}