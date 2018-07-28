'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ContainerViewProvider } from './mvc/containerview/ContainerViewProvider';
import { ContainerStore } from './symfony/ContainerStore';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    let containerStore = new ContainerStore()
    const containerViewProvider = new ContainerViewProvider(containerStore)

    containerStore.refresh().then(() => {
        vscode.window.registerTreeDataProvider("containerView", containerViewProvider)
    })
    vscode.commands.registerCommand('symfony-vscode.refreshView', () => containerViewProvider.refresh());
}

// this method is called when your extension is deactivated
export function deactivate() {
}