import * as vscode from "vscode";
import { RouteDefinition } from "../../symfony/RouteDefinition";

export class RouteDefinitionTreeItem extends vscode.TreeItem {
    private _routeDefinition: RouteDefinition

    constructor(
        routeDefinition: RouteDefinition
    ) {
        super(routeDefinition.id, vscode.TreeItemCollapsibleState.Collapsed)
        this._routeDefinition = routeDefinition
    }

    get tooltip() {
        return this._routeDefinition.path
    }

    get childrenItems() {
        let children: vscode.TreeItem[] = []

        children.push(new vscode.TreeItem("Path : " + this._routeDefinition.path, vscode.TreeItemCollapsibleState.None))
        children.push(new vscode.TreeItem("Method : " + this._routeDefinition.method, vscode.TreeItemCollapsibleState.None))
        children.push(new vscode.TreeItem("Action : " + this._routeDefinition.action, vscode.TreeItemCollapsibleState.None))

        return children
    }
}