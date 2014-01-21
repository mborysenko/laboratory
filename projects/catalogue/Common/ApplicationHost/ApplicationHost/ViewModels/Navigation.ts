/// <reference path="..\..\..\..\SDL.Client\SDL.Client.Core\ApplicationHost\ApplicationHost.d.ts" />
/// <reference path="..\..\..\..\SDL.Client\SDL.Client.Core\Types\Url.d.ts" />
/// <reference path="..\..\..\..\SDL.Client\SDL.Client.UI.Core.Knockout\Libraries\knockout\knockout.d.ts" />

module SDL.Client.UI.ApplicationHost.ViewModels.Navigation
{
	import Url = SDL.Client.Types.Url;
	import AppHost = SDL.Client.ApplicationHost;

	Xml.Namespaces["apphost"] = "http://www.sdl.com/2013/ApplicationHost";

	export interface ITargetDisplay
	{
		targetDisplay: AppHost.ITargetDisplay;
		src: string;
		accessed: KnockoutObservable<boolean>;
		loaded: KnockoutObservable<boolean>;
		loading: KnockoutComputed<boolean>;
		timeout: number;
	};

	export interface INavigationItemTargetDisplay extends ITargetDisplay
	{
		targetDisplay: AppHost.IApplicationEntryPointTargetDisplay;
		navigationItem: KnockoutObservable<INavigationItem>;
	};

	export interface IAuthenticationTargetDisplay extends ITargetDisplay
	{
		navigationGroup: KnockoutObservable<INavigationGroup>;
		authenticationMode: string;
		authenticated: boolean;
		disposed: KnockoutObservable<boolean>;
	};

	export interface INavigationItem
	{
		id: string;
		title?: string;
		titleResource?: string;
		applicationEntryPoint?: AppHost.IApplicationEntryPoint;
		icon?: string;
		src: KnockoutObservable<string>;
		navigationGroup?: INavigationGroup;
		targetDisplay: INavigationItemTargetDisplay;
		type: string;
		translations?: {[lang: string]: string;};
		external?: boolean;
		contextual: KnockoutObservable<boolean>;
		hidden: KnockoutObservable<boolean>;
		overlay?: boolean;
	};

	export interface INavigationGroup
	{
		id: string;
		title: string;
		applicationEntryPointGroup: AppHost.IApplicationEntryPointGroup;
		navigationItems: INavigationItem[];
		applications: AppHost.IApplication[];
		authenticationTargetDisplay?: KnockoutObservable<IAuthenticationTargetDisplay>;
		translations?: {[lang: string]: string;};
		shownItems: KnockoutObservable<number>;
		applicationId?: string;
	};

	export var navigationGroups: INavigationGroup[] = [];
	export var topNavigationGroup: INavigationGroup = null;
	export var homeNavigationItem: INavigationItem;
	export var currentNavigationItem: KnockoutObservable<INavigationItem> = ko.observable(<INavigationItem>null);
	export var currentNavigationGroup: KnockoutObservable<INavigationGroup> = ko.observable(null);
	export var authenticationTargetDisplays: IAuthenticationTargetDisplay[] = null;
	export var navigationItemTargetDisplays: INavigationItemTargetDisplay[] = null;

	var navigationItemsIndex: {[applicationId: string]: INavigationItem[];} = {};
	var applicationAuthenticationTargetDisplays: {[applicationId: string]: IAuthenticationTargetDisplay} = {};
	var applicationNavigationItemTargetDisplaysIndex: {[applicationId: string]: {[targetDisplayName: string]: INavigationItemTargetDisplay};} = {};
	var initialized: boolean = false;
	var initCallbacks = [];

	export function selectNavigationItem(navigationItem: INavigationItem)
	{
		if (navigationItem)
		{
			if (navigationItem.external)
			{
				window.open(navigationItem.src());
			}
			else if (currentNavigationItem() != navigationItem)
			{
				currentNavigationItem(navigationItem);
			}
		}
	}

	export function setNavigationSelectionFromUrl(ignoreErrors?: boolean)
	{
		var newAppId = Url.getHashParameter(window.location.href, "app");
		var newEntryId = Url.getHashParameter(window.location.href, "entry");
		var newGroupId = Url.getHashParameter(window.location.href, "group");

		if (newEntryId || (newAppId && !newGroupId))
		{
			var prevNavItem: INavigationItem = currentNavigationItem();
			var prevApplicationEntryPoint = prevNavItem && prevNavItem.applicationEntryPoint;
			var prevAppId = prevApplicationEntryPoint && prevApplicationEntryPoint.application.id || null;
			var prevEntryId = prevApplicationEntryPoint && prevApplicationEntryPoint.id || null;
			var prevSrc = prevNavItem && prevNavItem.src() || null;
			var newSrc = Url.getHashParameter(window.location.href, "url") || "";

			if (newAppId != prevAppId || newEntryId != prevEntryId || newSrc != prevSrc)
			{
				var newNavItem = getNavigationItemById(newEntryId, newAppId);
				if (newNavItem && !newNavItem.external && !newNavItem.hidden())
				{
					if (newNavItem.applicationEntryPoint)
					{
						if (ignoreErrors)
						{
							try
							{
								AppHost.ApplicationHost.setApplicationEntryPointUrl(newNavItem.id, newSrc, newAppId);
							}
							catch (err)
							{
								if (window.console)
								{
									window.console.error(err.message);
								}
							}
						}
						else
						{
							AppHost.ApplicationHost.setApplicationEntryPointUrl(newNavItem.id, newSrc, newAppId);
						}
					}

					if (prevNavItem != newNavItem)
					{
						selectNavigationItem(newNavItem);
						AppHost.ApplicationHost.setActiveApplicationEntryPoint(newNavItem.applicationEntryPoint && newNavItem.applicationEntryPoint.id,
							newNavItem.applicationEntryPoint && newNavItem.applicationEntryPoint.application.id);
					}
				}
			}
			return;
		}

		if (newGroupId)
		{
			var prevGroup: INavigationGroup = currentNavigationGroup();
			if (!prevGroup || prevGroup.id != newGroupId)
			{
				var group: INavigationGroup = getNavigationGroupById(newGroupId, newAppId);
				if (group && group.authenticationTargetDisplay && group.authenticationTargetDisplay())
				{
					currentNavigationGroup(group);
					selectNavigationItem(null);
					AppHost.ApplicationHost.setActiveApplicationEntryPoint(null, null);
				}
			}
			return;
		}

		if (currentNavigationItem() != homeNavigationItem)
		{
			selectNavigationItem(homeNavigationItem);
			AppHost.ApplicationHost.setActiveApplicationEntryPoint(homeNavigationItem.applicationEntryPoint && homeNavigationItem.applicationEntryPoint.id,
							homeNavigationItem.applicationEntryPoint && homeNavigationItem.applicationEntryPoint.application.id);
		}
	}

	export function initialize(callback?: () => void)
	{
		if (!initialized)
		{
			if (callback)
			{
				initCallbacks.push(callback);
			}

			if (initialized === false)
			{
				initialized = undefined;

				AppHost.ApplicationHost.initialize(function()
					{
						initializeNavigationViewModel();
						initialized = true;
						for (var i = 0, len = initCallbacks.length; i < len; i++)
						{
							initCallbacks[i]();
						}
						initCallbacks = undefined;
					}
				);
			}
		}
		else if (callback)
		{
			callback();
		}
	};

	export function getNavigationItemById(navigationItemId: string, applicationId: string): INavigationItem
	{
		var navigationItem;
		if (homeNavigationItem && (!navigationItemId || homeNavigationItem.id == navigationItemId) &&
				(!applicationId || homeNavigationItem.applicationEntryPoint && homeNavigationItem.applicationEntryPoint.application.id == applicationId))
		{
			return homeNavigationItem;
		}
		else
		{
			for (var i = 0, len = navigationGroups.length; i < len; i++)
			{
				var navigationItems = navigationGroups[i].navigationItems;
				for (var j = 0, lenj = navigationItems.length; j < lenj; j++)
				{
					var item = navigationItems[j];
					if (item && (!navigationItemId || item.id == navigationItemId) &&
						(!applicationId || item.applicationEntryPoint.application.id == applicationId))
					{
						return item;
					}
				}
			}
		}
	};

	function loadTargetDisplayForNavigationItem(navigationItem: INavigationItem)
	{
		if (!navigationItem.hidden())
		{
			var targetDisplay = navigationItem.targetDisplay;

			if (targetDisplay)
			{
				var curNavigationItem = targetDisplay.navigationItem();
				if (curNavigationItem != navigationItem)
				{
					targetDisplay.navigationItem(navigationItem);
					if (!curNavigationItem)
					{
						navigationItem.targetDisplay.src = navigationItem.src();
						navigationItem.targetDisplay.accessed(true);
					}
				}
			}
		}
	};

	function initializeNavigationViewModel()
	{
		var navigationNode = Xml.selectSingleNode(Configuration.ConfigurationManager.configuration, "//configuration/customSections/apphost:navigation");
		if (navigationNode)
		{
			// navigation is defined in configuration
			var navigationGroupNodes = Xml.selectNodes(navigationNode, "apphost:navigationGroup");
			navigationGroups = SDL.jQuery.map(navigationGroupNodes, (navigationGroupNode: Element, index: number) =>
				{
					var applicationEntryPointGroupId = navigationGroupNode.getAttribute("applicationEntryPointGroupId");
					if (applicationEntryPointGroupId)
					{
						return buildNavigationGroupForApplicationEntryPointGroup(
							getApplicationEntryPointGroupById(navigationGroupNode.getAttribute("applicationSuiteId"), applicationEntryPointGroupId), index == 0, navigationGroupNode);
					}
					else
					{
						return buildNavigationGroup(navigationGroupNode, index == 0);
					}
				});
		}
		else
		{
			// navigation is built based on application host data
			navigationGroups = <INavigationGroup[]><any>SDL.jQuery.map(AppHost.ApplicationHost.applications, (application, index) =>
				{
					return SDL.jQuery.map(application.entryPointGroups, (group, index: number) =>
						{
							return buildNavigationGroupForApplicationEntryPointGroup(group, index == 0);
						});
				});
		}

		authenticationTargetDisplays = SDL.jQuery.map(applicationAuthenticationTargetDisplays, (display, index) => display);
		navigationItemTargetDisplays = SDL.jQuery.map(applicationNavigationItemTargetDisplaysIndex,
				(displays: {[targetDisplayName: string]: INavigationItemTargetDisplay}, index) => 
					SDL.jQuery.map(displays, (display, index) => display));

		orderNavigationItems();
		createTopNavigationGroup();

		currentNavigationItem.subscribe(function()
		{
			var navItem = currentNavigationItem();
			if (navItem)
			{
				if (currentNavigationGroup())
				{
					currentNavigationGroup(null);
				}

				if (navItem.contextual())
				{
					navItem.contextual(false);
					if (!navItem.hidden())
					{
						navItem.navigationGroup.shownItems(navItem.navigationGroup.shownItems() + 1);
					}
				}

				var authenticationTargetDisplay = navItem.navigationGroup && navItem.navigationGroup.authenticationTargetDisplay && navItem.navigationGroup.authenticationTargetDisplay();
				if (authenticationTargetDisplay)
				{
					if (authenticationTargetDisplay.navigationGroup() != navItem.navigationGroup)
					{
						authenticationTargetDisplay.navigationGroup(navItem.navigationGroup);
						authenticationTargetDisplay.accessed(true);
					}
				}
				else
				{
					loadTargetDisplayForNavigationItem(navItem);
				}
				
				if (!navItem.hidden())
				{
					var appEntryPoint = navItem.applicationEntryPoint;
					AppHost.ApplicationHost.setActiveApplicationEntryPoint(appEntryPoint && appEntryPoint.id, appEntryPoint && appEntryPoint.application.id);
					return;
				}
			}

			AppHost.ApplicationHost.setActiveApplicationEntryPoint(null, null);
		});

		currentNavigationGroup.subscribe(function()
		{
			var navGroup = currentNavigationGroup();
			if (navGroup)
			{
				if (currentNavigationItem())
				{
					currentNavigationItem(null);
				}

				var targetDisplay = navGroup.authenticationTargetDisplay && navGroup.authenticationTargetDisplay();
				if (targetDisplay && targetDisplay.navigationGroup() != navGroup)
				{
					targetDisplay.navigationGroup(navGroup);
					targetDisplay.accessed(true);
				}
			}
		});

		Client.Event.EventRegister.addEventHandler(AppHost.ApplicationHost, "applicationentrypointactivate", setActiveApplicationEntryPoint);
		Client.Event.EventRegister.addEventHandler(AppHost.ApplicationHost, "applicationentrypointurlchange", setApplicationEntryPointUrl);
		Client.Event.EventRegister.addEventHandler(AppHost.ApplicationHost, "applicationentrypointvisited", onApplicationEntryPointVisited);
		Client.Event.EventRegister.addEventHandler(AppHost.ApplicationHost, "applicationfacaderequest", loadApplicationEntryPoint);
		Client.Event.EventRegister.addEventHandler(AppHost.ApplicationHost, "applicationsuiteinitialize", initializeApplicationSuite);
		Client.Event.EventRegister.addEventHandler(AppHost.ApplicationHost, "applicationsuitereset", resetApplicationSuite);
		Client.Event.EventRegister.addEventHandler(AppHost.ApplicationHost, "targetdisplayunload", onTargetDisplayUnloaded);

		setNavigationSelectionFromUrl(true);

		ko.computed(function setUrlFromNavigationSelection()
		{
			var navItem: INavigationItem = currentNavigationItem();
			var newHref = window.location.href;

			if (navItem)
			{
				var appEntryPoint = navItem.applicationEntryPoint;
				
				if (appEntryPoint)
				{
					newHref = Url.setHashParameter(newHref, "app", appEntryPoint.application.id);
					newHref = Url.setHashParameter(newHref, "entry", navItem.id);
					newHref = Url.setHashParameter(newHref, "group", null);

					navItem.src();	// this is to trigger computed to recalculate when src() changes
					if (appEntryPoint.url && appEntryPoint.url != appEntryPoint.baseUrl)
					{
						newHref = Url.setHashParameter(newHref, "url", Url.makeRelativeUrl(appEntryPoint.baseUrl, appEntryPoint.url));
					}
					else
					{
						newHref = Url.setHashParameter(newHref, "url", null);
					}
				}
				else
				{
					newHref = Url.setHashParameter(newHref, "app", null);
					newHref = Url.setHashParameter(newHref, "entry", null);
					newHref = Url.setHashParameter(newHref, "group", null);
					newHref = Url.setHashParameter(newHref, "url", null);
				}
			}
			else
			{
				newHref = Url.setHashParameter(newHref, "entry", null);

				var group: INavigationGroup = currentNavigationGroup();
				if (group)
				{
					newHref = Url.setHashParameter(newHref, "app", group.applicationId);
					newHref = Url.setHashParameter(newHref, "group", group.id);
				}
				else
				{
					newHref = Url.setHashParameter(newHref, "app", null);
					newHref = Url.setHashParameter(newHref, "group", null);
				}
			}
				
			if (window.location.href != newHref)
			{
				if (newHref.indexOf("#") == -1)
				{
					newHref += "#";	// making sure there's a hash parameter, otherwise the whole window will refresh
				}
				window.location.href = newHref;
			}
		}).extend({ throttle: 1 });

		SDL.jQuery(window).on("hashchange", function()
		{
			setNavigationSelectionFromUrl();
		});
	};

	function getApplicationEntryPointGroupById(applicationId: string, applicationEntryPointGroupId: string)
	{
		var application: AppHost.IApplication;
		if (applicationId)
		{
			application = AppHost.ApplicationHost.applicationsIndex[applicationId];
			if (application)
			{
				return application.entryPointGroupsIndex[applicationEntryPointGroupId];
			}
		}
		else
		{
			// application unspecified -> figure it out
			var applications = AppHost.ApplicationHost.applications;
			for (var i = 0, len = applications.length; i < len; i++)
			{
				var group = applications[i].entryPointGroupsIndex[applicationEntryPointGroupId];
				if (group)
				{
					return group;
				}
			}
		}
	};

	function getApplicationEntryPointById(applicationId: string, applicationEntryPointId: string): AppHost.IApplicationEntryPoint
	{
		var application: AppHost.IApplication;
		if (applicationId)
		{
			application = AppHost.ApplicationHost.applicationsIndex[applicationId];
			return getApplicationEntryPointByIdInApplication(application, applicationEntryPointId);
		}
		else
		{
			// application unspecified -> figure it out
			var applications = AppHost.ApplicationHost.applications;
			for (var i = 0, len = applications.length; i < len; i++)
			{
				var entry = getApplicationEntryPointByIdInApplication(applications[i], applicationEntryPointId);
				if (entry)
				{
					return entry;
				}
			}
		}
	};

	function getApplicationEntryPointByIdInApplication(application: AppHost.IApplication, applicationEntryPointId: string): AppHost.IApplicationEntryPoint
	{
		for (var i = 0, len = application.entryPointGroups.length; i < len; i++)
		{
			var group = application.entryPointGroups[i];
			for (var j = 0, lenj = group.entryPoints.length; j < lenj; j++)
			{
				if (group.entryPoints[j].id == applicationEntryPointId)
				{
					return group.entryPoints[j];
				}
			}
		}
	};

	function buildNavigationGroup(navigationGroupNode: Element, isFirstGroup: boolean): INavigationGroup
	{
		var groupApplicationId = navigationGroupNode.getAttribute("applicationSuiteId");
		var navigationItemNodes = Xml.selectNodes(navigationGroupNode, "apphost:navigationItems/apphost:navigationItem[@applicationEntryPointId]");
		var navigationGroup: INavigationGroup = {
				id: navigationGroupNode.getAttribute("id"),	
				title: navigationGroupNode.getAttribute("title"),
				applicationEntryPointGroup: null,
				navigationItems: null,
				applications: [],
				translations: buildNameTranslations(navigationGroupNode),
				shownItems: null,
				applicationId: groupApplicationId
			};

		if (groupApplicationId)
		{
			var application = AppHost.ApplicationHost.applicationsIndex[groupApplicationId];
			if (application)
			{
				navigationGroup.applications.push(application);
			}
		}

		var shownItems = 0;
		navigationGroup.navigationItems = SDL.jQuery.map(navigationItemNodes, (navigationItemNode: Element, index: number) =>
			{
				var applicationEntryPoint = getApplicationEntryPointById(
					navigationItemNode.getAttribute("applicationSuiteId") || groupApplicationId,
					navigationItemNode.getAttribute("applicationEntryPointId"));

				if (applicationEntryPoint)
				{
					var application = applicationEntryPoint && applicationEntryPoint.application;
					if (navigationGroup.applications.indexOf(application) == -1)
					{
						navigationGroup.applications.push(application);
					}
					
					if (application.authenticationUrl && !application.authenticated && !navigationGroup.authenticationTargetDisplay)
					{
						navigationGroup.authenticationTargetDisplay = ko.observable(getAuthenticationTargetDisplay(application));
					}

					var navigationItem = buildNavigationItemForApplicationEntryPoint(applicationEntryPoint, navigationGroup, isFirstGroup, navigationItemNode);
					if (navigationItem != homeNavigationItem)
					{
						if (!navigationItem.contextual() && !navigationItem.hidden())
						{
							shownItems++;
						}
						return navigationItem;
					}
				}
			});

		navigationGroup.shownItems = ko.observable(shownItems);
		return navigationGroup;
	};

	function buildNavigationGroupForApplicationEntryPointGroup(
			applicationEntryPointGroup: AppHost.IApplicationEntryPointGroup,
			isFirstGroup?: boolean, navigationGroupNode?: Element): INavigationGroup
	{
		var application = applicationEntryPointGroup.application;
		var navigationGroup: INavigationGroup = {
				id: navigationGroupNode && navigationGroupNode.getAttribute("id") ||  applicationEntryPointGroup.id,	
				title: navigationGroupNode && navigationGroupNode.getAttribute("title") ||  applicationEntryPointGroup.title,
				applicationEntryPointGroup: applicationEntryPointGroup,
				navigationItems: null,
				applications: [application],
				shownItems: null,
				applicationId: application.id
			};

		var shownItems = 0;
		navigationGroup.navigationItems = SDL.jQuery.map(applicationEntryPointGroup.entryPoints, (entryPoint, index: number) =>
				{
					var navigationItem = buildNavigationItemForApplicationEntryPoint(entryPoint, navigationGroup, isFirstGroup);
					if (navigationItem != homeNavigationItem)
					{
						if (!navigationItem.contextual() && !navigationItem.hidden())
						{
							shownItems++;
						}
						return navigationItem;
					}
				});
		
		navigationGroup.shownItems = ko.observable(shownItems);

		if (application.authenticationUrl && !application.authenticated)
		{
			navigationGroup.authenticationTargetDisplay = ko.observable(getAuthenticationTargetDisplay(application));
		}
		
		if (navigationGroupNode)
		{
			navigationGroup.translations = buildNameTranslations(navigationGroupNode);
		}

		return navigationGroup;
	};

	function getAuthenticationTargetDisplay(application: AppHost.IApplication): IAuthenticationTargetDisplay
	{
		var authenticationTargetDisplay = applicationAuthenticationTargetDisplays[application.id];
		if (!authenticationTargetDisplay)
		{
			authenticationTargetDisplay = applicationAuthenticationTargetDisplays[application.id] = {
						targetDisplay: application.authenticationTargetDisplay,
						navigationGroup: ko.observable(null),
						src: application.authenticationUrl,
						loaded: ko.observable(false),
						loading: null,
						timeout: 0,
						authenticationMode: application.authenticationMode,
						accessed: ko.observable(application.authenticationMode != "on-access"),
						authenticated: false,
						disposed: ko.observable(false)
					};

			authenticationTargetDisplay.loading = ko.computed(isTargetDisplayLoading, authenticationTargetDisplay);
		}

		return authenticationTargetDisplay;
	};

	function buildNavigationItemForApplicationEntryPoint(applicationEntryPoint: AppHost.IApplicationEntryPoint,
			parentNavigationGroup: INavigationGroup, isFirstGroup?: boolean, navigationItemNode?: Element): INavigationItem
	{
		var navigationItem: INavigationItem = {
				id: applicationEntryPoint.id,
				type: navigationItemNode && navigationItemNode.getAttribute("type") || applicationEntryPoint.type,
				title: navigationItemNode && navigationItemNode.getAttribute("title") || applicationEntryPoint.title,
				applicationEntryPoint: applicationEntryPoint,
				src: ko.observable(Url.isAbsoluteUrl(applicationEntryPoint.url) ? applicationEntryPoint.url : "about:blank"),
				icon: applicationEntryPoint.icon,
				navigationGroup: parentNavigationGroup,
				targetDisplay: buildNavigationItemTargetDisplay(applicationEntryPoint.targetDisplay.name, applicationEntryPoint.application),
				contextual: ko.observable(applicationEntryPoint.contextual && !applicationEntryPoint.visited),
				hidden: ko.observable(applicationEntryPoint.hidden),
				external: applicationEntryPoint.external,
				overlay: applicationEntryPoint.overlay
			};
		
		if (!homeNavigationItem && isFirstGroup && navigationItem.type == "home")
		{
			homeNavigationItem = navigationItem;
		}

		if (!navigationItemsIndex[applicationEntryPoint.application.id])
		{
			navigationItemsIndex[applicationEntryPoint.application.id] = [navigationItem];
		}
		else
		{
			navigationItemsIndex[applicationEntryPoint.application.id].push(navigationItem);
		}

		if (navigationItemNode)
		{
			navigationItem.titleResource = navigationItemNode.getAttribute("titleResource");
			navigationItem.translations = buildNameTranslations(navigationItemNode);
			var icon = navigationItemNode.getAttribute("icon");
			if (icon)
			{
				if (icon.charAt(0) != "/" && icon.indexOf("~/") == -1)
				{
					var baseUrlNodes =  Xml.selectNodes(navigationItemNode, "ancestor::configuration/@baseUrl");
					var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";
					icon = Url.combinePath(baseUrl, icon);
				}
				if (icon.indexOf("~/") == 0)
				{
					icon = Url.combinePath(Client.Configuration.ConfigurationManager.corePath, icon.slice(2));
				}
				navigationItem.icon = icon;
			}

			var external = navigationItemNode.getAttribute("external");
			if (external)
			{
				navigationItem.external = external == "true" || external == "1";
			}
			if (!applicationEntryPoint.visited)
			{
				var contextual = navigationItemNode.getAttribute("contextual");
				if (contextual)
				{
					navigationItem.contextual(contextual == "true" || contextual == "1");
				}
			}
			var overlay = navigationItemNode.getAttribute("overlay");
			if (overlay)
			{
				navigationItem.overlay = !(overlay == "false" || overlay == "0") && (overlay == "true" || overlay == "1" || undefined);
			}
		}

		return navigationItem;
	};

	function buildNavigationItemTargetDisplay(targetDisplayName: string, application: AppHost.IApplication): INavigationItemTargetDisplay
	{
		if (targetDisplayName)
		{
			var navigationItemTargetDisplays = applicationNavigationItemTargetDisplaysIndex[application.id];
			if (!navigationItemTargetDisplays)
			{
				navigationItemTargetDisplays = applicationNavigationItemTargetDisplaysIndex[application.id] = {};
			}
			var targetDisplay = navigationItemTargetDisplays[targetDisplayName];
			if (!targetDisplay)
			{
				var applicationEntryPointTargetDisplay = application.targetDisplaysIndex[targetDisplayName];
				if (applicationEntryPointTargetDisplay)
				{
					targetDisplay = navigationItemTargetDisplays[targetDisplayName] = {
							targetDisplay: applicationEntryPointTargetDisplay,
							src: null,
							accessed: ko.observable(false),
							loaded: ko.observable(false),
							loading: null,
							timeout: 0,
							disposed: ko.observable(false),
							navigationItem: ko.observable(null)
						};

					targetDisplay.loading = ko.computed(isTargetDisplayLoading, targetDisplay);
				}
			}
			return targetDisplay;
		}
	};

	function isTargetDisplayLoading(): boolean	// used for 'loading' KnockoutComputed
	{
		var targetDisplay: ITargetDisplay = this;	// 'this' is set by ko.computed
		if (targetDisplay.accessed() && !targetDisplay.loaded())
		{
			if (targetDisplay.timeout)
			{
				window.clearTimeout(targetDisplay.timeout);
			}

			targetDisplay.timeout = window.setTimeout(() =>
				{
					targetDisplay.timeout = 0;
					if (window.console)
					{
						window.console.warn(targetDisplay.src + " failed to load within 10 seconds");
					}
					targetDisplay.loaded(true);
				}, 10000);

			return true;
		}
		else
		{
			if (targetDisplay.timeout)
			{
				window.clearTimeout(targetDisplay.timeout);
				targetDisplay.timeout = 0;
			}
			return false;
		}
	};

	function getNavigationGroupById(groupId: string, applicationId?: string): INavigationGroup
	{
		for (var i = 0, len = navigationGroups.length; i < len; i++)
		{
			var group = navigationGroups[i];
			if (group.id == groupId && applicationId == group.applicationId)
			{
				return navigationGroups[i];
			}
		}
	};

	function buildNameTranslations(parent: Element): {[lang: string]: string;}
	{
		var translations = {};
		var translationNodes = Xml.selectNodes(parent, "apphost:translations/apphost:title[@lang]");
		for (var i = 0, len = translationNodes.length; i < len; i++)
		{
			var translationNode = <Element>translationNodes[i];
			translations[translationNode.getAttribute("lang")] = Xml.getInnerText(translationNode);
		}
		return translations;
	};

	function orderNavigationItems()
	{
		SDL.jQuery.each(navigationGroups, (index, group) =>
		{
			var home = [];
			var activities = [];
			var rest = [];
			var settings = [];
			var help = [];
			var about = [];

			var items = group.navigationItems;
			for (var i = 0, len = items.length; i < len; i++)
			{
				var item = items[i];
				switch (item.type)
				{
					case "home":
						home.push(item);
						break;
					case "activities":
						activities.push(item);
						break;
					case "settings":
						settings.push(item);
						break;
					case "help":
						help.push(item);
						break;
					case "about":
						about.push(item);
						break;
					default:
						rest.push(item);
						break;
				}
			}
			group.navigationItems = home.concat(activities, rest, settings, help, about);
		});
	};

	function createTopNavigationGroup()
	{
		topNavigationGroup = {
			id: null,	
			title: null,
			applicationEntryPointGroup: null,
			navigationItems: [],
			applications: [],
			shownItems: ko.observable(1)
		};

		if (homeNavigationItem)
		{
			var application = homeNavigationItem.applicationEntryPoint.application;
			homeNavigationItem.navigationGroup = topNavigationGroup;
			topNavigationGroup.applicationId = application.id;
			topNavigationGroup.applications.push(application);
			if (application.authenticationUrl && !application.authenticated)
			{
				topNavigationGroup.authenticationTargetDisplay = ko.observable(getAuthenticationTargetDisplay(application));
			}
		}
		else
		{
			homeNavigationItem = {
				id: null,
				type: "home",
				src: ko.observable("about:blank"),
				navigationGroup: topNavigationGroup,
				targetDisplay: null,
				contextual: ko.observable(false),
				hidden: ko.observable(false)
			}

			if (navigationGroups.length)
			{
				var firstGroup = navigationGroups[0];
				var application = firstGroup.applications.length == 1
					? firstGroup.applications[0]
					: (firstGroup.applicationId ? AppHost.ApplicationHost.applicationsIndex[firstGroup.applicationId] : null);

				if (application)	// 'root' application
				{
					topNavigationGroup.applicationId = application.id;
					topNavigationGroup.applications.push(application);
					if (application.authenticationUrl && !application.authenticated)
					{
						topNavigationGroup.authenticationTargetDisplay = ko.observable(getAuthenticationTargetDisplay(application));
					}
				}
			}
		}

		topNavigationGroup.navigationItems.push(homeNavigationItem);
	};
	
	function setActiveApplicationEntryPoint(event: Client.Event.Event)
	{
		var applicationEntryPointId = event.data.applicationEntryPointId;
		if (event.data.applicationEntryPointId)
		{
			var applicationId = event.data.applicationId;
			var navigationItem = currentNavigationItem();
			if (!navigationItem || navigationItem.id != applicationEntryPointId ||
				(navigationItem.applicationEntryPoint && navigationItem.applicationEntryPoint.application.id) != applicationId)
			{
				navigationItem = getNavigationItemById(applicationEntryPointId, applicationId);
				if (navigationItem && !navigationItem.hidden())
				{
					selectNavigationItem(navigationItem);
				}
			}
		}
	};

	function onApplicationEntryPointVisited(event: Client.Event.Event)
	{
		var applicationEntryPointId: string = event.data.applicationEntryPointId;
		var url: string = event.data.url;
		SDL.jQuery.each(navigationItemsIndex[event.data.applicationId] || [], (index, item: INavigationItem) =>
			{
				if (item.id == applicationEntryPointId && item.contextual())
				{
					item.contextual(false);
					if (!item.hidden())
					{
						item.navigationGroup.shownItems(item.navigationGroup.shownItems() + 1);
					}
				}
			});
	};

	function setApplicationEntryPointUrl(event: Client.Event.Event)
	{
		var url: string = event.data.url;
		if (Url.isAbsoluteUrl(url))
		{
			var applicationEntryPointId: string = event.data.applicationEntryPointId;
			SDL.jQuery.each(navigationItemsIndex[event.data.applicationId] || [], (index, item) =>
				{
					if (item.id == applicationEntryPointId && item.src() != url)
					{
						item.src(url);
					}
				});
		}
	};

	function loadApplicationEntryPoint(event: Client.Event.Event)
	{
		var applicationId: string = event.data.applicationId;
		var items = navigationItemsIndex[applicationId]
		if (items)
		{
			var itemToAuthenticate;
			var applicationEntryPointId: string = event.data.applicationEntryPointId;
			for (var i = 0, len = items.length; i < len; i++)
			{
				var navigationItem = items[i];
				if (navigationItem.id == applicationEntryPointId)
				{
					if (!navigationItem.navigationGroup.authenticationTargetDisplay ||
						 !navigationItem.navigationGroup.authenticationTargetDisplay())
					{
						loadTargetDisplayForNavigationItem(navigationItem);
						return;
					}
					else if (!itemToAuthenticate)
					{
						itemToAuthenticate = navigationItem;
					}
				}
			}
			if (itemToAuthenticate)
			{
				selectNavigationItem(itemToAuthenticate);
				AppHost.ApplicationHost.setActiveApplicationEntryPoint(itemToAuthenticate.applicationEntryPoint && itemToAuthenticate.applicationEntryPoint.id,
							itemToAuthenticate.applicationEntryPoint && itemToAuthenticate.applicationEntryPoint.application.id);
			}
		}
	};

	function initializeApplicationSuite(event: Client.Event.Event)
	{
		var applicationId: string = event.data.applicationId;

		var authenticationTargetDisplay = applicationAuthenticationTargetDisplays[applicationId];
		if (authenticationTargetDisplay && !authenticationTargetDisplay.authenticated)
		{
			var includeApplicationEntryPointIds: string[] = event.data.includeApplicationEntryPointIds;
			var excludeApplicationEntryPointIds: string[] = event.data.excludeApplicationEntryPointIds;
			var selectedGroup = currentNavigationGroup();
			var selectedItem = currentNavigationItem();
			var application = AppHost.ApplicationHost.applicationsIndex[applicationId];

			applicationAuthenticationTargetDisplays[applicationId].authenticated = true;

			SDL.jQuery.each([topNavigationGroup].concat(navigationGroups), (index, navigationGroup: INavigationGroup) =>
				{
					if (navigationGroup.authenticationTargetDisplay && navigationGroup.applications.indexOf(application) != -1)
					{
						var selectGroup = false;
						if (includeApplicationEntryPointIds || excludeApplicationEntryPointIds)
						{
							var shownItems = navigationGroup.shownItems();
							SDL.jQuery.each(navigationGroup.navigationItems, (index: number, navigationItem: INavigationItem) =>
								{
									var appEntryPoint = navigationItem.applicationEntryPoint;
									if (appEntryPoint && appEntryPoint.application == application && appEntryPoint.hidden)
									{
										navigationItem.hidden(true);

										if (navigationGroup != topNavigationGroup)
										{
											if (!navigationItem.contextual())
											{
												shownItems--;
											}

											if (selectedItem == navigationItem)
											{
												selectGroup = true;
											}
										}
									}
								});

							if (shownItems != navigationGroup.shownItems())
							{
								navigationGroup.shownItems(shownItems);
							}
						}

						var newAuthTargetDisplay: IAuthenticationTargetDisplay;
						if (navigationGroup.authenticationTargetDisplay() == authenticationTargetDisplay)
						{
							for (var i = 0, len = navigationGroup.applications.length; i < len; i++)
							{
								var nextAuthTargetDisplay = applicationAuthenticationTargetDisplays[navigationGroup.applications[i].id];
								if (nextAuthTargetDisplay && !nextAuthTargetDisplay.authenticated && (!newAuthTargetDisplay || nextAuthTargetDisplay.authenticationMode != "on-access"))
								{
									newAuthTargetDisplay = nextAuthTargetDisplay;
									if (newAuthTargetDisplay.authenticationMode != "on-access")
									{
										break;
									}
								}
							}
						}

						if (newAuthTargetDisplay)
						{
							if (selectGroup)
							{
								currentNavigationGroup(navigationGroup);
								currentNavigationItem(null);
							}
							navigationGroup.authenticationTargetDisplay(newAuthTargetDisplay);

							if (selectGroup || selectedGroup == navigationGroup || (selectedItem && selectedItem.navigationGroup == navigationGroup))
							{
								newAuthTargetDisplay.navigationGroup(navigationGroup);
								newAuthTargetDisplay.accessed(true);
							}
							else if(newAuthTargetDisplay.authenticationMode != "on-access")
							{
								newAuthTargetDisplay.accessed(true);
							}
						}
						else
						{
							if (selectGroup || selectedGroup == navigationGroup)
							{
								var firstNavigationItem: INavigationItem;
								for (var i = 0, len = navigationGroup.navigationItems.length; !firstNavigationItem && i < len; i++)
								{
									firstNavigationItem = navigationGroup.navigationItems[i];
									if (firstNavigationItem.external || firstNavigationItem.hidden())
									{
										firstNavigationItem = null;
									}
								}
								selectedItem = firstNavigationItem || homeNavigationItem;
								currentNavigationItem(selectedItem);
								loadTargetDisplayForNavigationItem(selectedItem);
							}
							else if (selectedItem && selectedItem.navigationGroup == navigationGroup)
							{
								loadTargetDisplayForNavigationItem(selectedItem);
							}
							navigationGroup.authenticationTargetDisplay(null);
						}
					}
				});

			if (authenticationTargetDisplay.targetDisplay && authenticationTargetDisplay.targetDisplay.frame)
			{
				authenticationTargetDisplay.targetDisplay.frame.src = "about:blank";
			}
		}
	};

	function resetApplicationSuite(event: Client.Event.Event)
	{
		var applicationId: string = event.data.applicationId;

		var authenticationTargetDisplay = applicationAuthenticationTargetDisplays[applicationId];
		if (authenticationTargetDisplay && authenticationTargetDisplay.authenticated)
		{
			var application = authenticationTargetDisplay.targetDisplay.application;

			authenticationTargetDisplay.authenticated = false;
			authenticationTargetDisplay.navigationGroup(null);
			authenticationTargetDisplay.accessed(false);
			authenticationTargetDisplay.disposed(false);
			authenticationTargetDisplay.loaded(false);

			var selectedNavigationGroup = currentNavigationGroup();
			var selectedNavigationItem = currentNavigationItem();
			var activeNavigationGroup: INavigationGroup = null;

			SDL.jQuery.each(navigationGroups.concat(topNavigationGroup), (index, navigationGroup: INavigationGroup) =>
				{
					if (navigationGroup.authenticationTargetDisplay && navigationGroup.applications.indexOf(application) != -1)
					{
						if (!navigationGroup.authenticationTargetDisplay())
						{
							navigationGroup.authenticationTargetDisplay(authenticationTargetDisplay);
						}

						if (navigationGroup == selectedNavigationGroup)
						{
							activeNavigationGroup = navigationGroup;
						}

						var shownItems = navigationGroup.shownItems();

						SDL.jQuery.each(navigationGroup.navigationItems, (index: number, navigationItem: INavigationItem) =>
							{
								var appEntryPoint = navigationItem.applicationEntryPoint;
								if (appEntryPoint && appEntryPoint.application == application)
								{
									if (navigationItem.hidden())
									{
										if (navigationGroup != topNavigationGroup && !navigationItem.contextual())
										{
											shownItems++;
										}
										navigationItem.hidden(false);
									}

									if (navigationItem.targetDisplay.navigationItem() == navigationItem)
									{
										navigationItem.targetDisplay.navigationItem(null);
									}

									if (navigationItem == selectedNavigationItem)
									{
										activeNavigationGroup = navigationGroup;
									}
								}
							});

						if (navigationGroup != topNavigationGroup && navigationGroup.shownItems() != shownItems)
						{
							navigationGroup.shownItems(shownItems);
						}
					}
				});

			if (activeNavigationGroup && activeNavigationGroup.authenticationTargetDisplay() == authenticationTargetDisplay)
			{
				authenticationTargetDisplay.navigationGroup(activeNavigationGroup);
				authenticationTargetDisplay.accessed(true);
			}
			else if (authenticationTargetDisplay.authenticationMode != "on-access")
			{
				authenticationTargetDisplay.accessed(true);
			}
		}
	};

	function onTargetDisplayUnloaded(event: Client.Event.Event)
	{
		var targetDisplay: AppHost.ITargetDisplay = event.data.targetDisplay;
		var authenticationTargetDisplay = applicationAuthenticationTargetDisplays[targetDisplay.application.id];
		if (authenticationTargetDisplay && authenticationTargetDisplay.authenticated &&
			authenticationTargetDisplay.targetDisplay == targetDisplay && !authenticationTargetDisplay.disposed())
		{
			authenticationTargetDisplay.targetDisplay.frame = null;
			setTimeout(() => authenticationTargetDisplay.disposed(true), 1);	// Chrome crashes without the timeout
		}
	};

	initialize();
}