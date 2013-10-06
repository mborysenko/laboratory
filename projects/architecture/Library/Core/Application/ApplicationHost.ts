/// <reference path="../Types/Types.d.ts" />
/// <reference path="..\Types\ObjectWithEvents.ts" />
/// <reference path="..\Resources\ResourceManager.ts" />
/// <reference path="..\Resources\FileResourceHandler.ts" />
/// <reference path="..\CrossDomainMessaging\CrossDomainMessaging.ts" />

module SDL.Client.Application
{
	export interface IApplicationHost extends Types.IObjectWithEvents
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
		resolveCommonLibraryResources(resourceGroupName: string, onSuccess: (resources: Resources.IResolvedResourceGroupResult[]) => void): void;
		getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {url: string; data: string;}) => void, onFailure: (error: string) => void): void;
		getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void;
		setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationId?: string): void;
		setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationId?: string): void;
		setApplicationEntryPointUrlUnsecure(applicationEntryPointId: string, url: string, applicationId?: string): void;
		callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationId?: string): void;
		callApplicationFacadeUnsecure(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationId?: string): void;
		initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {[id: string]: IApplicationDomain;}): void;
		resetApplicationSuite(): void;
	}

	export interface IApplicationHostData
	{
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

	eval(Types.OO.enableCustomInheritance);
	export class ApplicationHostProxyClass extends Types.ObjectWithEvents implements IApplicationHost
	{
		public libraryVersionSupported: boolean;
		public activeApplicationEntryPointId: string;
		public activeApplicationId: string;
		public culture: string;
		public isTrusted: boolean;

		public setCulture(culture: string): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setCulture", [culture]);
			}

		public applicationEntryPointLoaded(coreVersion?: string, callback?: (data: IApplicationHostData) => void): void
			{
				var _callback: {(data: any):void; sourceWindow?: Window; sourceDomain?: string;};
				_callback = (data: any) =>
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
					[coreVersion, this.getDelegate(this.onHostEvent)], _callback);
			}

		public exposeApplicationFacade(applicationEntryPointId: string): void
			{
				if (!ApplicationHost.isTrusted)
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

		public resolveCommonLibraryResources(resourceGroupName: string, onSuccess: (file: Resources.IResolvedResourceGroupResult[]) => void): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.resolveCommonLibraryResources", [resourceGroupName], onSuccess);
			}

		public getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {url: string; data: string;}) => void, onFailure: (error: string) => void): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.getCommonLibraryResources", [files, version, onFileLoad, onFailure]);
			}

		public getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.getCommonLibraryResource", [file, version, onSuccess, onFailure]);
			}

		public setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationId?: string): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setActiveApplicationEntryPoint", [applicationEntryPointId, applicationId]);
			}

		public setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationId?: string): void
			{
				if (!ApplicationHost.isTrusted)
				{
					throw Error("Unable to set application entry point Url: application host is untrusted.");
				}

				if (applicationId && applicationId != Application.applicationSuiteId && (Application.trustedApplications
					? (applicationId != Application.applicationSuiteId && Application.trustedApplications.indexOf(applicationId) == -1)
					: !Application.trustedApplicationDomains))
				{
					throw Error("Unable to set application entry point Url: application \"" + applicationId + "\" is untrusted.");
				}

				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setApplicationEntryPointUrl", [applicationEntryPointId, url, applicationId,
						Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null]);
			}

		public setApplicationEntryPointUrlUnsecure(applicationEntryPointId: string, url: string, applicationId?: string): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setApplicationEntryPointUrl", [applicationEntryPointId, url, applicationId]);
			}

		public callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationId?: string)
			{
				if (!ApplicationHost.isTrusted)
				{
					throw Error("Unable to call application facade: application host is untrusted.");
				}

				if (applicationId && applicationId != Application.applicationSuiteId && (Application.trustedApplications
					? (applicationId != Application.applicationSuiteId && Application.trustedApplications.indexOf(applicationId) == -1)
					: !Application.trustedApplicationDomains))
				{
					throw Error("Unable to call application facade: application \"" + applicationId + "\" is untrusted.");
				}

				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.callApplicationFacade", [applicationEntryPointId, method, args, callback, applicationId,
						Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null]);
			}

		public callApplicationFacadeUnsecure(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationId?: string)
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.callApplicationFacade", [applicationEntryPointId, method, args, callback, applicationId]);
			}

		public initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {[id: string]: IApplicationDomain;}): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.initializeApplicationSuite", [includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions]);
			}

		public resetApplicationSuite(): void
			{
				this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.resetApplicationSuite");
			}

		private call(method: string, args?: any[], callback?: (result: any) => void): void
			{
				CrossDomainMessaging.call(window.parent, method, args, callback);
			}

		private onHostEvent(e: Event.Event)
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
					domains = [localDomain];
				}
				else if (!Types.Array.contains(domains, localDomain, Types.Url.isSameDomain))
				{
					domains = domains.concat(localDomain);
				}
				return domains;
			}
	}
	SDL.Client.Types.OO.createInterface("SDL.Client.Application.ApplicationHostProxyClass", ApplicationHostProxyClass);
}
