import * as vscode from "vscode";
import { Parameter } from "../../symfony/Parameter";

export class ParameterTreeItem extends vscode.TreeItem {
    private _parameter: Parameter
    private _displayPath: boolean

    constructor(
        parameter: Parameter
    ) {
        super(parameter.name, vscode.TreeItemCollapsibleState.Collapsed)
        this._parameter = parameter
    }

    get tooltip() {
        return this._parameter.value
    }

    get childrenItems() {
        return [new vscode.TreeItem("Value : " + this._parameter.value, vscode.TreeItemCollapsibleState.None)]
    }
}