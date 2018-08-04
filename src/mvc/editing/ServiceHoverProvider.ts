import * as vscode from "vscode"
import { ContainerStore } from "../../symfony/ContainerStore"

export class ServiceHoverProvider implements vscode.HoverProvider {
    private _containerStore: ContainerStore

    constructor(containerStore: ContainerStore) {
        this._containerStore = containerStore
    }
    
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        let wordRange = this._getHoveredWordRange(document, position)
        let hoveredWord = document.getText(wordRange)
        let serviceDefinition = this._containerStore.serviceDefinitionList.find(serviceDefinition => {
            return hoveredWord === serviceDefinition.id
        });

        if(serviceDefinition !== undefined) {
            return new vscode.Hover(serviceDefinition.className, wordRange)
        } else {
            return null
        }
    }

    private _getHoveredWordRange(document: vscode.TextDocument, position: vscode.Position): vscode.Range {
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
}