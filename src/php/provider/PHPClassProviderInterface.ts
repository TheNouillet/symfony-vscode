import * as vscode from "vscode"
import { PHPClass } from "../PHPClass";

export interface PHPClassProviderInterface {
    canUpdateAllClasses(): boolean
    canUpdateClass(uri: vscode.Uri): boolean
    updateAllClasses(): Promise<PHPClass[]>
    updateClass(uri: vscode.Uri): Promise<PHPClass>
}