import * as vscode from "vscode"
import { ContainerStore } from "../../symfony/ContainerStore";
import { Parameter } from "../../symfony/Parameter";
import { ParameterTreeItem } from "./ParameterTreeItem";

export class ParameterViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;
    private _containerStore: ContainerStore

    constructor(containerStore: ContainerStore) {
        this._containerStore = containerStore
        this.refresh()
    }

    refresh(): void {
        vscode.window.withProgress({location: vscode.ProgressLocation.Window, title: "Symfony is refreshing..."}, (progress, token) => {
            return this._containerStore.refreshParameters().then(() => {
                this._onDidChangeTreeData.fire()
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
                let parameters: Parameter[] = this._containerStore.parameterList
                let result: vscode.TreeItem[] = []

                parameters.forEach(parameter => {
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