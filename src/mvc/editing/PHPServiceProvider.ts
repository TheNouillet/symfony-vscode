import * as vscode from "vscode";
import { ContainerStore } from "../../symfony/ContainerStore";

export class PHPServiceProvider implements vscode.CompletionItemProvider {

    private _containerStore: ContainerStore

    constructor(containerStore: ContainerStore) {
        this._containerStore = containerStore
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        let result: vscode.CompletionItem[] = []
        let serviceDefinitions = this._containerStore.serviceDefinitionList
        serviceDefinitions.forEach(serviceDefinition => {
            if(serviceDefinition.public && !serviceDefinition.isInstanceOf()) {
                let item = new vscode.CompletionItem(serviceDefinition.id, vscode.CompletionItemKind.Reference)
                item.detail = "Of class " + serviceDefinition.className
                if(serviceDefinition.id.match(/^(?:\\{1,2}\w+|\w+\\{1,2})(?:\w+\\{0,2}\w+)+$/)) {
                    // If the service Id is a class, we append ::class
                    item.insertText = item.label + "::class"
                }
                result.push(item)
            }
        });
        return result
    }
}