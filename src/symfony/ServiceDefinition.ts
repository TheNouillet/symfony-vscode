export class ServiceDefinition {
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
        return this.id.match(/^(?:\\{1,2}\w+|\w+\\{1,2})(?:\w+\\{0,2}\w+)+$/) !== null
    }
}