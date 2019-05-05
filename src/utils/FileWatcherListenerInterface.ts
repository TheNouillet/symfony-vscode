import * as vscode from "vscode"

export interface FileWatcherListenerInterface {
    onFileChanged(uri: vscode.Uri)
}