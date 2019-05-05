import * as vscode from "vscode"
import { ContainerProviderInterface } from "./ContainerProviderInterface";
import { ComposerJSON } from "../composer/ComposerJSON";
import { ServiceDefinition } from "../ServiceDefinition";
import { RouteDefinition } from "../RouteDefinition";
import { Parameter } from "../Parameter";
import { DIDumpFileExtractor } from "./diDump/DIDumpFileExtractor";
import { AbstractContainerProvider } from "./AbstractContainerProvider";

export class DumpContainerProvider extends AbstractContainerProvider implements ContainerProviderInterface {
    
    private _composerJson: ComposerJSON
    private _extractor: DIDumpFileExtractor
    
    constructor(composerJson: ComposerJSON, dumpFileExtractor: DIDumpFileExtractor) {
        super()
        this._composerJson = composerJson
        this._extractor = dumpFileExtractor
    }

    canProvideServiceDefinitions(): boolean {
        return this._composerJson.getSymfonyDIDependency() !== undefined && this._extractor.getDIDumpFileUri() !== null
    }
    canProvideRouteDefinitions(): boolean {
        return false
    }
    canProvideParameters(): boolean {
        return this._composerJson.getSymfonyDIDependency() !== undefined && this._extractor.getDIDumpFileUri() !== null
    }

    provideServiceDefinitions(): Promise<ServiceDefinition[]> {
        return new Promise<ServiceDefinition[]>((resolve, reject) => {
            try {
                this._extractor.extractServices().then(obj => {
                    resolve(this._parseServicesObject(obj))
                }).catch(reason => {
                    reject(reason)
                })
            } catch(e) {
                reject(e)
            }
        })
    }

    provideRouteDefinitions(): Promise<RouteDefinition[]> {
        throw new Error("Method not implemented.");
    }

    provideParameters(): Promise<Parameter[]> {
        return new Promise<Parameter[]>((resolve, reject) => {
            try {
                this._extractor.extractParameters().then(obj => {
                    resolve(this._parseParametersObject(obj))
                }).catch(reason => {
                    reject(reason)
                })
            } catch(e) {
                reject(e)
            }
        })
    }
}