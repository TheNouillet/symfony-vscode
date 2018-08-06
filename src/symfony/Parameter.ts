export class Parameter {
    public name: string
    public value: string

    constructor(name: string, value: string) {
        this.name = name

        if (value === null) {
            this.value = "null"
        } else if (typeof value === "number" || typeof value === "string") {
            this.value = value
        } else if (typeof value === "boolean") {
            this.value = value ? "true" : "false"
        } else if (typeof value === "object" && Array.isArray(value)) {
            this.value = "array"
        } else {
            this.value = typeof value
        }
    }
}