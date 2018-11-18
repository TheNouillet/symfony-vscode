import * as vscode from "vscode"
import { ServiceDefinition } from "../../../symfony/ServiceDefinition";

export class ServiceQuickPickItem implements vscode.QuickPickItem {
    public serviceDefinition: ServiceDefinition

    constructor(serviceDefinition: ServiceDefinition) {
        this.serviceDefinition = serviceDefinition
    }

    get label(): string {
        return this.serviceDefinition.id
    }

    get detail(): string {
        return this.serviceDefinition.className
    }
}