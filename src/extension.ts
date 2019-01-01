'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ServiceDefintionViewProvider } from './mvc/containerview/ServiceDefintionViewProvider';
import { ContainerStore } from './symfony/ContainerStore';
import { RouteDefinitionViewProvider } from './mvc/containerview/RouteDefinitionViewProvider';
import { FileWatchController } from './mvc/FileWatchController';
import { AutocompleteController } from './mvc/AutocompleteController';
import { ParameterViewProvider } from './mvc/containerview/ParameterViewProvider';
import { ServiceDocumentationCodeActionProvider } from './mvc/editing/codeaction/ServiceDocumentationCodeActionProvider';
import { ServicesCommandController } from './mvc/ServicesCommandController';
import { RoutesCommandController } from './mvc/RoutesCommandController';
import { ParametersCommandController } from './mvc/ParametersCommandController';
import { PHPClassStore } from './php/PHPClassStore';
import { PHPClassesController } from './mvc/PHPClassesController';
import { PHPClassCacheManager } from './php/PHPClassCacheManager';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    let containerStore = new ContainerStore()
    let cacheManager = new PHPClassCacheManager(context.workspaceState)
    let phpClassStore = new PHPClassStore(cacheManager)
    const serviceDefinitionViewProvider = new ServiceDefintionViewProvider()
    const routeDefinitionViewProvider = new RouteDefinitionViewProvider()
    const parameterViewProvider = new ParameterViewProvider()
    containerStore.subscribeListerner(serviceDefinitionViewProvider)
    containerStore.subscribeListerner(routeDefinitionViewProvider)
    containerStore.subscribeListerner(parameterViewProvider)

    vscode.commands.registerCommand('symfony-vscode.refreshContainer', () => containerStore.refreshAll())

    vscode.window.registerTreeDataProvider("serviceDefinitionsView", serviceDefinitionViewProvider)
    let servicesCommandController = new ServicesCommandController(containerStore, serviceDefinitionViewProvider)

    vscode.window.registerTreeDataProvider("routeDefinitionsView", routeDefinitionViewProvider)
    let routesCommandController = new RoutesCommandController(containerStore, routeDefinitionViewProvider)

    vscode.window.registerTreeDataProvider("parametersView", parameterViewProvider)
    let parametersCommandController = new ParametersCommandController(containerStore, parameterViewProvider)

    if(vscode.workspace.getConfiguration("symfony-vscode").get("enableFileWatching")) {
        let fileWatchController = new FileWatchController(containerStore, phpClassStore)
        context.subscriptions.push(fileWatchController)
    }

    let autocompleteController = new AutocompleteController(containerStore, phpClassStore)
    context.subscriptions.push(autocompleteController)

    let serviceDocCodeActionProvider = new ServiceDocumentationCodeActionProvider()
    containerStore.subscribeListerner(serviceDocCodeActionProvider)
    vscode.languages.registerCodeActionsProvider({scheme: "file", language: "php"}, serviceDocCodeActionProvider)

    let phpClassesController = new PHPClassesController(phpClassStore, cacheManager)

    containerStore.refreshAll(() => {
        phpClassStore.refreshAll()
    })
}

// this method is called when your extension is deactivated
export function deactivate() {
}