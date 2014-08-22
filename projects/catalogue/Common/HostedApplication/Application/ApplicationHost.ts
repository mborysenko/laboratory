/// <reference path="../../SDL.Client.Core/Resources/Resources.d.ts" />
/// <reference path="../Types/Url1.ts" />
/// <reference path="../CrossDomainMessaging/CrossDomainMessaging.ts" />
/// <reference path="Application.ts" />

/**
 *	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
**/
module SDL.Client.Application
{
	export interface IApplicationHost
	{
		version: string;
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
		startCaptureDomEvents(events: string[]): void;
		stopCaptureDomEvents(events?: string[]): void;
		resolveCommonLibraryResources(resourceGroupName: string, callback: (resources: Resources.IResolvedResourceGroupResult[]) => void): void;
		getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: ICommonLibraryResource) => void, onFailure?: (error: string) => void): void;
		getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void): void;
		setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void;
		setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void;
		setApplicationEntryPointUrlUnsecure(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void;
		callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string): void;
		callApplicationFacadeUnsecure(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string): void;
		initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: { [id: string]: IApplicationDomain; }): void;
		resetApplicationSuite(): void;
		updateTargetDisplayUrlUnsecure(url: string): void;
		storeApplicationData(key: string, data: any): void;
		storeApplicationSessionData(key: string, data: any): void;
		getApplicationData(key: string, callback: (data: any) => void): void;
		getApplicationSessionData(key: string, callback: (data: any) => void): void;
		clearApplicationData(): void;
		clearApplicationSessionData(): void;
		removeApplicationData(key: string): void;
		removeApplicationSessionData(key: string): void;
		triggerAnalyticsEvent(event: string, object: any): void;

		addEventListener(event: string, handler: Function): void;
		removeEventListener(event: string, handler: Function): void;
		fireEvent(event: string, eventData?: any): void;

		isSupported(method: string): boolean;
	}

	export interface IApplicationData
	{
		coreVersion?: string;
		loadedUrl: string;
	}
	
	export interface IApplicationHostData
	{
		applicationHostUrl: string;
		applicationHostCorePath: string;
		applicationSuiteId: string;
		version: string;
		libraryVersionSupported: boolean;
		culture: string;
		activeApplicationEntryPointId: string;
		activeApplicationId: string;
		supportedMethods?: { [method: string]: boolean };
		sharedSettings?: { [setting: string]: string };
	};

	export interface IApplicationDomain
	{
		domain: string;
		alternativeDomains: string[];
	};

	export interface ICommonLibraryResource
	{
		url: string;
		data: string;
		context?: string;
	};

	interface IHandler
	{
		fnc: Function;
	};

	export class ApplicationHostProxyClass implements IApplicationHost
	{
		public version: string;
		public libraryVersionSupported: boolean;
		public activeApplicationEntryPointId: string;
		public activeApplicationId: string;
		public culture: string;
		public isTrusted: boolean;
		private handlers: { [event: string]: IHandler[]; } = {};
		private supportedMethods: { [method: string]: boolean; } = {	// default supported methods (implemented in 1.0 GA),
																		// overwritten if ApplicationHost provides a different list
			applicationEntryPointLoaded: true,
			exposeApplicationFacade: true,
			applicationEntryPointUnloaded: true,
			setCulture: true,
			setActiveApplicationEntryPoint: true,
			setApplicationEntryPointUrl: true,
			callApplicationFacade: true,
			initializeApplicationSuite: true,
			resetApplicationSuite: true,
			resolveCommonLibraryResources: true,
			getCommonLibraryResources: true,
			getCommonLibraryResource: true
		};

		public setCulture(culture: string): void
		{
			this.call("setCulture", [culture]);
		}

		public applicationEntryPointLoaded(coreVersion?: string, callback?: (data: IApplicationHostData) => void): void
		{
			var _callback: { (data: IApplicationHostData): void; sourceWindow?: Window; sourceDomain?: string; } =
				(data: IApplicationHostData) =>
				{
					this.version = data.version;
					this.libraryVersionSupported = data.libraryVersionSupported
							this.activeApplicationEntryPointId = data.activeApplicationEntryPointId;
					this.activeApplicationId = data.activeApplicationId;
					this.culture = data.culture;
					if (data.supportedMethods)
					{
						this.supportedMethods = data.supportedMethods;
					}

					if (callback)
					{
						_callback.sourceDomain = (<any>arguments.callee.caller).sourceDomain;
						_callback.sourceWindow = (<any>arguments.callee.caller).sourceWindow;
						callback(data);
					}
				};

			this.call("applicationEntryPointLoaded", [coreVersion, (e: any) => { this.onHostEvent(e); }], _callback);
		}

		public startCaptureDomEvents(events: string[]): void
		{
			this.call("startCaptureDomEvents", [events]);
		}

		public stopCaptureDomEvents(events?: string[]): void
		{
			this.call("stopCaptureDomEvents", [events]);
		}

		public exposeApplicationFacade(applicationEntryPointId: string): void
		{
			if (!this.isTrusted)
			{
				throw Error("Unable to expose application facade: application host is untrusted.");
			}

			if (Application.isApplicationFacadeSecure === undefined)
			{
				isApplicationFacadeSecure = true;
				this.call("exposeApplicationFacade", [applicationEntryPointId]);
			}
			else if (!Application.isApplicationFacadeSecure)
			{
				throw Error("Application facade is already exposed as unsecure.");
			}
		}

		public exposeApplicationFacadeUnsecure(applicationEntryPointId: string): void
		{
			if (Application.isApplicationFacadeSecure === undefined)
			{
				isApplicationFacadeSecure = false;
				this.call("exposeApplicationFacade", [applicationEntryPointId]);
			}
			else if (Application.isApplicationFacadeSecure)
			{
				throw Error("Application facade is already exposed as secure.");
			}
		}

		public applicationEntryPointUnloaded(): void
		{
			this.call("applicationEntryPointUnloaded");
		}

		public resolveCommonLibraryResources(resourceGroupName: string, callback: (file: Resources.IResolvedResourceGroupResult[]) => void): void
		{
			this.call("resolveCommonLibraryResources", [resourceGroupName], callback);
		}

		public getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: ICommonLibraryResource) => void, onFailure?: (error: string) => void): void
		{
			this.call("getCommonLibraryResources", [files, version, onFileLoad, onFailure]);
		}

		public getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void): void
		{
			this.call("getCommonLibraryResource", [file, version, onSuccess, onFailure]);
		}

		public setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void
		{
			this.call("setActiveApplicationEntryPoint", [applicationEntryPointId, applicationSuiteId]);
		}

		public setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void
		{
			if (!ApplicationHost.isTrusted)
			{
				throw Error("Unable to set application entry point Url: application host is untrusted.");
			}

			if (applicationSuiteId && applicationSuiteId != Application.applicationSuiteId && (Application.trustedApplications
				? (applicationSuiteId != Application.applicationSuiteId && Application.trustedApplications.indexOf(applicationSuiteId) == -1)
				: !Application.trustedApplicationDomains))
			{
				throw Error("Unable to set application entry point Url: application \"" + applicationSuiteId + "\" is untrusted.");
			}

			this.call("setApplicationEntryPointUrl", [applicationEntryPointId, url, applicationSuiteId,
				Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null]);
		}

		public setApplicationEntryPointUrlUnsecure(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void
		{
			this.call("setApplicationEntryPointUrl", [applicationEntryPointId, url, applicationSuiteId]);
		}

		public updateTargetDisplayUrlUnsecure(url: string): void
		{
			this.call("updateTargetDisplayUrl", [url]);
		}

		public callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string)
		{
			if (!ApplicationHost.isTrusted)
			{
				throw Error("Unable to call application facade: application host is untrusted.");
			}

			if (applicationSuiteId && applicationSuiteId != Application.applicationSuiteId && (Application.trustedApplications
				? (applicationSuiteId != Application.applicationSuiteId && Application.trustedApplications.indexOf(applicationSuiteId) == -1)
				: !Application.trustedApplicationDomains))
			{
				throw Error("Unable to call application facade: application \"" + applicationSuiteId + "\" is untrusted.");
			}

			this.call("callApplicationFacade", [applicationEntryPointId, method, args, callback, applicationSuiteId,
				Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null]);
		}

		public callApplicationFacadeUnsecure(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string)
		{
			this.call("callApplicationFacade", [applicationEntryPointId, method, args, callback, applicationSuiteId]);
		}

		public initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: { [id: string]: IApplicationDomain; }): void
		{
			this.call("initializeApplicationSuite", [includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions]);
		}

		public resetApplicationSuite(): void
		{
			this.call("resetApplicationSuite");
		}

		public storeApplicationData(key: string, data: any): void
		{
			if (!ApplicationHost.isTrusted)
			{
				throw Error("Unable to store application data: application host is untrusted.");
			}
			this.call("storeApplicationData", [key, data]);
		}

		public storeApplicationSessionData(key: string, data: any): void
		{
			if (!ApplicationHost.isTrusted)
			{
				throw Error("Unable to store application session data: application host is untrusted.");
			}
			this.call("storeApplicationSessionData", [key, data]);
		}

		public getApplicationData(key: string, callback: (data: any) => void): void
		{
			if (!ApplicationHost.isTrusted)
			{
				throw Error("Unable to get application data: application host is untrusted.");
			}
			this.call("getApplicationData", [key], callback);
		}

		public getApplicationSessionData(key: string, callback: (data: any) => void): void
		{
			if (!ApplicationHost.isTrusted)
			{
				throw Error("Unable to get application session data: application host is untrusted.");
			}
			this.call("getApplicationSessionData", [key], callback);
		}

		public clearApplicationData(): void
		{
			if (!ApplicationHost.isTrusted)
			{
				throw Error("Unable to clear application data: application host is untrusted.");
			}
			this.call("clearApplicationData");
		}

		public clearApplicationSessionData(): void
		{
			if (!ApplicationHost.isTrusted)
			{
				throw Error("Unable to clear application session data: application host is untrusted.");
			}
			this.call("clearApplicationSessionData");
		}

		public removeApplicationData(key: string): void
		{
			if (!ApplicationHost.isTrusted)
			{
				throw Error("Unable to remove application data: application host is untrusted.");
			}
			this.call("removeApplicationData", [key]);
		}

		public removeApplicationSessionData(key: string): void
		{
			if (!ApplicationHost.isTrusted)
			{
				throw Error("Unable to remove application session data: application host is untrusted.");
			}
			this.call("removeApplicationSessionData", [key]);
		}

		public triggerAnalyticsEvent(event: string, object: any): void
		{
			if (this.isSupported("triggerAnalyticsEvent"))
			{
				this.call("triggerAnalyticsEvent", [event, object]);
			}
		}

		public addEventListener(event: string, handler: Function): void
		{
			if (this.handlers)
			{
				var e = this.handlers[event];
				if (!e)
				{
					e = this.handlers[event] = [];
				}
				e.push({ fnc: handler });
			}
		}

		public removeEventListener(event: string, handler: Function): void
		{
			if (this.handlers)
			{
				var e = this.handlers[event];
				if (e)
				{
					var len = e.length;
					for (var i = 0; i < len; i++)
					{
						if (e[i].fnc == handler)
						{
							if (len == 1)
							{
								delete this.handlers[event];
							}
							else
							{
								for (var j = i + 1; j < len; j++)
								{
									e[j - 1] = e[j];
								}
								e.pop();
							}
							return;
						}
					}
				}
			}
		}

		public fireEvent(eventType: string, eventData?: any): void
		{
			if (this.handlers)
			{
				var eventObj = {
					type: eventType,
					target: this,
					data: eventData
				};

				this._processHandlers(eventObj, eventType);
				this._processHandlers(eventObj, "*");
			}
		}

		public isSupported(method: string): boolean
		{
			return this.supportedMethods[method] || false;
		}

		private call(method: string, args?: any[], callback?: (result: any) => void): void
		{
			if (this.isSupported(method))
			{
				CrossDomainMessaging.call(window.parent, "SDL.Client.ApplicationHost.ApplicationHostFacade." + method, args, callback);
			}
			else
			{
				throw Error("ApplicationHost (ver. " + this.version + ") does not support method \"" + method + "\".");
			}
		}

		private onHostEvent(e: { type: string; data: any; }): void
		{
			switch (e.type)
			{
				case "culturechange":
					this.culture = e.data.culture;
					break;
				case "applicationentrypointactivate":
					this.activeApplicationEntryPointId = e.data.applicationEntryPointId;
					this.activeApplicationId = e.data.applicationId;
					break;
			}
			this.fireEvent(e.type, e.data);
		}

		private getWithLocalDomain(domains: string[]): string[]
		{
			var localDomain = Types.Url.getDomain(window.location.href);
			if (!domains)
			{
				return [localDomain];
			}
			else
			{
				for (var i = 0, len = domains.length; i < len; i++)
				{
					if (Types.Url.isSameDomain(domains[i], localDomain))
					{
						return domains;
					}
				}
				return domains.concat(localDomain);
			}
		}

		private _processHandlers(eventObj: any, handlersCollectionName: string): void
		{
			var handlers = this.handlers && this.handlers[handlersCollectionName];
			if (handlers)
			{
				var handlersClone = handlers.concat();	// creating a snapshot of handlers as newly added handlers should not be processed
				for (var i = 0, len = handlersClone.length; i < len && handlers; i++)
				{
					var handler: IHandler = handlersClone[i];
					if (handlers.indexOf(handler) != -1)	// making sure not to call removed handlers
					{
						handler.fnc.call(this, eventObj);	// cannot cancel ApplicationHost events -> ignore the return value
						handlers = this.handlers && this.handlers[handlersCollectionName];
					}
				}
			}
		}
	}
}