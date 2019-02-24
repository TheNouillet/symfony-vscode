import { AbstractServiceDefinitionProvider } from "./AbstractServiceDefinitionProvider";
import { ServiceDefinition } from "../../../symfony/ServiceDefinition";

export class PHPServiceDefinitionProvider extends AbstractServiceDefinitionProvider {
    acceptServiceDefinition(hoveredWord: string, serviceDefinition: ServiceDefinition): boolean {
        if(serviceDefinition.isServiceIdAClassName()) {
            return false
        } else {
            return hoveredWord === serviceDefinition.id
        }
    }
}