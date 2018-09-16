import * as vscode from "vscode";
import { ContainerStore } from "../../../symfony/ContainerStore";
import { PHPServiceCompletionItem } from "./PHPServiceCompletionItem";

export class PHPServiceProvider implements vscode.CompletionItemProvider {

    private _containerStore: ContainerStore

    constructor(containerStore: ContainerStore) {
        this._containerStore = containerStore
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        let result: vscode.CompletionItem[] = []
        let serviceDefinitions = this._containerStore.serviceDefinitionList
        serviceDefinitions.forEach(serviceDefinition => {
            if(serviceDefinition.public) {
                let item = new PHPServiceCompletionItem(serviceDefinition)
                result.push(item)
            }
        });
        return result
    }
}