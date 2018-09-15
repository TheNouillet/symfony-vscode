'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ServiceDefintionViewProvider } from './mvc/containerview/ServiceDefintionViewProvider';
import { ContainerStore } from './symfony/ContainerStore';
import { RouteDefintionViewProvider } from './mvc/containerview/RouteDefinitionViewProvider';
import { FileWatchController } from './mvc/FileWatchController';
import { AutocompleteController } from './mvc/AutocompleteController';
import { ParameterViewProvider } from './mvc/containerview/ParameterViewProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    let containerStore = new ContainerStore()
    const serviceDefinitionViewProvider = new ServiceDefintionViewProvider(containerStore)
    const routeDefinitionViewProvider = new RouteDefintionViewProvider(containerStore)
    const parameterViewProvider = new ParameterViewProvider(containerStore)

    vscode.commands.registerCommand('symfony-vscode.refreshContainer', () => containerStore.refreshAll())

    vscode.window.registerTreeDataProvider("serviceDefinitionsView", serviceDefinitionViewProvider)
    vscode.commands.registerCommand('symfony-vscode.refreshServiceDefinitions', () => containerStore.refreshServiceDefinitions())
    vscode.commands.registerCommand('symfony-vscode.toggleClassDisplay', () => serviceDefinitionViewProvider.toggleClassDisplay())

    vscode.window.registerTreeDataProvider("routeDefinitionsView", routeDefinitionViewProvider)
    vscode.commands.registerCommand('symfony-vscode.refreshRouteDefinitions', () => containerStore.refreshRouteDefinitions())
    vscode.commands.registerCommand('symfony-vscode.togglePathDisplay', () => routeDefinitionViewProvider.togglePathsDisplay())

    vscode.window.registerTreeDataProvider("parametersView", parameterViewProvider)
    vscode.commands.registerCommand('symfony-vscode.refreshParameters', () => containerStore.refreshParameters())

    if(vscode.workspace.getConfiguration("symfony-vscode").get("enableFileWatching")) {
        let fileWatchController = new FileWatchController(containerStore)
        context.subscriptions.push(fileWatchController)
    }

    let autocompleteController = new AutocompleteController(containerStore)
    context.subscriptions.push(autocompleteController)

    containerStore.refreshAll()
}

// this method is called when your extension is deactivated
export function deactivate() {
}