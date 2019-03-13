import * as vscode from "vscode"
import * as path from "path"
import * as jsonStripComments from "strip-json-comments"

import { ContainerProviderInterface } from "./ContainerProviderInterface";
import { ServiceDefinition } from "../ServiceDefinition";
import { spawn, SpawnOptions } from "child_process";
import { RouteDefinition } from "../RouteDefinition";
import { Parameter } from "../Parameter";
import { ComposerJSON } from "../composer/ComposerJSON";
import { AbstractContainerProvider } from "./AbstractContainerProvider";

export class ConsoleContainerProvider extends AbstractContainerProvider implements ContainerProviderInterface {
    
    private _composerJson: ComposerJSON
    
    constructor(composerJson: ComposerJSON) {
        super()
        this._composerJson = composerJson
    }

    canProvideServiceDefinitions(): boolean {
        return this._composerJson.getSymfonyDIDependency() !== undefined && this._composerJson.getSymfonyConsoleDependency() !== undefined
    }

    canProvideRouteDefinitions(): boolean {
        return this._composerJson.getSymfonyRoutingDependency() !== undefined && this._composerJson.getSymfonyConsoleDependency() !== undefined
    }

    canProvideParameters(): boolean {
        return this._composerJson.getSymfonyDIDependency() !== undefined && this._composerJson.getSymfonyConsoleDependency() !== undefined
    }

    provideServiceDefinitions(): Promise<ServiceDefinition[]> {
        return this._executeCommand<ServiceDefinition>(["debug:container", "--show-private"], (obj) => {
            return this._parseServicesObject(obj)
        })
    }

    provideRouteDefinitions(): Promise<RouteDefinition[]> {
        return this._executeCommand<RouteDefinition>(["debug:router"], (obj) => {
            let result: RouteDefinition[] = []

            Object.keys(obj).forEach(key => {
                if (!this._matchRoutesFilters(key, obj[key].path)) {
                    result.push(new RouteDefinition(key, obj[key].path, obj[key].method, obj[key].defaults._controller))
                }
            })

            return result
        })
    }

    provideParameters(): Promise<Parameter[]> {
        return this._executeCommand<Parameter>(["debug:container", "--parameters"], (obj) => {
            return this._parseParametersObject(obj)
        })
    }

    private _executeCommand<T>(parameters: string[], cb: (obj: any) => T[]): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this._getConsolePath().then(infos => {
                let args: string[] = []
                args.push(infos.consolePath)
                args = args.concat(parameters)
                args.push("--format=json")

                let buffer: string = ""
                let errorBuffer: string = ""
                try {
                    let executable: string = this._getPHPExecutablePath()
                    let options: SpawnOptions = { cwd: infos.cwd }

                    let shellExecutable: string | boolean = false
                    if (shellExecutable = this._getShellExecutable()) {
                        executable = this._getShellCommand()
                        options = { shell: shellExecutable }
                    }

                    let process = spawn(executable, args, options)
                    process.stdout.on('data', (data) => {
                        buffer += data
                    })
                    process.stderr.on('data', (data) => {
                        errorBuffer += data
                    })
                    process.on('error', (err) => {
                        if (this._showErrors) {
                            reject(err.message)
                        } else {
                            resolve([])
                        }
                    })
                    process.on('close', (code) => {
                        if (code !== 0) {
                            if (this._showErrors) {
                                reject(errorBuffer)
                            } else {
                                resolve([])
                            }
                        } else {
                            try {
                                let obj = JSON.parse(jsonStripComments(buffer))
                                resolve(cb(obj))
                            } catch (e) {
                                if (this._showErrors) {
                                    reject(e)
                                } else {
                                    resolve([])
                                }
                            }
                        }
                    })
                } catch (e) {
                    if (this._showErrors) {
                        reject(e)
                    } else {
                        resolve([])
                    }
                }
            }).catch(reason => {
                reject(reason)
            })
        })
    }

    private _getConsolePath(): Promise<{ consolePath: string, cwd: string }> {
        return new Promise((resolve, reject) => {
            let symfonyDIDep = this._composerJson.getSymfonyDIDependency()
            let customConsolePath = this._configuration.get("consolePath")
            let consolePath: string = ""
            if (customConsolePath) {
                consolePath = customConsolePath + " "
            } else {
                switch (symfonyDIDep.majorVersion) {
                    case 2:
                        consolePath = "app/console"
                        break;
                    case 3:
                    default:
                        consolePath = "bin/console"
                        break;
                }
            }
            resolve({
                consolePath: consolePath,
                cwd: symfonyDIDep.uri.fsPath
            })
        })
    }

    private _getPHPExecutablePath(): string {
        return this._configuration.get("phpExecutablePath")
    }

    private _getShellExecutable(): string {
        return this._configuration.get("shellExecutable")
    }

    private _getShellCommand(): string {
        return this._configuration.get("shellCommand")
    }

    private _showErrors(): boolean {
        return this._configuration.get("showConsoleErrors")
    }
}