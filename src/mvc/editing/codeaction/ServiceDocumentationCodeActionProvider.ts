import * as vscode from "vscode"
import { ServiceDefinition } from "../../../symfony/ServiceDefinition";
import { AbstractContainerStoreListener } from "../../../symfony/AbstractContainerStoreListener";
import { EditingUtils } from "../EditingUtils";
import { ServiceDocumentationCodeAction } from "./ServiceDocumentationCodeAction";
import { PHPClassStore } from "../../../php/PHPClassStore";

export class ServiceDocumentationCodeActionProvider extends AbstractContainerStoreListener implements vscode.CodeActionProvider {
    private _servicesDefinitionsList: ServiceDefinition[] = []
    private _phpClassStore: PHPClassStore

    constructor(phpClassStore: PHPClassStore) {
        super()
        this._phpClassStore = phpClassStore
    }

    onServicesChanges(servicesDefinitionList: ServiceDefinition[]) {
        this._servicesDefinitionsList = servicesDefinitionList
    }

    provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
        
        if(range instanceof vscode.Selection) {
            let potentialServiceRange = EditingUtils.getWordRange(document, range.active)
            let potentialServiceName = document.getText(potentialServiceRange)
            let use = this._phpClassStore.getUsesForUri(document.uri).find(use => {
                return potentialServiceName == use.shortName
            })
            let serviceDefinition = this._servicesDefinitionsList.find(serviceDefinition => {
                if(potentialServiceName === serviceDefinition.id) {
                    return true
                } else if (potentialServiceName === serviceDefinition.className && potentialServiceName !== "") {
                    return true
                } else if (use !== undefined && use.className === serviceDefinition.className){
                    return true
                } else if (use !== undefined && use.className === serviceDefinition.id){
                    return true
                }
                return false
            });
            if(serviceDefinition !== undefined) {
                return [new ServiceDocumentationCodeAction(document, potentialServiceRange, serviceDefinition)]
            }
            return null
        }
        return null
    }
}