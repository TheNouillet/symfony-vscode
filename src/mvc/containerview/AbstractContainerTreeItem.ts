import * as vscode from "vscode"

export abstract class AbstractContainerTreeItem extends vscode.TreeItem {
    constructor(label: string, state: vscode.TreeItemCollapsibleState) {
        super(label, state)
    }

    abstract get childrenItems(): vscode.TreeItem[]
}