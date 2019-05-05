import * as vscode from "vscode"
import { ServiceDefinition } from "./ServiceDefinition";
import { ContainerProviderInterface } from "./provider/ContainerProviderInterface";
import { ConsoleContainerProvider } from "./provider/ConsoleContainerProvider";
import { RouteDefinition } from "./RouteDefinition";
import { Parameter } from "./Parameter";
import { AbstractContainerStoreListener } from "./AbstractContainerStoreListener";
import { ContainerCacheManager } from "./ContainerCacheManager";
import { CacheContainerProvider } from "./provider/CacheContainerProvider";
import { ComposerJSON } from "./composer/ComposerJSON";
import { DumpContainerProvider } from "./provider/DumpContainerProvider";
import { DIDumpFileExtractor } from "./provider/diDump/DIDumpFileExtractor";

export class ContainerStore {
    private _cacheManager: ContainerCacheManager
    private _containerProviders: ContainerProviderInterface[] = []
    private _serviceDefinitionStore: ServiceDefinition[] = []
    private _routeDefinitionStore: RouteDefinition[] = []
    private _parameterStore: Parameter[] = []
    private _listeners: AbstractContainerStoreListener[] = []

    private static SERVICES_FETCH_MESSAGE = "Fetching Symfony services definitions..."
    private static ROUTES_FETCH_MESSAGE = "Fetching Symfony routes definitions..."
    private static PARAMETERS_FETCH_MESSAGE = "Fetching Symfony parameters..."
    private static CONTAINER_NO_PROVIDER = "Cannot retrieve container elements at the moment"

    constructor(cacheManager: ContainerCacheManager, composerJson: ComposerJSON, dumpFileExtractor: DIDumpFileExtractor) {
        this._cacheManager = cacheManager
        this._containerProviders.push(new CacheContainerProvider(cacheManager))
        this._containerProviders.push(new DumpContainerProvider(composerJson, dumpFileExtractor))
        this._containerProviders.push(new ConsoleContainerProvider(composerJson))
    }

    refreshAll(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.refreshServiceDefinitions()
                .then(() => this.refreshRouteDefinitions())
                .then(() => this.refreshParameters())
                .then(() => resolve())
                .catch(reason => reject(reason))
        })
    }

    clearCacheAndRefreshAll(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._cacheManager.clearServices().then(() => {
                this._cacheManager.clearRoutes().then(() => {
                    this._cacheManager.clearParameters().then(() => {
                        this.refreshAll().then(() => {
                            resolve()
                        }).catch(reason => {
                            reject(reason)
                        })
                    })
                })
            })
        })
    }

    refreshServiceDefinitions(): Promise<ServiceDefinition[]> {
        return new Promise<ServiceDefinition[]>((resolve, reject) => {
            let hasValidProvider = this._containerProviders.some(provider => {
                if(provider.canProvideServiceDefinitions()) {
                    vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.SERVICES_FETCH_MESSAGE }, (progress, token) => {
                        return provider.provideServiceDefinitions().then(servicesDefinitions => {
                            this._serviceDefinitionStore = servicesDefinitions
                            this._cacheManager.setServices(servicesDefinitions)
                            this._listeners.forEach(listener => {
                                listener.onServicesChanges(servicesDefinitions)
                            });
                            resolve(servicesDefinitions)
                        }).catch(reason => {
                            vscode.window.showErrorMessage(reason)
                            resolve([])
                        })
                    })
                    return true
                } else {
                    return false
                }
            })
            if(!hasValidProvider) {
                vscode.window.showErrorMessage(ContainerStore.CONTAINER_NO_PROVIDER)
                reject(ContainerStore.CONTAINER_NO_PROVIDER)
            }
        })
    }

    clearCacheAndRefreshServices(): Promise<ServiceDefinition[]> {
        return new Promise<ServiceDefinition[]>((resolve, reject) => {
            this._cacheManager.clearServices().then(() => {
                this.refreshServiceDefinitions().then((result) => {
                    resolve(result)
                }).catch(reason => {
                    reject(reason)
                })
            })
        })
    }

    refreshRouteDefinitions(): Promise<RouteDefinition[]> {
        return new Promise<RouteDefinition[]>((resolve, reject) => {
            let hasValidProvider = this._containerProviders.some(provider => {
                if(provider.canProvideRouteDefinitions()) {
                    vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.ROUTES_FETCH_MESSAGE }, (progress, token) => {
                        return provider.provideRouteDefinitions().then(routeDefinitions => {
                            this._routeDefinitionStore = routeDefinitions
                            this._cacheManager.setRoutes(routeDefinitions)
                            this._listeners.forEach(listener => {
                                listener.onRoutesChanges(routeDefinitions)
                            });
                            resolve(routeDefinitions)
                        }).catch(reason => {
                            vscode.window.showErrorMessage(reason)
                            resolve([])
                        })
                    })
                    return true
                } else {
                    return false
                }
            })
            if(!hasValidProvider) {
                vscode.window.showErrorMessage(ContainerStore.CONTAINER_NO_PROVIDER)
                reject(ContainerStore.CONTAINER_NO_PROVIDER)
            }
        })
    }

    clearCacheAndRefreshRoutes(): Promise<RouteDefinition[]> {
        return new Promise<RouteDefinition[]>((resolve, reject) => {
            this._cacheManager.clearRoutes().then(() => {
                this.refreshRouteDefinitions().then(result => {
                    resolve(result)
                }).catch(reason => {
                    reject(reason)
                })
            })
        })
    }

    refreshParameters(): Promise<Parameter[]> {
        return new Promise<Parameter[]>((resolve, reject) => {
            let hasValidProvider = this._containerProviders.some(provider => {
                if(provider.canProvideParameters()) {
                    vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.PARAMETERS_FETCH_MESSAGE }, (progress, token) => {
                        return provider.provideParameters().then(parameters => {
                            this._parameterStore = parameters
                            this._cacheManager.setParameters(parameters)
                            this._listeners.forEach(listener => {
                                listener.onParametersChanges(parameters)
                            });
                            resolve(parameters)
                        }).catch(reason => {
                            vscode.window.showErrorMessage(reason)
                            resolve([])
                        })
                    })
                    return true
                } else {
                    return false
                }
            })
            if(!hasValidProvider) {
                vscode.window.showErrorMessage(ContainerStore.CONTAINER_NO_PROVIDER)
                reject(ContainerStore.CONTAINER_NO_PROVIDER)
            }
        })
    }

    clearCacheAndRefreshParameters(): Promise<Parameter[]> {
        return new Promise<Parameter[]>((resolve, reject) => {
            this._cacheManager.clearParameters().then(() => {
                this.refreshParameters().then(result => {
                    resolve(result)
                }).catch(reason => {
                    reject(reason)
                })
            })
        })
    }

    subscribeListerner(listener: AbstractContainerStoreListener) {
        this._listeners.push(listener)
    }

    get serviceDefinitionList(): ServiceDefinition[] {
        return this._serviceDefinitionStore
    }

    get routeDefinitionList(): RouteDefinition[] {
        return this._routeDefinitionStore
    }

    get parameterList(): Parameter[] {
        return this._parameterStore
    }
}