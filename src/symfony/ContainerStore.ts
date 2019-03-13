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

export class ContainerStore {
    private _cacheManager: ContainerCacheManager
    private _composerJson: ComposerJSON
    private _containerProviders: ContainerProviderInterface[] = []
    private _serviceDefinitionStore: ServiceDefinition[] = []
    private _routeDefinitionStore: RouteDefinition[] = []
    private _parameterStore: Parameter[] = []
    private _listeners: AbstractContainerStoreListener[] = []

    private static SERVICES_FETCH_MESSAGE = "Fetching Symfony services definitions..."
    private static ROUTES_FETCH_MESSAGE = "Fetching Symfony routes definitions..."
    private static PARAMETERS_FETCH_MESSAGE = "Fetching Symfony parameters..."
    private static CONTAINER_NO_PROVIDER = "Cannot retrieve container elements at the moment"

    constructor(cacheManager: ContainerCacheManager, composerJson: ComposerJSON) {
        this._cacheManager = cacheManager
        this._composerJson = composerJson
        this._containerProviders.push(new CacheContainerProvider(cacheManager))
        this._containerProviders.push(new DumpContainerProvider(composerJson))
        this._containerProviders.push(new ConsoleContainerProvider(composerJson))
    }

    refreshAll(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let hasValidProvider = this._containerProviders.some((provider) => {
                if(provider.canProvideServiceDefinitions() && provider.canProvideRouteDefinitions() && provider.canProvideParameters()) {
                    vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.SERVICES_FETCH_MESSAGE }, (progress, token) => {
                        return provider.provideServiceDefinitions().then(servicesDefinitions => {
                            this._serviceDefinitionStore = servicesDefinitions
                            this._cacheManager.setServices(servicesDefinitions)
                            this._listeners.forEach(listerner => {
                                listerner.onServicesChanges(servicesDefinitions)
                            });
            
                            vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.ROUTES_FETCH_MESSAGE }, (progress, token) => {
                                return provider.provideRouteDefinitions().then(routeDefinitions => {
                                    this._routeDefinitionStore = routeDefinitions
                                    this._cacheManager.setRoutes(routeDefinitions)
                                    this._listeners.forEach(listerner => {
                                        listerner.onRoutesChanges(routeDefinitions)
                                    });
            
                                    vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.PARAMETERS_FETCH_MESSAGE }, (progress, token) => {
                                        return provider.provideParameters().then(parameters => {
                                            this._parameterStore = parameters
                                            this._cacheManager.setParameters(parameters)
                                            this._listeners.forEach(listerner => {
                                                listerner.onParametersChanges(parameters)
                                            });
                                            resolve()
                                        }).catch(reason => {
                                            vscode.window.showErrorMessage(reason)
                                            reject()
                                        })
                                    })
                                }).catch(reason => {
                                    vscode.window.showErrorMessage(reason)
                                    reject()
                                })
                            })
                        }).catch(reason => {
                            vscode.window.showErrorMessage(reason)
                            reject()
                        })
                    })
                    return true
                } else {
                    return false
                }
            })
            if(!hasValidProvider) {
                vscode.window.showErrorMessage(ContainerStore.CONTAINER_NO_PROVIDER)
            }
        })
    }

    clearCacheAndRefreshAll(): void {
        this._cacheManager.clearServices().then(() => {
            this._cacheManager.clearRoutes().then(() => {
                this._cacheManager.clearParameters().then(() => {
                    this.refreshAll()
                })
            })
        })
    }

    refreshServiceDefinitions(): void {
        let hasValidProvider = this._containerProviders.some(provider => {
            if(provider.canProvideServiceDefinitions()) {
                vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.SERVICES_FETCH_MESSAGE }, (progress, token) => {
                    return provider.provideServiceDefinitions().then(servicesDefinitions => {
                        this._serviceDefinitionStore = servicesDefinitions
                        this._cacheManager.setServices(servicesDefinitions)
                        this._listeners.forEach(listener => {
                            listener.onServicesChanges(servicesDefinitions)
                        });
                    }).catch(reason => {
                        vscode.window.showErrorMessage(reason)
                    })
                })
                return true
            } else {
                return false
            }
        })
        if(!hasValidProvider) {
            vscode.window.showErrorMessage(ContainerStore.CONTAINER_NO_PROVIDER)
        }
    }

    clearCacheAndRefreshServices(): void {
        this._cacheManager.clearServices().then(() => {
            this.refreshServiceDefinitions()
        })
    }

    refreshRouteDefinitions(): void {
        let hasValidProvider = this._containerProviders.some(provider => {
            if(provider.canProvideRouteDefinitions()) {
                vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.ROUTES_FETCH_MESSAGE }, (progress, token) => {
                    return provider.provideRouteDefinitions().then(routeDefinitions => {
                        this._routeDefinitionStore = routeDefinitions
                        this._cacheManager.setRoutes(routeDefinitions)
                        this._listeners.forEach(listener => {
                            listener.onRoutesChanges(routeDefinitions)
                        });
                    }).catch(reason => {
                        vscode.window.showErrorMessage(reason)
                    })
                })
                return true
            } else {
                return false
            }
        })
        if(!hasValidProvider) {
            vscode.window.showErrorMessage(ContainerStore.CONTAINER_NO_PROVIDER)
        }
    }

    clearCacheAndRefreshRoutes(): void {
        this._cacheManager.clearRoutes().then(() => {
            this.refreshRouteDefinitions()
        })
    }

    refreshParameters(): void {
        let hasValidProvider = this._containerProviders.some(provider => {
            if(provider.canProvideParameters()) {
                vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.PARAMETERS_FETCH_MESSAGE }, (progress, token) => {
                    return provider.provideParameters().then(parameters => {
                        this._parameterStore = parameters
                        this._cacheManager.setParameters(parameters)
                        this._listeners.forEach(listener => {
                            listener.onParametersChanges(parameters)
                        });
                    }).catch(reason => {
                        vscode.window.showErrorMessage(reason)
                    })
                })
                return true
            } else {
                return false
            }
        })
        if(!hasValidProvider) {
            vscode.window.showErrorMessage(ContainerStore.CONTAINER_NO_PROVIDER)
        }
    }

    clearCacheAndRefreshParameters(): void {
        this._cacheManager.clearParameters().then(() => {
            this.refreshParameters()
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