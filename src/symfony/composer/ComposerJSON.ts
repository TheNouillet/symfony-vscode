import * as vscode from "vscode"
import * as fs from "graceful-fs"
import * as path from "path"
import * as stripJsonComments from "strip-json-comments";
import { ComposerDependency } from "./ComposerDependency";

export class ComposerJSON {

    protected _dependencies: ComposerDependency[] = []

    public initialize(): Promise<ComposerJSON> {
        return new Promise((resolve, reject) => {
            if(vscode.workspace.workspaceFolders === undefined) {
                reject("No workspace folder opened")
            }
            vscode.workspace.findFiles("**/composer.json").then(uris => {
                if(uris.length == 0) {
                    reject("No composer.json file detected in the current workspace")
                } else {
                    uris.forEach(uri => {
                        let composerObj = JSON.parse(stripJsonComments(fs.readFileSync(uri.fsPath).toString()))
                        if(composerObj.require !== undefined) {
                            Object.keys(composerObj.require).forEach(key => {
                                this._dependencies.push(new ComposerDependency(vscode.Uri.file(path.dirname(uri.fsPath)), key, composerObj.require[key]))
                            })
                        }
                    })
                    resolve(this)
                }
            })
        })
    }

    public getSymfonyDIDependency(): ComposerDependency {
        return this._dependencies.find(dep => {
            return dep.isSymfonyFramework() || dep.isSymfonyDI()
        })
    }

    public getSymfonyRoutingDependency(): ComposerDependency {
        return this._dependencies.find(dep => {
            return dep.isSymfonyFramework() || dep.isSymfonyRouting()
        })
    }

    public getSymfonyConsoleDependency(): ComposerDependency {
        return this._dependencies.find(dep => {
            return dep.isSymfonyFramework() || dep.isSymfonyConsole()
        })
    }
}