import * as vscode from "vscode"
import { ContainerStore } from "../../symfony/ContainerStore"
import { EditingUtils } from "./EditingUtils";

export class ServiceHoverProvider implements vscode.HoverProvider {
    private _containerStore: ContainerStore

    constructor(containerStore: ContainerStore) {
        this._containerStore = containerStore
    }
    
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        let wordRange = EditingUtils.getWordRange(document, position)
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
}