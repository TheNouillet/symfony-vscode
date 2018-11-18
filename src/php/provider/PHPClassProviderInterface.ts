import * as vscode from "vscode"
import { PHPClass } from "../PHPClass";

export interface PHPClassProviderInterface {
    updateAllClasses(): Promise<PHPClass[]>
    updateClass(uri: vscode.Uri): Promise<PHPClass>
}