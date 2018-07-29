export class ServiceDefinition {
    public id: string
    public className: string
    public public: boolean

    constructor(id: string, className: string, isPublic: boolean) {
        this.id = id
        this.className = className
        this.public = isPublic
    }
}