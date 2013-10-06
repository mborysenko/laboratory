/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Types/ObjectWithEvents.d.ts" />
/// <reference path="../Resources/ResourceManager.d.ts" />
/// <reference path="../Resources/FileResourceHandler.d.ts" />
/// <reference path="../CrossDomainMessaging/CrossDomainMessaging.d.ts" />
declare module SDL.Client.Application {
    interface IApplicationHost extends Client.Types.IObjectWithEvents {
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
        resolveCommonLibraryResources(resourceGroupName: string, onSuccess: (resources: Client.Resources.IResolvedResourceGroupResult[]) => void): void;
        getCommonLibraryResources(files: Client.Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {
            url: string;
            data: string;
        }) => void, onFailure: (error: string) => void): void;
        getCommonLibraryResource(file: Client.Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void;
        setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationId?: string): void;
        setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationId?: string): void;
        setApplicationEntryPointUrlUnsecure(applicationEntryPointId: string, url: string, applicationId?: string): void;
        callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationId?: string): void;
        callApplicationFacadeUnsecure(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationId?: string): void;
        initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
            [id: string]: IApplicationDomain;
        }): void;
        resetApplicationSuite(): void;
    }
    interface IApplicationHostData {
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
    class ApplicationHostProxyClass extends Client.Types.ObjectWithEvents implements IApplicationHost {
        public libraryVersionSupported: boolean;
        public activeApplicationEntryPointId: string;
        public activeApplicationId: string;
        public culture: string;
        public isTrusted: boolean;
        public setCulture(culture: string): void;
        public applicationEntryPointLoaded(coreVersion?: string, callback?: (data: IApplicationHostData) => void): void;
        public exposeApplicationFacade(applicationEntryPointId: string): void;
        public exposeApplicationFacadeUnsecure(applicationEntryPointId: string): void;
        public applicationEntryPointUnloaded(): void;
        public resolveCommonLibraryResources(resourceGroupName: string, onSuccess: (file: Client.Resources.IResolvedResourceGroupResult[]) => void): void;
        public getCommonLibraryResources(files: Client.Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {
            url: string;
            data: string;
        }) => void, onFailure: (error: string) => void): void;
        public getCommonLibraryResource(file: Client.Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void;
        public setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationId?: string): void;
        public setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationId?: string): void;
        public setApplicationEntryPointUrlUnsecure(applicationEntryPointId: string, url: string, applicationId?: string): void;
        public callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationId?: string): void;
        public callApplicationFacadeUnsecure(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationId?: string): void;
        public initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
            [id: string]: IApplicationDomain;
        }): void;
        public resetApplicationSuite(): void;
        private call(method, args?, callback?);
        private onHostEvent(e);
        private getWithLocalDomain(domains);
    }
}
