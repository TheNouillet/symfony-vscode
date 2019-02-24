import * as vscode from "vscode"
import { PHPClass } from "./PHPClass";
import { PHPClassProviderInterface } from "./provider/PHPClassProviderInterface";
import { ParserPHPClassProvider } from "./provider/ParserPHPClassProvider";
import { CachePHPClassProvider } from "./provider/CachePHPClassProvider";
import { PHPClassCacheManager } from "./PHPClassCacheManager";

export class PHPClassStore {
    protected _cacheManager: PHPClassCacheManager
    protected _phpClassProviders: PHPClassProviderInterface[] = []
    protected _phpClassesIndex: Map<string, PHPClass> = new Map<string, PHPClass>()

    private static PHP_CLASS_FETCH_MESSAGE = "Fetching PHP classes..."
    private static PHP_CLASS_NO_PROVIDER = "Cannot retrieve PHP classes at the moment"

    constructor(cacheManager: PHPClassCacheManager) {
        this._cacheManager = cacheManager
        this._phpClassProviders.push(new CachePHPClassProvider(cacheManager))
        this._phpClassProviders.push(new ParserPHPClassProvider())
    }

    refreshAll(): void {
        this._phpClassesIndex.clear()
        let hasValidProvider = this._phpClassProviders.some(provider => {
            if(provider.canUpdateAllUris()) {
                vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: PHPClassStore.PHP_CLASS_FETCH_MESSAGE }, (progress, token) => {
                    return provider.updateAllUris().then(phpClasses => {
                        phpClasses.forEach(phpClass => {
                            this._phpClassesIndex.set(phpClass.className, phpClass)
                        })
                        this._cacheManager.set(phpClasses)
                    }).catch(reason => {
                        vscode.window.showErrorMessage(reason)
                    })
                })
                return true
            } else {
                return false
            }
        })
        if(!hasValidProvider) {
            vscode.window.showErrorMessage(PHPClassStore.PHP_CLASS_NO_PROVIDER)
        }
    }

    clearCacheAndRefreshAll(): void {
        this._cacheManager.clear().then(() => {
            this.refreshAll()
        })
    }

    refresh(uri: vscode.Uri): void {
        let hasValidProvider = this._phpClassProviders.some(provider => {
            if(provider.canUpdateUri(uri)) {
                provider.updateUri(uri).then(phpClasses => {
                    phpClasses.forEach(phpClass => {
                        this._phpClassesIndex.set(phpClass.className, phpClass)
                    })
                })
                let phpClasses = Array.from(this._phpClassesIndex.values())
                this._cacheManager.set(phpClasses)
                return true
            } else {
                return false
            }
        })
        if(!hasValidProvider) {
            vscode.window.showErrorMessage(PHPClassStore.PHP_CLASS_NO_PROVIDER)
        }
    }

    clearCacheAndRefresh(uri: vscode.Uri): void {
        this._cacheManager.clearClassByUri(uri).then(() => {
            this.refresh(uri)
        })
    }

    getPhpClass(className: string): PHPClass {
        return this._phpClassesIndex.get(className)
    }
}