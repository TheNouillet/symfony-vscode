import * as vscode from "vscode"

export interface DIDumpFileParserInterface {
    getFileFormat(): string
    extractServices(uri: vscode.Uri): Promise<Object>
    extractParameters(uri: vscode.Uri): Promise<Object>
}