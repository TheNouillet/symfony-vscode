import { ContainerProviderInterface } from "./ContainerProviderInterface";
import { ServiceDefinition } from "../ServiceDefinition";

export class DummyProvider implements ContainerProviderInterface {
    provideServiceDefinitions(): ServiceDefinition[] {
        let result : ServiceDefinition[] = []
        console.log("Dummy is providing...")

        result.push(new ServiceDefinition('foo', '\\Foo', false))
        result.push(new ServiceDefinition('bar', '\\Bar', false))
        result.push(new ServiceDefinition('foo.bar', '\\Foo\\Bar', true))
        result.push(new ServiceDefinition('form.type.form', 'Symfony\\Component\\Form\\Extension\\Core\\Type\\FormType', false))

        return result
    }
}