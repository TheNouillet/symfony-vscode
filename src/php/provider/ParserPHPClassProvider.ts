import * as vscode from "vscode"
import { PHPClassProviderInterface } from "./PHPClassProviderInterface"
import { PHPClass } from "../PHPClass"
import engine from 'php-parser'
import { readFile } from "graceful-fs";

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

    updateAllClasses(): Promise<PHPClass[]> {
        return new Promise((resolve, reject) => {
            let promises: Promise<PHPClass>[] = []
            vscode.workspace.findFiles("**/*.php").then(uris => {
                uris.forEach(uri => {
                    promises.push(this.updateClass(uri))
                })
                Promise.all(promises).then(phpClasses => {
                    resolve(phpClasses.filter((phpClass => {
                        return phpClass !== null
                    })))
                }).catch(reason => {
                    reject(reason)
                })
            })
        })
    }

    updateClass(uri: vscode.Uri): Promise<PHPClass> {
        return new Promise<PHPClass>((resolve) => {
            readFile(uri.path, (err, data) => {
                if(err) {
                    console.error(err)
                    resolve(null)
                } else {
                    try {
                        let ast = this._engine.parseCode(data.toString())
                        resolve(this._hydratePHPClass(ast, uri))
                    } catch(e) {
                        console.error(e)
                        resolve(null)
                    }
                }
            })
        })
    }

    protected _hydratePHPClass(ast: PHPParser_Item, uri: vscode.Uri): PHPClass {
        try {
            let result: PHPClass = null
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
                            result = phpClass
                        }
                    })
                }
            })
            return result
        } catch (e) {
            return null
        }
    }
}