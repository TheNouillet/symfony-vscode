import * as vscode from "vscode"

export class EditingUtils {
    static getWordRange(document: vscode.TextDocument, position: vscode.Position): vscode.Range {
        let beginPosition = position.with()
        let endPosition = position.with()
        while(document.getText(new vscode.Range(beginPosition.translate(0, -1), beginPosition)).match(/[A-Za-z0-9_.\\~]/)) {
            beginPosition = beginPosition.translate(0, -1)
        }
        while(document.getText(new vscode.Range(endPosition.translate(0, 1), endPosition.translate(0, 2))).match(/[A-Za-z0-9_.\\~]/)) {
            endPosition = endPosition.translate(0, 1)
        }
        return new vscode.Range(beginPosition, endPosition.translate(0, 1))
    }

    static getLineStartPosition(document: vscode.TextDocument, line: number): vscode.Position {
        let blanksCharacters = [" ", "\t"]
        let currentPosition = new vscode.Position(line, 0)
        while(blanksCharacters.indexOf(document.getText(new vscode.Range(currentPosition, currentPosition.translate(0, 1)))) !== -1) {
            
            currentPosition = currentPosition.translate(0, 1)
            if(!document.validatePosition(currentPosition)) {
                return currentPosition
            }
        }

        return currentPosition
    }
}