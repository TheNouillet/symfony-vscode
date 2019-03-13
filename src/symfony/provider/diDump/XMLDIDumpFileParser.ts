import * as vscode from "vscode"
import * as fs from "graceful-fs"
import {parseString as xmlParse} from "xml2js"

import { DIDumpFileParserInterface } from "./DIDumpFileParserInterface";
import { DIDumpFileExtractor } from "./DIDumpFileExtractor";

export class XMLDIDumpFileParser implements DIDumpFileParserInterface {
    getFileFormat(): string {
        return DIDumpFileExtractor.XML_DUMP_FILE_FORMAT
    }
    extractServices(uri: vscode.Uri): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            this._parseXml(uri).then(parsingResult => {
                try {
                    let result = {
                        definitions: {},
                        aliases: {}
                    }
                    let servicesObjects = parsingResult['container']['services'][0]['service']

                    servicesObjects.forEach(serviceObject => {
                        let resultingObject = {}
                        let isAlias = false
                        resultingObject['id'] = serviceObject['$']['id']
                        if(serviceObject['$']['alias'] !== undefined) {
                            isAlias = true
                            resultingObject['alias'] = serviceObject['$']['alias']
                        } else {
                            if(serviceObject['$']['class'] !== undefined) {
                                resultingObject['class'] = serviceObject['$']['class']
                            } else {
                                resultingObject['class'] = ""
                            }
                        }
                        if(serviceObject['$']['public'] !== undefined) {
                            resultingObject['public'] = serviceObject['$']['public'] === "true"
                        } else {
                            resultingObject['public'] = false
                        }

                        result[isAlias ? 'aliases' : 'definitions'][resultingObject['id']] = resultingObject
                    })

                    resolve(result)
                } catch(e) {
                    reject(e)
                }
            }).catch(reason => {
                reject(reason)
            })
        })
    }
    extractParameters(uri: vscode.Uri): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            this._parseXml(uri).then(parsingResult => {
                try {
                    let result = {}
                    let parametersObjects = parsingResult['container']['parameters'][0]['parameter']

                    parametersObjects.forEach(parameterObject => {
                        if(parameterObject['$']['key'] !== undefined) {
                            let key = parameterObject['$']['key']
                            if(parameterObject['_'] !== undefined) {
                                let value = parameterObject['_']
                                if(value === "true") {
                                    result[key] = true
                                } else if(value === "false") {
                                    result[key] = false
                                } else {
                                    result[key] = value
                                }
                            } else if(Array.isArray(parameterObject['parameter'])) {
                                result[key] = []
                            } else {
                                result[key] = ""
                            }
                        }
                    })

                    resolve(result)
                } catch(e) {
                    reject(e)
                }
            }).catch(reason => {
                reject(reason)
            })
        })
    }
    
    protected _parseXml(uri: vscode.Uri): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            fs.readFile(uri.fsPath, (err, data) => {
                if(err) {
                    reject(err)
                } else {
                    try {
                        xmlParse(data, (err, result) => {
                            if(err) {
                                reject(err)
                            } else {
                                resolve(result)
                            }
                        })
                    } catch(e) {
                        reject(e.message)
                    }
                }
            })
        })
    }
}