/// <reference path="ApplicationHost.ts" />
module SDL.Client.ApplicationHost.ApplicationHostFacade
{
	var supportedMethods: {[method: string]: boolean} = {};

	export function applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: Client.Event.Event) => void): Application.IApplicationHostData
	{
		return SDL.jQuery.extend({supportedMethods: supportedMethods}, ApplicationHost.applicationEntryPointLoaded(libraryVersion, eventHandler, <ICallerSignature>(<any>arguments.callee).caller));
	}

	export function exposeApplicationFacade(applicationEntryPointId: string): void
	{
		return ApplicationHost.exposeApplicationFacade(applicationEntryPointId, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function applicationEntryPointUnloaded(): void
	{
		return ApplicationHost.applicationEntryPointUnloaded(<ICallerSignature>(<any>arguments.callee).caller);
	}

	export function setCulture(culture: string): void
	{
		return ApplicationHost.setCulture(culture, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function startCaptureDomEvents(events: string[]): void
	{
		return ApplicationHost.startCaptureDomEvents(events, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function stopCaptureDomEvents(events?: string[]): void
	{
		return ApplicationHost.stopCaptureDomEvents(events, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void
	{
		return ApplicationHost.setActiveApplicationEntryPoint(applicationEntryPointId, applicationSuiteId, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string, allowedDomains?: string[]): void
	{
		return ApplicationHost.setApplicationEntryPointUrl(applicationEntryPointId, url, applicationSuiteId, allowedDomains, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string, allowedDomains?: string[]): void
	{
		return ApplicationHost.callApplicationFacade(applicationEntryPointId, method, args, callback, applicationSuiteId, allowedDomains, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {[id: string]: Application.IApplicationDomain;}): void
	{
		return ApplicationHost.initializeApplicationSuite(includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function resetApplicationSuite(): void
	{
		return ApplicationHost.resetApplicationSuite(<ICallerSignature>(<any>arguments.callee).caller);
	}

	export function updateTargetDisplayUrl(url: string, caller?: ICallerSignature): void
	{
		return ApplicationHost.updateTargetDisplayUrl(url, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function storeApplicationData(key: string, data: any): void
	{
		return ApplicationHost.storeApplicationData(key, data, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function storeApplicationSessionData(key: string, data: any): void
	{
		return ApplicationHost.storeApplicationSessionData(key, data, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function getApplicationData(key: string): any
	{
		return ApplicationHost.getApplicationData(key, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function getApplicationSessionData(key: string): any
	{
		return ApplicationHost.getApplicationSessionData(key, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function clearApplicationData(): void
	{
		return ApplicationHost.clearApplicationData(<ICallerSignature>(<any>arguments.callee).caller);
	}

	export function clearApplicationSessionData(): void
	{
		return ApplicationHost.clearApplicationSessionData(<ICallerSignature>(<any>arguments.callee).caller);
	}

	export function removeApplicationData(key: string): void
	{
		return ApplicationHost.removeApplicationData(key, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function removeApplicationSessionData(key: string): void
	{
		return ApplicationHost.removeApplicationSessionData(key, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function resolveCommonLibraryResources(resourceGroupName: string): Resources.IResolvedResourceGroupResult[]
	{
		return ApplicationHost.resolveCommonLibraryResources(resourceGroupName, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {url: string; data: string;}) => void, onFailure: (error: string) => void): void
	{
		return ApplicationHost.getCommonLibraryResources(files, version, onFileLoad, onFailure, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void
	{
		return ApplicationHost.getCommonLibraryResource(file, version, onSuccess, onFailure, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function triggerAnalyticsEvent(event: string, object: any): void
	{
		return ApplicationHost.triggerAnalyticsEvent(event, object, <ICallerSignature>(<any>arguments.callee).caller);
	}

	export function _expose()
	{
		CrossDomainMessaging.addAllowedHandlerBase(ApplicationHostFacade);

		for (var method in ApplicationHostFacade)
		{
			if (method != "_expose")
			{
				supportedMethods[method] = true;
			}
		}
	}
}