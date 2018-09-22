import * as vscode from "vscode"
import * as path from "path"

import { ContainerProviderInterface } from "./ContainerProviderInterface";
import { ServiceDefinition } from "../ServiceDefinition";
import { spawn } from "child_process";
import { ComposerJSON } from "../ComposerJSON";
import { RouteDefinition } from "../RouteDefinition";
import { Parameter } from "../Parameter";

export class ConsoleProvider implements ContainerProviderInterface {

    private _configuration = vscode.workspace.getConfiguration("symfony-vscode")
    private _composerJson: ComposerJSON = new ComposerJSON()

    provideServiceDefinitions(): Promise<ServiceDefinition[]> {
        return this._executeCommand<ServiceDefinition>(["debug:container", "--show-private"], (obj) => {
            let result: ServiceDefinition[] = []
            let collection: Object = {}

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

            return result
        })
    }

    provideRouteDefinitions(): Promise<RouteDefinition[]> {
        return this._executeCommand<RouteDefinition>(["debug:router"], (obj) => {
            let result: RouteDefinition[] = []

            Object.keys(obj).forEach(key => {
                if(!this._matchRoutesFilters(key, obj[key].path)) {
                    result.push(new RouteDefinition(key, obj[key].path, obj[key].method, obj[key].defaults._controller))
                }
            })

            return result
        })
    }

    provideParameters(): Promise<Parameter[]> {
        return this._executeCommand<Parameter>(["debug:container", "--parameters"], (obj) => {
            let result: Parameter[] = []

            Object.keys(obj).forEach(key => {
                if(!this._matchParametersFilters(key)) {
                    result.push(new Parameter(key, obj[key]))
                }
            })

            return result
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
                let process = spawn(this._getExecutablePath(), args, this._configuration.get("detectCwd") ? {cwd: infos.cwd} : undefined)
                process.stdout.on('data', (data) => {
                    buffer += data
                })
                process.stderr.on('data', (data) => {
                    errorBuffer += data
                })
                process.on('error', (err) => {
                    if(this._showErrors) {
                        reject(err.message)
                    } else {
                        resolve([])
                    }
                })
                process.on('close', (code) => {
                    if(code !== 0) {
                        if(this._showErrors) {
                            reject(errorBuffer)
                        } else {
                            resolve([])
                        }
                    } else {
                        try {
                            let obj = JSON.parse(buffer)
                            resolve(cb(obj))
                        } catch(e) {
                            if(this._showErrors) {
                                reject(e)
                            } else {
                                resolve([])
                            }
                        }
                    }
                })
            })
        })
    }

    private _getConsolePath(): Promise<{consolePath: string, cwd: string}> {
        return new Promise((resolve, reject) => {
            this._composerJson.initialize().then(infos => {
                let customConsolePath = this._configuration.get("consolePath")
                let consolePath: string = ""
                if(customConsolePath) {
                    consolePath = customConsolePath + " "
                } else {
                    switch (infos.symfonyVersion) {
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
                    cwd: path.dirname(infos.uri.fsPath)
                })
            }).catch(reason => reject(reason))
        })
    }

    private _getExecutablePath(): string {
        return this._configuration.get("phpPath")
    }

    private _showErrors(): boolean {
        return this._configuration.get("showConsoleErrors")
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

    private _matchParametersFilters(parameterId: string): boolean {
        let filters: Array<string> = this._configuration.get("parametersFilters")
        return filters.some(filter => {
            return parameterId != null && (parameterId.match(new RegExp(filter)) !== null)
        })
    }
}