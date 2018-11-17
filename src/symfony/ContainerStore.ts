import * as vscode from "vscode"
import { ServiceDefinition } from "./ServiceDefinition";
import { ContainerProviderInterface } from "./provider/ContainerProviderInterface";
import { ConsoleProvider } from "./provider/ConsoleProvider";
import { DummyProvider } from "./provider/DummyProvider";
import { RouteDefinition } from "./RouteDefinition";
import { Parameter } from "./Parameter";
import { AbstractContainerStoreListener } from "./AbstractContainerStoreListener";

export class ContainerStore {
    private _containerProvider: ContainerProviderInterface = new ConsoleProvider()
    private _serviceDefinitionStore: ServiceDefinition[] = []
    private _routeDefinitionStore: RouteDefinition[] = []
    private _parameterStore: Parameter[] = []
    private _listeners: AbstractContainerStoreListener[] = []

    private static SERVICES_FETCH_MESSAGE = "Fetching Symfony services definitions..."
    private static ROUTES_FETCH_MESSAGE = "Fetching Symfony routes definitions..."
    private static PARAMETERS_FETCH_MESSAGE = "Fetching Symfony parameters..."

    refreshAll(): void {
        vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.SERVICES_FETCH_MESSAGE }, (progress, token) => {
            return this._containerProvider.provideServiceDefinitions().then(servicesDefinitions => {
                this._serviceDefinitionStore = servicesDefinitions
                this._listeners.forEach(listerner => {
                    listerner.onServicesChanges(servicesDefinitions)
                });

                vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.ROUTES_FETCH_MESSAGE }, (progress, token) => {
                    return this._containerProvider.provideRouteDefinitions().then(routeDefinitions => {
                        this._routeDefinitionStore = routeDefinitions
                        this._listeners.forEach(listerner => {
                            listerner.onRoutesChanges(routeDefinitions)
                        });

                        vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.PARAMETERS_FETCH_MESSAGE }, (progress, token) => {
                            return this._containerProvider.provideParameters().then(parameters => {
                                this._parameterStore = parameters
                                this._listeners.forEach(listerner => {
                                    listerner.onParametersChanges(parameters)
                                });
                            }).catch(reason => {
                                vscode.window.showErrorMessage(reason)
                            })
                        })
                    }).catch(reason => {
                        vscode.window.showErrorMessage(reason)
                    })
                })
            }).catch(reason => {
                vscode.window.showErrorMessage(reason)
            })
        })
    }

    refreshServiceDefinitions(): void {
        vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.SERVICES_FETCH_MESSAGE }, (progress, token) => {
            return this._containerProvider.provideServiceDefinitions().then(servicesDefinitions => {
                this._serviceDefinitionStore = servicesDefinitions
                this._listeners.forEach(listener => {
                    listener.onServicesChanges(servicesDefinitions)
                });
            }).catch(reason => {
                vscode.window.showErrorMessage(reason)
            })
        })
    }

    refreshRouteDefinitions(): void {
        vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.ROUTES_FETCH_MESSAGE }, (progress, token) => {
            return this._containerProvider.provideRouteDefinitions().then(routeDefinitions => {
                this._routeDefinitionStore = routeDefinitions
                this._listeners.forEach(listener => {
                    listener.onRoutesChanges(routeDefinitions)
                });
            }).catch(reason => {
                vscode.window.showErrorMessage(reason)
            })
        })
    }

    refreshParameters(): void {
        vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: ContainerStore.PARAMETERS_FETCH_MESSAGE }, (progress, token) => {
            return this._containerProvider.provideParameters().then(parameters => {
                this._parameterStore = parameters
                this._listeners.forEach(listener => {
                    listener.onParametersChanges(parameters)
                });
            }).catch(reason => {
                vscode.window.showErrorMessage(reason)
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