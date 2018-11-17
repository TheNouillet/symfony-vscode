import * as vscode from "vscode"
import { RouteDefinition } from "../../symfony/RouteDefinition";
import { RouteDefinitionTreeItem } from "./RouteDefinitionTreeItem";
import { AbstractContainerViewProvider } from "./AbstractContainerViewProvider";
import { AbstractContainerTreeItem } from "./AbstractContainerTreeItem";

export class RouteDefinitionViewProvider extends AbstractContainerViewProvider {
    private _routesDefinitions: RouteDefinition[] = []
    private _displayPaths: boolean = false

    constructor() {
        super()
    }

    onRoutesChanges(routesDefinitions: RouteDefinition[]) {
        this._routesDefinitions = routesDefinitions
        this._onDidChangeTreeData.fire()
    }

    togglePathsDisplay(): void {
        this._displayPaths = !this._displayPaths
        this._onDidChangeTreeData.fire()
    }

    getTreeItems(): AbstractContainerTreeItem[] {
        let treeItems: RouteDefinitionTreeItem[] = []

        this._routesDefinitions.forEach(routeDefinition => {
            if(this.acceptSearchable(routeDefinition)) {
                treeItems.push(new RouteDefinitionTreeItem(routeDefinition, this._displayPaths))
            }
        });

        return treeItems
    }

    protected _getSearchItemContext(): string {
        return 'symfony-vscode.searchItem.route'
    }
}