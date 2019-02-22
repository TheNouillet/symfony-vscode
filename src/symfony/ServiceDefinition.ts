import { Searchable } from "./Searchable";

export class ServiceDefinition implements Searchable {
    public id: string
    public className: string
    public public: boolean
    public alias: string

    constructor(id: string, className: string, isPublic: boolean, alias: string) {
        this.id = id
        this.className = className
        this.public = isPublic
        this.alias = alias
    }

    public isServiceIdAClassName(): boolean {
        return this.id.match(/([A-Z]|\\)/) !== null
    }

    public acceptSearchCriteria(criteria: string): number {
        if(this.id && this.id.match(criteria)) {
            return 2
        }
        if(this.className && this.className.match(criteria)) {
            return 2
        }
        if(this.alias && this.alias.match(criteria)) {
            return 1
        }
        return 0
    }

    static fromJSON(jsonServiceDefinition: ServiceDefinition): ServiceDefinition {
        return new ServiceDefinition(
            jsonServiceDefinition.id, jsonServiceDefinition.className, jsonServiceDefinition.public, jsonServiceDefinition.alias
        )
    }
}