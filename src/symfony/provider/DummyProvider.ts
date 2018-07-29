import { ContainerProviderInterface } from "./ContainerProviderInterface";
import { ServiceDefinition } from "../ServiceDefinition";
import { RouteDefinition } from "../RouteDefinition";

export class DummyProvider implements ContainerProviderInterface {
    provideServiceDefinitions(): Promise<ServiceDefinition[]> {
        return new Promise(resolve => {
            let result: ServiceDefinition[] = []
            console.log("Dummy is providing...")
    
            result.push(new ServiceDefinition('foo', '\\Foo', false, null))
            result.push(new ServiceDefinition('bar', '\\Bar', false, null))
            result.push(new ServiceDefinition('foo.bar', '\\Foo\\Bar', true, null))
            result.push(new ServiceDefinition('form.type.form', 'Symfony\\Component\\Form\\Extension\\Core\\Type\\FormType', false, null))
    
            resolve(result)
        })
    }

    provideRouteDefinitions(): Promise<RouteDefinition[]> {
        return new Promise(resolve => {
            let result: RouteDefinition[] = []
            console.log("Dummy is providing...")
    
            result.push(new RouteDefinition('foo', '/foo', "GET", "AppBundle:Default:index"))
            result.push(new RouteDefinition('bar', '/bar', "GET", "AppBundle:Default:bar"))
            result.push(new RouteDefinition('foo.bar', '/foo/bar/{slug}', "GET", "AppBundle:Default:getBlog"))
            result.push(new RouteDefinition('fos_js_routing_js', '/js/routing.{_format}', "GET", "fos_js_routing.controller:indexAction"))
    
            resolve(result)
        })
    }
}