import * as vscode from "vscode"
import { PHPClass } from "./PHPClass";
import { PHPClassProviderInterface } from "./provider/PHPClassProviderInterface";
import { ParserPHPClassProvider } from "./provider/ParserPHPClassProvider";

export class PHPClassStore {
    protected _phpClassProvider: PHPClassProviderInterface = new ParserPHPClassProvider()
    protected _phpClassesIndex: Map<string, PHPClass> = new Map<string, PHPClass>()

    private static PHP_CLASS_FETCH_MESSAGE = "Fetching PHP classes..."

    constructor() {
        // TODO: cache system
        this.refreshAll()
    }

    refreshAll(): void {
        this._phpClassProvider.updateAllClasses().then(phpClasses => {
            phpClasses.forEach(phpClass => {
                this._phpClassesIndex.set(phpClass.className, phpClass)
            })
        })
    }

    refresh(uri: vscode.Uri): void {
        this._phpClassProvider.updateClass(uri).then(phpClass => {
            this._phpClassesIndex.set(phpClass.className, phpClass)
        })
    }

    getPhpClass(className: string): PHPClass {
        return this._phpClassesIndex.get(className)
    }
}