'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ServiceDefintionViewProvider } from './mvc/containerview/ServiceDefintionViewProvider';
import { ContainerStore } from './symfony/ContainerStore';
import { RouteDefintionViewProvider } from './mvc/containerview/RouteDefinitionViewProvider';
import { FileWatchController } from './mvc/FileWatchController';
import { AutocompleteController } from './mvc/AutocompleteController';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    let containerStore = new ContainerStore()
    const serviceDefinitionViewProvider = new ServiceDefintionViewProvider(containerStore)
    const routeDefinitionViewProvider = new RouteDefintionViewProvider(containerStore)

    vscode.window.registerTreeDataProvider("serviceDefinitionsView", serviceDefinitionViewProvider)
    vscode.commands.registerCommand('symfony-vscode.refreshServiceDefinitionsView', () => serviceDefinitionViewProvider.refresh());
    vscode.commands.registerCommand('symfony-vscode.toggleClassDisplay', () => serviceDefinitionViewProvider.toggleClassDisplay());

    vscode.window.registerTreeDataProvider("routeDefinitionsView", routeDefinitionViewProvider)
    vscode.commands.registerCommand('symfony-vscode.refreshRouteDefinitionsView', () => routeDefinitionViewProvider.refresh());
    vscode.commands.registerCommand('symfony-vscode.togglePathDisplay', () => routeDefinitionViewProvider.togglePathsDisplay());

    if(vscode.workspace.getConfiguration("symfony-vscode").get("enableFileWatching")) {
        let fileWatchController = new FileWatchController(serviceDefinitionViewProvider, routeDefinitionViewProvider)
        context.subscriptions.push(fileWatchController)
    }

    let autocompleteController = new AutocompleteController(containerStore)
    context.subscriptions.push(autocompleteController)
}

// this method is called when your extension is deactivated
export function deactivate() {
}