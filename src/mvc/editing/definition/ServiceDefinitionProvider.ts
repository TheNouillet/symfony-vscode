import * as vscode from "vscode"
import { PHPClassStore } from "../../../php/PHPClassStore";
import { EditingUtils } from "../EditingUtils";
import { ContainerStore } from "../../../symfony/ContainerStore";
import { ServiceDefinition } from "../../../symfony/ServiceDefinition";

export class ServiceDefinitionProvider implements vscode.DefinitionProvider {
    private _containerStore: ContainerStore
    private _phpClassStore: PHPClassStore

    constructor(containerStore: ContainerStore, phpClassStore: PHPClassStore) {
        this._containerStore = containerStore
        this._phpClassStore = phpClassStore
    }

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        let wordRange = EditingUtils.getWordRange(document, position)
        let hoveredWord = document.getText(wordRange)
        let serviceDefinition = this._containerStore.serviceDefinitionList.find(serviceDefinition => {
            return hoveredWord === serviceDefinition.id || hoveredWord === serviceDefinition.className
        });
        if(serviceDefinition !== undefined) {
            return this.getLocationOfService(serviceDefinition)
        } else {
            return null
        }
    }

    getLocationOfService(serviceDefinition: ServiceDefinition): vscode.Location {
        let phpClass = this._phpClassStore.getPhpClass(serviceDefinition.className)
        if(phpClass) {
            return new vscode.Location(phpClass.documentUri, phpClass.classPosition)
        } else {
            return null
        }
    }
}