import * as vscode from "vscode";
import { ServiceDefinition } from "../../symfony/ServiceDefinition";

export class ServiceDefinitionTreeItem extends vscode.TreeItem {
    private _serviceDefinition: ServiceDefinition

    constructor(
        serviceDefinition: ServiceDefinition,
        collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(serviceDefinition.id, collapsibleState)
        this._serviceDefinition = serviceDefinition
    }

    get tooltip() {
        return this._serviceDefinition.className
    }
}