/// <reference path="ApplicationHost.d.ts" />
declare module SDL.Client.ApplicationHost {
    class ApplicationHostFacadeClass {
        public supportedMethods: {
            [method: string]: boolean;
        };
        constructor();
        public applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: Event.Event) => void): Application.IApplicationHostData;
        public exposeApplicationFacade(applicationEntryPointId: string): void;
        public applicationEntryPointUnloaded(): void;
        public setCulture(culture: string): void;
        public startCaptureDomEvents(events: string[]): void;
        public stopCaptureDomEvents(events?: string[]): void;
        public setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void;
        public setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string, allowedDomains?: string[]): void;
        public callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string, allowedDomains?: string[]): void;
        public initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
            [id: string]: Application.IApplicationDomain;
        }): void;
        public resetApplicationSuite(): void;
        public updateTargetDisplayUrl(url: string, caller?: ICallerSignature): void;
        public storeApplicationData(key: string, data: any): void;
        public storeApplicationSessionData(key: string, data: any): void;
        public getApplicationData(key: string): any;
        public getApplicationDataAsync(key: string, callback: (data: any) => void): void;
        public getApplicationSessionData(key: string): any;
        public getApplicationSessionDataAsync(key: string, callback: (data: any) => void): void;
        public clearApplicationData(): void;
        public clearApplicationSessionData(): void;
        public removeApplicationData(key: string): void;
        public removeApplicationSessionData(key: string): void;
        public resolveCommonLibraryResources(resourceGroupName: string): Resources.IResolvedResourceGroupResult[];
        public resolveCommonLibraryResourcesAsync(resourceGroupName: string, callback: (result: Resources.IResolvedResourceGroupResult[]) => void): void;
        public getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {
            url: string;
            data: string;
        }) => void, onFailure: (error: string) => void): void;
        public getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void;
        public triggerAnalyticsEvent(event: string, object: any): void;
        public showTopBar(): void;
        public setTopBarOptions(options: any): void;
    }
}
