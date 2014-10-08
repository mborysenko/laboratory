/// <reference path="../Application/Application.ts" />
/// <reference path="../ConfigurationManager/ConfigurationManager.ts" />

/// <reference path="../Localization/Localization.ts" />
/// <reference path="../Resources/ResourceManager.ts" />

module SDL.Client
{
	import Appl = Application;
	import Conf = Configuration;
	var cm = Conf.ConfigurationManager;
	var pageConfigurationElement: Element;
	var corePackageKey: string;

	cm.initialize(initApplication,	// complete configuration is initialized -> load application's resources and initialize the page
		function()	// non-library configuration is loaded -> initialize Application object, connect to Application Host
		{
			pageConfigurationElement = cm.getCurrentPageConfigurationNode();

			if (!pageConfigurationElement)
			{
				throw Error("Unable to find configuration for page \"" + window.location.pathname + "\"");
			}

			if (cm.coreVersion)
			{
				Appl.libraryVersion = cm.coreVersion;	// use 'coreVersion' setting if configured
			}

			var hostingElement = Xml.selectSingleNode(Conf.ConfigurationManager.configuration, "//configuration/hosting");
			if (hostingElement)
			{
				Appl.defaultApplicationHostUrl = Xml.getInnerText(hostingElement, "defaultApplicationHostUrl");
				Appl.defaultApplicationEntryPointId = Xml.getInnerText(hostingElement, "defaultApplicationEntryPointId");
				Appl.defaultApplicationSuiteId = Xml.getInnerText(hostingElement, "defaultApplicationSuiteId");
				Appl.useHostedLibraryResources = !Xml.selectSingleNode(hostingElement, "useHostedLibraryResources[.='false' or .='0']");

				var map = function(nodes: Node[], handler?: (value: string) => string): string[]
				{
					var result: string[] = [];
					for (var i = 0, len = nodes.length; i < len; i++)
					{
						result.push(handler ? handler(Xml.getInnerText(nodes[i])) : Xml.getInnerText(nodes[i]));
					}
					return result;
				}

				Appl.trustedApplicationHostDomains = map(
						Xml.selectNodes(hostingElement, "restrictions/trustedApplicationHostDomains/domain"),
						(domain: string) => Types.Url.getAbsoluteUrl(domain));

				Appl.trustedApplications = map(Xml.selectNodes(hostingElement, "restrictions/trustedApplications/applicationId"));

				Appl.trustedApplicationDomains = map(
						Xml.selectNodes(hostingElement, "restrictions/trustedApplicationDomains/domain"),
						(domain: string) => Types.Url.getAbsoluteUrl(domain));
			}

			// Appl.initialize(), when completed, will unblock ConfigurationManager, allow it to load library configuration resources
			Appl.initialize(function()	// Application is initialized, we know now how to load the Core package
				{
					var i: number;
					var len: number;
					var packagesToLoad: Resources.IPreloadPackageFileResource[] = [];
					if (!SDL.Client.Resources)
					{
						SDL.Client.Resources = <any>{};
					}

					var packages = Resources.preloadPackages || (Resources.preloadPackages = <{[key: string]: Resources.IPreloadPackageFileResource;}>{});
					var corePackageUrl = "~/Library/Core/Packages/SDL.Client.Core.js";
					corePackageKey = corePackageUrl.toLowerCase();
					if (!packages[corePackageKey])
					{
						packagesToLoad.push(packages[corePackageKey] = {packageName: "SDL.Client.Core", url: "~/Library/Core/Packages/SDL.Client.Core.js", version: Appl.libraryVersion});
					}

					if (cm.getAppSetting("debug") != "true")	// no need to preload packages if in debug mode
					{
						var pageConfElements = [pageConfigurationElement];

						var nodes = cm.getCurrentPageExtensionConfigurationNodes();
						for (i = 0, len = nodes.length; i < len; i++)
						{
							pageConfElements.push(nodes[i]);
						}

						for (i = 0, len = pageConfElements.length; i < len; i++)
						{
							var preloadPackages = <Element[]>Xml.selectNodes(pageConfElements[i], "preloadPackages/package[@url]");
							if (preloadPackages.length)
							{
								var baseUrlNodes =  <Attr[]>Xml.selectNodes(pageConfElements[i], "ancestor::configuration/@baseUrl");
								var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].value : "";

								var appVersionNodes = <Attr[]>Xml.selectNodes(pageConfElements[i], "ancestor::configuration/appSettings/setting[@name='version']/@value");
								var appVersion = appVersionNodes.length ? appVersionNodes[appVersionNodes.length - 1].value : "";

								for (var j = 0, lenj = preloadPackages.length; j < lenj; j++)
								{
									var packageElement = preloadPackages[j];
									var url = packageElement.getAttribute("url");
									if (url.indexOf("~/") != 0)
									{
										url = Types.Url.combinePath(baseUrl, url);
									}
									var key = url.toLowerCase();

									if (!packages[key])
									{
										var version = url.indexOf("~/") == 0 ? Appl.libraryVersion : appVersion;
										var modification = packageElement.getAttribute("modification") || "";

										packagesToLoad.push(packages[key] = {
											packageName: packageElement.getAttribute("name"),
											url: url,
											version: (version && modification) ? (version + "." + modification) : (version || modification)});
									}
								}
							}
						}
					}

					for (i = 0, len = packagesToLoad.length; i < len; i++)
					{
						((pckg: Resources.IPreloadPackageFileResource) =>
						{
							if (Appl.isHosted && Appl.useHostedLibraryResources && pckg.url.indexOf("~/") == 0)
							{
								Appl.ApplicationHost.getCommonLibraryResource({url: pckg.url, version: pckg.version}, Appl.libraryVersion,
									(data: string) => {
										pckg.isShared = true;
										pckg.data = data;
										packageLoaded();
									},
									(error: string) => {
										pckg.error = error;
										throw Error(error);
									});
							}
							else
							{
								var xhr = new XMLHttpRequest();
								xhr.onreadystatechange = () =>
								{
									if (xhr.readyState == 4)
									{
										var statusCode = xhr.status;
										if (statusCode < 200 || statusCode >= 300)
										{
											var error: string;
											try
											{
												error = xhr.statusText;
											}
											catch (err)
											{ }

											pckg.error = error;
											throw Error(error || xhr.responseText);
										}

										pckg.data = xhr.responseText;
										initApplication();
									}
								};

								xhr.open("GET", (pckg.url.indexOf("~/") == 0 ? Types.Url.combinePath(cm.corePath, pckg.url.slice(2)) : pckg.url) + (pckg.version ? "?" + pckg.version : ""), true);
								xhr.send();
							} 
						})(packagesToLoad[i]);
				}
			});
	});

	function packageLoaded()
	{
		initApplication();
	}

	function initApplication()
	{
		if (cm.isInitialized && Client.Resources && Resources.preloadPackages)
		{
			var corePackage = Resources.preloadPackages[corePackageKey];
			var finalizeInitialization = corePackage && corePackage.data != null;	// core package loaded and ready to be evaluated
			if (finalizeInitialization)
			{
				var globalEval = eval;
				var corePackageUrl = Appl.isHosted && Appl.useHostedLibraryResources && corePackage.url.indexOf("~/") == 0
					? Types.Url.combinePath(Application.applicationHostCorePath, corePackage.url.slice(2))
					: Types.Url.getAbsoluteUrl(corePackage.url.indexOf("~/") == 0 ? Types.Url.combinePath(cm.corePath, corePackage.url.slice(2)) : corePackage.url);
				globalEval(corePackage.data + "\n//@ sourceURL=" + corePackageUrl);
			}

			var rm = Resources.ResourceManager;
			if (rm)	// register rendered packages and store loaded files
			{
				for (var key in Resources.preloadPackages)
				{
					var pckg = Resources.preloadPackages[key];
					if (pckg)
					{
						if (pckg.data != null)
						{
							switch (pckg.packageName)
							{
								case "SDL.Client.Init":
								case "SDL.Client.Core":
									rm.registerPackageRendered(pckg.packageName, pckg.url, pckg.data);
									break;
								default:
									rm.storeFileData(pckg.url, pckg.data, pckg.isShared);
									break;
							}
							Resources.preloadPackages[key] = null;
						}
						else if (pckg.packageName == "SDL.Client.Init")	// init package might have been loaded using <script> tag, would have no data to cache by ResourceManager
						{
							rm.registerPackageRendered(pckg.packageName, pckg.url);
							Resources.preloadPackages[key] = null;
						}
					}
				}
			}

			if (finalizeInitialization)
			{
				rm.registerPackageRendered("SDL.Client.Init");	// in case it was not registered as rendered

				Localization.setCulture((Appl.isHosted && Appl.ApplicationHost.culture) || cm.getAppSetting("culture") || "en");
				rm.readConfiguration();

				window.document.title = pageConfigurationElement.getAttribute("title") || "";

				var resource = pageConfigurationElement.getAttribute("resource");
				if (resource)
				{
					rm.load(resource, () => { Application.setApplicationReady(); });
				}
				else
				{
					Application.setApplicationReady();
				}
			}
		}
	}
}