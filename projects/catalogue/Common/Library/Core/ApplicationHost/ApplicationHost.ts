/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Application/Application.ts" />
/// <reference path="../Application/ApplicationHostFacade.ts" />
/// <reference path="../Application/ApplicationFacade.ts" />
/// <reference path="../ApplicationHost/ApplicationHostFacade.ts" />
/// <reference path="../ConfigurationManager/ConfigurationManager.ts" />
/// <reference path="../CrossDomainMessaging/CrossDomainMessaging.ts" />
/// <reference path="../Types/Object.d.ts" />
/// <reference path="../Xml/Xml.ts" />
/// <reference path="../Types/Url.ts" />
/// <reference path="../Types/Array.d.ts" />
/// <reference path="../Resources/ResourceManager.ts" />
/// <reference path="../Resources/FileResourceHandler.ts" />
/// <reference path="../Resources/FileHandlers/CssFileHandler.ts" />
/// <reference path="../Event/EventRegister.d.ts" />
/// <reference path="../Event/Event.d.ts" />
/// <reference path="ApplicationManifestReceiver.ts" />

var SDL_GoogleTagManager_DataLayer: any[];	// variable used by Google Tag Manager

module SDL.Client.ApplicationHost
{
	import Url = Client.Types.Url;
	export interface IApplicationHost extends Types.IObjectWithEvents
	{
		applications: IApplication[];
		applicationsIndex: {[id: string]: IApplication;};
		initialize(callback?: () => void): void;
		publishEvent(type: string, data: any, targetDisplay?: ITargetDisplay): void;
		registerApplication(applicationEntries: string, caller?: ICallerSignature): void;
		//--------- Begin methods supporting SDL.Client.ApplicationHost.ApplicationHostFacade ----------------
		applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: {type: string; data: any;}) => void, caller?: ICallerSignature): Application.IApplicationHostData;
		exposeApplicationFacade(applicationEntryPointId: string, caller?: ICallerSignature): void;
		applicationEntryPointUnloaded(caller?: ICallerSignature): void;
		setCulture(culture: string, caller?: ICallerSignature): void;
		startCaptureDomEvents(events: string[], caller?: ICallerSignature): void;
		stopCaptureDomEvents(events?: string[], caller?: ICallerSignature): void;
		setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string, caller?: ICallerSignature): void;
		setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string, allowedDomains?: string[], caller?: ICallerSignature): void;
		callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string, allowedDomains?: string[], caller?: ICallerSignature): void;
		initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {[id: string]: Application.IApplicationDomain;}, caller?: ICallerSignature): void;
		resetApplicationSuite(caller?: ICallerSignature): void;
		updateTargetDisplayUrl(url: string, caller?: ICallerSignature): void;

		storeApplicationData(key: string, data: any, caller?: ICallerSignature): void;
		storeApplicationSessionData(key: string, data: any, caller?: ICallerSignature): void;
		getApplicationData(key: string, caller?: ICallerSignature): any;
		getApplicationSessionData(key: string, caller?: ICallerSignature): any;
		clearApplicationData(caller?: ICallerSignature): void;
		clearApplicationSessionData(caller?: ICallerSignature): void;
		removeApplicationData(key: string, caller?: ICallerSignature): void;
		removeApplicationSessionData(key: string, caller?: ICallerSignature): void;

		triggerAnalyticsEvent(event: string, object: any, caller?: ICallerSignature): void;

		showTopBar(caller?: ICallerSignature): void;
		setTopBarOptions(options: any,caller?: ICallerSignature): void;

		resolveCommonLibraryResources(resourceGroupName: string, caller?: ICallerSignature): Resources.IResolvedResourceGroupResult[];
		getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: Application.ICommonLibraryResource) => void, onFailure?: (error: string) => void, caller?: ICallerSignature): void;
		getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void, caller?: ICallerSignature): void;
		//--------- End SDL.Client.ApplicationHost.ApplicationHostFacade methods ----------------
	};

	export interface ICallerSignature
	{
		sourceWindow: Window;
		sourceDomain: string;
		sourceDisplay?: ITargetDisplay;
	}

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
		urlLoggingFilterRegExp?: RegExp;
		domainLoggingHide?: boolean;
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

	export interface ITranslations
	{
		[lang: string]: string;
	};

	export interface IApplicationEntryPointGroup
	{
		id: string;
		title: string;
		translations?: ITranslations;
		entryPoints: IApplicationEntryPoint[];
		application: IApplication;
	};

	export interface IApplicationEntryPoint
	{
		id: string;
		title: string;
		translations: ITranslations;
		domain: IApplicationDomain;
		baseUrl: string;
		url: string;
		icon: string;
		topIcon: string;
		type: string;
		hidden: boolean;
		contextual: boolean;
		visited: boolean;
		external: boolean;
		overlay: boolean;
		targetDisplay: IApplicationEntryPointTargetDisplay;
		application: IApplication;
	};

	export interface ITargetDisplay
	{
		id: string;
		application?: IApplication;
		frame?: HTMLIFrameElement;
		loadedDomain?: string;
		loadedUrl?: string;
		eventHandler?: (event: {type: string; data: any;}) => void;
	};

	export interface IApplicationEntryPointTargetDisplay extends ITargetDisplay
	{
		name: string;
		domains: IApplicationDomain[];
		entryPoints: IApplicationEntryPoint[];
		currentApplicationEntryPoint?: IApplicationEntryPoint;
		exposedApplicationFacade?: string;
		delayedFacadeInvocations: {[entryPointId: string]: IDelayedFacadeInvocation[];};
	};

	export interface IDelayedFacadeInvocation
	{
		(): void;
	};

	export interface IApplicationManifest
	{
		iframe: HTMLIFrameElement;
		domain: string;
		url: string;
		id: string;
		xmlElement: Element;
		timeout: number;
		loadStartTime?: number;
	};

	interface IDelayedInvocation
	{
		(): void;
	};

	export interface IApplicationSessionData
	{
		entryPoints: {[id: string]: IApplicationEntryPointSessionData};
	}

	export interface IApplicationEntryPointSessionData
	{
		baseUrl: string;
		url?: string;
		visited?: boolean;
	}

	interface IApplicationStorageEntryPointDomainData
	{
		[key: string]: any;
	}

	interface IApplicationStorageManifestDomainData
	{
		[entryPointDomain: string]: IApplicationStorageEntryPointDomainData;
	}

	interface IApplicationStorageData
	{
		[manifestDomain: string]: IApplicationStorageManifestDomainData;
	}

	var CaptureDomEvents =
	{
		mouseup: "mouseup",
		mousemove: "mousemove"
	}

	export interface IApplicationHostClassProperties extends Types.IObjectWithEventsProperties
	{
		applications: IApplication[];
		applicationsIndex: {[id: string]: IApplication;};

		activeApplicationEntryPointId: string;
		activeApplicationEntryPoint: IApplicationEntryPoint;
		activeApplicationId: string;
		selfTargetDisplay: ITargetDisplay;
		initialized: boolean;
		libraryVersions: string[];
		initCallbacks: {(): void;}[];
		applicationManifestsCount: number;
		applicationManifests: IApplicationManifest[];
		applicationsSessionData: {[id: string]: IApplicationSessionData};
		domEventsTargetDisplays: {[id: string]: string[];};
	}

	eval(Types.OO.enableCustomInheritance);
	export class ApplicationHostClass extends Types.ObjectWithEvents implements IApplicationHost
	{
		public applications: IApplication[];
		public applicationsIndex: {[id: string]: IApplication;};
		private analyticsDataLayerProperties: {[property: string]: any;} = { timing: "" };	// object used to clear data layer data set by previous trigger events/tags
		private manifestsLoadStartTime: number;

		properties: IApplicationHostClassProperties;
		
		constructor()
		{
			super();

			var p = this.properties;

			this.applications = p.applications = [];
			this.applicationsIndex = p.applicationsIndex = {};

			p.selfTargetDisplay = { id: "display-self" };
			p.initialized = false;
			p.libraryVersions = [];
			p.initCallbacks = [];
			p.applicationManifestsCount = 0;
			p.applicationManifests = [];
			p.domEventsTargetDisplays = {};
		}

		public $initialize()
		{
			var enableGoogleTagManager: string = Xml.getInnerText(Configuration.ConfigurationManager.configuration,
				"//configuration/applicationHost/enableGoogleTagManager");

			if (enableGoogleTagManager == "true" || enableGoogleTagManager == "1")
			{
				var googleTagManagerContainerId = Xml.getInnerText(Configuration.ConfigurationManager.configuration,
					"//configuration/applicationHost/googleTagManagerContainerId");
				if (googleTagManagerContainerId)
				{
					SDL_GoogleTagManager_DataLayer = [];
					this.triggerAnalyticsEvent("gtm.js", { 'gtm.start': new Date().getTime() });

					var firstScript = document.getElementsByTagName("script")[0];
					var script = document.createElement("script");
					script.async = true;
					script.src = "//www.googletagmanager.com/gtm.js?id=" + googleTagManagerContainerId + "&l=SDL_GoogleTagManager_DataLayer";
					firstScript.parentNode.insertBefore(script, firstScript);
				}
			}
		}

		public applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: {type: string; data: any;}) => void, caller?: ICallerSignature): Application.IApplicationHostData
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, false, caller);
			if (targetDisplay)
			{
				this._stopCaptureDomEvents(targetDisplay);
				if (eventHandler)
				{
					(<CrossDomainMessaging.ICallbackHandler>eventHandler).reoccuring = true;
					targetDisplay.eventHandler = eventHandler;
				}
				else
				{
					targetDisplay.eventHandler = null;
				}

				var p = this.properties;
				var libraryVersionSupported: boolean = !libraryVersion || p.libraryVersions.indexOf(libraryVersion) != -1;
				this.triggerAnalyticsEvent("application-entry-point-load", {
								type: "Application Host API",
								coreVersion: libraryVersion,
								libraryVersionSupported: libraryVersionSupported
							}, caller);

				this.fireEvent("targetdisplayload", { targetDisplay: targetDisplay });

				return {
						applicationHostUrl: window.location.href.replace(/#.*$/, ""),	// remove the hash parameters from the URL
						applicationHostCorePath: Types.Url.getAbsoluteUrl(Configuration.ConfigurationManager.corePath),
						applicationSuiteId: targetDisplay.application.id,
						version: Configuration.ConfigurationManager.version,
						libraryVersionSupported: libraryVersionSupported,
						culture: Localization.getCulture(),
						activeApplicationEntryPointId: p.activeApplicationEntryPointId,
						activeApplicationId: p.activeApplicationId,
						sharedSettings: {
								activityIndicatorLegacyMode: Configuration.ConfigurationManager.getAppSetting("activityIndicatorLegacyMode")
							}
					};
			}
		}

		public exposeApplicationFacade(applicationEntryPointId: string, caller?: ICallerSignature): void
		{
			var targetDisplay = <IApplicationEntryPointTargetDisplay>this.getCallerTargetDisplay(false, false, false, caller);
			if (targetDisplay)
			{
				var application = targetDisplay.application;
				var applicationEntryPoint = this.getApplicationEntryPointById(applicationEntryPointId, application);
				if (!applicationEntryPoint || applicationEntryPoint.hidden)
				{
					var error = "Unknown application entry point ID: " + applicationEntryPointId + ".";
					this.triggerAnalyticsEvent("application-host-api-error", {
							type: "Application Host API",
							method: "exposeApplicationFacade",
							data: error
						});
					throw Error(error);
				}

				if (!applicationEntryPoint.domain.initialized)
				{
					this.triggerAnalyticsEvent("application-host-api-error", {
							type: "Application Host API",
							method: "exposeApplicationFacade",
							data: "Unable to determine valid origin domains for application facade \"" + applicationEntryPointId +
								"\". Deferred domain \"" + applicationEntryPoint.domain.id + "\" has not been uninitialized."
						});
					throw Error("Unable to determine valid origin domains for application facade \"" + applicationEntryPointId +
							"\" (application suite \"" + application.id + "\"). Deferred domain \"" + applicationEntryPoint.domain.id + "\" has not been uninitialized.");
				}

				if (!Types.Array.contains(applicationEntryPoint.domain.validDomains, targetDisplay.loadedDomain, Url.isSameDomain))
				{
					this.triggerAnalyticsEvent("application-host-api-error", {
							type: "Application Host API",
							method: "exposeApplicationFacade",
							data: "Application facade \"" + applicationEntryPointId + "\" exposed from an unexpected domain: " + targetDisplay.loadedDomain
						});
					throw Error("Application facade \"" + applicationEntryPointId + "\" (application suite \"" + application.id + "\") exposed from an unexpected domain: " + targetDisplay.loadedDomain);
				}

				this.triggerAnalyticsEvent("application-facade-expose", {
						type: "Application Host API",
						applicationEntryPoint: applicationEntryPointId
					}, caller);

				var invocations = targetDisplay.delayedFacadeInvocations[applicationEntryPointId];
				if (invocations)
				{
					for (var i = 0; i < invocations.length; i++)
					{
						invocations[i]();
					}
					targetDisplay.delayedFacadeInvocations[applicationEntryPointId] = null;
				}
				if (!targetDisplay.currentApplicationEntryPoint)
				{
					targetDisplay.currentApplicationEntryPoint = applicationEntryPoint;
				}
				targetDisplay.exposedApplicationFacade = applicationEntryPointId;
			}
		}

		public applicationEntryPointUnloaded(caller?: ICallerSignature): void
		{
			var targetDisplay: ITargetDisplay = this.getCallerTargetDisplay(true, false, true, caller);
			if (targetDisplay)
			{
				this.triggerAnalyticsEvent("application-entry-point-unload", {
								type: "Application Host API"
							}, caller);
				this._stopCaptureDomEvents(targetDisplay);
				targetDisplay.eventHandler = null;
				targetDisplay.loadedDomain = null;
				(<IApplicationEntryPointTargetDisplay>targetDisplay).exposedApplicationFacade = null;
				this.fireEvent("targetdisplayunload", {targetDisplay: targetDisplay});
			}
		}

		public setCulture(culture: string, caller?: ICallerSignature): void
		{
			if (this.getCallerTargetDisplay(true, true, false, caller))
			{
				this.triggerAnalyticsEvent("set-culture", {
								type: "Application Host API",
								data: culture
							}, caller);
				Localization.setCulture(culture);
			}
		}

		public startCaptureDomEvents(events: string[], caller?: ICallerSignature): void
		{
			if (events && events.length)
			{
				var targetDisplay: ITargetDisplay = this.getCallerTargetDisplay(true, false, true, caller);
				if (targetDisplay)
				{
					var p = this.properties;
					var targetDisplayId = targetDisplay.id;
					var targetDisplayEvents: string[] = p.domEventsTargetDisplays[targetDisplayId];
					if (!targetDisplayEvents)
					{
						targetDisplayEvents = p.domEventsTargetDisplays[targetDisplayId] = [];
					}
					SDL.jQuery.each(events, (i: number, event: string) =>
						{
							if ((event in CaptureDomEvents) && targetDisplayEvents.indexOf(event) == -1)
							{
								targetDisplayEvents.push(event);
								var listening = false;
								SDL.jQuery.each(p.domEventsTargetDisplays, (id: string, events: string[]) =>
									{
										if (id != targetDisplayId && events.indexOf(event) != -1)
										{
											listening = true;
											return false;
										}
									});
								if (!listening)
								{
									this.addCaptureDomEventListener(event);
								}
							}
						});

					this.triggerAnalyticsEvent("start-capture-dom-events", {
								type: "Application Host API",
								data: events.join(", ")
							}, caller);
				}
			}
		}

		public stopCaptureDomEvents(events?: string[], caller?: ICallerSignature): void
		{
			this.triggerAnalyticsEvent("stop-capture-dom-events", {
								type: "Application Host API",
								data: events && events.join(", ")
							}, caller);
			this._stopCaptureDomEvents(this.getCallerTargetDisplay(true, false, true, caller), events);
		}

		public setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string, caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, true, false, caller);
			if (targetDisplay)
			{
				var p = this.properties;
				var applicationEntryPoint: IApplicationEntryPoint;
				if (applicationEntryPointId || targetDisplay != p.selfTargetDisplay)	// hosted applications are not allowed to unselect application entry points
				{
					applicationEntryPoint = this.getApplicationEntryPointById(applicationEntryPointId, applicationSuiteId ? p.applicationsIndex[applicationSuiteId] : targetDisplay.application);
					if (!applicationEntryPoint || applicationEntryPoint.hidden)
					{
						var error = "Unable to activate application entry point '" + applicationEntryPointId + "' (application suite \"" +
								(applicationSuiteId || targetDisplay.application && targetDisplay.application.id) + "\"). Application entry point is not found.";

						this.triggerAnalyticsEvent("application-host-api-error", {
								type: "Application Host API",
								method: "setActiveApplicationEntryPoint",
								data: error
							});
						throw Error(error);
					}
				}

				applicationSuiteId = applicationEntryPointId ? applicationSuiteId || targetDisplay.application.id : null;
				if (applicationEntryPointId != p.activeApplicationEntryPointId || applicationSuiteId != p.activeApplicationId)
				{
					p.activeApplicationEntryPoint = applicationEntryPoint;
					p.activeApplicationEntryPointId = applicationEntryPointId;
					p.activeApplicationId = applicationSuiteId;

					this.triggerAnalyticsEvent("set-active-application-entry-point", {
								type: "Application Host API",
								applicationEntryPoint: applicationEntryPointId,
								application: applicationSuiteId
							}, caller);

					if (applicationEntryPoint)
					{
						applicationEntryPoint.targetDisplay.currentApplicationEntryPoint = applicationEntryPoint;

						if (!applicationEntryPoint.visited)
						{
							applicationEntryPoint.visited = true;
							this.saveApplicationEntryPointSessionData(applicationEntryPoint, "visited");
							this.fireEvent("applicationentrypointvisited", {applicationEntryPointId: applicationEntryPointId, applicationId: applicationSuiteId});
						}
					}
					this.fireEvent("applicationentrypointactivate", {applicationEntryPointId: applicationEntryPointId, applicationId: applicationSuiteId});
					this.publishEvent("applicationentrypointactivate", {applicationEntryPointId: applicationEntryPointId, applicationId: applicationSuiteId});
				}
			}
		}

		public setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string, allowedDomains?: string[], caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, true, false, caller);
			if (targetDisplay)
			{
				var p = this.properties;
				var applicationEntryPoint = this.getApplicationEntryPointById(applicationEntryPointId, applicationSuiteId ? p.applicationsIndex[applicationSuiteId] : targetDisplay.application);
				if (!applicationEntryPoint || applicationEntryPoint.hidden)
				{
					var error = "Unable to set URL for application entry point '" + applicationEntryPointId + "' (application suite \"" +
								(applicationSuiteId || targetDisplay.application && targetDisplay.application.id) + "\"). Application entry point is not found.";

					this.triggerAnalyticsEvent("application-host-api-error", {
							type: "Application Host API",
							method: "setApplicationEntryPointUrl",
							data: error
						});
					throw Error(error);
				}

				if (!applicationSuiteId)
				{
					applicationSuiteId = targetDisplay.application.id;
				}

				if (applicationEntryPoint.url != url)
				{
					var domain = Url.getDomain(url);
					if (!applicationEntryPoint.domain.initialized)
					{
						if (domain)
						{
							this.triggerAnalyticsEvent("application-host-api-error", {
								type: "Application Host API",
								method: "setApplicationEntryPointUrl",
								data: "Unable to set URL for application entry point '" + applicationEntryPointId +
									"'  (application suite \"" + applicationSuiteId + "\") to \"" +
										this.getLoggedApplicationUrl(Url.makeRelativeUrl(applicationEntryPoint.baseUrl, url),
												applicationSuiteId ? p.applicationsIndex[applicationSuiteId] : targetDisplay.application) +
									"\". Deferred domain \"" + applicationEntryPoint.domain.id + "\" has not been uninitialized."
							});
							throw Error("Unable to set URL for application entry point '" + applicationEntryPointId +
								"'  (application suite \"" + applicationSuiteId + "\") to \"" + url +
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
							this.triggerAnalyticsEvent("application-host-api-error", {
								type: "Application Host API",
								method: "setApplicationEntryPointUrl",
								data: "Unable to set URL for application entry point '" + applicationEntryPointId +
									"' (application suite \"" + applicationSuiteId +
									"\"). Target application entry point domain is untrusted" +
									(applicationEntryPoint.application.domainLoggingHide
										? "."
										: ": " + Url.getDomain(applicationEntryPoint.url)) + ". Trusted domains are: " + allowedDomains.join(", ")
							});
							throw Error("Unable to set URL for application entry point '" + applicationEntryPointId +
								"' (application suite \"" + applicationSuiteId +
								"\"). Target application entry point domain is untrusted: " + Url.getDomain(applicationEntryPoint.url) +
								". Trusted domains are: " + allowedDomains.join(", "));
						}

						url = Url.combinePath(applicationEntryPoint.baseUrl, url);
						if (domain && !Types.Array.contains(applicationEntryPoint.domain.validDomains, Url.getDomain(url), Url.isSameDomain))
						{
							this.triggerAnalyticsEvent("application-host-api-error", {
								type: "Application Host API",
								method: "setApplicationEntryPointUrl",
								data: "Unable to set URL for application entry point '" + applicationEntryPointId +
									"' (application suite \"" + applicationSuiteId + "\"). New URL has an invalid domain: " + domain
							});
							throw Error("Unable to set URL for application entry point '" + applicationEntryPointId +
								"' (application suite \"" + applicationSuiteId +
								"\"). New URL has an invalid domain: " + domain + ". Allowed domains are: " + applicationEntryPoint.domain.validDomains.join(", "));
						}
					}

					if (applicationEntryPoint.url != url)
					{
						applicationEntryPoint.url = url;
						this.saveApplicationEntryPointSessionData(applicationEntryPoint, "url");

						this.triggerAnalyticsEvent("set-application-entry-point-url", {
								type: "Application Host API",
								url: this.getLoggedApplicationEntryPointUrl(applicationEntryPoint),
								applicationEntryPoint: applicationEntryPointId,
								application: applicationSuiteId
							}, caller);
						this.fireEvent("applicationentrypointurlchange", {
								applicationEntryPointId: applicationEntryPointId,
								applicationId: applicationSuiteId,
								url: url})
					}
				}
			}
		}

		public updateTargetDisplayUrl(url: string, caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, false, caller);
			if (targetDisplay && targetDisplay.loadedUrl != url)
			{
				targetDisplay.loadedUrl = url;

				this.triggerAnalyticsEvent("update-target-display-url", {
								type: "Application Host API",
								url: this.getLoggedApplicationUrl(caller ? Url.makeRelativeUrl(caller.sourceDomain, url) : url, targetDisplay.application)
							}, caller);

				this.fireEvent("targetdisplayurlchange", {
						targetDisplay: targetDisplay,
						url: url})
			}
		}

		public callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string, allowedDomains?: string[], caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, true, false, caller);
			if (targetDisplay)
			{
				var p = this.properties;
				var applicationEntryPoint = this.getApplicationEntryPointById(applicationEntryPointId, applicationSuiteId ? p.applicationsIndex[applicationSuiteId] : targetDisplay.application);
				applicationSuiteId = applicationSuiteId || (targetDisplay.application && targetDisplay.application.id);
				if (!applicationEntryPoint || applicationEntryPoint.hidden)
				{
					this.triggerAnalyticsEvent("application-host-api-error", {
							type: "Application Host API",
							method: "callApplicationFacade",
							data: "Unable to call application facade '" + applicationEntryPointId + "' (application suite \"" +
								applicationSuiteId + "\"). Application facade is not found."
						});
					throw Error("Unable to call application facade '" + applicationEntryPointId + "' (application suite \"" +
						applicationSuiteId + "\"). Application facade is not found.");
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
							this.triggerAnalyticsEvent("application-host-api-error", {
									type: "Application Host API",
									method: "callApplicationFacade",
									data: "Unable to call application facade '" + applicationEntryPointId +
										"' (application suite \"" + applicationSuiteId +
										"\"). Target application domain is untrusted" +
										(applicationEntryPoint.application.domainLoggingHide ? "." : ": " + Url.getDomain(applicationEntryPoint.url))
								});
							throw Error("Unable to call application facade '" + applicationEntryPointId +
								"' (application suite \"" + applicationSuiteId +
								"\"). Target application domain is untrusted: " + Url.getDomain(applicationEntryPoint.url));
						}

						this.triggerAnalyticsEvent("application-facade-invoke", {
								type: "Application Host API",
								applicationEntryPoint: applicationEntryPointId,
								application: applicationSuiteId,
								method: method
							}, caller);

						CrossDomainMessaging.call(facadeTargetDisplay.frame.contentWindow,
							"SDL.Client.Application.ApplicationFacadeStub.callApplicationFacade",
							[method, args, callerData], callback);
					}

				this.triggerAnalyticsEvent("application-facade-request", {
								type: "Application Host API",
								applicationEntryPoint: applicationEntryPointId,
								application: applicationSuiteId,
								method: method
							}, caller);

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

		public initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {[id: string]: Application.IApplicationDomain;}, caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, false, caller);
			if (targetDisplay)
			{
				var application = targetDisplay.application;
				if (application.authenticationUrl && !application.authenticated)
				{
					application.authenticated = true;
					if (includeApplicationEntryPointIds || excludeApplicationEntryPointIds)
					{
						SDL.jQuery.each(application.entryPointGroups, (index: number, entryPointGroup: IApplicationEntryPointGroup) =>
							SDL.jQuery.each(entryPointGroup.entryPoints,
									(index: number, entryPoint: IApplicationEntryPoint) =>
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

					this.triggerAnalyticsEvent("application-initialize", {
								type: "Application Host API"
							}, caller);

					this.fireEvent("applicationsuiteinitialize", {
						applicationId: application.id,
						includeApplicationEntryPointIds: includeApplicationEntryPointIds,
						excludeApplicationEntryPointIds: excludeApplicationEntryPointIds});
				}
				return;
			}
		}

		public resetApplicationSuite(caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, false, caller);
			if (targetDisplay)
			{
				var application = targetDisplay.application;
				if (application.authenticationUrl && application.authenticated)
				{
					application.authenticated = false;
					SDL.jQuery.each(application.entryPointGroups, (index: number, entryPointGroup: IApplicationEntryPointGroup) =>
						SDL.jQuery.each(entryPointGroup.entryPoints,
								(index: number, entryPoint: IApplicationEntryPoint) => { entryPoint.hidden = false }));

					this.triggerAnalyticsEvent("application-reset", {
								type: "Application Host API"
							}, caller);

					this.fireEvent("applicationsuitereset", { applicationId: application.id });
				}
				return;
			}
		}

		public storeApplicationData(key: string, data: any, caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, false, caller);
			if (targetDisplay)
			{
				this.triggerAnalyticsEvent("application-data-store", {
								type: "Application Host API",
								key: key
							}, caller);
				this._storeApplicationData(localStorage, targetDisplay.application, targetDisplay.loadedDomain, key, data);
			}
		}

		public storeApplicationSessionData(key: string, data: any, caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, false, caller);
			if (targetDisplay)
			{
				this.triggerAnalyticsEvent("application-session-data-store", {
								type: "Application Host API",
								key: key
							}, caller);
				this._storeApplicationData(sessionStorage, targetDisplay.application, targetDisplay.loadedDomain, key, data);
			}
		}

		public getApplicationData(key: string, caller?: ICallerSignature): any
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, false, caller);
			if (targetDisplay)
			{
				this.triggerAnalyticsEvent("application-data-get", {
								type: "Application Host API",
								key: key
							}, caller);
				return this._getApplicationData(localStorage, targetDisplay.application, targetDisplay.loadedDomain, key);
			}
		}

		public getApplicationSessionData(key: string, caller?: ICallerSignature): any
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, false, caller);
			if (targetDisplay)
			{
				this.triggerAnalyticsEvent("application-session-data-get", {
								type: "Application Host API",
								key: key
							}, caller)
				return this._getApplicationData(sessionStorage, targetDisplay.application, targetDisplay.loadedDomain, key);
			}
		}

		public clearApplicationData(caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, false, caller);
			if (targetDisplay)
			{
				this.triggerAnalyticsEvent("application-data-clear", {
								type: "Application Host API"
							}, caller)
				this._removeApplicationData(localStorage, targetDisplay.application, targetDisplay.loadedDomain);
			}
		}

		public clearApplicationSessionData(caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, false, caller);
			if (targetDisplay)
			{
				this.triggerAnalyticsEvent("application-session-data-clear", {
								type: "Application Host API"
							}, caller)
				this._removeApplicationData(sessionStorage, targetDisplay.application, targetDisplay.loadedDomain);
			}
		}

		public removeApplicationData(key: string, caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, false, caller);
			if (targetDisplay)
			{
				this.triggerAnalyticsEvent("application-data-remove", {
								type: "Application Host API",
								key: key
							}, caller)
				this._removeApplicationData(localStorage, targetDisplay.application, targetDisplay.loadedDomain, key);
			}
		}

		public removeApplicationSessionData(key: string, caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, false, caller);
			if (targetDisplay)
			{
				this.triggerAnalyticsEvent("application-session-data-remove", {
								type: "Application Host API",
								key: key
							}, caller)
				this._removeApplicationData(sessionStorage, targetDisplay.application, targetDisplay.loadedDomain, key);
			}
		}

		public triggerAnalyticsEvent(event: string, object: any, caller?: ICallerSignature): void
		{
			if (SDL_GoogleTagManager_DataLayer)
			{
				if (SDL_GoogleTagManager_DataLayer.length >= 100)	// limit the size of the dataLayer collection: when reaches 100 reduce to 30
				{
					SDL_GoogleTagManager_DataLayer.splice(0, SDL_GoogleTagManager_DataLayer.length - 30);
				}

				var targetDisplay: ITargetDisplay = caller ? (caller.sourceDisplay || this.getCallerTargetDisplay(true, true, true, caller)) : null;
				var application = targetDisplay && targetDisplay.application;
				var isAuthentication = application && application.authenticationTargetDisplay == targetDisplay;
				var applicationEntryPoint: IApplicationEntryPoint = !isAuthentication && targetDisplay &&
						((<IApplicationEntryPointTargetDisplay>targetDisplay).currentApplicationEntryPoint ||
						((<IApplicationEntryPointTargetDisplay>targetDisplay).entryPoints && (<IApplicationEntryPointTargetDisplay>targetDisplay).entryPoints.length == 1 && 
							(<IApplicationEntryPointTargetDisplay>targetDisplay).entryPoints[0]));

				var eventObject: any;
				if (!object)
				{
					eventObject = SDL.jQuery.extend({}, this.analyticsDataLayerProperties);
				}
				else
				{
					eventObject = SDL.jQuery.extend({}, this.analyticsDataLayerProperties, object);
					for (var prop in object)
					{
						this.analyticsDataLayerProperties[prop] = "";
					}
				}

				eventObject.event = event;

				if (caller)
				{
					var applicationId = application && application.id;
					var authenticationId = isAuthentication && "[authentication" + (applicationId ? " '" + applicationId + "'" : "") + "]";

					eventObject.sourceDisplay = authenticationId || ((<IApplicationEntryPointTargetDisplay>targetDisplay).name || "[" + targetDisplay.id + "]");
					eventObject.sourceApplication = applicationId || "[unknown]";
					eventObject.sourceApplicationEntryPoint = authenticationId || (applicationEntryPoint && applicationEntryPoint.id || "[unknown]");
					eventObject.sourceUrl = authenticationId ||
						(applicationEntryPoint
							? this.getLoggedApplicationEntryPointUrl(applicationEntryPoint)
							: (targetDisplay &&
								(application && this.getLoggedApplicationUrl(targetDisplay.loadedUrl, application) ||
								targetDisplay.loadedUrl)) ||
						"[unknown]");
					eventObject.sourceDomain = caller.sourceDomain;
				}
				else
				{
					eventObject.sourceDisplay = eventObject.sourceDisplay != null ? eventObject.sourceDisplay : "[application host]";
					eventObject.sourceApplication = eventObject.sourceApplication != null ? eventObject.sourceApplication : "[application host]";
					eventObject.sourceApplicationEntryPoint = eventObject.sourceApplicationEntryPoint != null ? eventObject.sourceApplicationEntryPoint : "[application host]";
					eventObject.sourceUrl = eventObject.sourceUrl != null ? eventObject.sourceUrl : "(local)";
					eventObject.sourceDomain = eventObject.sourceDomain != null ? eventObject.sourceDomain : "(local)";
				}

				SDL_GoogleTagManager_DataLayer.push(eventObject);
			}
		}

		public showTopBar(caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, true, caller);
			if (targetDisplay)
			{
				this.triggerAnalyticsEvent("topbar-show", {
								type: "Application Host API"
							}, caller)
				this.fireEvent("showtopbar", { targetDisplay: targetDisplay });
			}
		}

		public setTopBarOptions(options: any, caller?: ICallerSignature): void
		{
			var targetDisplay = this.getCallerTargetDisplay(true, false, true, caller);
			if (targetDisplay)
			{
				this.fireEvent("settopbaroptions", { targetDisplay: targetDisplay, options: options });
			}
		}

		public resolveCommonLibraryResources(resourceGroupName: string, caller?: ICallerSignature): Resources.IResolvedResourceGroupResult[]
		{
			this.triggerAnalyticsEvent("library-resources-resolve", {
								type: "Application Host API",
								data: resourceGroupName
							}, caller)
			try
			{
				return Resources.ResourceManager.resolveResources(resourceGroupName);
			}
			catch (error)
			{
				this.triggerAnalyticsEvent("application-host-api-error", {
						type: "Application Host API",
						data: error,
						method: "resolveCommonLibraryResources"
					}, caller);
			}
		}

		public getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: Application.ICommonLibraryResource) => void, onFailure?: (error: string) => void, caller?: ICallerSignature): void
		{
			var count = files && files.length;

			this.triggerAnalyticsEvent("library-resources-get", {
								type: "Application Host API",
								data: count ? SDL.jQuery.map(files, (file: Resources.IFileResourceDefinition) => file.url).join(", ") : null
							}, caller)

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
							url = url.replace(/^~(\/|$)/i, "~/" + version + "$1");
						}
						file.url = Url.normalize(url);
					}

					if (!file.url || file.url.indexOf("~/") != 0)
					{
						var error = "library resource URL must start with ~/. Requested URL is '" + (file.url || "") + "'";
						this.triggerAnalyticsEvent("application-host-api-error", {
								type: "Application Host API",
								data: error,
								method: "getCommonLibraryResources"
							}, caller);

						if (onFileLoad && (<CrossDomainMessaging.ICallbackHandler>onFileLoad).retire)
						{
							(<CrossDomainMessaging.ICallbackHandler>onFileLoad).retire();
							onFileLoad = null;
						}

						if (onFailure)
						{
							onFailure("getCommonLibraryResources: " + error);
							onFailure = null;
						}
						return;
					}

					Resources.FileResourceHandler.load(file,
							(file: Resources.IFileResource) =>
								{
									if (onFileLoad)
									{
										var url = file.url;
										var data = file.data;
										if (Resources.FileHandlers.CssFileHandler.supports(url))
										{
											data = Resources.FileHandlers.CssFileHandler.updatePaths(file, true);
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
								},
							(file: Resources.IFileResource) =>
								{
									this.triggerAnalyticsEvent("application-host-api-error", {
											type: "Application Host API",
											data: file ? (file.url + ": " + file.error) : "",
											method: "getCommonLibraryResources"
										}, caller);

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
								},
						false,
						caller);
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

		public getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void, caller?: ICallerSignature): void
		{
			if (file.url)
			{
				var url = file.url;
				if (version && version != Configuration.ConfigurationManager.coreVersion)
				{
					url = url.replace(/^~(\/|$)/i, "~/" + version + "$1");
				}
				file.url = Url.normalize(url);
			}

			if (!file.url || file.url.indexOf("~/") != 0)
			{
				var error = "library resource URL must start with ~/. Requested URL is '" + (file.url || "") + "'";
				this.triggerAnalyticsEvent("application-host-api-error", {
							type: "Application Host API",
							data: error,
							method: "getCommonLibraryResource"
						}, caller);

				if (onFailure)
				{
					//onFailure.reoccuring = false; // is false by default
					onFailure("getCommonLibraryResource: " + error);
					onFailure = null;
				}

				if (onSuccess && (<CrossDomainMessaging.ICallbackHandler>onSuccess).retire)
				{
					(<CrossDomainMessaging.ICallbackHandler>onSuccess).retire();
					onSuccess = null;
				}
				return;
			}

			this.triggerAnalyticsEvent("library-resources-get", {
								type: "Application Host API",
								data: file.url
							}, caller)

			Resources.FileResourceHandler.load(file,
					(file: Resources.IFileResource) =>
						{
							if (onSuccess)
							{
								var url = file.url;
								var data = file.data;
								if (Resources.FileHandlers.CssFileHandler.supports(url))
								{
									data = Resources.FileHandlers.CssFileHandler.updatePaths(file, true);
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
						},
					(file: Resources.IFileResource) =>
						{
							this.triggerAnalyticsEvent("application-host-api-error", {
								type: "Application Host API",
								data: file ? (file.url + ": " + file.error) : "",
								method: "getCommonLibraryResource"
							}, caller);

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
						},
					false,
					caller);
		}

		public initialize(callback?: () => void): void
		{
			var p = this.properties;
			if (!p.initialized)
			{
				if (callback)
				{
					p.initCallbacks.push(callback);
				}

				if (p.initialized === false)
				{
					p.initialized = undefined;
					CrossDomainMessaging.addTrustedDomain("*");
					this.loadApplicationManifests();
				}
			}
			else if (callback)
			{
				callback();
			}
		}

		public registerApplication(applicationEntries: string, caller?: ICallerSignature): void
		{
			var p = this.properties;
			var t = (+new Date());
			var sourceDomain: string = caller.sourceDomain;
			if (p.initialized === undefined && p.applicationManifestsCount > 0)
			{
				var sourceWindow: Window = caller.sourceWindow;

				for (var i = 0, len = p.applicationManifests.length; i < len; i++)
				{
					var applicationManifestEntry = p.applicationManifests[i];
					if (applicationManifestEntry.iframe.contentWindow == sourceWindow)
					{
						var error: boolean = false;

						if (applicationManifestEntry.timeout)
						{
							clearTimeout(applicationManifestEntry.timeout);
						}

						if (!Url.isSameDomain(applicationManifestEntry.domain, sourceDomain))
						{
							error = true;
							if (window.console)
							{
								window.console.error("Call to 'registerApplication' from an unexpected domain: " + sourceDomain + ". Expected: " + applicationManifestEntry.domain);
							}
						}
						else
						{
							var manifestDoc = Xml.getNewXmlDocument(applicationEntries);
							if (Xml.hasParseError(manifestDoc))
							{
								error = true;
								if (window.console)
								{
									window.console.error("Invalid xml loaded: " + applicationManifestEntry.url + "\n" + Xml.getParseError(manifestDoc));
								}
							}
							else
							{
								var appId = Xml.getInnerText(manifestDoc, "/configuration/applicationSuite/@id");
								if (applicationManifestEntry.id != appId)
								{
									error = true;
									if (window.console)
									{
										window.console.error("Unexpected application suite id: \"" + appId + "\". Expected value is: \"" + applicationManifestEntry.id + "\"");
									}
								}
							}
						}

						var iframe = applicationManifestEntry.iframe;
						iframe.src = "about:blank";
						document.body.removeChild(iframe);

						if (!error)
						{
							var importedNode = Xml.importNode(Configuration.ConfigurationManager.configuration.ownerDocument, manifestDoc.documentElement, true);
							applicationManifestEntry.xmlElement.appendChild(importedNode);
						}

						this.triggerAnalyticsEvent("manifest-load", {
								type: "Application Host API",
								timing: t - applicationManifestEntry.loadStartTime,
								sourceDisplay: "[manifest '" + applicationManifestEntry.id + "']",
								sourceApplication: appId || null,
								sourceApplicationEntryPoint: "",
								sourceUrl: applicationManifestEntry.url,
								sourceDomain: sourceDomain
							});

						this.applicationManifestLoaded();
						return;
					}
				}
			}
			this.triggerAnalyticsEvent("application-host-api-error", {
					type: "Application Host API",
					data: "Unexpected 'registerApplication' call from domain " + sourceDomain + ".",
					method: "registerApplication",
					sourceDisplay: "",
					sourceApplication: "",
					sourceApplicationEntryPoint: "",
					sourceUrl: "",
					sourceDomain: sourceDomain
				});
			throw Error("Unexpected 'registerApplication' call from domain " + sourceDomain + ".");
		}

		publishEvent(type: string, data: any, targetDisplay?: ITargetDisplay): void
		{
			var p = this.properties;

			if (targetDisplay)
			{
				if (targetDisplay.eventHandler && (targetDisplay.application.authenticationTargetDisplay == targetDisplay ||
					(<ITargetDisplay[]>targetDisplay.application.targetDisplays).indexOf(targetDisplay) != -1))
				{
					targetDisplay.eventHandler({type: type, data: data});
				}
			}
			else
			{
				SDL.jQuery.each(p.applications, (index: number, application: IApplication) =>
					SDL.jQuery.each(application.authenticationTargetDisplay
									? (<ITargetDisplay[]>application.targetDisplays).concat(application.authenticationTargetDisplay)
									: application.targetDisplays,
							(index: number, targetDisplay: IApplicationEntryPointTargetDisplay) =>
						{
							if (targetDisplay.eventHandler)
							{
								targetDisplay.eventHandler({type: type, data: data});
							}
						}));
			}
		}

		getCallerTargetDisplay(allowAuthenticationTargetDisplay: boolean, allowSelfTargetDisplay: boolean, allowUnauthenticated: boolean, caller: ICallerSignature): ITargetDisplay
		{
			var sourceWindow: Window;
			var sourceDomain: string;

			if (!caller)
			{
				var funcCaller: any = (<any>arguments.callee).caller;

				// (callee = this function).(caller = ApplicationHost's function).(caller = ApplicationHostFacade's function).(caller = CrossDomainMessaging's function)
				if (!funcCaller || !funcCaller.caller || !funcCaller.caller.caller || !funcCaller.caller.caller.sourceWindow)
				{
					// called locally
					return allowSelfTargetDisplay ? this.properties.selfTargetDisplay : null;
				}
				else
				{
					caller = funcCaller.caller.caller;
				}
			}

			sourceWindow = caller.sourceWindow;
			sourceDomain = caller.sourceDomain;

			if (sourceWindow)
			{
				var p = this.properties;
				for (var i = 0; i < p.applications.length; i++)
				{
					var application = p.applications[i];

					if (allowAuthenticationTargetDisplay)
					{
						var authenticationTargetDisplay = application.authenticationTargetDisplay;
						if (authenticationTargetDisplay && authenticationTargetDisplay.frame && authenticationTargetDisplay.frame.contentWindow == sourceWindow)
						{
							authenticationTargetDisplay.loadedDomain = sourceDomain;
							caller.sourceDisplay = authenticationTargetDisplay;

							if (!Url.isSameDomain(application.authenticationUrl, sourceDomain))
							{
								var expectedDomain = Url.getDomain(application.authenticationUrl);
								this.triggerAnalyticsEvent("application-host-api-error", {
										type: "Application Host API",
										data: "Unexpected origin domain." + (application.domainLoggingHide ? "" : " Expected domain:" + expectedDomain)
									}, caller);
								throw Error("Unexpected origin domain \"" + sourceDomain + "\" from authentication target display for application \"" + application.id +
										"\".\nExpected domain:" + expectedDomain);
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
							caller.sourceDisplay = targetDisplay;

							if (!allowUnauthenticated && application.authenticationUrl && !application.authenticated)
							{
								this.triggerAnalyticsEvent("application-host-api-error", {
										type: "Application Host API",
										data: "Unexpected call from an unauthenticated application"
									}, caller);
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
									var expectedDomains: string[] = [];
									var deferredDomains: string[] = [];
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

									this.triggerAnalyticsEvent("application-host-api-error", {
											type: "Application Host API",
											data: "Unexpected origin domain"
										}, caller);

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

			this.triggerAnalyticsEvent("application-host-api-error", {
					type: "Application Host API",
					data: "Unable to determine caller's target display. Source domain is: " + sourceDomain
				});
			throw Error("ApplicationHost: unable to determine caller's target display. Source domain is: " + sourceDomain);
		}

		getApplicationEntryPointById(applicationEntryPointId: string, application: IApplication): IApplicationEntryPoint
		{
			if (application)
			{
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
			var p = this.properties;
			var nodes = <Element[]>Xml.selectNodes(Configuration.ConfigurationManager.configuration,
				"//configuration/applicationHost/applicationReferences/applicationReference[@url != '' and not(configuration/applicationSuite)]");
			var externalReferencesCount = nodes.length;
			if (externalReferencesCount)
			{
				p.applicationManifestsCount = externalReferencesCount;

				var allReferencesCount = Xml.selectNodes(Configuration.ConfigurationManager.configuration,
					"//configuration/applicationHost/applicationReferences/applicationReference").length;

				var maxAge = (<any>Xml.getInnerText(Configuration.ConfigurationManager.configuration, "//configuration/applicationHost/manifestCacheMaxAge") | 0) || 3600;	//default to 1 hour
				var reloadParameter = ((new Date().getTime() - 1380000000000)/(maxAge * 1000)|0).toString();

				var manifestTimeout = (<any>Xml.getInnerText(Configuration.ConfigurationManager.configuration, "//configuration/applicationHost/manifestLoadTimeout") | 0) || 5;	//default to 5 seconds

				CrossDomainMessaging.addAllowedHandlerBase(SDL.Client.ApplicationHost.ApplicationManifestReceiver);
				this.manifestsLoadStartTime = +new Date();
				SDL.jQuery.each(nodes, (i: number, xmlElement: Element) =>
					{
						var baseUrlNodes =  Xml.selectNodes(xmlElement, "ancestor::configuration/@baseUrl");
						var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

						var url = Url.getAbsoluteUrl(Url.combinePath(baseUrl, xmlElement.getAttribute("url")));
						var id = xmlElement.getAttribute("id");
						if (!id)
						{
							throw Error("'id' not specified for application: " + url);
						}

						var domain = Url.getDomain(url);

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
										p.applicationManifestsCount < externalReferencesCount)	// some manifests are loaded -> log the error and continue
									{
										if (window.console)
										{
											window.console.warn("Failed to load referenced application manifest from \"" + url + "\" within " + manifestTimeout + " seconds.");
										}
										iframe.src = "about:blank";
										document.body.removeChild(iframe);

										this.triggerAnalyticsEvent("manifest-load-fail", {
											type: "Application Host API",
											sourceDisplay: "[manifest '" + id + "']",
											sourceApplication: id || null,
											sourceApplicationEntryPoint: "",
											sourceUrl: url,
											sourceDomain: domain
										});

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

						p.applicationManifests.push(manifest);

						manifest.loadStartTime = +new Date();
						manifest.iframe.src = Url.setHashParameter(url, "t", reloadParameter);

						this.triggerAnalyticsEvent("manifest-load-start", {
								type: "Application Host API",
								sourceDisplay: "[manifest '" + id + "']",
								sourceApplication: id || null,
								sourceApplicationEntryPoint: "",
								sourceUrl: url,
								sourceDomain: domain
							});
					});
			}
			else
			{
				p.applicationManifests = undefined;
				this.initializeApplicationHost();
			}
		}

		private applicationManifestLoaded()
		{
			var p = this.properties;
			p.applicationManifestsCount--;
			if (p.applicationManifestsCount == 0)	// all application references are processed -> proceed with initialization
			{
				this.triggerAnalyticsEvent('all-manifests-load', {
							type: 'Application Host API',
							timing: (+new Date()) - this.manifestsLoadStartTime
						});
				p.applicationManifests = undefined;
				this.initializeApplicationHost();
			}
		}

		private initializeApplicationHost()
		{
			Client.Event.EventRegister.addEventHandler(Client.Localization, "culturechange", (e: Client.Event.Event) =>
			{
				this.publishEvent(e.type, e.data);
			});

			var p = this.properties;

			if (Configuration.ConfigurationManager.coreVersion)
			{
				p.libraryVersions.push(Configuration.ConfigurationManager.coreVersion);
			}

			var nodes = Xml.selectNodes(Configuration.ConfigurationManager.configuration, "//configuration/applicationHost/libraryVersions/version");
			var len = nodes.length;
			for (var i = 0; i < len; i++)
			{
				var version = Xml.getInnerText(nodes[i]);
				if (p.libraryVersions.indexOf(version) == -1)
				{
					p.libraryVersions.push(version);
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
					if (p.applicationsIndex[appId])
					{
						throw Error("A duplicate application id encountered: " + appId);
					}
					
					var manifestUrl = Url.getAbsoluteUrl(Url.combinePath(baseUrl, applicationReferenceNode.getAttribute("url")));

					var applicationSuiteNode = <Element>Xml.selectSingleNode(applicationReferenceNode, ".//configuration/applicationSuite");
					var authenticationUrl = applicationSuiteNode.getAttribute("authenticationUrl");

					var domains: {[id: string]: IApplicationDomain;} = {};
					var domainNodes = Xml.selectNodes(applicationSuiteNode, "applicationDomains/applicationDomain[@id != '']");
					for (var j = 0, lenj = domainNodes.length; j < lenj; j++)
					{
						var domainNode = <Element>domainNodes[j];
						var domainUrl = Url.combinePath(manifestUrl, domainNode.getAttribute("domain"));

						var altDomainNodes = Xml.selectNodes(domainNode, "alternativeDomain");
						var validDomains: string[] = [domainUrl].concat(SDL.jQuery.map(altDomainNodes,
								(altDomainsNode: Node) => Url.combinePath(manifestUrl, Xml.getInnerText(altDomainsNode))));

						var domainId = domainNode.getAttribute("id");
						var deferredAttribute = domainNode.getAttribute("deferred");
						var deferred = (deferredAttribute == "true" || deferredAttribute == "1");

						if (deferred && !authenticationUrl && window.console)
						{
							window.console.warn("Deferred domain definition \"" + domainId + "\" encountered in an application suite \"" + appId + "\" without 'authenticationUrl'.");
						}

						domains[domainId] = {
								id: domainId,
								baseUrl: manifestUrl,
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
								id: "display-" + Types.Object.getNextId(),
								application: application,
								frame: null
							};
						application.authenticated = false;
					}

					var applicationEntryPointUrlFilter: Element = <Element>Xml.selectSingleNode(applicationSuiteNode, "loggingSettings/applicationEntryPointUrlFilter");
					if (applicationEntryPointUrlFilter)
					{
						var regExp = Xml.getInnerText(applicationEntryPointUrlFilter);
						if (regExp)
						{
							regExp = regExp.trim();
							{
								var caseSensitiveFlag = applicationEntryPointUrlFilter.getAttribute("caseSensitive") == "true" ? "" : "i";
								try
								{
									application.urlLoggingFilterRegExp = new RegExp(regExp, "g" + caseSensitiveFlag);
								}
								catch (err)
								{
									if (window.console)
									{
										window.console.warn("Unable to create regular expression for 'applicationEntryPointUrlFilter': " + regExp + " (application suite id='" + appId + "'): " + err);
									}
								}
							}
						}
					}

					if (Xml.selectSingleNode(applicationSuiteNode, "loggingSettings/hideDomainName[.='1' or .='true']"))
					{
						application.domainLoggingHide = true;
					}

					application.entryPointGroups = SDL.jQuery.map(
							Xml.selectNodes(applicationSuiteNode, "applicationEntryPointGroups/applicationEntryPointGroup"),
									(element: Element) =>
										{
											var group = this.buildApplicationEntryPointGroup(element, domains, application);
											application.entryPointGroupsIndex[group.id] = group;
											return group;
										});

					p.applications.push(application);
					p.applicationsIndex[appId] = application;
				}

				SDL.Client.ApplicationHost.ApplicationHostFacade = new SDL.Client.ApplicationHost.ApplicationHostFacadeClass();
			}

			p.initialized = true;
			for (var k = 0, lenk = p.initCallbacks.length; k < lenk; k++)
			{
				p.initCallbacks[k]();
			}
			p.initCallbacks = undefined;
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
			var domainId = entryPointNode.getAttribute("domainId");
			
			var url = entryPointNode.getAttribute("url");
			var icon = entryPointNode.getAttribute("icon");
			var topIcon = entryPointNode.getAttribute("topIcon");
			var type = entryPointNode.getAttribute("type");
			var contextual = entryPointNode.getAttribute("contextual");
			var external = entryPointNode.getAttribute("external");
			var overlay = entryPointNode.getAttribute("overlay");
			var targetDisplayName = entryPointNode.getAttribute("targetDisplay") || id;

			var domain = domains[domainId];
			if (!domain && window.console)
			{
				window.console.error("No domain definition found for domainId='" + domainId + "' (application entry point id='" + id + "').");
			}
			var baseUrl = domain ? (domain.deferred ? url : Url.combinePath(domain.domain, url)) : Url.getAbsoluteUrl(url);

			var targetDisplay = parentApplication.targetDisplaysIndex[targetDisplayName];
			if (!targetDisplay)
			{
				targetDisplay = parentApplication.targetDisplaysIndex[targetDisplayName] = {
						id: "display-" + Types.Object.getNextId(),
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

			if (icon)
			{
				if (icon.indexOf("~/") == -1)
				{
					icon = Url.combinePath(parentApplication.manifestUrl, icon);
				}
				else
				{
					icon = Url.combinePath(Client.Configuration.ConfigurationManager.corePath, icon.slice(2));
				}
			}
			
			if (topIcon)
			{
				if (topIcon.indexOf("~/") == -1)
				{
					topIcon = Url.combinePath(parentApplication.manifestUrl, topIcon);
				}
				else
				{
					topIcon = Url.combinePath(Client.Configuration.ConfigurationManager.corePath, topIcon.slice(2));
				}
			}

			var entryPoint: IApplicationEntryPoint = {
				id: id,
				title: entryPointNode.getAttribute("title"),
				domain: domain,
				baseUrl: baseUrl,
				url: this.getApplicationEntryPointSessionData(parentApplication.id, id, baseUrl, "url") || baseUrl,
				icon: icon,
				topIcon: topIcon,
				type: type,
				translations: this.buildNameTranslations(entryPointNode),
				hidden: false,
				contextual: contextual == "true" || contextual == "1",
				visited: this.getApplicationEntryPointSessionData(parentApplication.id, id, baseUrl, "visited"),
				external: external == "true" || external == "1",
				overlay: !(overlay == "false" || overlay == "0") && (overlay == "true" || overlay == "1" || undefined),
				targetDisplay: targetDisplay,
				application: parentApplication
			};

			targetDisplay.entryPoints.push(entryPoint);
			return entryPoint;
		}

		private buildNameTranslations(parent: Element): ITranslations
		{
			var translations = <ITranslations>{};
			var translationNodes = Xml.selectNodes(parent, "translations/title[@lang]");
			for (var i = 0, len = translationNodes.length; i < len; i++)
			{
				var translationNode = <Element>translationNodes[i];
				translations[translationNode.getAttribute("lang")] = Xml.getInnerText(translationNode);
			}
			return translations;
		}

		private getLoggedApplicationEntryPointUrl(applicationEntryPoint: IApplicationEntryPoint): string
		{
			if (applicationEntryPoint)
			{
				return this.getLoggedApplicationUrl(Url.makeRelativeUrl(applicationEntryPoint.baseUrl, applicationEntryPoint.url),
						applicationEntryPoint.application);
			}
		}

		private getLoggedApplicationUrl(url: string, application: IApplication): string
		{
			if (application)
			{
				if (url)
				{
					var regExp = application.urlLoggingFilterRegExp;
					if (regExp)
					{
						var result = "";
						var prevMatchEndIndex = 0;
						url.replace(regExp, (part: string) =>
							{
								if (part)
								{
									var index: number = arguments[arguments.length - 2];
									if (index > prevMatchEndIndex)
									{
										result += "...";
									}
									result += part;
									prevMatchEndIndex = index + part.length;
								}
								return "";
							});

						if (prevMatchEndIndex < url.length)
						{
							result += "...";
						}

						url = result;
					}
				}
				return "(base)" + url;
			}
		}

		private saveApplicationEntryPointSessionData(applicationEntryPoint: IApplicationEntryPoint, property: string): void
		{
			var p = this.properties;
			if (!p.applicationsSessionData)
			{
				p.applicationsSessionData = Types.Object.deserialize(sessionStorage["appHost-applications"] || "{}");
			}

			var applicationSuiteId = applicationEntryPoint.application.id;
			var applicationData = p.applicationsSessionData[applicationSuiteId];
			if (!applicationData)
			{
				applicationData = p.applicationsSessionData[applicationSuiteId] = { entryPoints: {}};
			}

			var applicationEntryPointId = applicationEntryPoint.id;
			var baseUrl = applicationEntryPoint.baseUrl;
			var entryPointData: IApplicationEntryPointSessionData = applicationData.entryPoints[applicationEntryPointId];
			if (!entryPointData)
			{
				entryPointData = applicationData.entryPoints[applicationEntryPointId] =
					{
						baseUrl: baseUrl
					};
			}
			else if (entryPointData.baseUrl != baseUrl)
			{
				entryPointData.baseUrl = baseUrl;
			}
			(<any>entryPointData)[property] = (<any>applicationEntryPoint)[property];
			sessionStorage["appHost-applications"] = Types.Object.serialize(p.applicationsSessionData);
		}

		private getApplicationEntryPointSessionData(applicationSuiteId: string, applicationEntryPointId: string, baseUrl: string, property: string): any
		{
			var p = this.properties;
			if (!p.applicationsSessionData)
			{
				p.applicationsSessionData = Types.Object.deserialize(sessionStorage["appHost-applications"] || "{}");
			}
			var applicationData = p.applicationsSessionData[applicationSuiteId];
			if (applicationData)
			{
				var entryPointData: IApplicationEntryPointSessionData = applicationData.entryPoints[applicationEntryPointId];
				if (entryPointData && entryPointData.baseUrl == baseUrl)
				{
					return (<any>entryPointData)[property];
				}
			}
		}

		private _getRawApplicationStorageData(storage: Storage, application: IApplication): IApplicationStorageData
		{
			var rawAppStorageData: string = storage["appHost-appData-" + application.id];
			if (rawAppStorageData)
			{
				return JSON.parse(rawAppStorageData);
			}
		}

		private _storeApplicationData(storage: Storage, application: IApplication, applicationEntryPointDomain: string, key: string, data: any): void
		{
			if (application)
			{
				var manifestDomain = Types.Url.getDomain(application.manifestUrl);
				var appStorageData: IApplicationStorageData = this._getRawApplicationStorageData(storage, application) || {};
				var appStorageManifestDomainData = appStorageData[manifestDomain] || (appStorageData[manifestDomain] = {});
				var appStorageEntryPointDomainData = appStorageManifestDomainData[applicationEntryPointDomain] || (appStorageManifestDomainData[applicationEntryPointDomain] = {});
				appStorageEntryPointDomainData[key] = data;
				storage["appHost-appData-" + application.id] = JSON.stringify(appStorageData);
			}
		}

		private _getApplicationData(storage: Storage, application: IApplication, applicationEntryPointDomain: string, key: string): any
		{
			var appStorageData = this._getRawApplicationStorageData(storage, application);
			if (appStorageData)
			{
				var appStorageManifestDomainData = appStorageData[Types.Url.getDomain(application.manifestUrl)];
				if (appStorageManifestDomainData)
				{
					var appStorageEntryPointDomainData: IApplicationStorageEntryPointDomainData = appStorageManifestDomainData[applicationEntryPointDomain];
					if (appStorageEntryPointDomainData)
					{
						return appStorageEntryPointDomainData[key];
					}
				}
			}
		}

		private _removeApplicationData(storage: Storage, application: IApplication, applicationEntryPointDomain: string, key?: string): any
		{
			var appStorageData = this._getRawApplicationStorageData(storage, application);
			if (appStorageData)
			{
				var appStorageManifestDomainData = appStorageData[Types.Url.getDomain(application.manifestUrl)];
				if (appStorageManifestDomainData)
				{
					var appStorageEntryPointDomainData: IApplicationStorageEntryPointDomainData = appStorageManifestDomainData[applicationEntryPointDomain];
					if (appStorageEntryPointDomainData)
					{
						if (key)
						{
							delete appStorageEntryPointDomainData[key];
						}
						else
						{
							delete appStorageManifestDomainData[applicationEntryPointDomain];
						}
						storage["appHost-appData-" + application.id] = JSON.stringify(appStorageData);
					}
				}
			}
		}

		private _stopCaptureDomEvents(targetDisplay: ITargetDisplay, events?: string[]): void
		{
			if (!events || events.length)
			{
				if (targetDisplay)
				{
					var p = this.properties;
					var targetDisplayId = targetDisplay.id;
					var targetDisplayEvents: string[] = p.domEventsTargetDisplays[targetDisplayId];
					if (targetDisplayEvents)
					{
						var newEvents: string[] = events ? [] : null;

						SDL.jQuery.each(targetDisplayEvents, (i: number, event: string) =>
						{
							if (!events || events.indexOf(event) != -1)
							{
								var listening = false;
								SDL.jQuery.each(p.domEventsTargetDisplays, (id: string, events: string[]) =>
									{
										if (id != targetDisplayId && events.indexOf(event) != -1)
										{
											listening = true;
											return false;
										}
									});

								if (!listening)
								{
									this.removeCaptureDomEventListener(event);
								}
							}
							else
							{
								newEvents.push(event);
							}
						});

						if (!events || !newEvents.length)
						{
							delete p.domEventsTargetDisplays[targetDisplayId];
						}
						else
						{
							p.domEventsTargetDisplays[targetDisplayId] = newEvents;
						}
					}
				}
			}
		}

		private addCaptureDomEventListener(event: string): void
		{
			switch (event)
			{
				case "mouseup":
				case "mousemove":
					Client.Event.EventRegister.addEventHandler(document, event, this.getDelegate(this.handleCaptureDomEvent));
					break;
			}
		}

		private removeCaptureDomEventListener(event: string): void
		{
			switch (event)
			{
				case "mouseup":
				case "mousemove":
					Client.Event.EventRegister.removeEventHandler(document, event, this.getDelegate(this.handleCaptureDomEvent));
					break;
			}
		}

		private handleCaptureDomEvent(e: JQueryEventObject)
		{
			var p = this.properties;
			if (p.activeApplicationId && (e.type in CaptureDomEvents))
			{
				var application = p.applicationsIndex[p.activeApplicationId];
				var targetDisplay: ITargetDisplay;
				if (application.authenticationUrl && !application.authenticated)
				{
					targetDisplay = application.authenticationTargetDisplay;
				}
				else if (p.activeApplicationEntryPoint)
				{
					targetDisplay = p.activeApplicationEntryPoint.targetDisplay;
				}

				if (targetDisplay && targetDisplay.eventHandler)
				{
					var events = p.domEventsTargetDisplays[targetDisplay.id];
					if (events && events.indexOf(e.type) != -1)
					{
						switch (e.type)
						{
							case "mouseup":
							case "mousemove":
								targetDisplay.eventHandler({type: "domevent", data:
									{
										type: e.type,
										metaKey: e.metaKey,
										altKey: e.altKey,
										ctrlKey: e.ctrlKey,
										shiftKey: e.shiftKey,
										screenX: e.screenX,
										screenY: e.screenY,
										button: e.button
									}});
								break;
						}
					}
				}
			}
		}
	}

	SDL.Client.Types.OO.createInterface("SDL.Client.ApplicationHost.ApplicationHostClass", ApplicationHostClass);
	export var ApplicationHost: IApplicationHost;

	export function initialize(callback?: () => void): void
	{
		if (!ApplicationHost)
		{
			// using [new SDL.Client.ApplicationHost["ApplicationHostClass"]()] instead of [new ApplicationHostClass()]
			// because [new ApplicationHostClass()] would refer to a closure, not the interface defined in the line above
			ApplicationHost = new (<any>SDL.Client.ApplicationHost)["ApplicationHostClass"]();
		}
		ApplicationHost.initialize(callback);
	}
}