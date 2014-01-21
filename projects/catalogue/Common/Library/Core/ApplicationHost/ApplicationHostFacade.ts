/// <reference path="ApplicationHost.ts" />
module SDL.Client.ApplicationHost.ApplicationHostFacade
{
	export function applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: Client.Event.Event) => void): Application.IApplicationHostData
	{
		return ApplicationHost.applicationEntryPointLoaded(libraryVersion, eventHandler);
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
}