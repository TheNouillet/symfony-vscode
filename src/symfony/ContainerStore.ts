import { ServiceDefinition } from "./ServiceDefinition";

export class ContainerStore {
    get serviceDefinitionList() {
        let result : ServiceDefinition[] = []
        console.log("serviceDefinitionList()")

        result.push(new ServiceDefinition('foo', '\\Foo', false))
        result.push(new ServiceDefinition('bar', '\\Bar', false))
        result.push(new ServiceDefinition('foo.bar', '\\Foo\\Bar', true))
        result.push(new ServiceDefinition('form.type.form', 'Symfony\\Component\\Form\\Extension\\Core\\Type\\FormType', false))

        return result
    }
}