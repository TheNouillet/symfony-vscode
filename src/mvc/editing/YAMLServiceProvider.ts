import * as vscode from "vscode";
import { ContainerStore } from "../../symfony/ContainerStore";
import { YAMLServiceCompletionItem } from "./YAMLServiceCompletionItem";

export class YAMLServiceProvider implements vscode.CompletionItemProvider {

    private _containerStore: ContainerStore

    constructor(containerStore: ContainerStore) {
        this._containerStore = containerStore
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        let result: vscode.CompletionItem[] = []
        let serviceDefinitions = this._containerStore.serviceDefinitionList
        serviceDefinitions.forEach(serviceDefinition => {
            let item = new YAMLServiceCompletionItem(serviceDefinition)
            result.push(item)
        });
        return result
    }
}