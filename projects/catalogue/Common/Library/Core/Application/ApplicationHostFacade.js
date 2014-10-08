/// <reference path="ApplicationHost.ts" />
var SDL;
(function (SDL) {
    (function (Client) {
        (function (Application) {
            /**
            *	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
            **/
            (function (ApplicationHostFacade) {
                var supportedMethods;

                function applicationEntryPointLoaded(libraryVersion, eventHandler, callback) {
                    var _data;

                    var isApplicationInitialized = false;
                    var invokeCallback = false;

                    SDL.Client.Application.addInitializeCallback(function () {
                        isApplicationInitialized = true;

                        if (SDL.Client.Application.isHosted) {
                            if (!supportedMethods) {
                                var methods = {
                                    applicationEntryPointLoaded: 1,
                                    applicationEntryPointUnloaded: 1,
                                    setCulture: 1,
                                    startCaptureDomEvents: 1,
                                    stopCaptureDomEvents: 1,
                                    setActiveApplicationEntryPoint: 1,
                                    setApplicationEntryPointUrl: 1,
                                    callApplicationFacade: 1,
                                    storeApplicationData: 1,
                                    storeApplicationSessionData: 1,
                                    getApplicationData: 1,
                                    getApplicationDataAsync: 1,
                                    getApplicationSessionData: 1,
                                    getApplicationSessionDataAsync: 1,
                                    clearApplicationData: 1,
                                    clearApplicationSessionData: 1,
                                    removeApplicationData: 1,
                                    removeApplicationSessionData: 1,
                                    resolveCommonLibraryResources: 1,
                                    resolveCommonLibraryResourcesAsync: 1,
                                    getCommonLibraryResources: 1,
                                    getCommonLibraryResource: 1,
                                    triggerAnalyticsEvent: 1
                                };

                                supportedMethods = {};

                                for (var method in methods) {
                                    if (SDL.Client.Application.ApplicationHost.isSupported(method)) {
                                        supportedMethods[method] = true;
                                    }
                                }
                            }

                            _data = {
                                applicationHostUrl: SDL.Client.Application.applicationHostUrl,
                                applicationHostCorePath: SDL.Client.Application.applicationHostCorePath,
                                applicationSuiteId: SDL.Client.Application.applicationSuiteId,
                                version: SDL.Client.Application.ApplicationHost.version,
                                libraryVersionSupported: SDL.Client.Application.ApplicationHost.libraryVersionSupported,
                                culture: SDL.Client.Application.ApplicationHost.culture,
                                activeApplicationEntryPointId: SDL.Client.Application.ApplicationHost.activeApplicationEntryPointId,
                                activeApplicationId: SDL.Client.Application.ApplicationHost.activeApplicationId,
                                supportedMethods: supportedMethods,
                                sharedSettings: SDL.Client.Application.sharedSettings,
                                isApplicationHostProxy: true,
                                isApplicationHostTrusted: SDL.Client.Application.ApplicationHost.isTrusted
                            };

                            if (callback) {
                                if (invokeCallback) {
                                    callback(_data);
                                } else if (callback.retire) {
                                    callback.retire();
                                }
                            }
                        }
                    });

                    invokeCallback = !isApplicationInitialized; // callback will be invoked only if the data cannot be returned asynchronously
                    return _data;
                }
                ApplicationHostFacade.applicationEntryPointLoaded = applicationEntryPointLoaded;

                function applicationEntryPointUnloaded() {
                    // don't have to do anything
                }
                ApplicationHostFacade.applicationEntryPointUnloaded = applicationEntryPointUnloaded;

                function setCulture(culture) {
                    SDL.Client.Application.ApplicationHost.setCulture(culture);
                }
                ApplicationHostFacade.setCulture = setCulture;

                function startCaptureDomEvents(events) {
                    SDL.Client.Application.ApplicationHost.startCaptureDomEvents(events);
                }
                ApplicationHostFacade.startCaptureDomEvents = startCaptureDomEvents;

                function stopCaptureDomEvents(events) {
                    SDL.Client.Application.ApplicationHost.stopCaptureDomEvents(events);
                }
                ApplicationHostFacade.stopCaptureDomEvents = stopCaptureDomEvents;

                function setActiveApplicationEntryPoint(applicationEntryPointId, applicationSuiteId) {
                    SDL.Client.Application.ApplicationHost.setActiveApplicationEntryPoint(applicationEntryPointId, applicationSuiteId);
                }
                ApplicationHostFacade.setActiveApplicationEntryPoint = setActiveApplicationEntryPoint;

                function setApplicationEntryPointUrl(applicationEntryPointId, url, applicationSuiteId, allowedDomains) {
                    SDL.Client.Application.ApplicationHost.setApplicationEntryPointUrl(applicationEntryPointId, url, applicationSuiteId);
                }
                ApplicationHostFacade.setApplicationEntryPointUrl = setApplicationEntryPointUrl;

                function callApplicationFacade(applicationEntryPointId, method, args, callback, applicationSuiteId, allowedDomains) {
                    SDL.Client.Application.ApplicationHost.callApplicationFacade(applicationEntryPointId, method, args, callback, applicationSuiteId);
                }
                ApplicationHostFacade.callApplicationFacade = callApplicationFacade;

                function storeApplicationData(key, data) {
                    SDL.Client.Application.ApplicationHost.storeApplicationData(key, data);
                }
                ApplicationHostFacade.storeApplicationData = storeApplicationData;

                function storeApplicationSessionData(key, data) {
                    SDL.Client.Application.ApplicationHost.storeApplicationSessionData(key, data);
                }
                ApplicationHostFacade.storeApplicationSessionData = storeApplicationSessionData;

                function getApplicationDataAsync(key, callback) {
                    SDL.Client.Application.ApplicationHost.getApplicationData(key, function (data) {
                        if (callback) {
                            callback(data);
                        }
                    });
                }
                ApplicationHostFacade.getApplicationDataAsync = getApplicationDataAsync;

                function getApplicationData(key) {
                    var _data;
                    getApplicationDataAsync(key, function (data) {
                        _data = data;
                    });
                    return _data;
                }
                ApplicationHostFacade.getApplicationData = getApplicationData;

                function getApplicationSessionDataAsync(key, callback) {
                    SDL.Client.Application.ApplicationHost.getApplicationSessionData(key, function (data) {
                        if (callback) {
                            callback(data);
                        }
                    });
                }
                ApplicationHostFacade.getApplicationSessionDataAsync = getApplicationSessionDataAsync;

                function getApplicationSessionData(key) {
                    var _data;
                    getApplicationSessionDataAsync(key, function (data) {
                        _data = data;
                    });
                    return _data;
                }
                ApplicationHostFacade.getApplicationSessionData = getApplicationSessionData;

                function clearApplicationData() {
                    SDL.Client.Application.ApplicationHost.clearApplicationData();
                }
                ApplicationHostFacade.clearApplicationData = clearApplicationData;

                function clearApplicationSessionData() {
                    SDL.Client.Application.ApplicationHost.clearApplicationSessionData();
                }
                ApplicationHostFacade.clearApplicationSessionData = clearApplicationSessionData;

                function removeApplicationData(key) {
                    SDL.Client.Application.ApplicationHost.removeApplicationData(key);
                }
                ApplicationHostFacade.removeApplicationData = removeApplicationData;

                function removeApplicationSessionData(key) {
                    SDL.Client.Application.ApplicationHost.removeApplicationSessionData(key);
                }
                ApplicationHostFacade.removeApplicationSessionData = removeApplicationSessionData;

                function resolveCommonLibraryResourcesAsync(resourceGroupName, callback) {
                    SDL.Client.Application.ApplicationHost.resolveCommonLibraryResources(resourceGroupName, function (result) {
                        if (callback) {
                            callback(result);
                        }
                    });
                }
                ApplicationHostFacade.resolveCommonLibraryResourcesAsync = resolveCommonLibraryResourcesAsync;

                function resolveCommonLibraryResources(resourceGroupName, callback) {
                    var _result;
                    resolveCommonLibraryResourcesAsync(resourceGroupName, function (result) {
                        _result = result;
                    });
                    return _result;
                }
                ApplicationHostFacade.resolveCommonLibraryResources = resolveCommonLibraryResources;

                function getCommonLibraryResources(files, version, onFileLoad, onFailure) {
                    SDL.Client.Application.ApplicationHost.getCommonLibraryResources(files, version, onFileLoad, onFailure);
                }
                ApplicationHostFacade.getCommonLibraryResources = getCommonLibraryResources;

                function getCommonLibraryResource(file, version, onSuccess, onFailure) {
                    SDL.Client.Application.ApplicationHost.getCommonLibraryResource(file, version, onSuccess, onFailure);
                }
                ApplicationHostFacade.getCommonLibraryResource = getCommonLibraryResource;

                function triggerAnalyticsEvent(event, object) {
                    SDL.Client.Application.ApplicationHost.triggerAnalyticsEvent(event, object);
                }
                ApplicationHostFacade.triggerAnalyticsEvent = triggerAnalyticsEvent;
            })(Application.ApplicationHostFacade || (Application.ApplicationHostFacade = {}));
            var ApplicationHostFacade = Application.ApplicationHostFacade;
        })(Client.Application || (Client.Application = {}));
        var Application = Client.Application;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));

var SDL;
(function (SDL) {
    (function (Client) {
        (function (ApplicationHost) {
            ApplicationHost.ApplicationHostFacade = SDL.Client.Application.ApplicationHostFacade;
            Client.CrossDomainMessaging.addAllowedHandlerBase(ApplicationHost.ApplicationHostFacade);
        })(Client.ApplicationHost || (Client.ApplicationHost = {}));
        var ApplicationHost = Client.ApplicationHost;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=ApplicationHostFacade.js.map
