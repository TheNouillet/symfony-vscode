import { ServiceDefinition } from "./ServiceDefinition";
import { ContainerProviderInterface } from "./provider/ContainerProviderInterface";
import { ConsoleProvider } from "./provider/ConsoleProvider";

export class ContainerStore {
    private _containerProvider: ContainerProviderInterface = new ConsoleProvider()
    private _serviceDefinitionStore: ServiceDefinition[] = []

    constructor() {
        this.refresh()
    }

    refresh(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._containerProvider.provideServiceDefinitions().then(servicesDefinitions => {
                this._serviceDefinitionStore = servicesDefinitions
                resolve()
            }).catch(reason => reject(reason))
        })
    }

    get serviceDefinitionList(): ServiceDefinition[] {
        return this._serviceDefinitionStore
    }
}