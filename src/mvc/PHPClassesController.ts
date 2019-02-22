import * as vscode from "vscode"
import { PHPClassStore } from "../php/PHPClassStore";
import { PHPClassCacheManager } from "../php/PHPClassCacheManager";

export class PHPClassesController {
    protected _phpClassStore: PHPClassStore

    constructor(phpClassStore: PHPClassStore) {
        this._phpClassStore = phpClassStore
        vscode.commands.registerCommand('symfony-vscode.refreshPHPClasses', () => {
            this._phpClassStore.clearCacheAndRefreshAll()
        })
    }
}
