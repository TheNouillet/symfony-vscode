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
        if(this._serviceDefinition.alias !== null) {
            return "Alias of " + this._serviceDefinition.alias
        } else {
            return this._serviceDefinition.className
        }
    }

    get childrenItems() {
        let children: vscode.TreeItem[] = []

        if(this._serviceDefinition.alias !== null) {
            children.push(new vscode.TreeItem("Alias : " + this._serviceDefinition.alias, vscode.TreeItemCollapsibleState.None))
        } else {
            children.push(new vscode.TreeItem("Class : " + this._serviceDefinition.className, vscode.TreeItemCollapsibleState.None))
        }

        return children
    }
}