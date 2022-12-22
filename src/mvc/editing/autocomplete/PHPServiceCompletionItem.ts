import * as vscode from "vscode"
import { ServiceDefinition } from "../../../symfony/ServiceDefinition";

export class PHPServiceCompletionItem extends vscode.CompletionItem {
    private _serviceDefinition: ServiceDefinition

    constructor(serviceDefinition: ServiceDefinition) {
        super(serviceDefinition.id, vscode.CompletionItemKind.Reference)
        this._serviceDefinition = serviceDefinition
        
        this.detail = this._serviceDefinition.id;
        this.documentation = "Of class " + this._serviceDefinition.className;
       
        if(!this._serviceDefinition.isServiceIdAClassName()) {
            this.insertText = this._serviceDefinition.id;
        } else {
            this.insertText = this._serviceDefinition.className + "::class";
        }
    }
}