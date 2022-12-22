import * as vscode from "vscode"
import { Parameter } from "../../../symfony/Parameter";

export class ParameterCompletionItem extends vscode.CompletionItem {
    public parameter: Parameter

    constructor(parameter: Parameter) {
        super(parameter.name, vscode.CompletionItemKind.Property)
        this.parameter = parameter

        this.detail = this.parameter.name;
        this.documentation = "Of value : " + this.parameter.value;
    }
}