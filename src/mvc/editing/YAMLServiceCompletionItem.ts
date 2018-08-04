import * as vscode from "vscode"
import { ServiceDefinition } from "../../symfony/ServiceDefinition";

export class YAMLServiceCompletionItem extends vscode.CompletionItem {
    private _serviceDefinition: ServiceDefinition

    constructor(serviceDefinition: ServiceDefinition) {
        super(serviceDefinition.id, vscode.CompletionItemKind.Reference)
        this._serviceDefinition = serviceDefinition
    }

    public get detail() {
        return "Of class " + this._serviceDefinition.className
    }
}