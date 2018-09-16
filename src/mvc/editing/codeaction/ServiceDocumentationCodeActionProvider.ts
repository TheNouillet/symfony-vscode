import * as vscode from "vscode"
import { ServiceDefinition } from "../../../symfony/ServiceDefinition";
import { AbstractContainerStoreListener } from "../../../symfony/AbstractContainerStoreListener";
import { EditingUtils } from "../EditingUtils";
import { ServiceDocumentationCodeAction } from "./ServiceDocumentationCodeAction";

export class ServiceDocumentationCodeActionProvider extends AbstractContainerStoreListener implements vscode.CodeActionProvider {
    private _servicesDefinitionsList: ServiceDefinition[] = []

    constructor() {
        super()
    }

    onServicesChanges(servicesDefinitionList: ServiceDefinition[]) {
        this._servicesDefinitionsList = servicesDefinitionList
    }

    provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
        
        if(range instanceof vscode.Selection) {
            let potentialServiceRange = EditingUtils.getWordRange(document, range.active)
            let potentialServiceName = document.getText(potentialServiceRange)
            let serviceDefinition = this._servicesDefinitionsList.find(serviceDefinition => {
                return potentialServiceName === serviceDefinition.id
            });
            if(serviceDefinition !== undefined) {
                return [new ServiceDocumentationCodeAction(document, potentialServiceRange, serviceDefinition)]
            }
            return null
        }
        return null
    }
}