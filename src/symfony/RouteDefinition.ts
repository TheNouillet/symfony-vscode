export class RouteDefinition {
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
}