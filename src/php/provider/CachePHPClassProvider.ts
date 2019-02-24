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

    canUpdateAllUris(): boolean {
        return this._cacheManager.hasCachedData()
    }

    canUpdateUri(uri: vscode.Uri): boolean {
        return false
    }
    
    updateAllUris(): Promise<PHPClass[]> {
        return new Promise<PHPClass[]>((resolve, reject) => {
            if(this._cacheManager.hasCachedData()) {
                resolve(this._cacheManager.get())
            } else {
                reject(CachePHPClassProvider.NO_CLASS_IN_CACHE)
            }
        })
    }

    updateUri(uri: vscode.Uri): Promise<PHPClass[]> {
        return new Promise<PHPClass[]>((resolve) => {
            resolve([])
        })
    }
}