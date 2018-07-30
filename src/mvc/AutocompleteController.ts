import { ContainerStore } from "../symfony/ContainerStore";
import * as vscode from "vscode"
import { YAMLServiceProvider } from "./editing/YAMLServiceProvider";

export class AutocompleteController {
    private _disposable: vscode.Disposable

    constructor(containerStore: ContainerStore) {
        let yamlServiceProvider = new YAMLServiceProvider(containerStore)

        let disposables: vscode.Disposable[] = []
        disposables.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'yaml' }, yamlServiceProvider, "@"))

        this._disposable = vscode.Disposable.from(...disposables)
    }

    dispose() {
        this._disposable.dispose()
    }
}