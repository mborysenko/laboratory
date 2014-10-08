/// <reference path="ApplicationHost.d.ts" />
/**
*	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
**/
declare module SDL.Client.Application.ApplicationHostFacade {
    function applicationEntryPointLoaded(libraryVersion?: string, eventHandler?: (e: any) => void, callback?: (data: IApplicationHostData) => void): IApplicationHostData;
    function applicationEntryPointUnloaded(): void;
    function setCulture(culture: string): void;
    function startCaptureDomEvents(events: string[]): void;
    function stopCaptureDomEvents(events?: string[]): void;
    function setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void;
    function setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string, allowedDomains?: string[]): void;
    function callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string, allowedDomains?: string[]): void;
    function storeApplicationData(key: string, data: any): void;
    function storeApplicationSessionData(key: string, data: any): void;
    function getApplicationDataAsync(key: string, callback: (data: any) => void): void;
    function getApplicationData(key: string): any;
    function getApplicationSessionDataAsync(key: string, callback: (data: any) => void): void;
    function getApplicationSessionData(key: string): any;
    function clearApplicationData(): void;
    function clearApplicationSessionData(): void;
    function removeApplicationData(key: string): void;
    function removeApplicationSessionData(key: string): void;
    function resolveCommonLibraryResourcesAsync(resourceGroupName: string, callback?: (result: any) => void): void;
    function resolveCommonLibraryResources(resourceGroupName: string, callback?: (result: any) => void): any;
    function getCommonLibraryResources(files: any, version: string, onFileLoad: (resource: {
        url: string;
        data: string;
    }) => void, onFailure: (error: string) => void): void;
    function getCommonLibraryResource(file: any, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void;
    function triggerAnalyticsEvent(event: string, object: any): void;
}
declare module SDL.Client.ApplicationHost {
    var ApplicationHostFacade: any;
}
