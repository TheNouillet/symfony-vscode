import * as vscode from "vscode"
import { PHPClass } from "./PHPClass";

export class PHPClassCacheManager {

    protected _memento: vscode.Memento

    public static CACHE_KEY = "cached_php_store"

    constructor(memento: vscode.Memento) {
        this._memento = memento
    }

    hasCachedData() : boolean {
        return this._memento.get(PHPClassCacheManager.CACHE_KEY) !== undefined
    }

    get(): PHPClass[] {
        return this._memento.get<PHPClass[]>(PHPClassCacheManager.CACHE_KEY).map(jsonPhpClass => {
            return PHPClass.fromJSON(jsonPhpClass)
        })
    }

    set(phpClasses: PHPClass[]): void {
        this._memento.update(PHPClassCacheManager.CACHE_KEY, phpClasses)
    }

    clear(): void {
        this._memento.update(PHPClassCacheManager.CACHE_KEY, undefined)
    }
}