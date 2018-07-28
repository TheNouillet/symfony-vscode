import { ServiceDefinition } from "./ServiceDefinition";
import { ContainerProviderInterface } from "./provider/ContainerProviderInterface";
import { DummyProvider } from "./provider/DummyProvider";

export class ContainerStore {
    private _containerProvider: ContainerProviderInterface = new DummyProvider()
    private _serviceDefinitionStore: ServiceDefinition[] = []

    constructor() {
        this.refresh()
    }

    refresh() {
        this._serviceDefinitionStore = this._containerProvider.provideServiceDefinitions()
    }

    get serviceDefinitionList(): ServiceDefinition[] {
        return this._serviceDefinitionStore
    }
}