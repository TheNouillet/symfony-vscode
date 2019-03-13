import * as vscode from "vscode"
import * as fs from "fs"
import { DIDumpFileParserInterface } from "./DIDumpFileParserInterface";
import { XMLDIDumpFileParser } from "./XMLDIDumpFileParser";
import { ComposerJSON } from "../../composer/ComposerJSON";

export class DIDumpFileExtractor {

    static XML_DUMP_FILE_FORMAT = "xml"
    static YAML_DUMP_FILE_FORMAT = "yaml"
    static PHP_DUMP_FILE_FORMAT = "php"
    static UNKOWN_DUMP_FILE_FORMAT = "unknown"

    protected _parsers: DIDumpFileParserInterface[] = []
    protected _configuration = vscode.workspace.getConfiguration("symfony-vscode")
    protected _composerJson: ComposerJSON

    constructor(composerJson: ComposerJSON) {
        this._parsers.push(new XMLDIDumpFileParser())
        this._composerJson = composerJson
    }

    getDIDumpFileUri(): vscode.Uri {
        if(this._getDIDumpFileConfiguration() && fs.existsSync(this._getDIDumpFileConfiguration())) {
            return vscode.Uri.file(this._getDIDumpFileConfiguration())
        } else if(vscode.workspace.workspaceFolders !== undefined) {
            let diDep = this._composerJson.getSymfonyDIDependency()
            if(diDep) {
                let relativePath: string = ""
                switch (diDep.majorVersion) {
                    case 2:
                        relativePath = "/app/cache/dev/appDevDebugProjectContainer.xml"
                        break;
                    case 3:
                        relativePath = "/var/cache/dev/appDevDebugProjectContainer.xml"
                        break;
                    default:
                        relativePath = "/var/cache/dev/srcApp_KernelDevDebugContainer.xml"
                        break;
                }
                if(!fs.existsSync(diDep.uri.fsPath + relativePath)) {
                    throw "Cannot find dependency injection dump file";
                }
                return vscode.Uri.file(diDep.uri.fsPath + relativePath)
            } else {
                throw "Cannot find dependency injection dump file";
            }
        }
    }

    extractServices(): Promise<Object> {
        let adaptedParser = this._getAdaptedParser()
        if(adaptedParser) {
            return adaptedParser.extractServices(this.getDIDumpFileUri())
        } else {
            throw "No adapted parser available to extract services"
        }
    }

    extractParameters(): Promise<Object> {
        let adaptedParser = this._getAdaptedParser()
        if(adaptedParser) {
            return adaptedParser.extractParameters(this.getDIDumpFileUri())
        } else {
            throw "No adapted parser available to extract parameters"
        }
    }

    protected _getDIDumpFileFormat(): string {
        let dumpFileExtension = this.getDIDumpFileUri().fsPath.split('.').pop().toLowerCase()
        if(dumpFileExtension === "xml") {
            return DIDumpFileExtractor.XML_DUMP_FILE_FORMAT
        } else if(dumpFileExtension === "yml" || dumpFileExtension === "yaml") {
            return DIDumpFileExtractor.YAML_DUMP_FILE_FORMAT
        } else if(dumpFileExtension === "php") {
            return DIDumpFileExtractor.PHP_DUMP_FILE_FORMAT
        } else {
            return DIDumpFileExtractor.UNKOWN_DUMP_FILE_FORMAT
        }
    }
    protected _getDIDumpFileConfiguration(): string {
        return this._configuration.get('dumpFilePath')
    }
    protected _getAdaptedParser(): DIDumpFileParserInterface {
        let adaptedParser: DIDumpFileParserInterface = null
        this._parsers.forEach(parser => {
            if(parser.getFileFormat() === this._getDIDumpFileFormat()) {
                adaptedParser = parser
            }
        });
        return adaptedParser
    }
}