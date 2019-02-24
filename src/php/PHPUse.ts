export class PHPUse {
    public className: string
    public alias: string

    constructor(className: string, alias?: string) {
        this.className = className
        this.alias = alias
    }

    get shortName(): string {
        if(this.alias) {
            return this.alias
        } else {
            return this.className.split('\\').pop()
        }
    }
}