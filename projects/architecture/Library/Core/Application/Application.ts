/// <reference path="..\Libraries\jQuery\SDL.jQuery.ts" />
/// <reference path="..\Xml\Xml.d.ts" />
/// <reference path="..\ConfigurationManager\ConfigurationManager.ts" />
/// <reference path="..\CrossDomainMessaging\CrossDomainMessaging.ts" />
/// <reference path="..\Event\EventRegister.d.ts" />
/// <reference path="ApplicationHost.ts" />
/// <reference path="ApplicationFacade.ts" />

module SDL.Client.Application
{
	export var defaultApplicationEntryPointId: string;
	export var defaultApplicationSuiteId: string;
	export var isHosted: boolean;
	export var applicationSuiteId: string;
	export var isReloading: boolean;
	export var defaultApplicationHostUrl: string;
	export var trustedApplicationHostDomains: string[];
	export var trustedApplications: string[];
	export var trustedApplicationDomains: string[];
	export var ApplicationHost: IApplicationHost;
	export var useHostedLibraryResources: boolean;

	var initialized = false;
	var initCallbacks: any[];

	export function initialize(callback?: () => void): void
	{
		if (!initialized)
		{
			if (!isReloading)
			{
				if (callback)
				{
					if (initCallbacks)
					{
						initCallbacks.push(callback);
					}
					else
					{
						initCallbacks = [callback];
					}
				}

				if (initialized === false)
				{
					initialized = undefined;
					initializeApplication();
				}
			}
		}
		else if (callback)
		{
			callback();
		}
	};

	export function exposeApplicationFacade()
	{
		if (!isHosted)
		{
			throw Error("Cannot expose Application facade: application is not hosted.");
		}
		ApplicationHost.exposeApplicationFacade(Application.defaultApplicationEntryPointId);
	};

	export function exposeApplicationFacadeUnsecure()
	{
		if (!isHosted)
		{
			throw Error("Cannot expose Application facade: application is not hosted.");
		}
		ApplicationHost.exposeApplicationFacadeUnsecure(Application.defaultApplicationEntryPointId);
	};

	function initializeApplication()
	{
		var callbacks = function()
		{
			if (initCallbacks)
			{
				SDL.jQuery.each(initCallbacks, function(i, callback) { callback(); });
				initCallbacks = null;
			}
		};

		var hostingElement = Xml.selectSingleNode(Configuration.ConfigurationManager.configuration, "//configuration/hosting");

		if (!hostingElement)
		{
			Application.isHosted = false;
			Application.useHostedLibraryResources = false;
			initialized = true;
			callbacks();
		}
		else
		{
			Application.defaultApplicationEntryPointId = Xml.getInnerText(hostingElement, "defaultApplicationEntryPointId");
			Application.defaultApplicationSuiteId = Xml.getInnerText(hostingElement, "defaultApplicationSuiteId");

			var hosted = (window.top != window);

			if (hosted)
			{
				var useHostedLibraryResources = !Xml.selectSingleNode(hostingElement, "useHostedLibraryResources[.='false' or .='0']");

				trustedApplicationHostDomains = SDL.jQuery.map(
					Xml.selectNodes(hostingElement, "restrictions/trustedApplicationHostDomains/domain"),
					(node) => Types.Url.getAbsoluteUrl(Xml.getInnerText(node)));

				trustedApplications = SDL.jQuery.map(
					Xml.selectNodes(hostingElement, "restrictions/trustedApplications/applicationId"),
					(node) => Xml.getInnerText(node));

				trustedApplicationDomains = SDL.jQuery.map(
					Xml.selectNodes(hostingElement, "restrictions/trustedApplicationDomains/domain"),
					(node) => Types.Url.getAbsoluteUrl(Xml.getInnerText(node)));

				CrossDomainMessaging.addTrustedDomain("*");

				// notify the host the app is loaded, and see if the library version can be served by the host
				var interval: number;
				if (window.console)
				{
					var intervalCount = 0;
					interval = window.setInterval(function()
						{
							intervalCount++;
							console.log("NO REPLY FROM HOST AFTER " + intervalCount + " SECOND(S).");
							if (intervalCount > 60)
							{
								window.clearInterval(interval);
								interval = null;
							}
						}, 1000);
				}

				var host = new ApplicationHostProxyClass();
				host.applicationEntryPointLoaded(Configuration.ConfigurationManager.coreVersion,
					function(data: IApplicationHostData)
					{
						if (interval)
						{
							window.clearInterval(interval);
							interval = null;
						}

						Application.applicationSuiteId = data.applicationSuiteId;

						var applicationHostDomain: string = (<any>arguments.callee.caller).sourceDomain;
						host.isTrusted = Types.Url.isSameDomain(window.location.href, applicationHostDomain) ||
							(SDL.jQuery.inArray(applicationHostDomain, trustedApplicationHostDomains, 0, Types.Url.isSameDomain) != -1);

						CrossDomainMessaging.clearTrustedDomains();
						CrossDomainMessaging.addTrustedDomain(applicationHostDomain);
						CrossDomainMessaging.addAllowedHandlerBase(ApplicationFacadeStub);

						Application.ApplicationHost = host;
						Application.isHosted = true;

						if (data)
						{
							if (data.libraryVersionSupported)
							{
								Application.useHostedLibraryResources = useHostedLibraryResources;
							}

							if (data.culture)
							{
								Localization.setCulture(data.culture);
							}
						}

						Event.EventRegister.addEventHandler(ApplicationHost, "culturechange", (e) =>
						{
							Localization.setCulture(e.data.culture);
						});

						initialized = true;
						callbacks();
					});

				Event.EventRegister.addEventHandler(window, "unload", (e) =>
				{
					host.applicationEntryPointUnloaded();
				});
			}
			else
			{
				defaultApplicationHostUrl = Xml.getInnerText(hostingElement, "defaultApplicationHostUrl");;

				if (defaultApplicationHostUrl)
				{
					initCallbacks = null;
					Application.isReloading = true;
					window.location.replace(defaultApplicationHostUrl +
						(defaultApplicationSuiteId
						? ("#app=" + encodeURIComponent(defaultApplicationSuiteId) +
							(defaultApplicationEntryPointId
							? "&entry=" + encodeURIComponent(Application.defaultApplicationEntryPointId) + "&url=" + encodeURIComponent(location.href)
							: ""))
						: ""));
				}
				else
				{
					Application.isHosted = false;
						Application.useHostedLibraryResources = false;
						initialized = true;
						callbacks();
				}
			}
		}
	};
}