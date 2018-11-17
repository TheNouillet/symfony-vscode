import * as vscode from "vscode";
import { ContainerStore } from "../symfony/ContainerStore";
import { RouteDefinitionViewProvider } from "./containerview/RouteDefinitionViewProvider";

export class RoutesCommandController {
    private _containerStore: ContainerStore
    private _routeDefinitionViewProvider: RouteDefinitionViewProvider

    constructor(containerStore: ContainerStore, routeDefintionViewProvider: RouteDefinitionViewProvider) {
        this._containerStore = containerStore
        this._routeDefinitionViewProvider = routeDefintionViewProvider

        vscode.commands.registerCommand('symfony-vscode.refreshRouteDefinitions', () => this._containerStore.refreshRouteDefinitions())
        vscode.commands.registerCommand('symfony-vscode.togglePathDisplay', () => this._routeDefinitionViewProvider.togglePathsDisplay())
        vscode.commands.registerCommand('symfony-vscode.searchForRoutes', () => {
            vscode.window.showInputBox({
                prompt: "Criteria (e.g. \"AppBundle\", \"product\" ...)",
                value: this._routeDefinitionViewProvider.previousSearchCriteria
            }).then(criteria => {
                if(criteria !== undefined) {
                    this._routeDefinitionViewProvider.setCriteria(criteria)
                }
            })
        })
        vscode.commands.registerCommand('symfony-vscode.clearRoutesSearch', () => this._routeDefinitionViewProvider.clearCriteria())
    }
}