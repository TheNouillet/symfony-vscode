import { ServiceDefinition } from "../ServiceDefinition";
import { RouteDefinition } from "../RouteDefinition";

export interface ContainerProviderInterface {
    provideServiceDefinitions(): Promise<ServiceDefinition[]>
    provideRouteDefinitions(): Promise<RouteDefinition[]>
}