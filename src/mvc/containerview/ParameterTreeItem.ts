import * as vscode from "vscode";
import { Parameter } from "../../symfony/Parameter";
import { AbstractContainerTreeItem } from "./AbstractContainerTreeItem";

export class ParameterTreeItem extends AbstractContainerTreeItem {
    private _parameter: Parameter

    constructor(
        parameter: Parameter
    ) {
        super(parameter.name, vscode.TreeItemCollapsibleState.Collapsed)
        this._parameter = parameter
    }

    get tooltip() {
        return this._parameter.value
    }

    get childrenItems(): vscode.TreeItem[] {
        return [new vscode.TreeItem("Value : " + this._parameter.value, vscode.TreeItemCollapsibleState.None)]
    }
}