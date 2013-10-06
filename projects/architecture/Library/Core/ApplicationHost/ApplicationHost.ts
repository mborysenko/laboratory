/// <reference path="../Types/Types.d.ts" />
/// <reference path="..\Application\Application.ts" 
/// <reference path="..\Application\ApplicationFacade.ts" 
/// <reference path="..\Xml\Xml.d.ts" />
/// <reference path="..\ConfigurationManager\ConfigurationManager.ts" />
/// <reference path="..\CrossDomainMessaging\CrossDomainMessaging.ts" />
/// <reference path="..\Types\Object.d.ts" />
/// <reference path="..\Xml\Xml.d.ts" />
/// <reference path="..\Types\Url.d.ts" />
/// <reference path="..\Types\Array.d.ts" />
/// <reference path="..\Resources\ResourceManager.ts" />
/// <reference path="..\Resources\FileResourceHandler.ts" />
/// <reference path="..\Resources\FileHandlers\CssFileHandler.ts" />
/// <reference path="..\Event\EventRegister.d.ts" />
/// <reference path="..\Event\Event.d.ts" />
/// <reference path="ApplicationManifestReceiver.ts" />

module SDL.Client.ApplicationHost
{
	import Url = Types.Url;
	export interface IApplicationHost extends Types.IObjectWithEvents
	{
		applications: IApplication[];
		applicationsIndex: {[id: string]: IApplication;};
		initialize(callback?: () => void): void;
		registerApplication(applicationEntries: string);
		//--------- Begin methods supporting SDL.Client.ApplicationHost.ApplicationHostFacade ----------------
		applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: {type: string; data: any;}) => void): Application.IApplicationHostData;
		exposeApplicationFacade(applicationEntryPointId: string): void;
		applicationEntryPointUnloaded(): void;
		setCulture(culture: string): void;
		setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationId?: string): void;
		setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationId?: string, allowedDomains?: string[]): void;
		callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationId?: string, allowedDomains?: string[]): void;
		initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {[id: string]: Application.IApplicationDomain;}): void;
		resetApplicationSuite(): void;
		resolveCommonLibraryResources(resourceGroupName: string): Resources.IResolvedResourceGroupResult[];
		getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {url: string; data: string;}) => void, onFailure: (error: string) => void): void;
		getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void;
		//--------- End SDL.Client.ApplicationHost.ApplicationHostFacade methods ----------------
	};

	export interface IApplication
	{
		id: string;
		manifestUrl: string;
		authenticationUrl: string;
		authenticated?: boolean;
		authenticationMode: string;
		authenticationTargetDisplay?: ITargetDisplay;
		domains: {[id: string]: IApplicationDomain;};
		entryPointGroups: IApplicationEntryPointGroup[];
		entryPointGroupsIndex:  {[id: string]: IApplicationEntryPointGroup;};
		targetDisplays: IApplicationEntryPointTargetDisplay[];
		targetDisplaysIndex: {[name: string]: IApplicationEntryPointTargetDisplay;};
	};

	export interface IApplicationDomain
	{
		id: string;
		baseUrl: string;
		domain: string;
		deferred: boolean;
		initialized: boolean;
		validDomains: string[];
	};

	export interface IApplicationEntryPointGroup
	{
		id: string;
		title: string;
		translations?: {[lang: string]: string;};
		entryPoints: IApplicationEntryPoint[];
		application: IApplication;
	};

	export interface IApplicationEntryPoint
	{
		id: string;
		title: string;
		translations: {[lang: string]: string;};
		domain: IApplicationDomain;
		baseUrl: string;
		url: string;
		icon: string;
		type: string;
		hidden: boolean;
		contextual: boolean;
		external: boolean;
		overlay: boolean;
		targetDisplay: IApplicationEntryPointTargetDisplay;
		application: IApplication;
	};

	export interface ITargetDisplay
	{
		application?: IApplication;
		frame?: HTMLIFrameElement;
		loadedDomain?: string;
		eventHandler?: (event: {type: string; data: any;}) => void;
	};

	export interface IApplicationEntryPointTargetDisplay extends ITargetDisplay
	{
		name: string;
		domains: IApplicationDomain[];
		entryPoints: IApplicationEntryPoint[];
		exposedApplicationFacade?: string;
		delayedFacadeInvocations: {[entryPointId: string]: IDelayedFacadeInvocation[];};
	};

	export interface IDelayedFacadeInvocation
	{
		(): void;
	};

	interface IApplicationManifest
	{
		iframe: HTMLIFrameElement;
		domain: string;
		url: string;
		id: string;
		xmlElement: Element;
		timeout: number;
	};

	interface IDelayedInvocation
	{
		(): void;
	};

	eval(Types.OO.enableCustomInheritance);
	class ApplicationHostClass extends Types.ObjectWithEvents implements IApplicationHost
	{
		public applications: IApplication[] = [];
		public applicationsIndex: {[id: string]: IApplication;} = {};
		
		private activeApplicationEntryPointId: string;
		private activeApplicationId: string;
		private selfTargetDisplay: ITargetDisplay = {};
		private initialized = false;
		private libraryVersions: string[] = [];
		private initCallbacks = [];
		private applicationManifestsCount = 0;
		private applicationManifests: IApplicationManifest[] = [];

		public applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: {type: string; data: any;}) => void): Application.IApplicationHostData
		{
			var targetDisplay = this.getCallerTargetDisplay(true);
			if (targetDisplay)
			{
				this.removeHandler(targetDisplay);

				if (eventHandler)
				{
					(<CrossDomainMessaging.ICallbackHandler>eventHandler).reoccuring = true;
					targetDisplay.eventHandler = eventHandler;
				}

				return {
						applicationSuiteId: targetDisplay.application.id,
						libraryVersionSupported: !libraryVersion || this.libraryVersions.indexOf(libraryVersion) != -1,
						culture: Localization.getCulture(),
						activeApplicationEntryPointId: this.activeApplicationEntryPointId,
						activeApplicationId: this.activeApplicationId
					};
			}
		}

		public exposeApplicationFacade(applicationEntryPointId: string): void
		{
			var targetDisplay = <IApplicationEntryPointTargetDisplay>this.getCallerTargetDisplay(false);
			if (targetDisplay)
			{
				var application = targetDisplay.application;
				var applicationEntryPoint = this.getApplicationEntryPointById(applicationEntryPointId, application);
				if (!applicationEntryPoint || applicationEntryPoint.hidden)
				{
					throw Error("Unknown application entry point ID: " + applicationEntryPointId + ".");
				}

				if (!applicationEntryPoint.domain.initialized)
				{
					throw Error("Unable to determine valid origin domains for application facade \"" + applicationEntryPointId +
							"\" (application suite \"" + application.id + "\"). Deferred domain \"" + applicationEntryPoint.domain.id + "\" has not been uninitialized.");
				}

				if (!Types.Array.contains(applicationEntryPoint.domain.validDomains, targetDisplay.loadedDomain, Url.isSameDomain))
				{
					throw Error("Application facade \"" + applicationEntryPointId + "\" (application suite \"" + application.id + "\") exposed from an unexpected domain: " + targetDisplay.loadedDomain);
				}

				var invocations = targetDisplay.delayedFacadeInvocations[applicationEntryPointId];
				if (invocations)
				{
					for (var i = 0; i < invocations.length; i++)
					{
						invocations[i]();
					}
					targetDisplay.delayedFacadeInvocations[applicationEntryPointId] = null;
				}
				targetDisplay.exposedApplicationFacade = applicationEntryPointId;
			}
		}

		public applicationEntryPointUnloaded(): void
		{
			var targetDisplay: ITargetDisplay = this.getCallerTargetDisplay(true, false, true);
			if (targetDisplay)
			{
				targetDisplay.eventHandler = null;
				targetDisplay.loadedDomain = null;
				(<IApplicationEntryPointTargetDisplay>targetDisplay).exposedApplicationFacade = null;
				this.fireEvent("targetdisplayunload", {targetDisplay: targetDisplay});
			}
		}

		public setCulture(culture: string): void
		{
			if (this.getCallerTargetDisplay(true, true))
			{
				Localization.setCulture(culture);
			}
		}

		public setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationId?: string): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, true);
			if (targetDisplay)
			{
				var applicationEntryPoint: IApplicationEntryPoint;
				if (applicationEntryPointId || targetDisplay != this.selfTargetDisplay)	// hosted applications are not allowed to unselect application entry points
				{
					applicationEntryPoint = this.getApplicationEntryPointById(applicationEntryPointId, applicationId ? this.applicationsIndex[applicationId] : targetDisplay.application);
					if (!applicationEntryPoint || applicationEntryPoint.hidden)
					{
						throw Error("Unable to activate application entry point '" + applicationEntryPointId + "' (application suite \"" +
							(applicationId || targetDisplay.application && targetDisplay.application.id) + "\"). Application entry point is not found.");
					}
				}

				applicationId = applicationEntryPointId ? applicationId || targetDisplay.application.id : null;
				if (applicationEntryPointId != this.activeApplicationEntryPointId || applicationId != this.activeApplicationId)
				{
					this.activeApplicationEntryPointId = applicationEntryPointId;
					this.activeApplicationId = applicationId;

					if (applicationEntryPoint && applicationEntryPoint.contextual)
					{
						applicationEntryPoint.contextual = false;
						this.fireEvent("applicationentrypointcontextualactivate", {applicationEntryPointId: applicationEntryPointId, applicationId: applicationId});
					}
					this.fireEvent("applicationentrypointactivate", {applicationEntryPointId: applicationEntryPointId, applicationId: applicationId});
					this.publishEvent("applicationentrypointactivate", {applicationEntryPointId: applicationEntryPointId, applicationId: applicationId});
				}
			}
		}

		public setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationId?: string, allowedDomains?: string[]): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, true);
			if (targetDisplay)
			{
				var applicationEntryPoint = this.getApplicationEntryPointById(applicationEntryPointId, applicationId ? this.applicationsIndex[applicationId] : targetDisplay.application);
				if (!applicationEntryPoint || applicationEntryPoint.hidden)
				{
					throw Error("Unable to set URL for application entry point '" + applicationEntryPointId + "' (application suite \"" +
						(applicationId || targetDisplay.application && targetDisplay.application.id) + "\"). Application entry point is not found.");
				}

				if (applicationEntryPoint.url != url)
				{
					var domain = Url.getDomain(url);
					if (!applicationEntryPoint.domain.initialized)
					{
						if (domain)
						{
							throw Error("Unable to set URL for application entry point '" + applicationEntryPointId +
								"'  (application suite \"" + (applicationId || targetDisplay.application.id) + "\") to \"" + url +
								"\". Deferred domain \"" + applicationEntryPoint.domain.id + "\" has not been uninitialized.");
						}
						else
						{
							url = Url.combinePath(applicationEntryPoint.baseUrl, url);
						}
					}
					else
					{
						if (allowedDomains && !Types.Array.contains(allowedDomains, applicationEntryPoint.url, Url.isSameDomain))
						{
							throw Error("Unable to set URL for application entry point '" + applicationEntryPointId +
								"' (application suite \"" + (applicationId || targetDisplay.application.id) +
								"\"). Target application entry point domain is untrusted: " + Url.getDomain(applicationEntryPoint.url) +
								". Trusted domains are: " + allowedDomains.join(", "));
						}

						url = Url.combinePath(applicationEntryPoint.baseUrl, url);
						if (domain && !Types.Array.contains(applicationEntryPoint.domain.validDomains, Url.getDomain(url), Url.isSameDomain))
						{
							throw Error("Unable to set URL for application entry point '" + applicationEntryPointId +
								"' (application suite \"" + (applicationId || targetDisplay.application.id) +
								"\"). New URL has an invalid domain: " + domain + ". Allowed domains are: " + applicationEntryPoint.domain.validDomains.join(", "));
						}
					}

					if (applicationEntryPoint.url != url)
					{
						applicationEntryPoint.url = url;
						this.fireEvent("applicationentrypointurlchange", {
								applicationEntryPointId: applicationEntryPointId,
								applicationId: applicationId || targetDisplay.application.id,
								url: url})
					}
				}
			}
		}

		public callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationId?: string, allowedDomains?: string[]): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, true);
			if (targetDisplay)
			{
				var applicationEntryPoint = this.getApplicationEntryPointById(applicationEntryPointId, applicationId ? this.applicationsIndex[applicationId] : targetDisplay.application);
				if (!applicationEntryPoint || applicationEntryPoint.hidden)
				{
					throw Error("Unable to call application facade '" + applicationEntryPointId + "' (application suite \"" +
						(applicationId || targetDisplay.application && targetDisplay.application.id) + "\"). Application facade is not found.");
				}

				var callerData: Application.ICallingApplicationData = {
							applicationId: targetDisplay.application && targetDisplay.application.id,
							applicationDomain: targetDisplay.loadedDomain
						};

				var facadeTargetDisplay = applicationEntryPoint.targetDisplay;
				var invocation = () =>
					{
						if (allowedDomains && !Types.Array.contains(allowedDomains, applicationEntryPoint.url, Url.isSameDomain))
						{
							throw Error("Unable to call application facade '" + applicationEntryPointId +
								"' (application suite \"" + (applicationId || targetDisplay.application.id) +
								"\"). Target application domain is untrusted: " + Url.getDomain(applicationEntryPoint.url));
						}

						CrossDomainMessaging.call(facadeTargetDisplay.frame.contentWindow,
							"SDL.Client.Application.ApplicationFacadeStub.callApplicationFacade",
							[method, args, callerData], callback);
					}

				if (facadeTargetDisplay.exposedApplicationFacade == applicationEntryPointId)
				{
					// application loaded and facade exposed
					invocation();
				}
				else
				{
					// facade not exposed
					if (!facadeTargetDisplay.delayedFacadeInvocations[applicationEntryPointId])
					{
						facadeTargetDisplay.delayedFacadeInvocations[applicationEntryPointId] = [invocation];
					}
					else
					{
						facadeTargetDisplay.delayedFacadeInvocations[applicationEntryPointId].push(invocation);
					}

					if (!facadeTargetDisplay.frame)
					{
						// targetDisplay of the requested application entry point is not used -> load the entry point
						this.fireEvent("applicationfacaderequest", {
								applicationEntryPointId: applicationEntryPointId,
								applicationId: facadeTargetDisplay.application.id});
					}
				}
			}
		}

		public initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {[id: string]: Application.IApplicationDomain;}): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true);
			if (targetDisplay)
			{
				var application = targetDisplay.application;
				if (application.authenticationUrl && !application.authenticated)
				{
					application.authenticated = true;
					if (includeApplicationEntryPointIds || excludeApplicationEntryPointIds)
					{
						SDL.jQuery.each(application.entryPointGroups, (index, entryPointGroup) =>
							SDL.jQuery.each(entryPointGroup.entryPoints,
									(index, entryPoint: IApplicationEntryPoint) =>
										{
											if ((includeApplicationEntryPointIds && includeApplicationEntryPointIds.indexOf(entryPoint.id) == -1) ||
												(excludeApplicationEntryPointIds && excludeApplicationEntryPointIds.indexOf(entryPoint.id) != -1))
											{
												entryPoint.hidden = true;
											}
										}));
					}

					if (domainDefinitions)
					{
						SDL.jQuery.each(domainDefinitions, (id: string, domainDefinition: Application.IApplicationDomain) =>
						{
							var domain = application.domains[id];
							if (!domain)
							{
								if (window.console)
								{
									window.console.warn("Unable to define domain \"" + id + "\" (application suite \"" + application.id + "\"). Domain is not found.");
								}
							}
							else if (!domain.deferred)
							{
								if (window.console)
								{
									window.console.warn("Unable to define domain \"" + id + "\" (application suite \"" + application.id + "\"). Domain is not deferred.");
								}
							}
							else if (!domain.initialized)
							{
								domain.initialized = true;
								if (domainDefinition)	// passing null will keep the properties defined in configuration
								{
									domain.domain = Url.combinePath(domain.baseUrl, domainDefinition.domain || "");
									domain.validDomains = [domain.domain].concat(
											SDL.jQuery.map(domainDefinition.alternativeDomains || [],
												(validDomain: string, index: number) => Url.combinePath(domain.baseUrl, validDomain)));
								}

								SDL.jQuery.each(application.entryPointGroups, (index: number, entryPointGroup: IApplicationEntryPointGroup) =>
									SDL.jQuery.each(entryPointGroup.entryPoints, (index: number, entryPoint: IApplicationEntryPoint) =>
									{
										if (entryPoint.domain == domain)
										{
											if (!Url.isAbsoluteUrl(entryPoint.baseUrl))
											{
												entryPoint.baseUrl = Url.combinePath(domain.domain, entryPoint.baseUrl);
											}

											if (!Url.isAbsoluteUrl(entryPoint.url))
											{
												entryPoint.url = Url.combinePath(domain.domain, entryPoint.url);

												this.fireEvent("applicationentrypointurlchange", {
														applicationEntryPointId: entryPoint.id,
														applicationId: application.id,
														url: entryPoint.url});
											}
										}
									}));
							}
						});
					}

					if (window.console)
					{
						SDL.jQuery.each(application.domains, (index: number, domain: IApplicationDomain) =>
							{
								if (!domain.initialized)
								{
									window.console.warn("Deferred domain \"" + domain.id + "\" (application suite \"" + application.id + "\") is left undefined.");
								}
							});
					}

					this.fireEvent("applicationsuiteinitialize", {
						applicationId: application.id,
						includeApplicationEntryPointIds: includeApplicationEntryPointIds,
						excludeApplicationEntryPointIds: excludeApplicationEntryPointIds});
				}
				return;
			}
		}

		public resetApplicationSuite(): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true);
			if (targetDisplay)
			{
				var application = targetDisplay.application;
				if (application.authenticationUrl && application.authenticated)
				{
					application.authenticated = false;
					SDL.jQuery.each(application.entryPointGroups, (index, entryPointGroup) =>
						SDL.jQuery.each(entryPointGroup.entryPoints,
								(index, entryPoint: IApplicationEntryPoint) => { entryPoint.hidden = false }));

					this.fireEvent("applicationsuitereset", { applicationId: application.id });
				}
				return;
			}
		}

		public resolveCommonLibraryResources(resourceGroupName: string): Resources.IResolvedResourceGroupResult[]
		{
			return Resources.ResourceManager.resolveResources(resourceGroupName);
		}

		public getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {url: string; data: string;}) => void, onFailure: (error: string) => void): void
		{
			var count = files && files.length;
			if (count)
			{
				if (onFileLoad)
				{
					(<CrossDomainMessaging.ICallbackHandler>onFileLoad).reoccuring = true;
				}

				SDL.jQuery.each<Resources.IFileResourceDefinition>(files, (i, file) =>
				{
					if (file.url)
					{
						var url = file.url;
						if (version && version != Configuration.ConfigurationManager.coreVersion)
						{
							url = url.replace(/^~(\/Library)(\/|$)/i, "~/" + version + "/$1$2");
						}
						file.url = Url.normalize(url);
					}

					if (!file.url || file.url.indexOf("~/") != 0)
					{
						if (onFileLoad && (<CrossDomainMessaging.ICallbackHandler>onFileLoad).retire)
						{
							(<CrossDomainMessaging.ICallbackHandler>onFileLoad).retire();
							onFileLoad = null;
						}

						if (onFailure)
						{
							onFailure("getCommonLibraryResource: library resource URL must start with ~/. Requested URL is '" + (file.url || "") + "'");
							onFailure = null;
						}
						return;
					}

					Resources.FileResourceHandler.load(file,
						onFileLoad || onFailure
							? function(file: Resources.IFileResource)
								{
									if (onFileLoad)
									{
										var url = file.url;
										var data = file.data;
										if (Resources.FileHandlers.CssFileHandler.supports(url))
										{
											data = Resources.FileHandlers.CssFileHandler.updatePaths(data, url, true);
										}
										onFileLoad({url: url, data: data});
									}

									if (--count == 0)
									{
										if (onFileLoad && (<CrossDomainMessaging.ICallbackHandler>onFileLoad).retire)
										{
											(<CrossDomainMessaging.ICallbackHandler>onFileLoad).retire();
											onFileLoad = null;
										}

										if (onFailure && (<CrossDomainMessaging.ICallbackHandler>onFailure).retire)
										{
											(<CrossDomainMessaging.ICallbackHandler>onFailure).retire();
											onFailure = null;
										}
									}
								}
							: null,
						onFileLoad || onFailure
							? function(file: Resources.IFileResource)
								{
									if (onFileLoad && (<CrossDomainMessaging.ICallbackHandler>onFileLoad).retire)
									{
										(<CrossDomainMessaging.ICallbackHandler>onFileLoad).retire();
										onFileLoad = null;
									}

									if (onFailure)
									{
										onFailure(file && file.error);
										onFailure = null;
									}
								}
							: null);
				});
			}
			else
			{
				if (onFileLoad && (<CrossDomainMessaging.ICallbackHandler>onFileLoad).retire)
				{
					(<CrossDomainMessaging.ICallbackHandler>onFileLoad).retire();
					onFileLoad = null;
				}

				if (onFailure && (<CrossDomainMessaging.ICallbackHandler>onFailure).retire)
				{
					(<CrossDomainMessaging.ICallbackHandler>onFailure).retire();
					onFailure = null;
				}
			}
		}

		public getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void
		{
			if (file.url)
			{
				var url = file.url;
				if (version && version != Configuration.ConfigurationManager.coreVersion)
				{
					url = url.replace(/^~(\/Library)(\/|$)/i, "~/" + version + "/$1$2");
				}
				file.url = Url.normalize(url);
			}

			if (!file.url || file.url.indexOf("~/") != 0)
			{
				if (onFailure)
				{
					//onFailure.reoccuring = false; // is false by default
					onFailure("getCommonLibraryResource: library resource URL must start with ~/. Requested URL is '" + (file.url || "") + "'");
					onFailure = null;
				}

				if (onSuccess && (<CrossDomainMessaging.ICallbackHandler>onSuccess).retire)
				{
					(<CrossDomainMessaging.ICallbackHandler>onSuccess).retire();
					onSuccess = null;
				}
				return;
			}

			Resources.FileResourceHandler.load(file,
				onSuccess || onFailure
					? function(file: Resources.IFileResource)
						{
							if (onSuccess)
							{
								var url = file.url;
								var data = file.data;
								if (Resources.FileHandlers.CssFileHandler.supports(url))
								{
									data = Resources.FileHandlers.CssFileHandler.updatePaths(data, url, true);
								}

								//onSuccess.reoccuring = false; // is false by default
								onSuccess(data);
								onSuccess = null;
							}
							if (onFailure && (<CrossDomainMessaging.ICallbackHandler>onFailure).retire)
							{
								(<CrossDomainMessaging.ICallbackHandler>onFailure).retire();
								onFailure = null;
							}
						}
					: null,
				onSuccess || onFailure
					? function(file: Resources.IFileResource)
						{
							if (onFailure)
							{
								//onFailure.reoccuring = false; // is false by default
								onFailure(file && file.error);
								onFailure = null;
							}
							if (onSuccess && (<CrossDomainMessaging.ICallbackHandler>onSuccess).retire)
							{
								(<CrossDomainMessaging.ICallbackHandler>onSuccess).retire();
								onSuccess = null;
							}
						}
					: null);
		}

		public initialize(callback?: () => void): void
		{
			if (!this.initialized)
			{
				if (callback)
				{
					this.initCallbacks.push(callback);
				}

				if (this.initialized === false)
				{
					this.initialized = undefined;
					CrossDomainMessaging.addTrustedDomain("*");
					this.loadApplicationManifests();
				}
			}
			else if (callback)
			{
				callback();
			}
		}

		public registerApplication(applicationEntries: string)
		{
			var sourceDomain: string = (<any>arguments.callee).caller.caller.sourceDomain; // caller 1: ApplicationManifestReceiver, caller 2: CrossDomainMessaging
			if (this.initialized === undefined && this.applicationManifestsCount > 0)
			{
				var sourceWindow: Window = (<any>arguments.callee).caller.caller.sourceWindow;

				for (var i = 0, len = this.applicationManifests.length; i < len; i++)
				{
					var applicationManifestEntry = this.applicationManifests[i];
					if (applicationManifestEntry.iframe.contentWindow == sourceWindow)
					{
						if (applicationManifestEntry.timeout)
						{
							clearTimeout(applicationManifestEntry.timeout);
						}

						if (!Url.isSameDomain(applicationManifestEntry.domain, sourceDomain))
						{
							throw Error("Call to 'registerApplication' from an unexpected domain: " + sourceDomain + ". Expected: " + applicationManifestEntry.domain);
						}

						var manifestDoc = Xml.getNewXmlDocument(applicationEntries);
						if (Xml.hasParseError(manifestDoc))
						{
							throw Error("Invalid xml loaded: " + applicationManifestEntry.url + "\n" + Xml.getParseError(manifestDoc));
						}
						var importedNode = Xml.importNode(Configuration.ConfigurationManager.configuration.ownerDocument, manifestDoc.documentElement, true);
						applicationManifestEntry.xmlElement.appendChild(importedNode);

						var appId = Xml.getInnerText(applicationManifestEntry.xmlElement, ".//configuration/applicationSuite/@id");
						if (applicationManifestEntry.id != appId)
						{
							throw Error("Unexpected application suite id: \"" + appId + "\". Expected value is: \"" + applicationManifestEntry.id + "\"");
						}

						var iframe = applicationManifestEntry.iframe;
						iframe.src = "about:blank";
						document.body.removeChild(iframe);

						this.applicationManifestLoaded();
						return;
					}
				}
			}
			throw Error("Unexpected 'registerApplication' call from domain " + sourceDomain + ".");
		}

		publishEvent(type: string, data: any): void
		{
			SDL.jQuery.each(this.applications, (index, application) =>
				SDL.jQuery.each(application.targetDisplays, (index, targetDisplay) =>
					{
						if (targetDisplay.eventHandler)
						{
							targetDisplay.eventHandler({type: type, data: data});
						}
					}));
		}

		getCallerTargetDisplay(allowAuthenticationTargetDisplay?: boolean, allowSelfTargetDisplay?: boolean, allowUnauthenticated?: boolean): ITargetDisplay
		{
			var sourceWindow;
			var sourceDomain;
			// (callee = this function).(caller = ApplicationHost's function).(caller = ApplicationHostFacade's function).(caller = CrossDomainMessaging's function)
			var caller = (<any>arguments.callee).caller;
			if (!caller || !caller.caller || !caller.caller.caller || !caller.caller.caller.sourceWindow)
			{
				// called locally
				if (allowSelfTargetDisplay)
				{
					return this.selfTargetDisplay;
				}
			}
			else
			{
				sourceWindow = caller.caller.caller.sourceWindow;
				sourceDomain = caller.caller.caller.sourceDomain;
			}

			if (sourceWindow)
			{
				for (var i = 0; i < this.applications.length; i++)
				{
					var application = this.applications[i];

					if (allowAuthenticationTargetDisplay)
					{
						var authenticationTargetDisplay = application.authenticationTargetDisplay;
						if (authenticationTargetDisplay && authenticationTargetDisplay.frame && authenticationTargetDisplay.frame.contentWindow == sourceWindow)
						{
							authenticationTargetDisplay.loadedDomain = sourceDomain;
							if (!Url.isSameDomain(application.authenticationUrl, sourceDomain))
							{
								throw Error("Unexpected origin domain \"" + sourceDomain + "\" from authentication target display for application \"" + application.id +
										"\".\nExpected domain:\n" + Url.getDomain(application.authenticationUrl));
							}
							return authenticationTargetDisplay;
						}
					}

					var targetDisplays = application.targetDisplays;
					for (var j = 0, lenj = targetDisplays.length; j < lenj; j++)
					{
						var targetDisplay = targetDisplays[j];
						if (targetDisplay.frame && targetDisplay.frame.contentWindow == sourceWindow)
						{
							if (!allowUnauthenticated && application.authenticationUrl && !application.authenticated)
							{
								throw Error("Unexpected call from an unauthenticated application \"" + application.id +
										"\": domain \"" + sourceDomain + "\", target display \"" + targetDisplay.name + "\".");
							}
							else
							{
								targetDisplay.loadedDomain = sourceDomain;

								var validDomain = false;
								for (var k = 0, lenk = targetDisplay.domains.length; k < lenk; k++)
								{
									var domain = targetDisplay.domains[k];
									if (domain.initialized)
									{
										if (Types.Array.contains(domain.validDomains, sourceDomain, Url.isSameDomain))
										{
											validDomain = true;
											break;
										}
									}
								}
								if (!validDomain)
								{
									var expectedDomains = [];
									var deferredDomains = [];
									for (var k = 0, lenk = targetDisplay.domains.length; k < lenk; k++)
									{
										var domain = targetDisplay.domains[k];
										if (!domain.initialized)
										{
											deferredDomains.push(domain.id);
										}
										else
										{
											expectedDomains.push(domain.id + ": [" + domain.validDomains.join(", ") + "]");
										}
									}

									throw Error("Unexpected origin domain \"" + sourceDomain + "\" from target display \"" + targetDisplay.name +
										"\".\nExpected domains:\n" + expectedDomains.join(",\n") +
										(deferredDomains.length ? "\nUninitialized deferred domains: " + deferredDomains.join(", ") : ""));
								}

								return targetDisplay;
							}
						}
					}
				}
			}

			throw Error("ApplicationHost: unable to determine caller's target display. Source domain is: " + sourceDomain);
		}

		removeHandler(targetDisplay: ITargetDisplay)
		{
			if (targetDisplay.eventHandler)
			{
				(<CrossDomainMessaging.ICallbackHandler>targetDisplay.eventHandler).retire();
				targetDisplay.eventHandler = null;
			}
		}

		getApplicationEntryPointById(applicationEntryPointId: string, application: IApplication): IApplicationEntryPoint
		{
			if (application)
			{
				var applicationId = application.id;
				var entryPointGroups = application.entryPointGroups;
				for (var i = 0, len = entryPointGroups.length; i < len; i++)
				{
					var entryPoints = entryPointGroups[i].entryPoints;
					for (var j = 0, lenj = entryPoints.length; j < lenj; j++)
					{
						if (entryPoints[j].id == applicationEntryPointId)
						{
							return entryPoints[j];
						}
					}
				}
			}
		}

		// -------------------- Initialization --------------------
		private loadApplicationManifests()
		{
			var nodes = <Element[]>Xml.selectNodes(Configuration.ConfigurationManager.configuration,
				"//configuration/applicationHost/applicationReferences/applicationReference[@url != '' and not(configuration/applicationSuite)]");
			var externalReferencesCount = nodes.length;
			if (externalReferencesCount)
			{
				this.applicationManifestsCount = externalReferencesCount;

				var allReferencesCount = Xml.selectNodes(Configuration.ConfigurationManager.configuration,
					"//configuration/applicationHost/applicationReferences/applicationReference").length;

				var maxAge = (<any>Xml.getInnerText(Configuration.ConfigurationManager.configuration, "//configuration/applicationHost/manifestCacheMaxAge") | 0) || 3600;	//default to 1 hour
				var reloadParameter = ((new Date().getTime() - 1380000000000)/(maxAge * 1000)|0).toString();

				var manifestTimeout = (<any>Xml.getInnerText(Configuration.ConfigurationManager.configuration, "//configuration/applicationHost/manifestLoadTimeout") | 0) || 5;	//default to 5 seconds

				CrossDomainMessaging.addAllowedHandlerBase(ApplicationManifestReceiver);
				SDL.jQuery.each(nodes, (i, xmlElement) =>
					{
						var baseUrlNodes =  Xml.selectNodes(xmlElement, "ancestor::configuration/@baseUrl");
						var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

						var url = xmlElement.getAttribute("url");
						var id = xmlElement.getAttribute("id");
						if (!id)
						{
							throw Error("'id' not specified for application: " + url);
						}

						var domain = Url.getDomain(Url.getAbsoluteUrl(Url.combinePath(baseUrl, url)));

						var iframe = document.createElement("iframe");
						iframe.style.border = "none";
						iframe.style.width = "1px";
						iframe.style.height = "1px";
						document.body.appendChild(iframe);

						var manifest: IApplicationManifest = {
								iframe: iframe,
								domain: domain,
								url: url,
								id: id,
								xmlElement: xmlElement,
								timeout: null
							};

						if (allReferencesCount > 1)
						{
							// if multiple applications -> timeout after 5 seconds (do not timeout if a single application)
							var timeoutHandler = () =>
								{
									if (allReferencesCount > externalReferencesCount ||
										this.applicationManifestsCount < externalReferencesCount)	// some manifests are loaded -> log the error and continue
									{
										if (window.console)
										{
											window.console.warn("Failed to load referenced application manifest from \"" + url + "\" within " + manifestTimeout + " seconds.");
										}
										iframe.src = "about:blank";
										document.body.removeChild(iframe);
										this.applicationManifestLoaded();
									}
									else
									{
										// none of the manifests are loaded -> wait further
										manifest.timeout = setTimeout(timeoutHandler, manifestTimeout * 1000);
									}
								}

							manifest.timeout = setTimeout(timeoutHandler, manifestTimeout * 1000);
						}

						this.applicationManifests.push(manifest);
						iframe.src = Url.setHashParameter(url, "t", reloadParameter);
					});
			}
			else
			{
				this.applicationManifests = undefined;
				this.initializeApplicationHost();
			}
		}

		private applicationManifestLoaded()
		{
			this.applicationManifestsCount--;
			if (this.applicationManifestsCount == 0)	// all application references are processed -> proceed with initialization
			{
				this.applicationManifests = undefined;
				this.initializeApplicationHost();
			}
		}

		private initializeApplicationHost()
		{
			Client.Event.EventRegister.addEventHandler(Client.Localization, "culturechange", (e: Client.Event.Event) =>
			{
				this.publishEvent(e.type, e.data);
			});

			if (Configuration.ConfigurationManager.coreVersion)
			{
				this.libraryVersions.push(Configuration.ConfigurationManager.coreVersion);
			}

			var nodes = Xml.selectNodes(Configuration.ConfigurationManager.configuration, "//configuration/applicationHost/libraryVersions/version");
			var len = nodes.length;
			for (var i = 0; i < len; i++)
			{
				var version = Xml.getInnerText(nodes[i]);
				if (this.libraryVersions.indexOf(version) == -1)
				{
					this.libraryVersions.push(version);
				}
			}

			nodes = Xml.selectNodes(Configuration.ConfigurationManager.configuration,
				"//configuration/applicationHost/applicationReferences/applicationReference[.//configuration/applicationSuite]");
			len = nodes.length;
			if (len)
			{
				for (var i = 0; i < len; i++)
				{
					var applicationReferenceNode = <Element>nodes[i];

					var baseUrlNodes =  Xml.selectNodes(applicationReferenceNode, "ancestor::configuration/@baseUrl");
					var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

					var appId = applicationReferenceNode.getAttribute("id");
					if (this.applicationsIndex[appId])
					{
						throw Error("A duplicate application id encountered: " + appId);
					}
					
					var manifestUrl = Url.getAbsoluteUrl(Url.combinePath(baseUrl, applicationReferenceNode.getAttribute("url")));
					var applicationDomain = Url.getDomain(manifestUrl);

					var applicationSuiteNode = <Element>Xml.selectSingleNode(applicationReferenceNode, ".//configuration/applicationSuite");
					var authenticationUrl = applicationSuiteNode.getAttribute("authenticationUrl");

					var domains: {[id: string]: IApplicationDomain;} = {};
					var domainNodes = Xml.selectNodes(applicationSuiteNode, "applicationDomains/applicationDomain[@id != '']");
					for (var j = 0, lenj = domainNodes.length; j < lenj; j++)
					{
						var domainNode = <Element>domainNodes[j];
						var domainUrl = Url.combinePath(applicationDomain, domainNode.getAttribute("domain"));

						var altDomainNodes = Xml.selectNodes(domainNode, "alternativeDomain");
						var validDomains: string[] = [domainUrl].concat(SDL.jQuery.map(altDomainNodes,
								(altDomainsNode: Node) => Url.combinePath(applicationDomain, Xml.getInnerText(altDomainsNode))));

						var domainId = domainNode.getAttribute("id");
						var deferredAttribute = domainNode.getAttribute("deferred");
						var deferred = (deferredAttribute == "true" || deferredAttribute == "1");

						if (deferred && !authenticationUrl && window.console)
						{
							window.console.warn("Deferred domain definition \"" + domainId + "\" encountered in an application suite \"" + appId + "\" without 'authenticationUrl'.");
						}

						domains[domainId] = {
								id: domainId,
								baseUrl: applicationDomain,
								domain: domainUrl,
								deferred: deferred,
								initialized: !deferred,
								validDomains: validDomains
							};
					}
					
					if (authenticationUrl)
					{
						authenticationUrl = Url.combinePath(manifestUrl, authenticationUrl);
					}

					var application: IApplication = {
							id: appId,
							manifestUrl: manifestUrl,
							authenticationUrl: authenticationUrl,
							authenticationMode: applicationSuiteNode.getAttribute("authenticationMode"),
							authenticationTargetDisplay: null,
							domains: domains,
							targetDisplays: [],
							targetDisplaysIndex: {},
							entryPointGroups: null,
							entryPointGroupsIndex: {}
						};

					if (authenticationUrl)
					{
						application.authenticationTargetDisplay = {
								application: application,
								frame: null
							};
						application.authenticated = false;
					}
					application.entryPointGroups = SDL.jQuery.map(
							Xml.selectNodes(applicationSuiteNode, "applicationEntryPointGroups/applicationEntryPointGroup"),
									(element: Element) =>
										{
											var group = this.buildApplicationEntryPointGroup(element, domains, application);
											application.entryPointGroupsIndex[group.id] = group;
											return group;
										});

					this.applications.push(application);
					this.applicationsIndex[appId] = application;
				}
			}

			this.initialized = true;
			for (var k = 0, lenk = this.initCallbacks.length; k < lenk; k++)
			{
				this.initCallbacks[k]();
			}
			this.initCallbacks = undefined;
		}

		private buildApplicationEntryPointGroup(entryPointGroupNode: Element, domains: {[id: string]: IApplicationDomain;}, parentApplication: IApplication): IApplicationEntryPointGroup
		{
			var id = entryPointGroupNode.getAttribute("id") || "__group-" + Types.Object.getNextId();
			return {
				id: id,
				title: entryPointGroupNode.getAttribute("title"),
				translations: this.buildNameTranslations(entryPointGroupNode),
				entryPoints: SDL.jQuery.map(
						Xml.selectNodes(entryPointGroupNode, "applicationEntryPoints/applicationEntryPoint"),
						(element: Element) => this.buildApplicationEntryPoint(element, domains, parentApplication)),
				application: parentApplication
			};
		}

		private buildApplicationEntryPoint(entryPointNode: Element, domains: {[id: string]: IApplicationDomain;}, parentApplication: IApplication): IApplicationEntryPoint
		{
			var id = entryPointNode.getAttribute("id");
			var domain = domains[entryPointNode.getAttribute("domainId")];
			var url = entryPointNode.getAttribute("url");
			var icon = entryPointNode.getAttribute("icon");
			var type = entryPointNode.getAttribute("type");
			var contextual = entryPointNode.getAttribute("contextual");
			var external = entryPointNode.getAttribute("external");
			var overlay = entryPointNode.getAttribute("overlay");
			var targetDisplayName = entryPointNode.getAttribute("targetDisplay") || id;
			var baseUrl = domain ? (domain.deferred ? url : Url.combinePath(domain.domain, url)) : Url.getAbsoluteUrl(url);

			var targetDisplay = parentApplication.targetDisplaysIndex[targetDisplayName];
			if (!targetDisplay)
			{
				targetDisplay = parentApplication.targetDisplaysIndex[targetDisplayName] = {
						name: targetDisplayName,
						application: parentApplication,
						entryPoints: [],
						domains: [domain],
						frame: null,
						delayedFacadeInvocations: {}
					};

				parentApplication.targetDisplays.push(targetDisplay);
			}
			else if (targetDisplay.domains.indexOf(domain) == -1)
			{
				targetDisplay.domains.push(domain);
			}

			var entryPoint: IApplicationEntryPoint = {
				id: id,
				title: entryPointNode.getAttribute("title"),
				domain: domain,
				baseUrl: baseUrl,
				url: baseUrl,
				icon: icon,
				type: type,
				translations: this.buildNameTranslations(entryPointNode),
				hidden: false,
				contextual: contextual == "true" || contextual == "1",
				external: external == "true" || external == "1",
				overlay: !(overlay == "false" || overlay == "0") && (overlay == "true" || overlay == "1" || undefined),
				targetDisplay: targetDisplay,
				application: parentApplication
			};

			if (icon)
			{
				if (icon.indexOf("~/") == -1)
				{
					entryPoint.icon = Url.combinePath(parentApplication.manifestUrl, icon);
				}
				else
				{
					entryPoint.icon = Url.combinePath(Client.Configuration.ConfigurationManager.corePath, icon.slice(2));
				}
			}
			

			targetDisplay.entryPoints.push(entryPoint);
			return entryPoint;
		}

		private buildNameTranslations(parent: Element): {[lang: string]: string;}
		{
			var translations = {};
			var translationNodes = Xml.selectNodes(parent, "translations/title[@lang]");
			for (var i = 0, len = translationNodes.length; i < len; i++)
			{
				var translationNode = <Element>translationNodes[i];
				translations[translationNode.getAttribute("lang")] = Xml.getInnerText(translationNode);
			}
			return translations;
		}
	}
	SDL.Client.Types.OO.createInterface("SDL.Client.ApplicationHost.ApplicationHostClass", ApplicationHostClass);
	export var ApplicationHost: IApplicationHost = new SDL.Client.ApplicationHost["ApplicationHostClass"]();
	ApplicationHost.initialize();
}
