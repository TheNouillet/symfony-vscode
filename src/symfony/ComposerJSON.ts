import * as vscode from "vscode"
import * as fs from "graceful-fs"
import * as stripJsonComments from "strip-json-comments";

export class ComposerJSON {

    public async initialize(): Promise<{ symfonyVersion: number; uri: vscode.Uri; }> {
        
        if(vscode.workspace.workspaceFolders === undefined) {
            throw new Error("No workspace folder opened")
        }
        let composerJsonList = await vscode.workspace.findFiles("**/composer.json");
        if (composerJsonList.length === 0) {
            throw new Error("No composer.json file detected in the current workspace");
        }

        for (let uri of composerJsonList) {
            let composerObj = JSON.parse(stripJsonComments(fs.readFileSync(uri.fsPath).toString()));
            if(composerObj.require instanceof Object) {
                for (let composerPackage in composerObj.require) {
                    if(composerPackage === "symfony/symfony" || composerPackage == "symfony/framework-bundle") {
                        return {
                            symfonyVersion: parseInt(composerObj.require[composerPackage].match(/\d/)),
                            uri: uri
                        };
                    }
                }
            }
        }
        
        throw new Error("No composer.json file wih Symfony as dependency detected");
    }
}