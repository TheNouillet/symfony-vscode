import * as vscode from "vscode";
import { ServiceDefinition } from "../../symfony/ServiceDefinition";
import { AbstractContainerTreeItem } from "./AbstractContainerTreeItem";

export class ServiceDefinitionTreeItem extends AbstractContainerTreeItem {
    public serviceDefinition: ServiceDefinition
    private _displayClass: boolean

    constructor(
        serviceDefinition: ServiceDefinition,
        displayClass: boolean = false
    ) {
        super(displayClass ? serviceDefinition.className : serviceDefinition.id, vscode.TreeItemCollapsibleState.Collapsed)
        this.serviceDefinition = serviceDefinition
        this._displayClass = displayClass
    }

    get tooltip(): string {
        return this.serviceDefinition.className
    }

    get childrenItems(): vscode.TreeItem[] {
        let children: vscode.TreeItem[] = []

        if(this._displayClass) {
            children.push(new vscode.TreeItem("Id : " + this.serviceDefinition.id, vscode.TreeItemCollapsibleState.None))
        }
        if(this.serviceDefinition.alias !== null) {
            children.push(new vscode.TreeItem("Alias : " + this.serviceDefinition.alias, vscode.TreeItemCollapsibleState.None))
        }
        if(!this._displayClass) {
            children.push(new vscode.TreeItem("Class : " + this.serviceDefinition.className, vscode.TreeItemCollapsibleState.None))
        }
        children.push(new vscode.TreeItem("Is public : " + (this.serviceDefinition.public ? "true" : "false"), vscode.TreeItemCollapsibleState.None))

        return children
    }
}