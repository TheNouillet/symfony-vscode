import { ServiceDefinition } from "./ServiceDefinition";
import { RouteDefinition } from "./RouteDefinition";
import { Parameter } from "./Parameter";

export abstract class AbstractContainerStoreListener
{
    onServicesChanges(servicesDefinitions: ServiceDefinition[]){}
    onRoutesChanges(routesDefinitions: RouteDefinition[]){}
    onParametersChanges(parameters: Parameter[]){}
}