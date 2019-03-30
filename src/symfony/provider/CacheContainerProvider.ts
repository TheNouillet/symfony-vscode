import * as vscode from "vscode"
import { ContainerProviderInterface } from "./ContainerProviderInterface";
import { RouteDefinition } from "../RouteDefinition";
import { Parameter } from "../Parameter";
import { ServiceDefinition } from "../ServiceDefinition";
import { ContainerCacheManager } from "../ContainerCacheManager";
import { AbstractContainerProvider } from "./AbstractContainerProvider";

export class CacheContainerProvider extends AbstractContainerProvider implements ContainerProviderInterface {
    protected _cacheManager: ContainerCacheManager

    protected static NO_SERVICES_IN_CACHE = "No services in cache"
    protected static NO_ROUTES_IN_CACHE = "No routes in cache"
    protected static NO_PARAMETERS_IN_CACHE = "No parameters in cache"

    constructor(cacheManager: ContainerCacheManager) {
        super()
        this._cacheManager = cacheManager
    }

    canProvideServiceDefinitions(): boolean {
        return this._cacheManager.hasCachedServices()
    }
    canProvideRouteDefinitions(): boolean {
        return this._cacheManager.hasCachedRoutes()
    }
    canProvideParameters(): boolean {
        return this._cacheManager.hasCachedParameters()
    }

    provideServiceDefinitions(): Promise<ServiceDefinition[]> {
        return new Promise<ServiceDefinition[]>((resolve, reject) => {
            if(this._cacheManager.hasCachedServices()) {
                let services = this._cacheManager.getServices()
                let filteredServices = []

                services.forEach(service => {
                    if (!this._matchServicesFilters(service.id, service.className)) {
                        filteredServices.push(service)
                    }
                })

                resolve(filteredServices)
            } else {
                reject(CacheContainerProvider.NO_SERVICES_IN_CACHE)
            }
        })
    }    
    provideRouteDefinitions(): Promise<RouteDefinition[]> {
        return new Promise<RouteDefinition[]>((resolve, reject) => {
            if(this._cacheManager.hasCachedRoutes()) {
                let routes = this._cacheManager.getRoutes()
                let filteredRoutes = []

                routes.forEach(route => {
                    if(!this._matchRoutesFilters(route.id, route.path)) {
                        filteredRoutes.push(route)
                    }
                })

                resolve(filteredRoutes)
            } else {
                reject(CacheContainerProvider.NO_ROUTES_IN_CACHE)
            }
        })
    }
    provideParameters(): Promise<Parameter[]> {
        return new Promise<Parameter[]>((resolve, reject) => {
            if(this._cacheManager.hasCachedParameters()) {
                let parameters = this._cacheManager.getParameters()
                let filteredParameters = []

                parameters.forEach(parameter => {
                    if(!this._matchParametersFilters(parameter.name)) {
                        filteredParameters.push(parameter)
                    }
                })

                resolve(filteredParameters)
            } else {
                reject(CacheContainerProvider.NO_PARAMETERS_IN_CACHE)
            }
        })
    }
}