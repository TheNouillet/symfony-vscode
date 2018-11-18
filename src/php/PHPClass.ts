import * as vscode from "vscode"

export class PHPClass {
    public className: string
    public documentUri: vscode.Uri
    public methods: string[] = []
    protected _classNameArray: string[] = []

    public constructor(className: string, documentUri: vscode.Uri) {
        this.className = className
        this.documentUri = documentUri
        this._classNameArray = this.className.split('\\')
    }

    public addMethod(method: string) {
        this.methods.push(method)
    }

    public isInNamespaceOf(namespace: string): boolean {
        return this._classNameArray.indexOf(namespace) != -1
    }

    public isController(): boolean {
        return this.isInNamespaceOf('Controller')
    }

    get shortClassName(): string {
        return this._classNameArray[this._classNameArray.length - 1]
    }
}