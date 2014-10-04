/// <reference path="ApplicationHost.ts" />
module SDL.Client.ApplicationHost
{
	//export var ApplicationHostFacade: any;

	export class ApplicationHostFacadeClass
	{
		supportedMethods: {[method: string]: boolean} = {};

		constructor()
		{
			CrossDomainMessaging.addAllowedHandlerBase(this);
			for (var method in this)
			{
				this.supportedMethods[method] = true;
			}
		}

		applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: Client.Event.Event) => void): Application.IApplicationHostData
		{
			return SDL.jQuery.extend({supportedMethods: this.supportedMethods}, ApplicationHost.applicationEntryPointLoaded(libraryVersion, eventHandler, <ICallerSignature>(<any>arguments.callee).caller));
		}

		exposeApplicationFacade(applicationEntryPointId: string): void
		{
			return ApplicationHost.exposeApplicationFacade(applicationEntryPointId, <ICallerSignature>(<any>arguments.callee).caller);
		}

		applicationEntryPointUnloaded(): void
		{
			return ApplicationHost.applicationEntryPointUnloaded(<ICallerSignature>(<any>arguments.callee).caller);
		}

		setCulture(culture: string): void
		{
			return ApplicationHost.setCulture(culture, <ICallerSignature>(<any>arguments.callee).caller);
		}

		startCaptureDomEvents(events: string[]): void
		{
			return ApplicationHost.startCaptureDomEvents(events, <ICallerSignature>(<any>arguments.callee).caller);
		}

		stopCaptureDomEvents(events?: string[]): void
		{
			return ApplicationHost.stopCaptureDomEvents(events, <ICallerSignature>(<any>arguments.callee).caller);
		}

		setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void
		{
			return ApplicationHost.setActiveApplicationEntryPoint(applicationEntryPointId, applicationSuiteId, <ICallerSignature>(<any>arguments.callee).caller);
		}

		setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string, allowedDomains?: string[]): void
		{
			return ApplicationHost.setApplicationEntryPointUrl(applicationEntryPointId, url, applicationSuiteId, allowedDomains, <ICallerSignature>(<any>arguments.callee).caller);
		}

		callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string, allowedDomains?: string[]): void
		{
			return ApplicationHost.callApplicationFacade(applicationEntryPointId, method, args, callback, applicationSuiteId, allowedDomains, <ICallerSignature>(<any>arguments.callee).caller);
		}

		initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {[id: string]: Application.IApplicationDomain;}): void
		{
			return ApplicationHost.initializeApplicationSuite(includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions, <ICallerSignature>(<any>arguments.callee).caller);
		}

		resetApplicationSuite(): void
		{
			return ApplicationHost.resetApplicationSuite(<ICallerSignature>(<any>arguments.callee).caller);
		}

		updateTargetDisplayUrl(url: string, caller?: ICallerSignature): void
		{
			return ApplicationHost.updateTargetDisplayUrl(url, <ICallerSignature>(<any>arguments.callee).caller);
		}

		storeApplicationData(key: string, data: any): void
		{
			return ApplicationHost.storeApplicationData(key, data, <ICallerSignature>(<any>arguments.callee).caller);
		}

		storeApplicationSessionData(key: string, data: any): void
		{
			return ApplicationHost.storeApplicationSessionData(key, data, <ICallerSignature>(<any>arguments.callee).caller);
		}

		getApplicationData(key: string): any
		{
			return ApplicationHost.getApplicationData(key, <ICallerSignature>(<any>arguments.callee).caller);
		}

		getApplicationDataAsync(key: string, callback: (data: any) => void): void
		{
			((data: any) =>
			{
				if (callback)
				{
					callback(data);
				}
			})(ApplicationHost.getApplicationData(key, <ICallerSignature>(<any>arguments.callee).caller));
		}

		getApplicationSessionData(key: string): any
		{
			return ApplicationHost.getApplicationSessionData(key, <ICallerSignature>(<any>arguments.callee).caller);
		}

		getApplicationSessionDataAsync(key: string, callback: (data: any) => void): void
		{
			((data: any) =>
			{
				if (callback)
				{
					callback(data);
				}
			})(ApplicationHost.getApplicationSessionData(key, <ICallerSignature>(<any>arguments.callee).caller));
		}

		clearApplicationData(): void
		{
			return ApplicationHost.clearApplicationData(<ICallerSignature>(<any>arguments.callee).caller);
		}

		clearApplicationSessionData(): void
		{
			return ApplicationHost.clearApplicationSessionData(<ICallerSignature>(<any>arguments.callee).caller);
		}

		removeApplicationData(key: string): void
		{
			return ApplicationHost.removeApplicationData(key, <ICallerSignature>(<any>arguments.callee).caller);
		}

		removeApplicationSessionData(key: string): void
		{
			return ApplicationHost.removeApplicationSessionData(key, <ICallerSignature>(<any>arguments.callee).caller);
		}

		resolveCommonLibraryResources(resourceGroupName: string): Resources.IResolvedResourceGroupResult[]
		{
			return ApplicationHost.resolveCommonLibraryResources(resourceGroupName, <ICallerSignature>(<any>arguments.callee).caller);
		}

		resolveCommonLibraryResourcesAsync(resourceGroupName: string, callback: (result: Resources.IResolvedResourceGroupResult[]) => void): void
		{
			((result: Resources.IResolvedResourceGroupResult[]) =>
			{
				if (callback)
				{
					callback(result);
				}
			})(ApplicationHost.resolveCommonLibraryResources(resourceGroupName, <ICallerSignature>(<any>arguments.callee).caller));
		}

		getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {url: string; data: string;}) => void, onFailure: (error: string) => void): void
		{
			return ApplicationHost.getCommonLibraryResources(files, version, onFileLoad, onFailure, <ICallerSignature>(<any>arguments.callee).caller);
		}

		getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void
		{
			return ApplicationHost.getCommonLibraryResource(file, version, onSuccess, onFailure, <ICallerSignature>(<any>arguments.callee).caller);
		}

		triggerAnalyticsEvent(event: string, object: any): void
		{
			return ApplicationHost.triggerAnalyticsEvent(event, object, <ICallerSignature>(<any>arguments.callee).caller);
		}

		showTopBar(): void
		{
			return ApplicationHost.showTopBar(<ICallerSignature>(<any>arguments.callee).caller);
		}

		setTopBarOptions(options: any): void
		{
			return ApplicationHost.setTopBarOptions(options, <ICallerSignature>(<any>arguments.callee).caller);
		}
	}
}