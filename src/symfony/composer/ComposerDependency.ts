import * as vscode from "vscode"

export class ComposerDependency {

    static SYMFONY_FRAMEWORK_DEPS = [
        "symfony/symfony",
        "symfony/framework-bundle",
        "symfony/lts",
        "symfony/flex"
    ]

    static SYMFONY_DI_DEPS = [
        "symfony/dependency-injection"
    ]

    public uri: vscode.Uri
    public dependencyName: string
    public version: string

    constructor(uri: vscode.Uri, dependencyName: string, version: string) {
        this.uri = uri
        this.dependencyName = dependencyName
        this.version = version
    }

    get majorVersion(): number {
        let regExpArray = this.version.match(/\d/)
        if(regExpArray.length > 0) {
            return parseInt(regExpArray[0])
        }
        return null
    }

    public isSymfonyFramework(): boolean {
        return ComposerDependency.SYMFONY_FRAMEWORK_DEPS.indexOf(this.dependencyName) !== -1
    }

    public isSymfonyDI(): boolean {
        return ComposerDependency.SYMFONY_DI_DEPS.indexOf(this.dependencyName) !== -1
    }
}