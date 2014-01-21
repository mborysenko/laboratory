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
		resolveCommonLibraryResources(resourceGroupName: string, callback: (resources: Resources.IResolvedResourceGroupResult[]) => void): void;
		getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: ICommonLibraryResource) => void, onFailure?: (error: string) => void): void;
		getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void): void;
		setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void;
		setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void;
		setApplicationEntryPointUrlUnsecure(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void;
		callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string): void;
		callApplicationFacadeUnsecure(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string): void;
		initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {[id: string]: IApplicationDomain;}): void;
		resetApplicationSuite(): void;

		addEventListener(event: string, handler: Function): void;
		removeEventListener(event: string, handler: Function): void;
		fireEvent (event: string, eventData?: any): void;
	}

	export interface IApplicationHostData
	{
		applicationHostUrl: string;
		applicationHostCorePath: string;
		applicationSuiteId: string;
		libraryVersionSupported: boolean;
		culture: string;
		activeApplicationEntryPointId: string;
		activeApplicationId: string;
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
		public libraryVersionSupported: boolean;
		public activeApplicationEntryPointId: string;
		public activeApplicationId: string;
		public culture: string;
		public isTrusted: boolean;
		private handlers: { [event: string]: IHandler[]; } = {};

		public setCulture(culture: string): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setCulture", [culture]);
			}

		public applicationEntryPointLoaded(coreVersion?: string, callback?: (data: IApplicationHostData) => void): void
			{
				var _callback: {(data: IApplicationHostData): void; sourceWindow?: Window; sourceDomain?: string;} =
					(data: IApplicationHostData) =>
						{
							this.libraryVersionSupported = data.libraryVersionSupported
							this.activeApplicationEntryPointId = data.activeApplicationEntryPointId;
							this.activeApplicationId = data.activeApplicationId;
							this.culture = data.culture;
							if (callback)
							{
								_callback.sourceDomain = (<any>arguments.callee.caller).sourceDomain;
								_callback.sourceWindow = (<any>arguments.callee.caller).sourceWindow;
								callback(data);
							}
						};

				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.applicationEntryPointLoaded",
					[coreVersion, (e) => { this.onHostEvent(e); }], _callback);
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
					this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.exposeApplicationFacade", [applicationEntryPointId]);
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
					this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.exposeApplicationFacade", [applicationEntryPointId]);
				}
				else if (Application.isApplicationFacadeSecure)
				{
					throw Error("Application facade is already exposed as secure.");
				}
			}

		public applicationEntryPointUnloaded(): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.applicationEntryPointUnloaded");
			}

		public resolveCommonLibraryResources(resourceGroupName: string, callback: (file: Resources.IResolvedResourceGroupResult[]) => void): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.resolveCommonLibraryResources", [resourceGroupName], callback);
			}

		public getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: ICommonLibraryResource) => void, onFailure?: (error: string) => void): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.getCommonLibraryResources", [files, version, onFileLoad, onFailure]);
			}

		public getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.getCommonLibraryResource", [file, version, onSuccess, onFailure]);
			}

		public setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setActiveApplicationEntryPoint", [applicationEntryPointId, applicationSuiteId]);
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

				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setApplicationEntryPointUrl", [applicationEntryPointId, url, applicationSuiteId,
						Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null]);
			}

		public setApplicationEntryPointUrlUnsecure(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setApplicationEntryPointUrl", [applicationEntryPointId, url, applicationSuiteId]);
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

				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.callApplicationFacade", [applicationEntryPointId, method, args, callback, applicationSuiteId,
						Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null]);
			}

		public callApplicationFacadeUnsecure(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string)
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.callApplicationFacade", [applicationEntryPointId, method, args, callback, applicationSuiteId]);
			}

		public initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {[id: string]: IApplicationDomain;}): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.initializeApplicationSuite", [includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions]);
			}

		public resetApplicationSuite(): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.resetApplicationSuite");
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

		private call(method: string, args?: any[], callback?: (result: any) => void): void
			{
				CrossDomainMessaging.call(window.parent, method, args, callback);
			}

		private onHostEvent(e: {type: string; data: any;}): void
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
					// handlers can be added/removed while handling an event
					// thus have to recheck them if at least one handler has been executed
					var needPostprocess: boolean;
					var processedHandlers: IHandler[] = [];

					do
					{
						needPostprocess = false;

						for (var i = 0; handlers && (i < handlers.length); i++)
						{
							var handler: IHandler = handlers[i];
							if (processedHandlers.indexOf(handler) == -1)
							{
								needPostprocess = true;
								processedHandlers.push(handler);

								handler.fnc.call(this, eventObj);	// cannot cancel ApplicationHost events -> ignore the return value

								handlers = this.handlers && this.handlers[handlersCollectionName];
							}
						}
					}
					while (needPostprocess);
				}
			}
	}
}