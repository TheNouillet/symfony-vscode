import * as vscode from "vscode";
import { ContainerStore } from "../../symfony/ContainerStore";

export class YAMLServiceProvider implements vscode.CompletionItemProvider {

    private _containerStore: ContainerStore

    constructor(containerStore: ContainerStore) {
        this._containerStore = containerStore
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        let result: vscode.CompletionItem[] = []
        let serviceDefinitions = this._containerStore.serviceDefinitionList
        serviceDefinitions.forEach(serviceDefinition => {
            if(!serviceDefinition.id.match(/~/) && !serviceDefinition.id.match(/abstract\.instanceof/)) {
                let item = new vscode.CompletionItem(serviceDefinition.id, vscode.CompletionItemKind.Reference)
                item.detail = "Of class " + serviceDefinition.className
                result.push(item)
            }
        });
        return result
    }
}