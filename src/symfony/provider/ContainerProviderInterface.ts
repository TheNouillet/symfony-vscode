import { ServiceDefinition } from "../ServiceDefinition";

export interface ContainerProviderInterface {
    provideServiceDefinitions(): ServiceDefinition[]
}