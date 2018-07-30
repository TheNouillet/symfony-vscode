import * as vscode from "vscode";
import { ServiceDefinition } from "../../symfony/ServiceDefinition";

export class ServiceDefinitionTreeItem extends vscode.TreeItem {
    public serviceDefinition: ServiceDefinition

    constructor(
        serviceDefinition: ServiceDefinition
    ) {
        super(serviceDefinition.id, vscode.TreeItemCollapsibleState.Collapsed)
        this.serviceDefinition = serviceDefinition
    }

    get tooltip() {
        if(this.serviceDefinition.alias !== null) {
            return "Alias of " + this.serviceDefinition.alias
        } else {
            return this.serviceDefinition.className
        }
    }

    get childrenItems() {
        let children: vscode.TreeItem[] = []

        if(this.serviceDefinition.alias !== null) {
            children.push(new vscode.TreeItem("Alias : " + this.serviceDefinition.alias, vscode.TreeItemCollapsibleState.None))
        }
        children.push(new vscode.TreeItem("Class : " + this.serviceDefinition.className, vscode.TreeItemCollapsibleState.None))

        return children
    }
}