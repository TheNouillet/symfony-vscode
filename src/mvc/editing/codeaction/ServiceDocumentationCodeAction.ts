import * as vscode from "vscode";
import { ServiceDefinition } from "../../../symfony/ServiceDefinition";
import { EditingUtils } from "../EditingUtils";

export class ServiceDocumentationCodeAction extends vscode.CodeAction {
    constructor(document: vscode.TextDocument, range: vscode.Range, serviceDefinition: ServiceDefinition) {
        super("Include PHPDoc tag for Symfony service", vscode.CodeActionKind.QuickFix)
        
        let uri: vscode.Uri = document.uri
        let position: vscode.Position = EditingUtils.getLineStartPosition(document, range.start.line)
        let newText = this._getTextToInsert(document, position, serviceDefinition)

        let edit = new vscode.WorkspaceEdit()
        edit.insert(uri, position, newText)
        this.edit = edit
    }

    private _getTextToInsert(document: vscode.TextDocument, position: vscode.Position, serviceDefinition: ServiceDefinition) {
        let variableName: string = ""
        let textLine: string = document.lineAt(position.line).text
        let variableMatching = textLine.match(/^[ |\t]*(\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/)
        if(variableMatching) {
            variableName = variableMatching[0].trim()
        }
        
        let indentationSubstring: string = document.getText(new vscode.Range(
            new vscode.Position(position.line, 0), position
        ))
        let textToInsert: string = "/** @var \\" + serviceDefinition.className + " " + variableName + " */\n" + indentationSubstring

        return textToInsert
    }
}