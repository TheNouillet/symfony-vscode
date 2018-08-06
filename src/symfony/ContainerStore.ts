import { ServiceDefinition } from "./ServiceDefinition";
import { ContainerProviderInterface } from "./provider/ContainerProviderInterface";
import { ConsoleProvider } from "./provider/ConsoleProvider";
import { DummyProvider } from "./provider/DummyProvider";
import { RouteDefinition } from "./RouteDefinition";
import { Parameter } from "./Parameter";

export class ContainerStore {
    private _containerProvider: ContainerProviderInterface = new ConsoleProvider()
    private _serviceDefinitionStore: ServiceDefinition[] = []
    private _routeDefinitionStore: RouteDefinition[] = []
    private _parameterStore: Parameter[] = []

    refreshServiceDefinitions(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._containerProvider.provideServiceDefinitions().then(servicesDefinitions => {
                this._serviceDefinitionStore = servicesDefinitions
                resolve()
            }).catch(reason => reject(reason))
        })
    }

    refreshRouteDefinitions(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._containerProvider.provideRouteDefinitions().then(routeDefinitions => {
                this._routeDefinitionStore = routeDefinitions
                resolve()
            }).catch(reason => reject(reason))
        })
    }

    refreshParameters(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._containerProvider.provideParameters().then(parameters => {
                this._parameterStore = parameters
                resolve()
            }).catch(reason => reject(reason))
        })
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