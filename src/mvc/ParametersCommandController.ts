import * as vscode from "vscode";
import { ContainerStore } from "../symfony/ContainerStore";
import { ParameterViewProvider } from "./containerview/ParameterViewProvider";

export class ParametersCommandController {
    private _containerStore: ContainerStore
    private _parameterViewProvider: ParameterViewProvider

    constructor(containerStore: ContainerStore, parameterViewProvider: ParameterViewProvider) {
        this._containerStore = containerStore
        this._parameterViewProvider = parameterViewProvider

        vscode.commands.registerCommand('symfony-vscode.refreshParameters', () => this._containerStore.refreshParameters())
        vscode.commands.registerCommand('symfony-vscode.searchForParameters', () => {
            vscode.window.showInputBox({
                prompt: "Criteria (e.g. \"app\", \"doctrine\" ...)",
                value: this._parameterViewProvider.previousSearchCriteria
            }).then(criteria => {
                if(criteria !== undefined) {
                    this._parameterViewProvider.setCriteria(criteria)
                }
            })
        })
        vscode.commands.registerCommand('symfony-vscode.clearParametersSearch', () => this._parameterViewProvider.clearCriteria())
    }
}