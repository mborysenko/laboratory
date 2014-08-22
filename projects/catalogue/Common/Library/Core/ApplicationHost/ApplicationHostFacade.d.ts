/// <reference path="ApplicationHost.d.ts" />
declare module SDL.Client.ApplicationHost.ApplicationHostFacade {
    function applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: Event.Event) => void): Application.IApplicationHostData;
    function exposeApplicationFacade(applicationEntryPointId: string): void;
    function applicationEntryPointUnloaded(): void;
    function setCulture(culture: string): void;
    function startCaptureDomEvents(events: string[]): void;
    function stopCaptureDomEvents(events?: string[]): void;
    function setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void;
    function setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string, allowedDomains?: string[]): void;
    function callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string, allowedDomains?: string[]): void;
    function initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
        [id: string]: Application.IApplicationDomain;
    }): void;
    function resetApplicationSuite(): void;
    function updateTargetDisplayUrl(url: string, caller?: ICallerSignature): void;
    function storeApplicationData(key: string, data: any): void;
    function storeApplicationSessionData(key: string, data: any): void;
    function getApplicationData(key: string): any;
    function getApplicationSessionData(key: string): any;
    function clearApplicationData(): void;
    function clearApplicationSessionData(): void;
    function removeApplicationData(key: string): void;
    function removeApplicationSessionData(key: string): void;
    function resolveCommonLibraryResources(resourceGroupName: string): Resources.IResolvedResourceGroupResult[];
    function getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {
        url: string;
        data: string;
    }) => void, onFailure: (error: string) => void): void;
    function getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void;
    function triggerAnalyticsEvent(event: string, object: any): void;
    function _expose(): void;
}
