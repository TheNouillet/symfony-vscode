import { ContainerStore } from "../symfony/ContainerStore";
import * as vscode from "vscode"
import { YAMLServiceProvider } from "./editing/YAMLServiceProvider";
import { PHPServiceProvider } from "./editing/PHPServiceProvider";
import { ServiceHoverProvider } from "./editing/ServiceHoverProvider";

export class AutocompleteController {
    private _disposable: vscode.Disposable

    constructor(containerStore: ContainerStore) {
        let yamlServiceProvider = new YAMLServiceProvider(containerStore)
        let phpServiceProvider = new PHPServiceProvider(containerStore)
        let hoverProvider = new ServiceHoverProvider(containerStore)

        let disposables: vscode.Disposable[] = []
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'yaml' }, yamlServiceProvider, "@"))
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'php' }, phpServiceProvider))
        disposables.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'yaml' }, hoverProvider))
        disposables.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'php' }, hoverProvider))

        this._disposable = vscode.Disposable.from(...disposables)
    }

    dispose() {
        this._disposable.dispose()
    }
}