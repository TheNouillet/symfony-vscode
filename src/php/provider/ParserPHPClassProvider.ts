import * as vscode from "vscode"
import { PHPClassProviderInterface } from "./PHPClassProviderInterface"
import { PHPClass } from "../PHPClass"
import engine from 'php-parser'
import { readFile } from "graceful-fs";
import { PromiseUtils } from "../PromiseUtils";
import { PHPUse } from "../PHPUse";

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
    items?: Array<PHPParser_UseItem>
    body?: Array<PHPParser_Item>
}

interface PHPParser_UseItem {
    kind: string
    name: string
    alias?: string
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
            let nextElementsToProcess: Array<PHPParser_Item> = children
            let currentElement: PHPParser_Item = null
            let currentNamespace: String = null
            let uses: PHPUse[] = []
            while(nextElementsToProcess.length > 0) {
                currentElement = nextElementsToProcess.shift()
                if(currentElement.kind === "namespace") {
                    currentNamespace = <string>currentElement.name
                    nextElementsToProcess = currentElement.children
                }
                if(currentElement.kind === "usegroup") {
                    uses = uses.concat(this._processUseGroup(currentElement))
                }
                if(currentElement.kind === "class" || currentElement.kind === "interface") {
                    result.push(this._processClass(currentElement, uri, currentNamespace))
                }
            }

            result.forEach(phpClass => {
                phpClass.uses = uses
            })

            return result
        } catch (e) {
            return []
        }
    }

    protected _processClass(element: PHPParser_Item, uri: vscode.Uri, namespace?: String): PHPClass {
        let fullName = <string>element.name
        if(namespace) {
            fullName = namespace + '\\' + fullName
        }
        let phpClass = new PHPClass(fullName, uri)
        element.body.forEach(classElement => {
            if(classElement.kind === "method") {
                phpClass.addMethod(<string>(<PHPParser_Item>classElement.name).name)
            }
        })
        phpClass.classPosition = new vscode.Position(
            element.loc.start.line, element.loc.start.column
        )
        return phpClass
    }

    protected _processUseGroup(element: PHPParser_Item): PHPUse[] {
        let result: PHPUse[] = []

        element.items.forEach(item => {
            result.push(new PHPUse(item.name, item.alias))
        })

        return result
    }

    private _getParserThrottle(): number {
        return this._configuration.get("phpParserThrottle")
    }
}