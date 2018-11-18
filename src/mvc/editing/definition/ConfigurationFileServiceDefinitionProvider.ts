import { AbstractServiceDefinitionProvider } from "./AbstractServiceDefinitionProvider";
import { ServiceDefinition } from "../../../symfony/ServiceDefinition";

export class ConfigurationFileServiceDefinitionProvider extends AbstractServiceDefinitionProvider {
    acceptServiceDefinition(hoveredWord: string, serviceDefinition: ServiceDefinition): boolean {
        return hoveredWord === serviceDefinition.id || hoveredWord === serviceDefinition.className
    }
}