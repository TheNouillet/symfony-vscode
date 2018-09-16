import { ContainerStore } from "../symfony/ContainerStore";
import * as vscode from "vscode"
import { ConfigurationFileProvider } from "./editing/autocomplete/ConfigurationFileProvider";
import { PHPServiceProvider } from "./editing/autocomplete/PHPServiceProvider";
import { ContainerHoverProvider } from "./editing/hover/ContainerHoverProvider";

export class AutocompleteController {
    private _disposable: vscode.Disposable

    constructor(containerStore: ContainerStore) {
        let configurationFileProvider = new ConfigurationFileProvider(containerStore)
        let phpServiceProvider = new PHPServiceProvider(containerStore)
        let hoverProvider = new ContainerHoverProvider(containerStore)

        let disposables: vscode.Disposable[] = []
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'yaml' }, configurationFileProvider, "@"))
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'xml' }, configurationFileProvider, "id=\""))
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'php' }, phpServiceProvider))
        disposables.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'yaml' }, hoverProvider))
        disposables.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'xml' }, hoverProvider))
        disposables.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'php' }, hoverProvider))

        this._disposable = vscode.Disposable.from(...disposables)
    }

    dispose() {
        this._disposable.dispose()
    }
}