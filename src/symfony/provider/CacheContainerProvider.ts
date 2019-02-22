import * as vscode from "vscode"
import { ContainerProviderInterface } from "./ContainerProviderInterface";
import { RouteDefinition } from "../RouteDefinition";
import { Parameter } from "../Parameter";
import { ServiceDefinition } from "../ServiceDefinition";
import { ContainerCacheManager } from "../ContainerCacheManager";

export class CacheContainerProvider implements ContainerProviderInterface {
    protected _cacheManager: ContainerCacheManager

    protected static NO_SERVICES_IN_CACHE = "No services in cache"
    protected static NO_ROUTES_IN_CACHE = "No routes in cache"
    protected static NO_PARAMETERS_IN_CACHE = "No parameters in cache"

    constructor(cacheManager: ContainerCacheManager) {
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
                resolve(this._cacheManager.getServices())
            } else {
                reject(CacheContainerProvider.NO_SERVICES_IN_CACHE)
            }
        })
    }    
    provideRouteDefinitions(): Promise<RouteDefinition[]> {
        return new Promise<RouteDefinition[]>((resolve, reject) => {
            if(this._cacheManager.hasCachedRoutes()) {
                resolve(this._cacheManager.getRoutes())
            } else {
                reject(CacheContainerProvider.NO_ROUTES_IN_CACHE)
            }
        })
    }
    provideParameters(): Promise<Parameter[]> {
        return new Promise<Parameter[]>((resolve, reject) => {
            if(this._cacheManager.hasCachedParameters()) {
                resolve(this._cacheManager.getParameters())
            } else {
                reject(CacheContainerProvider.NO_PARAMETERS_IN_CACHE)
            }
        })
    }
}