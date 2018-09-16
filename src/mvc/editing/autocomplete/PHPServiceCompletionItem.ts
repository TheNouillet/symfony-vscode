import * as vscode from "vscode"
import { ServiceDefinition } from "../../../symfony/ServiceDefinition";

export class PHPServiceCompletionItem extends vscode.CompletionItem {
    private _serviceDefinition: ServiceDefinition

    constructor(serviceDefinition: ServiceDefinition) {
        super(serviceDefinition.id, vscode.CompletionItemKind.Reference)
        this._serviceDefinition = serviceDefinition
    }

    public get insertText(): string {
        if(!this._serviceDefinition.isServiceIdAClassName()) {
            return this._serviceDefinition.id
        } else {
            return this._serviceDefinition.className + "::class"
        }
    }

    public get detail(): string {
        return this._serviceDefinition.id
    }

    public get documentation(): string {
        return "Of class " + this._serviceDefinition.className
    }
}