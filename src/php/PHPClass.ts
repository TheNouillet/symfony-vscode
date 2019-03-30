import * as vscode from "vscode"
import { PHPUse } from "./PHPUse";

export class PHPClass {
    public className: string
    public documentUri: vscode.Uri
    public methods: string[] = []
    public classPosition: vscode.Position
    public uses: PHPUse[] = []
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

    static fromJSON(jsonPhpClass: PHPClass): PHPClass {
        let uri = vscode.Uri.file(jsonPhpClass.documentUri.path)
        let position = new vscode.Position(jsonPhpClass.classPosition.line, jsonPhpClass.classPosition.character)
        let phpClass = new PHPClass(jsonPhpClass.className, uri)
        phpClass.classPosition = position
        jsonPhpClass.methods.forEach(method => {
            phpClass.addMethod(method)
        })
        jsonPhpClass.uses.forEach(use => {
            phpClass.uses.push(new PHPUse(use.className, use.alias))
        })

        return phpClass
    }
}