import * as vscode from "vscode"
import * as fs from "graceful-fs"
import * as stripJsonComments from "strip-json-comments";

export class ComposerJSON {

    public initialize(): Promise<{symfonyVersion: number, uri: vscode.Uri}> {
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
                                if(key === "symfony/symfony" || key == "symfony/framework-bundle") {
                                    resolve({
                                        symfonyVersion: parseInt(composerObj.require[key].match(/\d/)),
                                        uri: uri
                                    })
                                }
                            })
                        }
                    });
                    reject("No composer.json file wih Symfony as dependency detected")
                }
            })
        })
    }
}