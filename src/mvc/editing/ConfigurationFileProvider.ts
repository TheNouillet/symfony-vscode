import * as vscode from "vscode";
import { ContainerStore } from "../../symfony/ContainerStore";
import { ConfigurationFileServiceCompletionItem } from "./ConfigurationFileServiceCompletionItem";
import { ParameterCompletionItem } from "./ParameterCompletionItem";
import { EditingUtils } from "./EditingUtils";

export class ConfigurationFileProvider implements vscode.CompletionItemProvider {

    private _containerStore: ContainerStore

    constructor(containerStore: ContainerStore) {
        this._containerStore = containerStore
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.CompletionItem[] {
        let result: vscode.CompletionItem[] = []
        let serviceDefinitions = this._containerStore.serviceDefinitionList
        let parameters = this._containerStore.parameterList
        let wordRange = EditingUtils.getWordRange(document, position)
        let previousCharacter = document.getText(new vscode.Range(wordRange.start.translate(0, -1), wordRange.start))

        if (previousCharacter === "@") {
            serviceDefinitions.forEach(serviceDefinition => {
                if (!serviceDefinition.isServiceIdAClassName()) {
                    let item = new ConfigurationFileServiceCompletionItem(serviceDefinition)
                    result.push(item)
                }
            });
        } else {
            serviceDefinitions.forEach(serviceDefinition => {
                let item = new ConfigurationFileServiceCompletionItem(serviceDefinition)
                result.push(item)
            });
            parameters.forEach(parameter => {
                let item = new ParameterCompletionItem(parameter)
                result.push(item)
            })
        }
        return result
    }
}