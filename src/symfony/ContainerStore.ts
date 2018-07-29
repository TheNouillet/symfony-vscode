import { ServiceDefinition } from "./ServiceDefinition";
import { ContainerProviderInterface } from "./provider/ContainerProviderInterface";
import { ConsoleProvider } from "./provider/ConsoleProvider";
import { DummyProvider } from "./provider/DummyProvider";
import { RouteDefinition } from "./RouteDefinition";

export class ContainerStore {
    private _containerProvider: ContainerProviderInterface = new DummyProvider()
    private _serviceDefinitionStore: ServiceDefinition[] = []
    private _routeDefinitionStore: RouteDefinition[] = []

    constructor() {
        this.refreshAll()
    }

    refreshAll(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.refreshServiceDefinitions()
                .then(() => {
                    this.refreshRouteDefinitions()
                        .then(() => {
                            resolve()
                        })
                        .catch(reason => reject(reason))
                })
                .catch(reason => reject(reason))
        })
    }

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

    get serviceDefinitionList(): ServiceDefinition[] {
        return this._serviceDefinitionStore
    }

    get routeDefinitionList(): RouteDefinition[] {
        return this._routeDefinitionStore
    }
}