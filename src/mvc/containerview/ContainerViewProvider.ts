import * as vscode from "vscode"
import { ServiceDefinitionTreeItem } from "./ServiceDefinitionTreeItem";

export class ContainerViewProvider implements vscode.TreeDataProvider<ServiceDefinitionTreeItem> {
    onDidChangeTreeData?: vscode.Event<any>;
    
    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element
    }
    getChildren(element?: any): vscode.ProviderResult<any[]> {
        throw new Error("Method not implemented.");
    }
}