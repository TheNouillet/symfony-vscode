export class ServiceDefinition {
    private _id: string
    private _className: string
    private _public: boolean

    constructor(id: string, className: string, isPublic: boolean) {
        this.id = id
        this.className = className
        this.isPublic = isPublic
    }

    get id() {
        return this._id
    }
    set id(newId) {
        this._id = newId
    }

    get className() {
        return this._className
    }
    set className(newClassName) {
        this._className = newClassName
    }

    get isPublic() {
        return this._public
    }
    set isPublic(newIsPublic) {
        this._public = newIsPublic
    }
}