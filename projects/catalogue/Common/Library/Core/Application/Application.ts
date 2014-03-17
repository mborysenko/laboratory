/// <reference path="../../SDL.Client.Core/Resources/Resources.d.ts" />
/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core.Knockout/Libraries/Knockout/knockout.d.ts" />
/// <reference path="../Types/Url1.ts" />
/// <reference path="../CrossDomainMessaging/CrossDomainMessaging.ts" />
/// <reference path="ApplicationHost.ts" />
/// <reference path="ApplicationFacade.ts" />

/**
 *	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
**/
module SDL.Client.Application
{
	interface IResource
	{
		url: string;
		data?: string;
		context?: string;
		resourceName?: string;
	}

	export var defaultApplicationEntryPointId: string;
	export var defaultApplicationSuiteId: string;
	export var isHosted: boolean;
	export var applicationSuiteId: string;
	export var isReloading: boolean;
	export var applicationHostUrl: string;
	export var applicationHostCorePath: string;
	export var defaultApplicationHostUrl: string;
	export var trustedApplicationHostDomains: string[];
	export var trustedApplications: string[];
	export var trustedApplicationDomains: string[];
	export var ApplicationHost: IApplicationHost;
	export var useHostedLibraryResources: boolean = true;
	export var libraryVersion: string;
	export var isInitialized: boolean = false;

	var _isInitialized = false;
	var isReady = false;

	export var initCallbacks: {(): void;}[];
	export var readyCallbacks: {(): void;}[];

	var _initCallbacks: {(): void;}[] = initCallbacks ? initCallbacks.concat() : null;
	var _readyCallbacks: {(): void;}[] = readyCallbacks ? readyCallbacks.concat() : null;

	var filesToRender: IResource[] = [];
	var allResources: string[] = [];
	var renderedResources: string[] = [];
	var resolveResourcesCallbacks: {[url: string]: {():void;}[];} = {};

	export function initialize(callback?: () => void): void
	{
		addInitializeCallback(callback);

		if (_isInitialized === false)
		{
			_isInitialized = undefined;
			initializeApplication();
		}
	};

	export function addInitializeCallback(callback: () => void): void
	{
		if (callback)
		{
			if (_isInitialized)
			{
				callback();
			}
			else if (!isReloading)
			{
				if (_initCallbacks)
				{
					_initCallbacks.push(callback);
				}
				else
				{
					_initCallbacks = [callback];
				}
			}
		}
	};

	export function addReadyCallback(callback: () => void): void
	{
		if (callback)
		{
			if (isReady)
			{
				callback();
			}
			else if (!isReloading)
			{
				if (_readyCallbacks)
				{
					_readyCallbacks.push(callback);
				}
				else
				{
					_readyCallbacks = [callback];
				}
			}
		}
	};

	export function setApplicationReady()
	{
		if (!isReady)
		{
			isReady = true;
			if (_readyCallbacks)
			{
				for (var i = 0, len = _readyCallbacks.length; i < len; i++)
				{
					_readyCallbacks[i]();
				}
				_readyCallbacks = null;
			}
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

	export function registerResourceGroupRendered(resourceGroupName: string)
	{
		if (renderedResources.indexOf(resourceGroupName) == -1)
		{
			if (allResources.indexOf(resourceGroupName) == -1)
			{
				allResources.push(resourceGroupName);
			}

			renderedResources.push(resourceGroupName);
		}
	};

	export function loadLibraryResourceGroup(resourceGroupName: string, jQuery?: JQueryStatic, knockout?: KnockoutStatic, callback?: () => void)
	{
		if ((<any>Client).Configuration)	// application has been initialized using bootstrap.js -> use ResourceManager
		{
			Application.addReadyCallback(() => { (<any>Resources).ResourceManager.load(resourceGroupName, callback); });
		}
		else								// application has been initialized using application.js -> get resources via ApplicationHost
		{
			if (!isHosted)
			{
				throw Error("Unable to load library resources, application is not hosted.");
			}

			if (!ApplicationHost.isTrusted)
			{
				throw Error("Unable to load library resources, application host is not trusted.");
			}

			registerResourceGroupRendered("SDL.Client.Types.Url1");
			registerResourceGroupRendered("SDL.Client.CrossDomainMessaging");
			registerResourceGroupRendered("SDL.Client.Application");
			if (jQuery)
			{
				(<any>SDL).jQuery = jQuery;
				registerResourceGroupRendered("SDL.Client.Libraries.JQuery");
			}

			if (knockout)
			{
				registerResourceGroupRendered("SDL.UI.Core.Knockout.Libraries.Knockout");
			}

			ApplicationHost.resolveCommonLibraryResources(resourceGroupName, (resources: Resources.IResolvedResourceGroupResult[]) =>
				{
					if (resources && resources.length)
					{
						var filesToLoad: IResource[] = [];
						var resourceForCallback: string;

						for (var i = 0, len = resources.length; i < len; i++)
						{
							var resourceName = resources[i].name;
							if (allResources.indexOf(resourceName) == -1)
							{
								allResources.push(resourceName);
								var files = resources[i].files;
								if (files && files.length)
								{
									var count = files.length;
									for (var j = 0; j < count; j++)
									{
										filesToRender[filesToRender.length] = filesToLoad[filesToLoad.length] = { url: files[j] };
									}
									filesToRender[filesToRender.length - 1].resourceName = resourceName;	// adding the name of the group to the last file of the resource group
									resourceForCallback = resourceName;
								}
								else
								{
									// no files to render, mark group as rendered right away
									renderedResources.push(resourceName);
								}
							}
							else if (renderedResources.indexOf(resourceName) == -1)
							{
								resourceForCallback = resourceName;
							}
						}

						if (resourceForCallback)
						{
							if (!resolveResourcesCallbacks[resourceForCallback])
							{
								resolveResourcesCallbacks[resourceForCallback] = [callback];
							}
							else
							{
								resolveResourcesCallbacks[resourceForCallback].push(callback);
							}

							if (filesToLoad.length > 0)
							{
								ApplicationHost.getCommonLibraryResources(filesToLoad, null, onFileLoaded,
									(error) =>
									{
										throw Error(error);
									});
							}
							return;
						}
					}

					if (callback)
					{
						callback();
					}
				});
		}
	}

	var fileToRenderIndex = 0;
	function onFileLoaded(resource: ICommonLibraryResource)
	{
		var nextFile = filesToRender[fileToRenderIndex];
		var url = resource.url;
		if (nextFile && nextFile.url == url)
		{
			renderFile(url, resource.data, resource.context, nextFile.resourceName);
			fileToRenderIndex++;

			while (fileToRenderIndex < filesToRender.length)
			{
				var fileToRender = filesToRender[fileToRenderIndex];
				var data = fileToRender.data;
				if (data != null)
				{
					renderFile(fileToRender.url, data, fileToRender.context, fileToRender.resourceName);
					filesToRender[fileToRenderIndex] = null;
					fileToRenderIndex++;
				}
				else
				{
					return;
				}
			}
		}
		else
		{
			for (var i = fileToRenderIndex + 1; i < filesToRender.length; i++)
			{
				var fileToRender = filesToRender[i];
				if (fileToRender.url == url)
				{
					fileToRender.data = resource.data || "";
					fileToRender.context = resource.context;
					return;
				}
			}
		}
	};

	var globalEval = eval;
	function renderFile(url: string, data: string, context: string, resourceName: string)
	{
		if (data)
		{
			if (url.slice(-3).toLowerCase() == ".js")
			{
				data += ("\n//@ sourceURL=" + Application.applicationHostCorePath + url.slice(2));
				if (context)
				{
					(function()
					{
						globalEval(arguments[0]);
					}).apply(globalEval(context), [data]);
				}
				else
				{
					globalEval(data);
				}
			}
			else if (url.slice(-4).toLowerCase() == ".css")
			{
				var style = document.getElementById("sdl-styles");
				if (!style)
				{
					style = document.createElement("style");
					style.id = "sdl-styles";
					var head = document.getElementsByTagName("head");
					(head[0] || document.body).appendChild(style);
				}
				var text = document.createTextNode(data);
				style.appendChild(text);
			}
		}

		if (resourceName)	// it was the last file of the resource group
		{
			renderedResources.push(resourceName);
			var calls = resolveResourcesCallbacks[resourceName];
			if (calls)
			{
				for (var i = 0, len = calls.length; i < len; i++)
				{
					calls[i]();
				}
			}
		}
	};

	function initializeApplication()
	{
		var callbacks = function()
		{
			if (_initCallbacks)
			{
				for (var i = 0, len = _initCallbacks.length; i < len; i++)
				{
					_initCallbacks[i]();
				}
				_initCallbacks = null;
			}
		}

		var hosted = (window.top != window);

		if (hosted)
		{
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
						if (intervalCount >= 30)
						{
							window.clearInterval(interval);
							interval = null;
						}
					}, 1000);
			}

			var host = new ApplicationHostProxyClass();
			var onUnload = () =>
				{
					host.applicationEntryPointUnloaded();
					window.removeEventListener("unload", onUnload);
				};
			window.addEventListener("unload", onUnload);

			host.applicationEntryPointLoaded(Application.libraryVersion, function(data: IApplicationHostData)
				{
					if (interval)
					{
						window.clearInterval(interval);
						interval = null;
					}

					applicationHostUrl = sessionStorage["appHost-url"] = data.applicationHostUrl;
					applicationHostCorePath = data.applicationHostCorePath;
					Application.applicationSuiteId = data.applicationSuiteId;

					var applicationHostDomain: string = (<any>arguments.callee.caller).sourceDomain;
					host.isTrusted = Types.Url.isSameDomain(window.location.href, applicationHostDomain);
					if (!host.isTrusted)
					{
						var domains = trustedApplicationHostDomains || <any[]>[];
						for (var i = 0, len = domains.length; i < len; i++)
						{
							if (Types.Url.isSameDomain(domains[i], applicationHostDomain))
							{
								host.isTrusted = true;
								break;
							}
						}
					}

					CrossDomainMessaging.clearTrustedDomains();
					CrossDomainMessaging.addTrustedDomain(applicationHostDomain);
					CrossDomainMessaging.addAllowedHandlerBase(ApplicationFacadeStub);

					Application.ApplicationHost = host;
					Application.isHosted = true;

					if (!host.isTrusted || !data.libraryVersionSupported)
					{
						Application.useHostedLibraryResources = false;
					}

					isInitialized = _isInitialized = true;
					callbacks();
				});
		}
		else if (defaultApplicationHostUrl)	// only redirect if defaultApplicationHostUrl is specified, regardless of the applicationHostUrl stored in sessionStorage
		{
			applicationHostUrl = sessionStorage["appHost-url"] || defaultApplicationHostUrl;	// use sessionStorage value if specified
			_initCallbacks = null;
			Application.isReloading = true;
			window.location.replace(applicationHostUrl +
				(defaultApplicationSuiteId
				? ("#app=" + encodeURIComponent(defaultApplicationSuiteId) +
					(defaultApplicationEntryPointId
					? "&entry=" + encodeURIComponent(Application.defaultApplicationEntryPointId) + "&url=" + encodeURIComponent(location.href)
					: "")
				) : ""));
		}
		else
		{
			Application.isHosted = false;
			Application.useHostedLibraryResources = false;
			isInitialized = _isInitialized = true;
			callbacks();
		}
	};
}