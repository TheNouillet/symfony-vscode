import { ContainerStore } from "../symfony/ContainerStore";
import * as vscode from "vscode"
import { ConfigurationFileProvider } from "./editing/autocomplete/ConfigurationFileProvider";
import { PHPServiceProvider } from "./editing/autocomplete/PHPServiceProvider";
import { ContainerHoverProvider } from "./editing/hover/ContainerHoverProvider";
import { ServiceDefinitionProvider } from "./editing/definition/ServiceDefinitionProvider";
import { PHPClassStore } from "../php/PHPClassStore";
import { ServiceDefinitionTreeItem } from "./containerview/ServiceDefinitionTreeItem";

export class AutocompleteController {
    private _disposable: vscode.Disposable

    constructor(containerStore: ContainerStore, phpClassStore: PHPClassStore) {
        let configurationFileProvider = new ConfigurationFileProvider(containerStore)
        let phpServiceProvider = new PHPServiceProvider(containerStore)
        let hoverProvider = new ContainerHoverProvider(containerStore)
        let serviceDefinitionProvider = new ServiceDefinitionProvider(containerStore, phpClassStore)

        let disposables: vscode.Disposable[] = []
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'yaml' }, configurationFileProvider, "@"))
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'xml' }, configurationFileProvider, "id=\""))
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'php' }, phpServiceProvider))
        disposables.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'yaml' }, hoverProvider))
        disposables.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'xml' }, hoverProvider))
        disposables.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'php' }, hoverProvider))
        disposables.push(vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'yaml' }, serviceDefinitionProvider))
        disposables.push(vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'xml' }, serviceDefinitionProvider))
        disposables.push(vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'php' }, serviceDefinitionProvider))

        this._disposable = vscode.Disposable.from(...disposables)

        vscode.commands.registerCommand('symfony-vscode.goToServiceDefinition', (args) => {
            if(args && args instanceof ServiceDefinitionTreeItem) {
                let serviceDefinition = args.serviceDefinition
                let location = serviceDefinitionProvider.getLocationOfService(serviceDefinition)
                if(location) {
                    vscode.window.showTextDocument(location.uri, {
                        selection: location.range
                    })
                } else {
                    vscode.window.showErrorMessage("Class \"" + serviceDefinition.className + "\" not found")
                }
            }
        })
    }

    dispose() {
        this._disposable.dispose()
    }
}