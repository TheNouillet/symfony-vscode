import * as vscode from "vscode"
import { PHPClass } from "../PHPClass";

export interface PHPClassProviderInterface {
    canUpdateAllUris(): boolean
    canUpdateUri(uri: vscode.Uri): boolean
    updateAllUris(): Promise<PHPClass[]>
    updateUri(uri: vscode.Uri): Promise<PHPClass[]>
}