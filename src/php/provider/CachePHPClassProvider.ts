import * as vscode from "vscode"
import { PHPClassProviderInterface } from "./PHPClassProviderInterface"
import { PHPClass } from "../PHPClass"
import { PHPClassCacheManager } from "../PHPClassCacheManager";

export class CachePHPClassProvider implements PHPClassProviderInterface {

    protected _cacheManager: PHPClassCacheManager

    protected static NO_CLASS_IN_CACHE = "No cached classes"

    constructor(cacheManager: PHPClassCacheManager) {
        this._cacheManager = cacheManager
    }

    canUpdateAllClasses(): boolean {
        return this._cacheManager.hasCachedData()
    }

    canUpdateClass(uri: vscode.Uri): boolean {
        return false
    }
    
    updateAllClasses(): Promise<PHPClass[]> {
        return new Promise<PHPClass[]>((resolve, reject) => {
            if(this._cacheManager.hasCachedData()) {
                resolve(this._cacheManager.get())
            } else {
                reject(CachePHPClassProvider.NO_CLASS_IN_CACHE)
            }
        })
    }

    updateClass(uri: vscode.Uri): Promise<PHPClass> {
        return new Promise<PHPClass>((resolve) => {
            resolve(null)
        })
    }
}