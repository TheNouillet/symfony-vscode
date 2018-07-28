import { ContainerProviderInterface } from "./ContainerProviderInterface";
import { ServiceDefinition } from "../ServiceDefinition";
import { spawn, execSync, ExecSyncOptions } from "child_process";

class CommandOptions implements ExecSyncOptions {
    cwd: string = ""
    constructor(rootDirectory: string) {
        this.cwd = rootDirectory
    }
}

export class ConsoleProvider implements ContainerProviderInterface {
    provideServiceDefinitions(): ServiceDefinition[] {
        let result: ServiceDefinition[] = []

        const cmd = this._getPhpExecutablePath() + " " + this._getExecutablePath() + " debug:container --show-private --format=json"
        let buffer = execSync(cmd, new CommandOptions(this._getRootDirectory())).toString()
        let obj = JSON.parse(buffer)
        if(obj.definitions !== undefined) {
            Object.keys(obj.definitions).forEach(key => {
                result.push(new ServiceDefinition(key, obj.definitions[key].class, obj.definitions[key].public))
            })
        }

        return result
    }

    private _getRootDirectory(): string {
        return "/home/axel/projets/ezplatform2"
    }

    private _getExecutablePath(): string {
        return "bin/console"
    }

    private _getPhpExecutablePath(): string {
        return "/usr/bin/php7.1"
    }
}