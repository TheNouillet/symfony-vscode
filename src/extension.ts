'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ServiceDefintionViewProvider } from './mvc/containerview/ServiceDefintionViewProvider';
import { ContainerStore } from './symfony/ContainerStore';
import { RouteDefintionViewProvider } from './mvc/containerview/RouteDefinitionViewProvider';
import { FileWatchController } from './mvc/containerview/FileWatchController';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    let containerStore = new ContainerStore()
    const serviceDefinitionViewProvider = new ServiceDefintionViewProvider(containerStore)
    const routeDefinitionViewProvider = new RouteDefintionViewProvider(containerStore)

    containerStore.refreshServiceDefinitions().then(() => {
        vscode.window.registerTreeDataProvider("serviceDefinitionsView", serviceDefinitionViewProvider)
    })
    vscode.commands.registerCommand('symfony-vscode.refreshServiceDefinitionsView', () => serviceDefinitionViewProvider.refresh());

    containerStore.refreshRouteDefinitions().then(() => {
        vscode.window.registerTreeDataProvider("routeDefinitionsView", routeDefinitionViewProvider)
    })
    vscode.commands.registerCommand('symfony-vscode.refreshRouteDefinitionsView', () => routeDefinitionViewProvider.refresh());

    let fileWatchController = new FileWatchController(serviceDefinitionViewProvider, routeDefinitionViewProvider)

    context.subscriptions.push(fileWatchController)
}

// this method is called when your extension is deactivated
export function deactivate() {
}