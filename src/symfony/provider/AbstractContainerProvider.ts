import * as vscode from "vscode"
import { ServiceDefinition } from "../ServiceDefinition";
import { Parameter } from "../Parameter";

export abstract class AbstractContainerProvider {

    protected _configuration = vscode.workspace.getConfiguration("symfony-vscode")

    protected _parseServicesObject(obj: any): ServiceDefinition[] {
        let result: ServiceDefinition[] = []
        let collection: Object = {}

        if (obj.definitions !== undefined) {
            Object.keys(obj.definitions).forEach(key => {
                collection[key] = (new ServiceDefinition(key, obj.definitions[key].class, obj.definitions[key].public, null))
            })
        }
        if (obj.aliases !== undefined) {
            Object.keys(obj.aliases).forEach(key => {
                let alias = obj.aliases[key].service
                let className = collection[alias] ? collection[alias].className : null
                collection[key] = (new ServiceDefinition(key, className, obj.aliases[key].public, alias))
            })
        }
        Object.keys(collection).forEach(key => {
            if (!this._matchServicesFilters(collection[key].id, collection[key].className)) {
                result.push(collection[key])
            }
        });

        return result
    }

    protected _parseParametersObject(obj: any): Parameter[] {
        let result: Parameter[] = []

        Object.keys(obj).forEach(key => {
            if (!this._matchParametersFilters(key)) {
                result.push(new Parameter(key, obj[key]))
            }
        })

        return result
    }

    protected _matchServicesFilters(serviceId: string, serviceClassName: string): boolean {
        let filters: object = this._configuration.get("servicesFilters")
        return Object.keys(filters).some(filter => {
            if (filters[filter] === "id" && serviceId != null && serviceId.match(new RegExp(filter))) {
                return true
            } else if (filters[filter] === "class" && serviceClassName != null && serviceClassName.match(new RegExp(filter))) {
                return true
            }
            return false
        })
    }

    protected _matchRoutesFilters(routeId: string, routePath: string): boolean {
        let filters: object = this._configuration.get("routesFilters")
        return Object.keys(filters).some(filter => {
            if (filters[filter] === "id" && routeId != null && routeId.match(new RegExp(filter))) {
                return true
            } else if (filters[filter] === "path" && routePath != null && routePath.match(new RegExp(filter))) {
                return true
            }
            return false
        })
    }

    protected _matchParametersFilters(parameterId: string): boolean {
        let filters: Array<string> = this._configuration.get("parametersFilters")
        return filters.some(filter => {
            return parameterId != null && (parameterId.match(new RegExp(filter)) !== null)
        })
    }
}