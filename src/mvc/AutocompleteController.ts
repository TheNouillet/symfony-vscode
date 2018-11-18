import { ContainerStore } from "../symfony/ContainerStore";
import * as vscode from "vscode"
import { ConfigurationFileProvider } from "./editing/autocomplete/ConfigurationFileProvider";
import { PHPServiceProvider } from "./editing/autocomplete/PHPServiceProvider";
import { ContainerHoverProvider } from "./editing/hover/ContainerHoverProvider";
import { PHPClassStore } from "../php/PHPClassStore";
import { ServiceDefinitionTreeItem } from "./containerview/ServiceDefinitionTreeItem";
import { ConfigurationFileServiceDefinitionProvider } from "./editing/definition/ConfigurationFileServiceDefinitionProvider";
import { PHPServiceDefinitionProvider } from "./editing/definition/PHPServiceDefinitionProvider";
import { ServiceQuickPickItem } from "./editing/quickpick/ServiceQuickPickItem";
import { ServiceDefinition } from "../symfony/ServiceDefinition";
import { AbstractServiceDefinitionProvider } from "./editing/definition/AbstractServiceDefinitionProvider";

export class AutocompleteController {
    private _disposable: vscode.Disposable

    constructor(containerStore: ContainerStore, phpClassStore: PHPClassStore) {
        let configurationFileProvider = new ConfigurationFileProvider(containerStore)
        let phpServiceProvider = new PHPServiceProvider(containerStore)
        let hoverProvider = new ContainerHoverProvider(containerStore)
        let confFileServiveDefinitionProvider = new ConfigurationFileServiceDefinitionProvider(containerStore, phpClassStore)
        let phpServiceDefinitionProvider = new PHPServiceDefinitionProvider(containerStore, phpClassStore)

        let disposables: vscode.Disposable[] = []
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'yaml' }, configurationFileProvider, "@"))
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'xml' }, configurationFileProvider, "id=\""))
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'php' }, phpServiceProvider))
        disposables.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'yaml' }, hoverProvider))
        disposables.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'xml' }, hoverProvider))
        disposables.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'php' }, hoverProvider))
        disposables.push(vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'yaml' }, confFileServiveDefinitionProvider))
        disposables.push(vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'xml' }, confFileServiveDefinitionProvider))
        disposables.push(vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'php' }, phpServiceDefinitionProvider))

        this._disposable = vscode.Disposable.from(...disposables)

        vscode.commands.registerCommand('symfony-vscode.goToServiceDefinition', (args) => {
            if(args && args instanceof ServiceDefinitionTreeItem) {
                this._goToServiceDefinition(args.serviceDefinition, confFileServiveDefinitionProvider)
            } else {
                vscode.window.showQuickPick(containerStore.serviceDefinitionList.map(serviceDefinition => {
                    return new ServiceQuickPickItem(serviceDefinition)
                })).then(item => {
                    if(item instanceof ServiceQuickPickItem) {
                        this._goToServiceDefinition(item.serviceDefinition, confFileServiveDefinitionProvider)
                    }
                })
            }
        })
    }

    protected _goToServiceDefinition(serviceDefinition: ServiceDefinition, serviceDefinitionProvider: AbstractServiceDefinitionProvider) {
        let location = serviceDefinitionProvider.getLocationOfService(serviceDefinition)
        if(location) {
            vscode.window.showTextDocument(location.uri, {
                selection: location.range
            })
        } else {
            vscode.window.showErrorMessage("Class \"" + serviceDefinition.className + "\" not found")
        }
    }

    dispose() {
        this._disposable.dispose()
    }
}