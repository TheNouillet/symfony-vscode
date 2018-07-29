import * as vscode from "vscode"
import * as path from "path"

import { ContainerProviderInterface } from "./ContainerProviderInterface";
import { ServiceDefinition } from "../ServiceDefinition";
import { execSync, ExecSyncOptions } from "child_process";
import { ComposerJSON } from "../ComposerJSON";
import { RouteDefinition } from "../RouteDefinition";

class CommandOptions implements ExecSyncOptions {
    cwd: string = ""
    constructor(rootDirectory: string) {
        this.cwd = rootDirectory
    }
}

export class ConsoleProvider implements ContainerProviderInterface {

    private _configuration = vscode.workspace.getConfiguration("symfony-vscode")
    private _composerJson: ComposerJSON = new ComposerJSON()

    provideServiceDefinitions(): Promise<ServiceDefinition[]> {
        return new Promise((resolve, reject) => {
            this._getDebugCommand().then(infos => {
                let result: ServiceDefinition[] = []
                let buffer = execSync(infos.cmd, new CommandOptions(infos.cwd)).toString()
                let obj = JSON.parse(buffer)
                if(obj.definitions !== undefined) {
                    Object.keys(obj.definitions).forEach(key => {
                        result.push(new ServiceDefinition(key, obj.definitions[key].class, obj.definitions[key].public))
                    })
                }
    
                resolve(result)
            }).catch(reason => reject(reason))
        })
    }

    provideRouteDefinitions(): Promise<RouteDefinition[]> {
        return new Promise(resolve => {
            resolve([])
        })
    }

    private _getDebugCommand(): Promise<{cmd: string, cwd: string}> {
        return new Promise((resolve, reject) => {
            this._composerJson.initialize()
                .then(infos => {
                    let cmd = this._getPhpExecutablePath() + " "

                    let customConsolePath = this._configuration.get("consolePath")
                    if(customConsolePath) {
                        cmd += customConsolePath + " "
                    } else {
                        switch (infos.symfonyVersion) {
                            case 2:
                                cmd += "app/console "
                                break;
                            case 3:
                            default:
                                cmd += "bin/console "
                                break;
                        }
                    }

                    cmd += "debug:container --format=json"
                    resolve({
                        cmd: cmd,
                        cwd: path.dirname(infos.uri.fsPath)
                    })
                }).catch(reason => reject(reason))
        })
    }

    private _getPhpExecutablePath(): string {
        return this._configuration.get("phpPath")
    }
}