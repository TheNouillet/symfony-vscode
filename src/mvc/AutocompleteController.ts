import { ContainerStore } from "../symfony/ContainerStore";
import * as vscode from "vscode"
import { YAMLServiceProvider } from "./editing/YAMLServiceProvider";
import { PHPServiceProvider } from "./editing/PHPServiceProvider";

export class AutocompleteController {
    private _disposable: vscode.Disposable

    constructor(containerStore: ContainerStore) {
        let yamlServiceProvider = new YAMLServiceProvider(containerStore)
        let phpServiceProvider = new PHPServiceProvider(containerStore)

        let disposables: vscode.Disposable[] = []
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'yaml' }, yamlServiceProvider, "@"))
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'php' }, phpServiceProvider))

        this._disposable = vscode.Disposable.from(...disposables)
    }

    dispose() {
        this._disposable.dispose()
    }
}