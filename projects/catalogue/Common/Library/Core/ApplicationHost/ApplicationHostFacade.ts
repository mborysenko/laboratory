/// <reference path="ApplicationHost.ts" />
module SDL.Client.ApplicationHost.ApplicationHostFacade
{
	var supportedMethods: {[method: string]: boolean} = {};

	export function applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: Client.Event.Event) => void): Application.IApplicationHostData
	{
		return SDL.jQuery.extend({supportedMethods: supportedMethods}, ApplicationHost.applicationEntryPointLoaded(libraryVersion, eventHandler));
	}

	export function exposeApplicationFacade(applicationEntryPointId: string): void
	{
		return ApplicationHost.exposeApplicationFacade(applicationEntryPointId);
	}

	export function applicationEntryPointUnloaded(): void
	{
		return ApplicationHost.applicationEntryPointUnloaded();
	}

	export function setCulture(culture: string): void
	{
		return ApplicationHost.setCulture(culture);
	}

	export function startCaptureDomEvents(events: string[]): void
	{
		return ApplicationHost.startCaptureDomEvents(events);
	}

	export function stopCaptureDomEvents(events?: string[]): void
	{
		return ApplicationHost.stopCaptureDomEvents(events);
	}

	export function setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void
	{
		return ApplicationHost.setActiveApplicationEntryPoint(applicationEntryPointId, applicationSuiteId);
	}

	export function setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string, allowedDomains?: string[]): void
	{
		return ApplicationHost.setApplicationEntryPointUrl(applicationEntryPointId, url, applicationSuiteId, allowedDomains);
	}

	export function callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string, allowedDomains?: string[]): void
	{
		return ApplicationHost.callApplicationFacade(applicationEntryPointId, method, args, callback, applicationSuiteId, allowedDomains);
	}

	export function initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {[id: string]: Application.IApplicationDomain;}): void
	{
		return ApplicationHost.initializeApplicationSuite(includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions);
	}

	export function resetApplicationSuite(): void
	{
		return ApplicationHost.resetApplicationSuite();
	}

	export function storeApplicationData(key: string, data: any): void
	{
		return ApplicationHost.storeApplicationData(key, data);
	}

	export function storeApplicationSessionData(key: string, data: any): void
	{
		return ApplicationHost.storeApplicationSessionData(key, data);
	}

	export function getApplicationData(key: string): any
	{
		return ApplicationHost.getApplicationData(key);
	}

	export function getApplicationSessionData(key: string): any
	{
		return ApplicationHost.getApplicationSessionData(key);
	}

	export function clearApplicationData(): void
	{
		return ApplicationHost.clearApplicationData();
	}

	export function clearApplicationSessionData(): void
	{
		return ApplicationHost.clearApplicationSessionData();
	}

	export function removeApplicationData(key: string): void
	{
		return ApplicationHost.removeApplicationData(key);
	}

	export function removeApplicationSessionData(key: string): void
	{
		return ApplicationHost.removeApplicationSessionData(key);
	}

	export function resolveCommonLibraryResources(resourceGroupName: string): Resources.IResolvedResourceGroupResult[]
	{
		return ApplicationHost.resolveCommonLibraryResources(resourceGroupName);
	}

	export function getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {url: string; data: string;}) => void, onFailure: (error: string) => void): void
	{
		return ApplicationHost.getCommonLibraryResources(files, version, onFileLoad, onFailure);
	}

	export function getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void
	{
		return ApplicationHost.getCommonLibraryResource(file, version, onSuccess, onFailure);
	}

	CrossDomainMessaging.addAllowedHandlerBase(ApplicationHostFacade);

	for (var method in ApplicationHostFacade)
	{
		supportedMethods[method] = true;
	}
}