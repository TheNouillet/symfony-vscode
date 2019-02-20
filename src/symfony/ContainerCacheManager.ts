import * as vscode from "vscode"
import { ServiceDefinition } from "./ServiceDefinition";
import { RouteDefinition } from "./RouteDefinition";
import { Parameter } from "./Parameter";

export class ContainerCacheManager {

    protected _memento: vscode.Memento

    public static SERVICES_CACHE_KEY = "cached_container_store_services"
    public static ROUTES_CACHE_KEY = "cached_container_store_routes"
    public static PARAMETERS_CACHE_KEY = "cached_container_store_parameters"

    constructor(memento: vscode.Memento) {
        this._memento = memento
    }

    hasCachedServices() : boolean {
        return this._memento.get(ContainerCacheManager.SERVICES_CACHE_KEY) !== undefined
    }

    hasCachedRoutes() : boolean {
        return this._memento.get(ContainerCacheManager.ROUTES_CACHE_KEY) !== undefined
    }

    hasCachedParameters() : boolean {
        return this._memento.get(ContainerCacheManager.PARAMETERS_CACHE_KEY) !== undefined
    }

    getServices(): ServiceDefinition[] {
        return this._memento.get<ServiceDefinition[]>(ContainerCacheManager.SERVICES_CACHE_KEY)
    }

    getRoutes(): RouteDefinition[] {
        return this._memento.get<RouteDefinition[]>(ContainerCacheManager.ROUTES_CACHE_KEY)
    }

    getParameters(): Parameter[] {
        return this._memento.get<Parameter[]>(ContainerCacheManager.PARAMETERS_CACHE_KEY)
    }

    setServices(servicesDefinitions: ServiceDefinition[]): Thenable<void> {
        return this._memento.update(ContainerCacheManager.SERVICES_CACHE_KEY, servicesDefinitions)
    }

    setRoutes(routesDefinitions: RouteDefinition[]): Thenable<void> {
        return this._memento.update(ContainerCacheManager.ROUTES_CACHE_KEY, routesDefinitions)
    }

    setParameters(parameters: Parameter[]): Thenable<void> {
        return this._memento.update(ContainerCacheManager.PARAMETERS_CACHE_KEY, parameters)
    }

    clearServices(): Thenable<void> {
        return this._memento.update(ContainerCacheManager.SERVICES_CACHE_KEY, undefined)
    }

    clearRoutes(): Thenable<void> {
        return this._memento.update(ContainerCacheManager.ROUTES_CACHE_KEY, undefined)
    }

    clearParameters(): Thenable<void> {
        return this._memento.update(ContainerCacheManager.PARAMETERS_CACHE_KEY, undefined)
    }
}