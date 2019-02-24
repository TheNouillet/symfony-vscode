import * as vscode from "vscode"
import { PHPClassProviderInterface } from "./PHPClassProviderInterface"
import { PHPClass } from "../PHPClass"
import engine from 'php-parser'
import { readFile } from "graceful-fs";
import { PromiseUtils } from "../PromiseUtils";

interface PHPParser {
    parseEval(code: String|Buffer): PHPParser_Item
    parseCode(code: String|Buffer, filename?: String): PHPParser_Item
    tokenGetAll(code: String|Buffer): PHPParser_Item
}

interface PHPParser_Item {
    kind: string
    loc: PHPParser_Location
    name?: string | PHPParser_Item
    children?: Array<PHPParser_Item>
    body?: Array<PHPParser_Item>
}

interface PHPParser_Location {
    start: PHPParser_Position
    end: PHPParser_Position
}

interface PHPParser_Position {
    line: number
    column: number
    offset: number
}

export class ParserPHPClassProvider implements PHPClassProviderInterface {

    protected _engine: PHPParser
    protected _configuration = vscode.workspace.getConfiguration("symfony-vscode")

    constructor() {
        this._engine = new engine({
            parser: {
                php7: true
            },
            ast: {
              withPositions: true
            }
        })
    }

    canUpdateAllUris(): boolean {
        return true
    }

    canUpdateUri(uri: vscode.Uri): boolean {
        return true
    }

    updateAllUris(): Promise<PHPClass[]> {
        return new Promise((resolve, reject) => {
            vscode.workspace.findFiles("**/*.php").then(uris => {
                let ps = []
                uris.forEach(uri => {
                    ps.push(() => this.updateUri(uri))
                })
                PromiseUtils.throttleActions(ps, this._getParserThrottle()).then(phpClassesArray => {
                    let resultArray: PHPClass[] = []
                    phpClassesArray.map(phpClasses => {
                        let filteredArray: PHPClass[] = phpClasses.filter(phpClass => {
                            return phpClass !== null
                        })
                        resultArray = resultArray.concat(filteredArray)
                    })
                    resolve(resultArray)
                }).catch(reason => {
                    reject(reason)
                })
            })
        })
    }

    updateUri(uri: vscode.Uri): Promise<PHPClass[]> {
        return new Promise<PHPClass[]>((resolve) => {
            readFile(uri.path, (err, data) => {
                if(err) {
                    resolve([])
                } else {
                    try {
                        let ast = this._engine.parseCode(data.toString())
                        resolve(this._hydratePHPClass(ast, uri))
                    } catch(e) {
                        resolve([])
                    }
                }
            })
        })
    }

    protected _hydratePHPClass(ast: PHPParser_Item, uri: vscode.Uri): PHPClass[] {
        try {
            let result: PHPClass[] = []
            let children: Array<PHPParser_Item> = ast.children
            children.forEach(rootElement => {
                if(rootElement.kind === "namespace") {
                    let namespace = <string>rootElement.name
                    rootElement.children.forEach(namespaceElement => {
                        if(namespaceElement.kind === "class" || namespaceElement.kind === "interface") {
                            let phpClass: PHPClass = new PHPClass(namespace + '\\' + (<string>namespaceElement.name), uri)
                            namespaceElement.body.forEach(classElement => {
                                if(classElement.kind === "method") {
                                    phpClass.addMethod(<string>(<PHPParser_Item>classElement.name).name)
                                }
                            })
                            phpClass.classPosition = new vscode.Position(
                                namespaceElement.loc.start.line, namespaceElement.loc.start.column
                            )
                            result.push(phpClass)
                        }
                    })
                } else if (rootElement.kind === "class" || rootElement.kind === "interface") {
                    let phpClass: PHPClass = new PHPClass((<string>rootElement.name), uri)
                    rootElement.body.forEach(classElement => {
                        if(classElement.kind === "method") {
                            phpClass.addMethod(<string>(<PHPParser_Item>classElement.name).name)
                        }
                    })
                    phpClass.classPosition = new vscode.Position(
                        rootElement.loc.start.line, rootElement.loc.start.column
                    )
                    result.push(phpClass)
                }
            })
            return result
        } catch (e) {
            return []
        }
    }

    private _getParserThrottle(): number {
        return this._configuration.get("phpParserThrottle")
    }
}