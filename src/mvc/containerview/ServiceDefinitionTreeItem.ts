import * as vscode from "vscode";
import { ServiceDefinition } from "../../symfony/ServiceDefinition";

export class ServiceDefinitionTreeItem extends vscode.TreeItem {
    private _serviceDefinition: ServiceDefinition

    constructor(
        serviceDefinition: ServiceDefinition
    ) {
        super(serviceDefinition.id, vscode.TreeItemCollapsibleState.Collapsed)
        this._serviceDefinition = serviceDefinition
    }

    get tooltip() {
        return this._serviceDefinition.className
    }

    get childrenItems() {
        let children: vscode.TreeItem[] = []

        children.push(new vscode.TreeItem("Class : " + this._serviceDefinition.className, vscode.TreeItemCollapsibleState.None))
        children.push(new vscode.TreeItem("Visibility : " + (this._serviceDefinition.public ? "Is public" : "Is private"), vscode.TreeItemCollapsibleState.None))

        return children
    }
}