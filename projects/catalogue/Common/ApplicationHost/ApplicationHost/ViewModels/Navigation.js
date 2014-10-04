/// <reference path="../../../../SDL.Client/SDL.Client.Core/ApplicationHost/ApplicationHost.d.ts" />
/// <reference path="../../../../SDL.Client/SDL.Client.Core/Types/Url.d.ts" />
/// <reference path="../../../../SDL.Client/SDL.Client.UI.Core.Knockout/Libraries/knockout/knockout.d.ts" />
/// <reference path="../../../../SDL.Client/SDL.Client.UI.Controls/TopBar/TopBar.d.ts" />
var SDL;
(function (SDL) {
    (function (Client) {
        (function (UI) {
            (function (ApplicationHost) {
                (function (ViewModels) {
                    (function (Navigation) {
                        var Url = SDL.Client.Types.Url;
                        var AppHost = SDL.Client.ApplicationHost;

                        Client.Xml.Namespaces["apphost"] = "http://www.sdl.com/2013/ApplicationHost";

                        ;

                        ;

                        ;

                        ;

                        ;

                        Navigation.navigationGroups = [];
                        Navigation.topNavigationGroup = null;
                        Navigation.homeNavigationItem;
                        Navigation.currentNavigationItem = ko.observable(null);
                        Navigation.currentNavigationGroup = ko.observable(null);
                        Navigation.authenticationTargetDisplays = null;
                        Navigation.navigationItemTargetDisplays = null;

                        var navigationItemsIndex = {};
                        var applicationAuthenticationTargetDisplays = {};
                        var applicationNavigationItemTargetDisplaysIndex = {};
                        var initialized = false;
                        var initCallbacks = [];
                        var topNavigationGroupItems = [];
                        var baseTopBarOptions = { ribbonTabs: undefined, selectedRibbonTabId: undefined, buttons: undefined };

                        function selectNavigationItem(navigationItem) {
                            if (navigationItem) {
                                if (navigationItem.external) {
                                    window.open(navigationItem.src());
                                } else if (Navigation.currentNavigationItem() != navigationItem) {
                                    Navigation.currentNavigationItem(navigationItem);
                                }
                            }
                        }
                        Navigation.selectNavigationItem = selectNavigationItem;

                        function setNavigationSelectionFromUrl(ignoreErrors) {
                            var newAppId = Url.getHashParameter(window.location.href, "app");
                            var newEntryId = Url.getHashParameter(window.location.href, "entry");
                            var newGroupId = Url.getHashParameter(window.location.href, "group");

                            if (newEntryId || (newAppId && !newGroupId)) {
                                var prevNavItem = Navigation.currentNavigationItem();
                                var prevApplicationEntryPoint = prevNavItem && prevNavItem.applicationEntryPoint;
                                var prevAppId = prevApplicationEntryPoint && prevApplicationEntryPoint.application.id || null;
                                var prevEntryId = prevApplicationEntryPoint && prevApplicationEntryPoint.id || null;
                                var prevSrc = prevNavItem && prevNavItem.src() || null;
                                var newSrc = Url.getHashParameter(window.location.href, "url") || "";

                                if (newAppId != prevAppId || newEntryId != prevEntryId || newSrc != prevSrc) {
                                    var newNavItem = getNavigationItemById(newEntryId, newAppId) || (newAppId ? getNavigationItemById(null, newAppId) : null);

                                    if (newNavItem && !newNavItem.external && !newNavItem.hidden()) {
                                        if (newNavItem.applicationEntryPoint) {
                                            if (ignoreErrors) {
                                                try  {
                                                    AppHost.ApplicationHost.setApplicationEntryPointUrl(newNavItem.id, newSrc, newAppId);
                                                } catch (err) {
                                                    if (window.console) {
                                                        window.console.error(err.message);
                                                    }
                                                }
                                            } else {
                                                AppHost.ApplicationHost.setApplicationEntryPointUrl(newNavItem.id, newSrc, newAppId);
                                            }
                                        }

                                        if (prevNavItem != newNavItem) {
                                            selectNavigationItem(newNavItem);
                                        }
                                    }
                                }
                                return;
                            }

                            if (newGroupId) {
                                var prevGroup = Navigation.currentNavigationGroup();
                                if (!prevGroup || prevGroup.id != newGroupId) {
                                    var group = getNavigationGroupById(newGroupId, newAppId);
                                    if (group && group.authenticationTargetDisplay && group.authenticationTargetDisplay()) {
                                        Navigation.currentNavigationGroup(group);
                                        selectNavigationItem(null);
                                    }
                                }
                                return;
                            }

                            if (Navigation.currentNavigationItem() != Navigation.homeNavigationItem) {
                                selectNavigationItem(Navigation.homeNavigationItem);
                            }
                        }
                        Navigation.setNavigationSelectionFromUrl = setNavigationSelectionFromUrl;

                        function initialize(callback) {
                            if (!initialized) {
                                if (callback) {
                                    initCallbacks.push(callback);
                                }

                                if (initialized === false) {
                                    initialized = undefined;

                                    AppHost.initialize(function () {
                                        initializeNavigationViewModel();
                                        initialized = true;
                                        for (var i = 0, len = initCallbacks.length; i < len; i++) {
                                            initCallbacks[i]();
                                        }
                                        initCallbacks = undefined;
                                    });
                                }
                            } else if (callback) {
                                callback();
                            }
                        }
                        Navigation.initialize = initialize;
                        ;

                        function getNavigationItemById(navigationItemId, applicationId) {
                            var allGroups = [Navigation.topNavigationGroup].concat(Navigation.navigationGroups);
                            for (var i = 0, len = allGroups.length; i < len; i++) {
                                var navigationItems = allGroups[i].navigationItems;
                                for (var j = 0, lenj = navigationItems.length; j < lenj; j++) {
                                    var item = navigationItems[j];
                                    if (item && (!navigationItemId || item.id == navigationItemId) && (!applicationId || item.applicationEntryPoint && item.applicationEntryPoint.application.id == applicationId)) {
                                        return item;
                                    }
                                }
                            }
                        }
                        Navigation.getNavigationItemById = getNavigationItemById;
                        ;

                        function onTopBarEvent(targetDisplay, e, topBar) {
                            AppHost.ApplicationHost.publishEvent("topbarevent", { type: e.type, data: e.data }, targetDisplay.targetDisplay);
                        }
                        Navigation.onTopBarEvent = onTopBarEvent;

                        function loadTargetDisplayForNavigationItem(navigationItem) {
                            if (!navigationItem.hidden()) {
                                var targetDisplay = navigationItem.targetDisplay;

                                if (targetDisplay) {
                                    var curNavigationItem = targetDisplay.navigationItem();
                                    if (curNavigationItem != navigationItem) {
                                        targetDisplay.navigationItem(navigationItem);
                                        if (!curNavigationItem) {
                                            navigationItem.targetDisplay.accessed(true);
                                        }
                                    }
                                }
                            }
                        }
                        ;

                        function initializeNavigationViewModel() {
                            var navigationNode = Client.Xml.selectSingleNode(Client.Configuration.ConfigurationManager.configuration, "//configuration/customSections/apphost:navigation");
                            if (navigationNode) {
                                // navigation is defined in configuration
                                var navigationGroupNodes = Client.Xml.selectNodes(navigationNode, "apphost:navigationGroup");
                                Navigation.navigationGroups = SDL.jQuery.map(navigationGroupNodes, function (navigationGroupNode, index) {
                                    var applicationEntryPointGroupId = navigationGroupNode.getAttribute("applicationEntryPointGroupId");
                                    if (applicationEntryPointGroupId) {
                                        return buildNavigationGroupForApplicationEntryPointGroup(getApplicationEntryPointGroupById(navigationGroupNode.getAttribute("applicationSuiteId"), applicationEntryPointGroupId), index == 0, navigationGroupNode);
                                    } else {
                                        return buildNavigationGroup(navigationGroupNode, index == 0);
                                    }
                                });
                            } else {
                                // navigation is built based on application host data
                                Navigation.navigationGroups = SDL.jQuery.map(AppHost.ApplicationHost.applications, function (application, index) {
                                    return SDL.jQuery.map(application.entryPointGroups, function (group, index) {
                                        return buildNavigationGroupForApplicationEntryPointGroup(group, index == 0);
                                    });
                                });
                            }

                            Navigation.authenticationTargetDisplays = SDL.jQuery.map(applicationAuthenticationTargetDisplays, function (display, index) {
                                return display;
                            });
                            Navigation.navigationItemTargetDisplays = SDL.jQuery.map(applicationNavigationItemTargetDisplaysIndex, function (displays, index) {
                                return SDL.jQuery.map(displays, function (display, index) {
                                    return display;
                                });
                            });

                            orderNavigationItems();
                            createTopNavigationGroup();

                            Navigation.currentNavigationItem.subscribe(function () {
                                var navItem = Navigation.currentNavigationItem();
                                if (navItem) {
                                    if (Navigation.currentNavigationGroup()) {
                                        Navigation.currentNavigationGroup(null);
                                    }

                                    if (navItem.contextual()) {
                                        navItem.contextual(false);
                                        if (!navItem.hidden()) {
                                            navItem.navigationGroup.shownItems(navItem.navigationGroup.shownItems() + 1);
                                        }
                                    }

                                    var authenticationTargetDisplay = navItem.navigationGroup && navItem.navigationGroup.authenticationTargetDisplay && navItem.navigationGroup.authenticationTargetDisplay();
                                    if (authenticationTargetDisplay) {
                                        if (authenticationTargetDisplay.navigationGroup() != navItem.navigationGroup) {
                                            authenticationTargetDisplay.navigationGroup(navItem.navigationGroup);
                                            authenticationTargetDisplay.accessed(true);
                                        }
                                    } else {
                                        loadTargetDisplayForNavigationItem(navItem);
                                    }

                                    if (!navItem.hidden()) {
                                        var appEntryPoint = navItem.applicationEntryPoint;
                                        AppHost.ApplicationHost.setActiveApplicationEntryPoint(appEntryPoint && appEntryPoint.id, appEntryPoint && appEntryPoint.application.id);
                                        return;
                                    }
                                }

                                AppHost.ApplicationHost.setActiveApplicationEntryPoint(null, null);
                            });

                            Navigation.currentNavigationGroup.subscribe(function () {
                                var navGroup = Navigation.currentNavigationGroup();
                                if (navGroup) {
                                    if (Navigation.currentNavigationItem()) {
                                        Navigation.currentNavigationItem(null);
                                    }

                                    var targetDisplay = navGroup.authenticationTargetDisplay && navGroup.authenticationTargetDisplay();
                                    if (targetDisplay && targetDisplay.navigationGroup() != navGroup) {
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
                            Client.Event.EventRegister.addEventHandler(AppHost.ApplicationHost, "targetdisplayload", onTargetDisplayLoaded);
                            Client.Event.EventRegister.addEventHandler(AppHost.ApplicationHost, "targetdisplayunload", onTargetDisplayUnloaded);
                            Client.Event.EventRegister.addEventHandler(AppHost.ApplicationHost, "targetdisplayurlchange", onTargetDisplayUrlChange);
                            Client.Event.EventRegister.addEventHandler(AppHost.ApplicationHost, "showtopbar", onTargetDisplayTopBarShow);
                            Client.Event.EventRegister.addEventHandler(AppHost.ApplicationHost, "settopbaroptions", onTargetDisplayTopBarOptions);

                            setNavigationSelectionFromUrl(true);

                            ko.computed(function setUrlFromNavigationSelection() {
                                var navItem = Navigation.currentNavigationItem();
                                var newHref = window.location.href;

                                if (navItem) {
                                    var appEntryPoint = navItem.applicationEntryPoint;

                                    if (appEntryPoint) {
                                        newHref = Url.setHashParameter(newHref, "app", appEntryPoint.application.id);
                                        newHref = Url.setHashParameter(newHref, "entry", navItem.id);
                                        newHref = Url.setHashParameter(newHref, "group", null);

                                        navItem.src(); // this is to trigger computed to recalculate when src() changes
                                        if (appEntryPoint.url && appEntryPoint.url != appEntryPoint.baseUrl) {
                                            newHref = Url.setHashParameter(newHref, "url", Url.makeRelativeUrl(appEntryPoint.baseUrl, appEntryPoint.url));
                                        } else {
                                            newHref = Url.setHashParameter(newHref, "url", null);
                                        }
                                    } else {
                                        newHref = Url.setHashParameter(newHref, "app", null);
                                        newHref = Url.setHashParameter(newHref, "entry", null);
                                        newHref = Url.setHashParameter(newHref, "group", null);
                                        newHref = Url.setHashParameter(newHref, "url", null);
                                    }
                                } else {
                                    newHref = Url.setHashParameter(newHref, "entry", null);

                                    var group = Navigation.currentNavigationGroup();
                                    if (group) {
                                        newHref = Url.setHashParameter(newHref, "app", group.applicationId);
                                        newHref = Url.setHashParameter(newHref, "group", group.id);
                                    } else {
                                        newHref = Url.setHashParameter(newHref, "app", null);
                                        newHref = Url.setHashParameter(newHref, "group", null);
                                    }
                                }

                                if (window.location.href != newHref) {
                                    if (newHref.indexOf("#") == -1) {
                                        newHref += "#"; // making sure there's a hash parameter, otherwise the whole window will refresh
                                    }
                                    window.location.href = newHref;
                                }
                            }).extend({ throttle: 1 });

                            SDL.jQuery(window).on("hashchange", function () {
                                setNavigationSelectionFromUrl();
                            });
                        }
                        ;

                        function getApplicationEntryPointGroupById(applicationId, applicationEntryPointGroupId) {
                            var application;
                            if (applicationId) {
                                application = AppHost.ApplicationHost.applicationsIndex[applicationId];
                                if (application) {
                                    return application.entryPointGroupsIndex[applicationEntryPointGroupId];
                                }
                            } else {
                                // application unspecified -> figure it out
                                var applications = AppHost.ApplicationHost.applications;
                                for (var i = 0, len = applications.length; i < len; i++) {
                                    var group = applications[i].entryPointGroupsIndex[applicationEntryPointGroupId];
                                    if (group) {
                                        return group;
                                    }
                                }
                            }
                        }
                        ;

                        function getApplicationEntryPointById(applicationId, applicationEntryPointId) {
                            var application;
                            if (applicationId) {
                                application = AppHost.ApplicationHost.applicationsIndex[applicationId];
                                return getApplicationEntryPointByIdInApplication(application, applicationEntryPointId);
                            } else {
                                // application unspecified -> figure it out
                                var applications = AppHost.ApplicationHost.applications;
                                for (var i = 0, len = applications.length; i < len; i++) {
                                    var entry = getApplicationEntryPointByIdInApplication(applications[i], applicationEntryPointId);
                                    if (entry) {
                                        return entry;
                                    }
                                }
                            }
                        }
                        ;

                        function getApplicationEntryPointByIdInApplication(application, applicationEntryPointId) {
                            for (var i = 0, len = application.entryPointGroups.length; i < len; i++) {
                                var group = application.entryPointGroups[i];
                                for (var j = 0, lenj = group.entryPoints.length; j < lenj; j++) {
                                    if (group.entryPoints[j].id == applicationEntryPointId) {
                                        return group.entryPoints[j];
                                    }
                                }
                            }
                        }
                        ;

                        function buildNavigationGroup(navigationGroupNode, isFirstGroup) {
                            var groupApplicationId = navigationGroupNode.getAttribute("applicationSuiteId");
                            var navigationItemNodes = Client.Xml.selectNodes(navigationGroupNode, "apphost:navigationItems/apphost:navigationItem[@applicationEntryPointId]");
                            var navigationGroup = {
                                id: navigationGroupNode.getAttribute("id"),
                                title: navigationGroupNode.getAttribute("title"),
                                applicationEntryPointGroup: null,
                                navigationItems: null,
                                applications: [],
                                translations: buildNameTranslations(navigationGroupNode),
                                shownItems: null,
                                applicationId: groupApplicationId
                            };

                            if (groupApplicationId) {
                                var application = AppHost.ApplicationHost.applicationsIndex[groupApplicationId];
                                if (application) {
                                    navigationGroup.applications.push(application);
                                }
                            }

                            var shownItems = 0;
                            navigationGroup.navigationItems = SDL.jQuery.map(navigationItemNodes, function (navigationItemNode, index) {
                                var applicationEntryPoint = getApplicationEntryPointById(navigationItemNode.getAttribute("applicationSuiteId") || groupApplicationId, navigationItemNode.getAttribute("applicationEntryPointId"));

                                if (applicationEntryPoint) {
                                    var application = applicationEntryPoint && applicationEntryPoint.application;
                                    if (navigationGroup.applications.indexOf(application) == -1) {
                                        navigationGroup.applications.push(application);
                                    }

                                    if (application.authenticationUrl && !application.authenticated && !navigationGroup.authenticationTargetDisplay) {
                                        navigationGroup.authenticationTargetDisplay = ko.observable(getAuthenticationTargetDisplay(application));
                                    }

                                    var navigationItem = buildNavigationItemForApplicationEntryPoint(applicationEntryPoint, navigationGroup, isFirstGroup, navigationItemNode);
                                    if (topNavigationGroupItems.indexOf(navigationItem) == -1) {
                                        if (!navigationItem.contextual() && !navigationItem.hidden()) {
                                            shownItems++;
                                        }
                                        return navigationItem;
                                    }
                                }
                            });

                            navigationGroup.shownItems = ko.observable(shownItems);
                            return navigationGroup;
                        }
                        ;

                        function buildNavigationGroupForApplicationEntryPointGroup(applicationEntryPointGroup, isFirstGroup, navigationGroupNode) {
                            var application = applicationEntryPointGroup.application;
                            var navigationGroup = {
                                id: navigationGroupNode && navigationGroupNode.getAttribute("id") || applicationEntryPointGroup.id,
                                title: navigationGroupNode && navigationGroupNode.getAttribute("title") || applicationEntryPointGroup.title,
                                applicationEntryPointGroup: applicationEntryPointGroup,
                                navigationItems: null,
                                applications: [application],
                                shownItems: null,
                                applicationId: application.id
                            };

                            var shownItems = 0;
                            navigationGroup.navigationItems = SDL.jQuery.map(applicationEntryPointGroup.entryPoints, function (entryPoint, index) {
                                var navigationItem = buildNavigationItemForApplicationEntryPoint(entryPoint, navigationGroup, isFirstGroup);
                                if (topNavigationGroupItems.indexOf(navigationItem) == -1) {
                                    if (!navigationItem.contextual() && !navigationItem.hidden()) {
                                        shownItems++;
                                    }
                                    return navigationItem;
                                }
                            });

                            navigationGroup.shownItems = ko.observable(shownItems);

                            if (application.authenticationUrl && !application.authenticated) {
                                navigationGroup.authenticationTargetDisplay = ko.observable(getAuthenticationTargetDisplay(application));
                            }

                            if (navigationGroupNode) {
                                navigationGroup.translations = buildNameTranslations(navigationGroupNode);
                            }

                            return navigationGroup;
                        }
                        ;

                        function getAuthenticationTargetDisplay(application) {
                            var authenticationTargetDisplay = applicationAuthenticationTargetDisplays[application.id];
                            if (!authenticationTargetDisplay) {
                                authenticationTargetDisplay = applicationAuthenticationTargetDisplays[application.id] = {
                                    targetDisplay: application.authenticationTargetDisplay,
                                    navigationGroup: ko.observable(null),
                                    src: application.authenticationUrl,
                                    loaded: ko.observable(false),
                                    loading: null,
                                    topBarShown: ko.observable(false),
                                    topBarOptions: ko.observable(SDL.jQuery.extend({}, baseTopBarOptions)),
                                    timeout: 0,
                                    authenticationMode: application.authenticationMode,
                                    accessed: ko.observable(application.authenticationMode != "on-access"),
                                    authenticated: false,
                                    disposed: ko.observable(false)
                                };

                                authenticationTargetDisplay.loading = ko.computed(isTargetDisplayLoading, authenticationTargetDisplay);
                            }

                            return authenticationTargetDisplay;
                        }
                        ;

                        function buildNavigationItemForApplicationEntryPoint(applicationEntryPoint, parentNavigationGroup, isFirstGroup, navigationItemNode) {
                            var navigationItem = {
                                id: applicationEntryPoint.id,
                                type: navigationItemNode && navigationItemNode.getAttribute("type") || applicationEntryPoint.type,
                                title: navigationItemNode && navigationItemNode.getAttribute("title") || applicationEntryPoint.title,
                                applicationEntryPoint: applicationEntryPoint,
                                src: ko.observable(Url.isAbsoluteUrl(applicationEntryPoint.url) ? applicationEntryPoint.url : "about:blank"),
                                icon: applicationEntryPoint.icon,
                                topIcon: applicationEntryPoint.topIcon,
                                navigationGroup: parentNavigationGroup,
                                targetDisplay: buildNavigationItemTargetDisplay(applicationEntryPoint.targetDisplay.name, applicationEntryPoint.application),
                                contextual: ko.observable(applicationEntryPoint.contextual && !applicationEntryPoint.visited),
                                hidden: ko.observable(applicationEntryPoint.hidden),
                                external: applicationEntryPoint.external,
                                overlay: applicationEntryPoint.overlay
                            };

                            if (isFirstGroup) {
                                switch (navigationItem.type) {
                                    case "home":
                                        if (!Navigation.homeNavigationItem) {
                                            Navigation.homeNavigationItem = navigationItem;
                                            topNavigationGroupItems.unshift(navigationItem);
                                        }
                                        break;
                                    case "top":
                                        // add to the top group
                                        topNavigationGroupItems.push(navigationItem);
                                        break;
                                }
                            }

                            if (!navigationItemsIndex[applicationEntryPoint.application.id]) {
                                navigationItemsIndex[applicationEntryPoint.application.id] = [navigationItem];
                            } else {
                                navigationItemsIndex[applicationEntryPoint.application.id].push(navigationItem);
                            }

                            if (navigationItemNode) {
                                navigationItem.titleResource = navigationItemNode.getAttribute("titleResource");
                                navigationItem.translations = buildNameTranslations(navigationItemNode);

                                var icon = navigationItemNode.getAttribute("icon");
                                var topIcon = navigationItemNode.getAttribute("topIcon");
                                var isIconRelative = icon && icon.charAt(0) != "/" && icon.indexOf("~/") == -1;
                                var isTopIconRelative = topIcon && topIcon.charAt(0) != "/" && topIcon.indexOf("~/") == -1;
                                if (isIconRelative || isTopIconRelative) {
                                    var baseUrlNodes = Client.Xml.selectNodes(navigationItemNode, "ancestor::configuration/@baseUrl");
                                    var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

                                    if (isIconRelative) {
                                        icon = Url.combinePath(baseUrl, icon);
                                    }

                                    if (isTopIconRelative) {
                                        topIcon = Url.combinePath(baseUrl, topIcon);
                                    }
                                }

                                if (icon) {
                                    if (icon.indexOf("~/") == 0) {
                                        icon = Url.combinePath(Client.Configuration.ConfigurationManager.corePath, icon.slice(2));
                                    }
                                    navigationItem.icon = icon;
                                }

                                if (topIcon) {
                                    if (topIcon.indexOf("~/") == 0) {
                                        topIcon = Url.combinePath(Client.Configuration.ConfigurationManager.corePath, topIcon.slice(2));
                                    }
                                    navigationItem.topIcon = topIcon;
                                }

                                var external = navigationItemNode.getAttribute("external");
                                if (external) {
                                    navigationItem.external = external == "true" || external == "1";
                                }
                                if (!applicationEntryPoint.visited) {
                                    var contextual = navigationItemNode.getAttribute("contextual");
                                    if (contextual) {
                                        navigationItem.contextual(contextual == "true" || contextual == "1");
                                    }
                                }
                                var overlay = navigationItemNode.getAttribute("overlay");
                                if (overlay) {
                                    navigationItem.overlay = !(overlay == "false" || overlay == "0") && (overlay == "true" || overlay == "1" || undefined);
                                }
                            }

                            return navigationItem;
                        }
                        ;

                        function buildNavigationItemTargetDisplay(targetDisplayName, application) {
                            if (targetDisplayName) {
                                var navigationItemTargetDisplays = applicationNavigationItemTargetDisplaysIndex[application.id];
                                if (!navigationItemTargetDisplays) {
                                    navigationItemTargetDisplays = applicationNavigationItemTargetDisplaysIndex[application.id] = {};
                                }
                                var targetDisplay = navigationItemTargetDisplays[targetDisplayName];
                                if (!targetDisplay) {
                                    var applicationEntryPointTargetDisplay = application.targetDisplaysIndex[targetDisplayName];
                                    if (applicationEntryPointTargetDisplay) {
                                        targetDisplay = navigationItemTargetDisplays[targetDisplayName] = {
                                            targetDisplay: applicationEntryPointTargetDisplay,
                                            src: null,
                                            accessed: ko.observable(false),
                                            loaded: ko.observable(false),
                                            loading: null,
                                            topBarShown: ko.observable(false),
                                            topBarOptions: ko.observable(SDL.jQuery.extend({}, baseTopBarOptions)),
                                            timeout: 0,
                                            disposed: ko.observable(false),
                                            navigationItem: ko.observable(null)
                                        };

                                        targetDisplay.loading = ko.computed(isTargetDisplayLoading, targetDisplay);
                                    }
                                }
                                return targetDisplay;
                            }
                        }
                        ;

                        function isTargetDisplayLoading() {
                            var targetDisplay = this;
                            if (targetDisplay.accessed() && !targetDisplay.loaded()) {
                                if (targetDisplay.timeout) {
                                    window.clearTimeout(targetDisplay.timeout);
                                }

                                targetDisplay.timeout = window.setTimeout(function () {
                                    targetDisplay.timeout = 0;
                                    if (window.console) {
                                        window.console.warn(targetDisplay.src + " failed to load within 10 seconds");
                                    }
                                    targetDisplay.loaded(true);
                                }, 10000);

                                return true;
                            } else {
                                if (targetDisplay.timeout) {
                                    window.clearTimeout(targetDisplay.timeout);
                                    targetDisplay.timeout = 0;
                                }
                                return false;
                            }
                        }
                        ;

                        function getNavigationGroupById(groupId, applicationId) {
                            for (var i = 0, len = Navigation.navigationGroups.length; i < len; i++) {
                                var group = Navigation.navigationGroups[i];
                                if (group.id == groupId && applicationId == group.applicationId) {
                                    return Navigation.navigationGroups[i];
                                }
                            }
                        }
                        ;

                        function buildNameTranslations(parent) {
                            var translations = {};
                            var translationNodes = Client.Xml.selectNodes(parent, "apphost:translations/apphost:title[@lang]");
                            for (var i = 0, len = translationNodes.length; i < len; i++) {
                                var translationNode = translationNodes[i];
                                translations[translationNode.getAttribute("lang")] = Client.Xml.getInnerText(translationNode);
                            }
                            return translations;
                        }
                        ;

                        function orderNavigationItems() {
                            SDL.jQuery.each(Navigation.navigationGroups, function (index, group) {
                                var home = [];
                                var activities = [];
                                var rest = [];
                                var settings = [];
                                var help = [];
                                var about = [];

                                var items = group.navigationItems;
                                for (var i = 0, len = items.length; i < len; i++) {
                                    var item = items[i];
                                    switch (item.type) {
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
                        }
                        ;

                        function createTopNavigationGroup() {
                            Navigation.topNavigationGroup = {
                                id: null,
                                title: null,
                                applicationEntryPointGroup: null,
                                navigationItems: topNavigationGroupItems,
                                applications: [],
                                shownItems: ko.observable(topNavigationGroupItems.length + (Navigation.homeNavigationItem ? 0 : 1))
                            };

                            for (var i = 0; i < topNavigationGroupItems.length; i++) {
                                var topNavigationGroupItem = topNavigationGroupItems[i];
                                application = topNavigationGroupItem.applicationEntryPoint.application;
                                topNavigationGroupItem.navigationGroup = Navigation.topNavigationGroup;

                                if (Navigation.topNavigationGroup.applications.indexOf(application) == -1) {
                                    Navigation.topNavigationGroup.applications.push(application);
                                }

                                if (!Navigation.topNavigationGroup.applicationId) {
                                    Navigation.topNavigationGroup.applicationId = application.id;
                                }

                                if (application.authenticationUrl && !application.authenticated && !Navigation.topNavigationGroup.authenticationTargetDisplay) {
                                    Navigation.topNavigationGroup.authenticationTargetDisplay = ko.observable(getAuthenticationTargetDisplay(application));
                                }
                            }

                            if (!Navigation.homeNavigationItem) {
                                Navigation.homeNavigationItem = {
                                    id: null,
                                    type: "home",
                                    src: ko.observable("about:blank"),
                                    navigationGroup: Navigation.topNavigationGroup,
                                    targetDisplay: null,
                                    contextual: ko.observable(false),
                                    hidden: ko.observable(false)
                                };

                                if (!Navigation.topNavigationGroup.applicationId && Navigation.navigationGroups.length) {
                                    var firstGroup = Navigation.navigationGroups[0];
                                    var application = firstGroup.applications.length == 1 ? firstGroup.applications[0] : (firstGroup.applicationId ? AppHost.ApplicationHost.applicationsIndex[firstGroup.applicationId] : null);

                                    if (application) {
                                        Navigation.topNavigationGroup.applicationId = application.id;
                                        Navigation.topNavigationGroup.applications.push(application);
                                        if (application.authenticationUrl && !application.authenticated) {
                                            Navigation.topNavigationGroup.authenticationTargetDisplay = ko.observable(getAuthenticationTargetDisplay(application));
                                        }
                                    }
                                }
                                topNavigationGroupItems.unshift(Navigation.homeNavigationItem);
                            }
                        }
                        ;

                        function setActiveApplicationEntryPoint(event) {
                            var applicationEntryPointId = event.data.applicationEntryPointId;
                            if (applicationEntryPointId) {
                                var applicationId = event.data.applicationId;
                                var navigationItem = Navigation.currentNavigationItem();
                                if (!navigationItem || navigationItem.id != applicationEntryPointId || (navigationItem.applicationEntryPoint && navigationItem.applicationEntryPoint.application.id) != applicationId) {
                                    navigationItem = getNavigationItemById(applicationEntryPointId, applicationId);
                                    if (navigationItem && !navigationItem.hidden()) {
                                        selectNavigationItem(navigationItem);
                                    }
                                }
                            }
                        }
                        ;

                        function onApplicationEntryPointVisited(event) {
                            var applicationEntryPointId = event.data.applicationEntryPointId;
                            var url = event.data.url;
                            SDL.jQuery.each(navigationItemsIndex[event.data.applicationId] || [], function (index, item) {
                                if (item.id == applicationEntryPointId && item.contextual()) {
                                    item.contextual(false);
                                    if (!item.hidden()) {
                                        item.navigationGroup.shownItems(item.navigationGroup.shownItems() + 1);
                                    }
                                }
                            });
                        }
                        ;

                        function setApplicationEntryPointUrl(event) {
                            var url = event.data.url;
                            if (Url.isAbsoluteUrl(url)) {
                                var applicationEntryPointId = event.data.applicationEntryPointId;
                                SDL.jQuery.each(navigationItemsIndex[event.data.applicationId] || [], function (index, item) {
                                    if (item.id == applicationEntryPointId && item.src() != url) {
                                        item.src(url);
                                    }
                                });
                            }
                        }
                        ;

                        function loadApplicationEntryPoint(event) {
                            var applicationId = event.data.applicationId;
                            var items = navigationItemsIndex[applicationId];
                            if (items) {
                                var itemToAuthenticate;
                                var applicationEntryPointId = event.data.applicationEntryPointId;
                                for (var i = 0, len = items.length; i < len; i++) {
                                    var navigationItem = items[i];
                                    if (navigationItem.id == applicationEntryPointId) {
                                        if (!navigationItem.navigationGroup.authenticationTargetDisplay || !navigationItem.navigationGroup.authenticationTargetDisplay()) {
                                            loadTargetDisplayForNavigationItem(navigationItem);
                                            return;
                                        } else if (!itemToAuthenticate) {
                                            itemToAuthenticate = navigationItem;
                                        }
                                    }
                                }
                                if (itemToAuthenticate) {
                                    selectNavigationItem(itemToAuthenticate);
                                }
                            }
                        }
                        ;

                        function initializeApplicationSuite(event) {
                            var applicationId = event.data.applicationId;

                            var authenticationTargetDisplay = applicationAuthenticationTargetDisplays[applicationId];
                            if (authenticationTargetDisplay && !authenticationTargetDisplay.authenticated) {
                                var includeApplicationEntryPointIds = event.data.includeApplicationEntryPointIds;
                                var excludeApplicationEntryPointIds = event.data.excludeApplicationEntryPointIds;
                                var selectedGroup = Navigation.currentNavigationGroup();
                                var selectedItem = Navigation.currentNavigationItem();
                                var application = AppHost.ApplicationHost.applicationsIndex[applicationId];

                                applicationAuthenticationTargetDisplays[applicationId].authenticated = true;

                                SDL.jQuery.each([Navigation.topNavigationGroup].concat(Navigation.navigationGroups), function (index, navigationGroup) {
                                    if (navigationGroup.authenticationTargetDisplay && navigationGroup.applications.indexOf(application) != -1) {
                                        var selectGroup = false;
                                        if (includeApplicationEntryPointIds || excludeApplicationEntryPointIds) {
                                            var shownItems = navigationGroup.shownItems();
                                            SDL.jQuery.each(navigationGroup.navigationItems, function (index, navigationItem) {
                                                var appEntryPoint = navigationItem.applicationEntryPoint;
                                                if (appEntryPoint && appEntryPoint.application == application && appEntryPoint.hidden) {
                                                    navigationItem.hidden(true);

                                                    if (navigationGroup != Navigation.topNavigationGroup) {
                                                        if (!navigationItem.contextual()) {
                                                            shownItems--;
                                                        }

                                                        if (selectedItem == navigationItem) {
                                                            selectGroup = true;
                                                        }
                                                    }
                                                }
                                            });

                                            if (shownItems != navigationGroup.shownItems()) {
                                                navigationGroup.shownItems(shownItems);
                                            }
                                        }

                                        var newAuthTargetDisplay;
                                        if (navigationGroup.authenticationTargetDisplay() == authenticationTargetDisplay) {
                                            for (var i = 0, len = navigationGroup.applications.length; i < len; i++) {
                                                var nextAuthTargetDisplay = applicationAuthenticationTargetDisplays[navigationGroup.applications[i].id];
                                                if (nextAuthTargetDisplay && !nextAuthTargetDisplay.authenticated && (!newAuthTargetDisplay || nextAuthTargetDisplay.authenticationMode != "on-access")) {
                                                    newAuthTargetDisplay = nextAuthTargetDisplay;
                                                    if (newAuthTargetDisplay.authenticationMode != "on-access") {
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if (newAuthTargetDisplay) {
                                            if (selectGroup) {
                                                Navigation.currentNavigationGroup(navigationGroup);
                                                Navigation.currentNavigationItem(null);
                                            }
                                            navigationGroup.authenticationTargetDisplay(newAuthTargetDisplay);

                                            if (selectGroup || selectedGroup == navigationGroup || (selectedItem && selectedItem.navigationGroup == navigationGroup)) {
                                                newAuthTargetDisplay.navigationGroup(navigationGroup);
                                                newAuthTargetDisplay.accessed(true);
                                            } else if (newAuthTargetDisplay.authenticationMode != "on-access") {
                                                newAuthTargetDisplay.accessed(true);
                                            }
                                        } else {
                                            if (selectGroup || selectedGroup == navigationGroup) {
                                                var firstNavigationItem;
                                                for (var i = 0, len = navigationGroup.navigationItems.length; !firstNavigationItem && i < len; i++) {
                                                    firstNavigationItem = navigationGroup.navigationItems[i];
                                                    if (firstNavigationItem.external || firstNavigationItem.hidden()) {
                                                        firstNavigationItem = null;
                                                    }
                                                }
                                                selectedItem = firstNavigationItem || Navigation.homeNavigationItem;
                                                Navigation.currentNavigationItem(selectedItem);
                                                loadTargetDisplayForNavigationItem(selectedItem);
                                            } else if (selectedItem && selectedItem.navigationGroup == navigationGroup) {
                                                loadTargetDisplayForNavigationItem(selectedItem);
                                            }
                                            navigationGroup.authenticationTargetDisplay(null);
                                        }
                                    }
                                });

                                if (authenticationTargetDisplay.targetDisplay && authenticationTargetDisplay.targetDisplay.frame) {
                                    authenticationTargetDisplay.targetDisplay.frame.src = "about:blank";
                                }
                            }
                        }
                        ;

                        function resetApplicationSuite(event) {
                            var applicationId = event.data.applicationId;

                            var authenticationTargetDisplay = applicationAuthenticationTargetDisplays[applicationId];
                            if (authenticationTargetDisplay && authenticationTargetDisplay.authenticated) {
                                var application = authenticationTargetDisplay.targetDisplay.application;

                                authenticationTargetDisplay.authenticated = false;
                                authenticationTargetDisplay.navigationGroup(null);
                                authenticationTargetDisplay.accessed(false);
                                authenticationTargetDisplay.disposed(false);
                                authenticationTargetDisplay.loaded(false);

                                var selectedNavigationGroup = Navigation.currentNavigationGroup();
                                var selectedNavigationItem = Navigation.currentNavigationItem();
                                var activeNavigationGroup = null;

                                SDL.jQuery.each(Navigation.navigationGroups.concat(Navigation.topNavigationGroup), function (index, navigationGroup) {
                                    if (navigationGroup.authenticationTargetDisplay && navigationGroup.applications.indexOf(application) != -1) {
                                        if (!navigationGroup.authenticationTargetDisplay()) {
                                            navigationGroup.authenticationTargetDisplay(authenticationTargetDisplay);
                                        }

                                        if (navigationGroup == selectedNavigationGroup) {
                                            activeNavigationGroup = navigationGroup;
                                        }

                                        var shownItems = navigationGroup.shownItems();

                                        SDL.jQuery.each(navigationGroup.navigationItems, function (index, navigationItem) {
                                            var appEntryPoint = navigationItem.applicationEntryPoint;
                                            if (appEntryPoint && appEntryPoint.application == application) {
                                                if (navigationItem.hidden()) {
                                                    if (navigationGroup != Navigation.topNavigationGroup && !navigationItem.contextual()) {
                                                        shownItems++;
                                                    }
                                                    navigationItem.hidden(false);
                                                }

                                                if (navigationItem.targetDisplay.navigationItem() == navigationItem) {
                                                    navigationItem.targetDisplay.navigationItem(null);
                                                }

                                                if (navigationItem == selectedNavigationItem) {
                                                    activeNavigationGroup = navigationGroup;
                                                }
                                            }
                                        });

                                        if (navigationGroup != Navigation.topNavigationGroup && navigationGroup.shownItems() != shownItems) {
                                            navigationGroup.shownItems(shownItems);
                                        }
                                    }
                                });

                                if (activeNavigationGroup && activeNavigationGroup.authenticationTargetDisplay() == authenticationTargetDisplay) {
                                    authenticationTargetDisplay.navigationGroup(activeNavigationGroup);
                                    authenticationTargetDisplay.accessed(true);
                                } else if (authenticationTargetDisplay.authenticationMode != "on-access") {
                                    authenticationTargetDisplay.accessed(true);
                                }
                            }
                        }
                        ;

                        function onTargetDisplayLoaded(event) {
                            var targetDisplay = event.data.targetDisplay;
                            var application = targetDisplay.application;
                            if (application && targetDisplay.name) {
                                var applicationTargetDisplays = applicationNavigationItemTargetDisplaysIndex[application.id];
                                if (applicationTargetDisplays) {
                                    var navigationItemTargetDisplay = applicationTargetDisplays[targetDisplay.name];
                                    if (navigationItemTargetDisplay) {
                                        navigationItemTargetDisplay.loaded(true);
                                    }
                                }
                            }
                        }
                        ;

                        function onTargetDisplayUnloaded(event) {
                            var targetDisplay = event.data.targetDisplay;
                            var application = targetDisplay.application;
                            if (application) {
                                var authenticationTargetDisplay = applicationAuthenticationTargetDisplays[application.id];
                                if (authenticationTargetDisplay && authenticationTargetDisplay.targetDisplay == targetDisplay) {
                                    if (authenticationTargetDisplay.authenticated && !authenticationTargetDisplay.disposed()) {
                                        authenticationTargetDisplay.targetDisplay.frame = null;
                                        setTimeout(function () {
                                            return authenticationTargetDisplay.disposed(true);
                                        }, 1); // Chrome crashes without the timeout
                                    }
                                } else if (targetDisplay.name) {
                                    var navigationItemTargetDisplay = applicationNavigationItemTargetDisplaysIndex[application.id][targetDisplay.name];
                                    if (navigationItemTargetDisplay) {
                                        navigationItemTargetDisplay.loaded(false);
                                        navigationItemTargetDisplay.topBarShown(false);
                                    }
                                }
                            }
                        }
                        ;

                        function onTargetDisplayUrlChange(event) {
                            var targetDisplay = event.data.targetDisplay;
                            var application = targetDisplay.application;
                            if (application && targetDisplay.name) {
                                var navigationItemTargetDisplay = applicationNavigationItemTargetDisplaysIndex[application.id][targetDisplay.name];
                                if (navigationItemTargetDisplay) {
                                    navigationItemTargetDisplay.src = targetDisplay.loadedUrl; // must be the same as event.data.url
                                }
                            }
                        }
                        ;

                        function onTargetDisplayTopBarShow(event) {
                            var targetDisplay = event.data.targetDisplay;
                            var application = targetDisplay.application;
                            if (application) {
                                var authenticationTargetDisplay = applicationAuthenticationTargetDisplays[application.id];
                                if (authenticationTargetDisplay && authenticationTargetDisplay.targetDisplay == targetDisplay) {
                                    authenticationTargetDisplay.topBarShown(true);
                                } else if (targetDisplay.name) {
                                    var navigationItemTargetDisplay = applicationNavigationItemTargetDisplaysIndex[application.id][targetDisplay.name];
                                    if (navigationItemTargetDisplay) {
                                        navigationItemTargetDisplay.topBarShown(true);
                                    }
                                }
                            }
                        }

                        function onTargetDisplayTopBarOptions(event) {
                            var options = event.data.options;
                            var targetDisplay = event.data.targetDisplay;
                            var application = targetDisplay.application;
                            if (application) {
                                var authenticationTargetDisplay = applicationAuthenticationTargetDisplays[application.id];
                                if (authenticationTargetDisplay && authenticationTargetDisplay.targetDisplay == targetDisplay) {
                                    authenticationTargetDisplay.topBarOptions(SDL.jQuery.extend({}, baseTopBarOptions, options));
                                } else if (targetDisplay.name) {
                                    var navigationItemTargetDisplay = applicationNavigationItemTargetDisplaysIndex[application.id][targetDisplay.name];
                                    if (navigationItemTargetDisplay) {
                                        navigationItemTargetDisplay.topBarOptions(SDL.jQuery.extend({}, baseTopBarOptions, options));
                                    }
                                }
                            }
                        }

                        initialize();
                    })(ViewModels.Navigation || (ViewModels.Navigation = {}));
                    var Navigation = ViewModels.Navigation;
                })(ApplicationHost.ViewModels || (ApplicationHost.ViewModels = {}));
                var ViewModels = ApplicationHost.ViewModels;
            })(UI.ApplicationHost || (UI.ApplicationHost = {}));
            var ApplicationHost = UI.ApplicationHost;
        })(Client.UI || (Client.UI = {}));
        var UI = Client.UI;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=Navigation.js.map
