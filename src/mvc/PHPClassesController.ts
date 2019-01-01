import * as vscode from "vscode"
import { PHPClassStore } from "../php/PHPClassStore";
import { PHPClassCacheManager } from "../php/PHPClassCacheManager";

export class PHPClassesController {
    protected _phpClassStore: PHPClassStore
    protected _cacheManager: PHPClassCacheManager

    constructor(phpClassStore: PHPClassStore, cacheManager: PHPClassCacheManager) {
        this._phpClassStore = phpClassStore
        this._cacheManager = cacheManager
        vscode.commands.registerCommand('symfony-vscode.refreshPHPClasses', () => {
            this._cacheManager.clear().then(() => {
                this._phpClassStore.refreshAll()
            })
        })
    }
}
