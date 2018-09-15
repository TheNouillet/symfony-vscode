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

    refreshAll(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._containerProvider.provideServiceDefinitions().then(servicesDefinitions => {
                this._serviceDefinitionStore = servicesDefinitions
                this._listeners.forEach(listerner => {
                    listerner.onServicesChanges(servicesDefinitions)
                });
                this._containerProvider.provideRouteDefinitions().then(routeDefinitions => {
                    this._routeDefinitionStore = routeDefinitions
                    this._listeners.forEach(listerner => {
                        listerner.onRoutesChanges(routeDefinitions)
                    });
                    this._containerProvider.provideParameters().then(parameters => {
                        this._parameterStore = parameters
                        this._listeners.forEach(listerner => {
                            listerner.onParametersChanges(parameters)
                        });
                        resolve()
                    }).catch(reason => reject(reason))
                }).catch(reason => reject(reason))
            }).catch(reason => reject(reason))
        })
    }

    refreshServiceDefinitions(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._containerProvider.provideServiceDefinitions().then(servicesDefinitions => {
                this._serviceDefinitionStore = servicesDefinitions
                this._listeners.forEach(listener => {
                    listener.onServicesChanges(servicesDefinitions)
                });
                resolve()
            }).catch(reason => reject(reason))
        })
    }

    refreshRouteDefinitions(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._containerProvider.provideRouteDefinitions().then(routeDefinitions => {
                this._routeDefinitionStore = routeDefinitions
                this._listeners.forEach(listener => {
                    listener.onRoutesChanges(routeDefinitions)
                });
                resolve()
            }).catch(reason => reject(reason))
        })
    }

    refreshParameters(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._containerProvider.provideParameters().then(parameters => {
                this._parameterStore = parameters
                this._listeners.forEach(listener => {
                    listener.onParametersChanges(parameters)
                });
                resolve()
            }).catch(reason => reject(reason))
        })
    }

    subscribeListerner(listener: AbstractContainerStoreListener)
    {
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