import { ServiceDefinition } from "../../symfony/ServiceDefinition";
import { ServiceDefinitionTreeItem } from "./ServiceDefinitionTreeItem";
import { AbstractContainerViewProvider } from "./AbstractContainerViewProvider";
import { AbstractContainerTreeItem } from "./AbstractContainerTreeItem";

export class ServiceDefintionViewProvider extends AbstractContainerViewProvider {
    private _servicesDefinitions: ServiceDefinition[] = []
    private _displayClasses: boolean = false

    constructor() {
        super()
    }

    onServicesChanges(servicesDefinitions: ServiceDefinition[]) {
        this._servicesDefinitions = servicesDefinitions
        this._onDidChangeTreeData.fire()
    }

    toggleClassDisplay(): void {
        this._displayClasses = !this._displayClasses
        this._onDidChangeTreeData.fire()
    }

    getTreeItems(): AbstractContainerTreeItem[] {
        let treeItems: ServiceDefinitionTreeItem[] = []

        this._servicesDefinitions.forEach(serviceDefinition => {
            if(this.acceptSearchable(serviceDefinition)) {
                treeItems.push(new ServiceDefinitionTreeItem(serviceDefinition, this._displayClasses))
            }
        });

        return treeItems
    }
}