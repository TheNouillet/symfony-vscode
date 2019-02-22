import { Searchable } from "./Searchable";

export class RouteDefinition implements Searchable {
    public id: string
    public path: string
    public method: string
    public action: string

    constructor(id: string, path: string, method: string, action: string) {
        this.id = id
        this.path = path
        this.method = method
        this.action = action
    }

    acceptSearchCriteria(criteria: string): number {
        if (this.id && this.id.match(criteria)) {
            return 2
        }
        if (this.path && this.path.match(criteria)) {
            return 2
        }
        if (this.action && this.action.match(criteria)) {
            return 2
        }
        return 0
    }

    static fromJSON(jsonRouteDefinition: RouteDefinition): RouteDefinition {
        return new RouteDefinition(
            jsonRouteDefinition.id, jsonRouteDefinition.path, jsonRouteDefinition.method, jsonRouteDefinition.action
        )
    }
}