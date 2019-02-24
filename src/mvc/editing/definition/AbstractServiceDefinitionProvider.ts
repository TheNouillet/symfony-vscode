import * as vscode from "vscode"
import { PHPClassStore } from "../../../php/PHPClassStore";
import { EditingUtils } from "../EditingUtils";
import { ContainerStore } from "../../../symfony/ContainerStore";
import { ServiceDefinition } from "../../../symfony/ServiceDefinition";

export abstract class AbstractServiceDefinitionProvider implements vscode.DefinitionProvider {
    protected _containerStore: ContainerStore
    protected _phpClassStore: PHPClassStore

    constructor(containerStore: ContainerStore, phpClassStore: PHPClassStore) {
        this._containerStore = containerStore
        this._phpClassStore = phpClassStore
    }

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        let wordRange = EditingUtils.getWordRange(document, position)
        let hoveredWord = document.getText(wordRange)
        let serviceDefinition = this._containerStore.serviceDefinitionList.find(service => {
            return this.acceptServiceDefinition(hoveredWord, service)
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

    abstract acceptServiceDefinition(hoveredWord: string, serviceDefinition: ServiceDefinition): boolean
}