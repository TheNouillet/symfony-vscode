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

    set(phpClasses: PHPClass[]): Thenable<void> {
        return this._memento.update(PHPClassCacheManager.CACHE_KEY, phpClasses)
    }

    clear(): Thenable<void> {
        return this._memento.update(PHPClassCacheManager.CACHE_KEY, undefined)
    }

    clearClassByUri(phpClassUri: vscode.Uri): Thenable<void> {
        let classes = this.get()
        let newClasses = []
        classes.forEach(phpClass => {
            if(phpClass.documentUri !== phpClassUri) {
                newClasses.push(phpClass)
            }
        });

        return this.set(newClasses)
    }
}