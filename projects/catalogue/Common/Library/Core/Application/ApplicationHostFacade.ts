/// <reference path="ApplicationHost.ts" />

/**
 *	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
**/
module SDL.Client.Application.ApplicationHostFacade
{
	var supportedMethods: {[method: string]: boolean};

	export function applicationEntryPointLoaded(libraryVersion?: string, eventHandler?: (e: any) => void, callback?: (data: Application.IApplicationHostData) => void): SDL.Client.Application.IApplicationHostData
	{
		var _data: Application.IApplicationHostData;

		var isApplicationInitialized = false;
		var invokeCallback = false;

		SDL.Client.Application.addInitializeCallback(() =>
		{
			isApplicationInitialized = true;

			if (SDL.Client.Application.isHosted)
			{
				if (!supportedMethods)
				{
					var methods = {
						applicationEntryPointLoaded: 1,
						applicationEntryPointUnloaded: 1,
						setCulture: 1,
						startCaptureDomEvents: 1,
						stopCaptureDomEvents: 1,
						setActiveApplicationEntryPoint: 1,
						setApplicationEntryPointUrl: 1,
						callApplicationFacade: 1,
						storeApplicationData: 1,
						storeApplicationSessionData: 1,
						getApplicationData: 1,
						getApplicationDataAsync: 1,
						getApplicationSessionData: 1,
						getApplicationSessionDataAsync: 1,
						clearApplicationData: 1,
						clearApplicationSessionData: 1,
						removeApplicationData: 1,
						removeApplicationSessionData: 1,
						resolveCommonLibraryResources: 1,
						resolveCommonLibraryResourcesAsync: 1,
						getCommonLibraryResources: 1,
						getCommonLibraryResource: 1,
						triggerAnalyticsEvent: 1
					};

					supportedMethods = {};

					for (var method in methods)
					{
						if (SDL.Client.Application.ApplicationHost.isSupported(method))
						{
							supportedMethods[method] = true;
						}
					}
				}

				_data = {
					applicationHostUrl: SDL.Client.Application.applicationHostUrl,
					applicationHostCorePath: SDL.Client.Application.applicationHostCorePath,
					applicationSuiteId: SDL.Client.Application.applicationSuiteId,
					version: SDL.Client.Application.ApplicationHost.version,
					libraryVersionSupported: SDL.Client.Application.ApplicationHost.libraryVersionSupported,
					culture: SDL.Client.Application.ApplicationHost.culture,
					activeApplicationEntryPointId: SDL.Client.Application.ApplicationHost.activeApplicationEntryPointId,
					activeApplicationId: SDL.Client.Application.ApplicationHost.activeApplicationId,
					supportedMethods: supportedMethods,
					sharedSettings: SDL.Client.Application.sharedSettings,
					isApplicationHostProxy: true,
					isApplicationHostTrusted: SDL.Client.Application.ApplicationHost.isTrusted
				};

				if (callback)
				{
					if (invokeCallback)
					{
						callback(_data);
					}
					else if ((<CrossDomainMessaging.ICallbackHandler>callback).retire)
					{
						(<CrossDomainMessaging.ICallbackHandler>callback).retire();
					}
				}
			}
		});

		invokeCallback = !isApplicationInitialized;	// callback will be invoked only if the data cannot be returned asynchronously
		return _data;
	}

	export function applicationEntryPointUnloaded(): void
	{
		// don't have to do anything
	}

	export function setCulture(culture: string): void
	{
		SDL.Client.Application.ApplicationHost.setCulture(culture);
	}

	export function startCaptureDomEvents(events: string[]): void
	{
		SDL.Client.Application.ApplicationHost.startCaptureDomEvents(events);
	}

	export function stopCaptureDomEvents(events?: string[]): void
	{
		SDL.Client.Application.ApplicationHost.stopCaptureDomEvents(events);
	}

	export function setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void
	{
		SDL.Client.Application.ApplicationHost.setActiveApplicationEntryPoint(applicationEntryPointId, applicationSuiteId);
	}

	export function setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string, allowedDomains?: string[]): void
	{
		SDL.Client.Application.ApplicationHost.setApplicationEntryPointUrl(applicationEntryPointId, url, applicationSuiteId);
	}

	export function callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string, allowedDomains?: string[]): void
	{
		SDL.Client.Application.ApplicationHost.callApplicationFacade(applicationEntryPointId, method, args, callback, applicationSuiteId);
	}

	export function storeApplicationData(key: string, data: any): void
	{
		SDL.Client.Application.ApplicationHost.storeApplicationData(key, data);
	}

	export function storeApplicationSessionData(key: string, data: any): void
	{
		SDL.Client.Application.ApplicationHost.storeApplicationSessionData(key, data);
	}

	export function getApplicationDataAsync(key: string, callback: (data: any) => void): void
	{
		SDL.Client.Application.ApplicationHost.getApplicationData(key, (data: any) =>
		{
			if (callback)
			{
				callback(data);
			}
		});
	}

	export function getApplicationData(key: string): any
	{
		var _data: any;
		getApplicationDataAsync(key, (data: any) => { _data = data; });
		return _data;
	}

	export function getApplicationSessionDataAsync(key: string, callback: (data: any) => void): void
	{
		SDL.Client.Application.ApplicationHost.getApplicationSessionData(key, (data: any) =>
		{
			if (callback)
			{
				callback(data);
			}
		});
	}

	export function getApplicationSessionData(key: string): any
	{
		var _data: any;
		getApplicationSessionDataAsync(key, (data: any) => { _data = data; });
		return _data;
	}

	export function clearApplicationData(): void
	{
		SDL.Client.Application.ApplicationHost.clearApplicationData();
	}

	export function clearApplicationSessionData(): void
	{
		SDL.Client.Application.ApplicationHost.clearApplicationSessionData();
	}

	export function removeApplicationData(key: string): void
	{
		SDL.Client.Application.ApplicationHost.removeApplicationData(key);
	}

	export function removeApplicationSessionData(key: string): void
	{
		SDL.Client.Application.ApplicationHost.removeApplicationSessionData(key);
	}

	export function resolveCommonLibraryResourcesAsync(resourceGroupName: string, callback?: (result: any) => void): void
	{
		SDL.Client.Application.ApplicationHost.resolveCommonLibraryResources(resourceGroupName, (result: any) =>
		{
			if (callback)
			{
				callback(result);
			}
		});
	}

	export function resolveCommonLibraryResources(resourceGroupName: string, callback?: (result: any) => void): any
	{
		var _result: any;
		resolveCommonLibraryResourcesAsync(resourceGroupName, (result: any) => { _result = result; });
		return _result;
	}

	export function getCommonLibraryResources(files: any, version: string, onFileLoad: (resource: {url: string; data: string;}) => void, onFailure: (error: string) => void): void
	{
		SDL.Client.Application.ApplicationHost.getCommonLibraryResources(files, version, onFileLoad, onFailure);
	}

	export function getCommonLibraryResource(file: any, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void
	{
		SDL.Client.Application.ApplicationHost.getCommonLibraryResource(file, version, onSuccess, onFailure);
	}

	export function triggerAnalyticsEvent(event: string, object: any): void
	{
		SDL.Client.Application.ApplicationHost.triggerAnalyticsEvent(event, object);
	}
}

module SDL.Client.ApplicationHost
{
	export var ApplicationHostFacade: any = <any>SDL.Client.Application.ApplicationHostFacade;
	CrossDomainMessaging.addAllowedHandlerBase(ApplicationHostFacade);
}