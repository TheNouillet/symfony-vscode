import * as vscode from "vscode"
import * as path from "path"

import { ContainerProviderInterface } from "./ContainerProviderInterface";
import { ServiceDefinition } from "../ServiceDefinition";
import { execSync, ExecSyncOptions } from "child_process";
import { ComposerJSON } from "../ComposerJSON";
import { RouteDefinition } from "../RouteDefinition";
import { Parameter } from "../Parameter";

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
        let showErrors = this._configuration.get("showConsoleErrors")
        return new Promise((resolve, reject) => {
            this._getDebugCommand("debug:container --show-private").then(infos => {
                let result: ServiceDefinition[] = []
                let collection: Object = {}
                try {
                    let buffer = execSync(infos.cmd, this._configuration.get("detectCwd") ? new CommandOptions(infos.cwd) : undefined).toString()
                    let obj = JSON.parse(buffer)
                    if(obj.definitions !== undefined) {
                        Object.keys(obj.definitions).forEach(key => {
                            collection[key] = (new ServiceDefinition(key, obj.definitions[key].class, obj.definitions[key].public, null))
                        })
                    }
                    if(obj.aliases !== undefined) {
                        Object.keys(obj.aliases).forEach(key => {
                            let alias = obj.aliases[key].service
                            let className = collection[alias] ? collection[alias].className : null
                            collection[key] = (new ServiceDefinition(key, className, obj.aliases[key].public, alias))
                        })
                    }
                    Object.keys(collection).forEach(key => {
                        if(!this._matchServicesFilters(collection[key].id, collection[key].className)) {
                            result.push(collection[key])
                        }
                    });
                    resolve(result)
                } catch (e) {
                    if(showErrors) {
                        reject(e.message)
                    } else {
                        resolve([])
                    }
                }
            }).catch(reason => reject(reason))
        })
    }

    provideRouteDefinitions(): Promise<RouteDefinition[]> {
        let showErrors = this._configuration.get("showConsoleErrors")
        return new Promise((resolve, reject) => {
            this._getDebugCommand("debug:router").then(infos => {
                let result: RouteDefinition[] = []
                try {
                    let buffer = execSync(infos.cmd, this._configuration.get("detectCwd") ? new CommandOptions(infos.cwd) : undefined).toString()
                    let obj = JSON.parse(buffer)
                    Object.keys(obj).forEach(key => {
                        if(!this._matchRoutesFilters(key, obj[key].path)) {
                            result.push(new RouteDefinition(key, obj[key].path, obj[key].method, obj[key].defaults._controller))
                        }
                    })
                    resolve(result)
                } catch(e) {
                    if(showErrors) {
                        reject(e.message)
                    } else {
                        resolve([])
                    }
                }
            }).catch(reason => reject(reason))
        })
    }

    provideParameters(): Promise<Parameter[]> {
        let showErrors = this._configuration.get("showConsoleErrors")
        return new Promise((resolve, reject) => {
            this._getDebugCommand("debug:container --parameters").then(infos => {
                let result: Parameter[] = []
                try {
                    let buffer = execSync(infos.cmd, this._configuration.get("detectCwd") ? new CommandOptions(infos.cwd) : undefined).toString()
                    let obj = JSON.parse(buffer)
                    Object.keys(obj).forEach(key => {
                        result.push(new Parameter(key, obj[key]))
                    })
                    resolve(result)
                } catch(e) {
                    if(showErrors) {
                        reject(e.message)
                    } else {
                        resolve([])
                    }
                }
            }).catch(reason => reject(reason))
        })
    }

    private _getDebugCommand(symfonyCommand: string): Promise<{cmd: string, cwd: string}> {
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

                    cmd += symfonyCommand + " --format=json"
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

    private _matchServicesFilters(serviceId: string, serviceClassName: string): boolean {
        let filters: object = this._configuration.get("servicesFilters")
        return Object.keys(filters).some(filter => {
            if(filters[filter] === "id" && serviceId != null && serviceId.match(new RegExp(filter))) {
                return true
            } else if(filters[filter] === "class" && serviceClassName != null &&  serviceClassName.match(new RegExp(filter))) {
                return true
            }
            return false
        })
    }

    private _matchRoutesFilters(routeId: string, routePath: string): boolean {
        let filters: object = this._configuration.get("routesFilters")
        return Object.keys(filters).some(filter => {
            if(filters[filter] === "id" && routeId != null && routeId.match(new RegExp(filter))) {
                return true
            } else if(filters[filter] === "path" && routePath != null &&  routePath.match(new RegExp(filter))) {
                return true
            }
            return false
        })
    }
}