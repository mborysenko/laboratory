/// <reference path="ApplicationHost.d.ts" />
declare module SDL.Client.ApplicationHost.ApplicationHostFacade {
    function applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: Client.Event.Event) => void): Client.Application.IApplicationHostData;
    function exposeApplicationFacade(applicationEntryPointId: string): void;
    function applicationEntryPointUnloaded(): void;
    function setCulture(culture: string): void;
    function setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationId?: string): void;
    function setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationId?: string, allowedDomains?: string[]): void;
    function callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationId?: string, allowedDomains?: string[]): void;
    function initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
        [id: string]: Client.Application.IApplicationDomain;
    }): void;
    function resetApplicationSuite(): void;
    function resolveCommonLibraryResources(resourceGroupName: string): Client.Resources.IResolvedResourceGroupResult[];
    function getCommonLibraryResources(files: Client.Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {
        url: string;
        data: string;
    }) => void, onFailure: (error: string) => void): void;
    function getCommonLibraryResource(file: Client.Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void;
}
