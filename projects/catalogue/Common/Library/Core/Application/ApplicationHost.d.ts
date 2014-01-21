/// <reference path="../Resources/Resources.d.ts" />
/// <reference path="../Types/Url1.d.ts" />
/// <reference path="../CrossDomainMessaging/CrossDomainMessaging.d.ts" />
/// <reference path="Application.d.ts" />
/**
*	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
**/
declare module SDL.Client.Application {
    interface IApplicationHost {
        libraryVersionSupported: boolean;
        activeApplicationEntryPointId: string;
        activeApplicationId: string;
        culture: string;
        isTrusted: boolean;
        applicationEntryPointLoaded(coreVersion?: string, callback?: (data: IApplicationHostData) => void): void;
        exposeApplicationFacade(applicationEntryPointId: string): void;
        exposeApplicationFacadeUnsecure(applicationEntryPointId: string): void;
        applicationEntryPointUnloaded(): void;
        setCulture(culture: string): void;
        resolveCommonLibraryResources(resourceGroupName: string, callback: (resources: Client.Resources.IResolvedResourceGroupResult[]) => void): void;
        getCommonLibraryResources(files: Client.Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: ICommonLibraryResource) => void, onFailure?: (error: string) => void): void;
        getCommonLibraryResource(file: Client.Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void): void;
        setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void;
        setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void;
        setApplicationEntryPointUrlUnsecure(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void;
        callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string): void;
        callApplicationFacadeUnsecure(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string): void;
        initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
            [id: string]: IApplicationDomain;
        }): void;
        resetApplicationSuite(): void;
        addEventListener(event: string, handler: Function): void;
        removeEventListener(event: string, handler: Function): void;
        fireEvent(event: string, eventData?: any): void;
    }
    interface IApplicationHostData {
        applicationHostUrl: string;
        applicationHostCorePath: string;
        applicationSuiteId: string;
        libraryVersionSupported: boolean;
        culture: string;
        activeApplicationEntryPointId: string;
        activeApplicationId: string;
    }
    interface IApplicationDomain {
        domain: string;
        alternativeDomains: string[];
    }
    interface ICommonLibraryResource {
        url: string;
        data: string;
        context?: string;
    }
    class ApplicationHostProxyClass implements IApplicationHost {
        public libraryVersionSupported: boolean;
        public activeApplicationEntryPointId: string;
        public activeApplicationId: string;
        public culture: string;
        public isTrusted: boolean;
        private handlers;
        public setCulture(culture: string): void;
        public applicationEntryPointLoaded(coreVersion?: string, callback?: (data: IApplicationHostData) => void): void;
        public exposeApplicationFacade(applicationEntryPointId: string): void;
        public exposeApplicationFacadeUnsecure(applicationEntryPointId: string): void;
        public applicationEntryPointUnloaded(): void;
        public resolveCommonLibraryResources(resourceGroupName: string, callback: (file: Client.Resources.IResolvedResourceGroupResult[]) => void): void;
        public getCommonLibraryResources(files: Client.Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: ICommonLibraryResource) => void, onFailure?: (error: string) => void): void;
        public getCommonLibraryResource(file: Client.Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void): void;
        public setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void;
        public setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void;
        public setApplicationEntryPointUrlUnsecure(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void;
        public callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string): void;
        public callApplicationFacadeUnsecure(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string): void;
        public initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
            [id: string]: IApplicationDomain;
        }): void;
        public resetApplicationSuite(): void;
        public addEventListener(event: string, handler: Function): void;
        public removeEventListener(event: string, handler: Function): void;
        public fireEvent(eventType: string, eventData?: any): void;
        private call(method, args?, callback?);
        private onHostEvent(e);
        private getWithLocalDomain(domains);
        private _processHandlers(eventObj, handlersCollectionName);
    }
}
