import { ServiceDefinition } from "../ServiceDefinition";
import { RouteDefinition } from "../RouteDefinition";
import { Parameter } from "../Parameter";

export interface ContainerProviderInterface {
    canProvideServiceDefinitions(): boolean
    canProvideRouteDefinitions(): boolean
    canProvideParameters(): boolean
    provideServiceDefinitions(): Promise<ServiceDefinition[]>
    provideRouteDefinitions(): Promise<RouteDefinition[]>
    provideParameters(): Promise<Parameter[]>
}