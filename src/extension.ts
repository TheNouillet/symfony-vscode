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
import { ContainerCacheManager } from './symfony/ContainerCacheManager';
import { ComposerJSON } from './symfony/composer/ComposerJSON';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    let composerJson = new ComposerJSON()
    composerJson.initialize().then(composerJson => {
        let symfonyDep = composerJson.getSymfonyDependency()
        if(symfonyDep) {
            let phpClassCacheManager = new PHPClassCacheManager(context.workspaceState)
            let containerCacheManager = new ContainerCacheManager(context.workspaceState)
            let containerStore = new ContainerStore(containerCacheManager, symfonyDep)
            let phpClassStore = new PHPClassStore(phpClassCacheManager)
            const serviceDefinitionViewProvider = new ServiceDefintionViewProvider()
            const routeDefinitionViewProvider = new RouteDefinitionViewProvider()
            const parameterViewProvider = new ParameterViewProvider()
            containerStore.subscribeListerner(serviceDefinitionViewProvider)
            containerStore.subscribeListerner(routeDefinitionViewProvider)
            containerStore.subscribeListerner(parameterViewProvider)
        
            vscode.commands.registerCommand('symfony-vscode.refreshContainer', () => {
                containerStore.clearCacheAndRefreshAll()
            })
        
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
        
            let serviceDocCodeActionProvider = new ServiceDocumentationCodeActionProvider(phpClassStore)
            containerStore.subscribeListerner(serviceDocCodeActionProvider)
            vscode.languages.registerCodeActionsProvider({scheme: "file", language: "php"}, serviceDocCodeActionProvider)
        
            let phpClassesController = new PHPClassesController(phpClassStore)
        
            containerStore.refreshAll().then(() => {
                phpClassStore.refreshAll()
            })
        } else {
            vscode.window.showErrorMessage("No composer.json file with Symfony as dependency detected")
        }
    }).catch(reason => {
        vscode.window.showErrorMessage(reason)
    })
}

// this method is called when your extension is deactivated
export function deactivate() {
}