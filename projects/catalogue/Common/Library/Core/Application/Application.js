var SDL;
(function (SDL) {
    (function (Client) {
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
        (function (Application) {
            Application.defaultApplicationEntryPointId;
            Application.defaultApplicationSuiteId;
            Application.isHosted;
            Application.applicationSuiteId;
            Application.isReloading;
            Application.applicationHostUrl;
            Application.applicationHostCorePath;
            Application.defaultApplicationHostUrl;
            Application.trustedApplicationHostDomains;
            Application.trustedApplications;
            Application.trustedApplicationDomains;
            Application.ApplicationHost;
            Application.useHostedLibraryResources = true;
            Application.libraryVersion;
            Application.isInitialized = false;

            var _isInitialized = false;
            var isReady = false;

            Application.initCallbacks;
            Application.readyCallbacks;

            var _initCallbacks = Application.initCallbacks ? Application.initCallbacks.concat() : null;
            var _readyCallbacks = Application.readyCallbacks ? Application.readyCallbacks.concat() : null;

            var filesToRender = [];
            var allResources = [];
            var renderedResources = [];
            var resolveResourcesCallbacks = {};

            function initialize(callback) {
                addInitializeCallback(callback);

                if (_isInitialized === false) {
                    _isInitialized = undefined;
                    initializeApplication();
                }
            }
            Application.initialize = initialize;
            ;

            function addInitializeCallback(callback) {
                if (callback) {
                    if (_isInitialized) {
                        callback();
                    } else if (!Application.isReloading) {
                        if (_initCallbacks) {
                            _initCallbacks.push(callback);
                        } else {
                            _initCallbacks = [callback];
                        }
                    }
                }
            }
            Application.addInitializeCallback = addInitializeCallback;
            ;

            function addReadyCallback(callback) {
                if (callback) {
                    if (isReady) {
                        callback();
                    } else if (!Application.isReloading) {
                        if (_readyCallbacks) {
                            _readyCallbacks.push(callback);
                        } else {
                            _readyCallbacks = [callback];
                        }
                    }
                }
            }
            Application.addReadyCallback = addReadyCallback;
            ;

            function setApplicationReady() {
                if (!isReady) {
                    isReady = true;
                    if (_readyCallbacks) {
                        for (var i = 0, len = _readyCallbacks.length; i < len; i++) {
                            _readyCallbacks[i]();
                        }
                        _readyCallbacks = null;
                    }
                }
            }
            Application.setApplicationReady = setApplicationReady;
            ;

            function exposeApplicationFacade() {
                if (!Application.isHosted) {
                    throw Error("Cannot expose Application facade: application is not hosted.");
                }
                Application.ApplicationHost.exposeApplicationFacade(Client.Application.defaultApplicationEntryPointId);
            }
            Application.exposeApplicationFacade = exposeApplicationFacade;
            ;

            function exposeApplicationFacadeUnsecure() {
                if (!Application.isHosted) {
                    throw Error("Cannot expose Application facade: application is not hosted.");
                }
                Application.ApplicationHost.exposeApplicationFacadeUnsecure(Client.Application.defaultApplicationEntryPointId);
            }
            Application.exposeApplicationFacadeUnsecure = exposeApplicationFacadeUnsecure;
            ;

            function registerResourceGroupRendered(resourceGroupName) {
                if (renderedResources.indexOf(resourceGroupName) == -1) {
                    if (allResources.indexOf(resourceGroupName) == -1) {
                        allResources.push(resourceGroupName);
                    }

                    renderedResources.push(resourceGroupName);
                }
            }
            Application.registerResourceGroupRendered = registerResourceGroupRendered;
            ;

            function loadLibraryResourceGroup(resourceGroupName, jQuery, knockout, callback) {
                if ((SDL.Client).Configuration) {
                    Client.Application.addReadyCallback(function () {
                        (Client.Resources).ResourceManager.load(resourceGroupName, callback);
                    });
                } else {
                    if (!Application.isHosted) {
                        throw Error("Unable to load library resources, application is not hosted.");
                    }

                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to load library resources, application host is not trusted.");
                    }

                    registerResourceGroupRendered("SDL.Client.Types.Url1");
                    registerResourceGroupRendered("SDL.Client.CrossDomainMessaging");
                    registerResourceGroupRendered("SDL.Client.Application");
                    if (jQuery) {
                        registerResourceGroupRendered("SDL.Client.Libraries.JQuery");
                    }

                    if (knockout) {
                        registerResourceGroupRendered("SDL.UI.Core.Knockout.Libraries.Knockout");
                    }

                    Application.ApplicationHost.resolveCommonLibraryResources(resourceGroupName, function (resources) {
                        if (resources && resources.length) {
                            var filesToLoad = [];
                            var resourceForCallback;

                            for (var i = 0, len = resources.length; i < len; i++) {
                                var resourceName = resources[i].name;
                                if (allResources.indexOf(resourceName) == -1) {
                                    allResources.push(resourceName);
                                    var files = resources[i].files;
                                    if (files && files.length) {
                                        var count = files.length;
                                        for (var j = 0; j < count; j++) {
                                            filesToRender[filesToRender.length] = filesToLoad[filesToLoad.length] = { url: files[j] };
                                        }
                                        filesToRender[filesToRender.length - 1].resourceName = resourceName;
                                        resourceForCallback = resourceName;
                                    } else {
                                        // no files to render, mark group as rendered right away
                                        renderedResources.push(resourceName);
                                    }
                                } else if (renderedResources.indexOf(resourceName) == -1) {
                                    resourceForCallback = resourceName;
                                }
                            }

                            if (resourceForCallback) {
                                if (!resolveResourcesCallbacks[resourceForCallback]) {
                                    resolveResourcesCallbacks[resourceForCallback] = [callback];
                                } else {
                                    resolveResourcesCallbacks[resourceForCallback].push(callback);
                                }

                                if (filesToLoad.length > 0) {
                                    Application.ApplicationHost.getCommonLibraryResources(filesToLoad, null, onFileLoaded, function (error) {
                                        throw Error(error);
                                    });
                                }
                                return;
                            }
                        }

                        if (callback) {
                            callback();
                        }
                    });
                }
            }
            Application.loadLibraryResourceGroup = loadLibraryResourceGroup;

            var fileToRenderIndex = 0;
            function onFileLoaded(resource) {
                var nextFile = filesToRender[fileToRenderIndex];
                var url = resource.url;
                if (nextFile && nextFile.url == url) {
                    renderFile(url, resource.data, resource.context, nextFile.resourceName);
                    fileToRenderIndex++;

                    while (fileToRenderIndex < filesToRender.length) {
                        var fileToRender = filesToRender[fileToRenderIndex];
                        var data = fileToRender.data;
                        if (data != null) {
                            renderFile(fileToRender.url, data, fileToRender.context, fileToRender.resourceName);
                            filesToRender[fileToRenderIndex] = null;
                            fileToRenderIndex++;
                        } else {
                            return;
                        }
                    }
                } else {
                    for (var i = fileToRenderIndex + 1; i < filesToRender.length; i++) {
                        var fileToRender = filesToRender[i];
                        if (fileToRender.url == url) {
                            fileToRender.data = resource.data || "";
                            fileToRender.context = resource.context;
                            return;
                        }
                    }
                }
            }
            ;

            var globalEval = eval;
            function renderFile(url, data, context, resourceName) {
                if (data) {
                    if (url.slice(-3).toLowerCase() == ".js") {
                        data += ("\n//@ sourceURL=" + Client.Application.applicationHostCorePath + url.slice(2));
                        if (context) {
                            (function () {
                                globalEval(arguments[0]);
                            }).apply(globalEval(context), [data]);
                        } else {
                            globalEval(data);
                        }
                    } else if (url.slice(-4).toLowerCase() == ".css") {
                        var style = document.getElementById("sdl-styles");
                        if (!style) {
                            style = document.createElement("style");
                            style.id = "sdl-styles";
                            var head = document.getElementsByTagName("head");
                            (head[0] || document.body).appendChild(style);
                        }
                        var text = document.createTextNode(data);
                        style.appendChild(text);
                    }
                }

                if (resourceName) {
                    renderedResources.push(resourceName);
                    var calls = resolveResourcesCallbacks[resourceName];
                    if (calls) {
                        for (var i = 0, len = calls.length; i < len; i++) {
                            calls[i]();
                        }
                    }
                }
            }
            ;

            function initializeApplication() {
                var callbacks = function () {
                    if (_initCallbacks) {
                        for (var i = 0, len = _initCallbacks.length; i < len; i++) {
                            _initCallbacks[i]();
                        }
                        _initCallbacks = null;
                    }
                };

                var hosted = (window.top != window);

                if (hosted) {
                    Client.CrossDomainMessaging.addTrustedDomain("*");

                    // notify the host the app is loaded, and see if the library version can be served by the host
                    var interval;
                    if (window.console) {
                        var intervalCount = 0;
                        interval = window.setInterval(function () {
                            intervalCount++;
                            console.log("NO REPLY FROM HOST AFTER " + intervalCount + " SECOND(S).");
                            if (intervalCount >= 30) {
                                window.clearInterval(interval);
                                interval = null;
                            }
                        }, 1000);
                    }

                    var host = new Application.ApplicationHostProxyClass();
                    var onUnload = function () {
                        host.applicationEntryPointUnloaded();
                        window.removeEventListener("unload", onUnload);
                    };
                    window.addEventListener("unload", onUnload);

                    host.applicationEntryPointLoaded(Client.Application.libraryVersion, function (data) {
                        if (interval) {
                            window.clearInterval(interval);
                            interval = null;
                        }

                        Application.applicationHostUrl = sessionStorage["applicationHostUrl"] = data.applicationHostUrl;
                        Application.applicationHostCorePath = data.applicationHostCorePath;
                        Client.Application.applicationSuiteId = data.applicationSuiteId;

                        var applicationHostDomain = (arguments.callee.caller).sourceDomain;
                        host.isTrusted = Client.Types.Url.isSameDomain(window.location.href, applicationHostDomain);
                        if (!host.isTrusted) {
                            var domains = Application.trustedApplicationHostDomains || [];
                            for (var i = 0, len = domains.length; i < len; i++) {
                                if (Client.Types.Url.isSameDomain(domains[i], applicationHostDomain)) {
                                    host.isTrusted = true;
                                    break;
                                }
                            }
                        }

                        Client.CrossDomainMessaging.clearTrustedDomains();
                        Client.CrossDomainMessaging.addTrustedDomain(applicationHostDomain);
                        Client.CrossDomainMessaging.addAllowedHandlerBase(Application.ApplicationFacadeStub);

                        Client.Application.ApplicationHost = host;
                        Client.Application.isHosted = true;

                        if (!host.isTrusted || !data.libraryVersionSupported) {
                            Client.Application.useHostedLibraryResources = false;
                        }

                        Application.isInitialized = _isInitialized = true;
                        callbacks();
                    });
                } else if (Application.defaultApplicationHostUrl) {
                    Application.applicationHostUrl = sessionStorage["applicationHostUrl"] || Application.defaultApplicationHostUrl;
                    _initCallbacks = null;
                    Client.Application.isReloading = true;
                    window.location.replace(Application.applicationHostUrl + (Application.defaultApplicationSuiteId ? ("#app=" + encodeURIComponent(Application.defaultApplicationSuiteId) + (Application.defaultApplicationEntryPointId ? "&entry=" + encodeURIComponent(Client.Application.defaultApplicationEntryPointId) + "&url=" + encodeURIComponent(location.href) : "")) : ""));
                } else {
                    Client.Application.isHosted = false;
                    Client.Application.useHostedLibraryResources = false;
                    Application.isInitialized = _isInitialized = true;
                    callbacks();
                }
            }
            ;
        })(Client.Application || (Client.Application = {}));
        var Application = Client.Application;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=Application.js.map
