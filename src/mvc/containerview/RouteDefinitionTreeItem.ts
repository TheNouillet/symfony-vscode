import * as vscode from "vscode";
import { RouteDefinition } from "../../symfony/RouteDefinition";
import { AbstractContainerTreeItem } from "./AbstractContainerTreeItem";

export class RouteDefinitionTreeItem extends AbstractContainerTreeItem {
    private _routeDefinition: RouteDefinition
    private _displayPath: boolean

    constructor(
        routeDefinition: RouteDefinition,
        displayPath: boolean = false
    ) {
        super(displayPath ? routeDefinition.path + " [" + routeDefinition.method + "]" : routeDefinition.id, vscode.TreeItemCollapsibleState.Collapsed)
        this._routeDefinition = routeDefinition
        this._displayPath = displayPath
    }

    get tooltip() {
        return this._routeDefinition.path + " [" + this._routeDefinition.method + "]"
    }

    get childrenItems(): vscode.TreeItem[] {
        let children: vscode.TreeItem[] = []

        if(this._displayPath) {
            children.push(new vscode.TreeItem("Id : " + this._routeDefinition.id, vscode.TreeItemCollapsibleState.None))
        } else {
            children.push(new vscode.TreeItem("Path : " + this._routeDefinition.path, vscode.TreeItemCollapsibleState.None))
        }
        children.push(new vscode.TreeItem("Method : " + this._routeDefinition.method, vscode.TreeItemCollapsibleState.None))
        children.push(new vscode.TreeItem("Action : " + this._routeDefinition.action, vscode.TreeItemCollapsibleState.None))

        return children
    }
}