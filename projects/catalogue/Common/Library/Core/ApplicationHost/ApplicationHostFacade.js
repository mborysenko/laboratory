var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="ApplicationHost.ts" />
        (function (ApplicationHost) {
            //export var ApplicationHostFacade: any;
            var ApplicationHostFacadeClass = (function () {
                function ApplicationHostFacadeClass() {
                    this.supportedMethods = {};
                    Client.CrossDomainMessaging.addAllowedHandlerBase(this);
                    for (var method in this) {
                        this.supportedMethods[method] = true;
                    }
                }
                ApplicationHostFacadeClass.prototype.applicationEntryPointLoaded = function (libraryVersion, eventHandler) {
                    return SDL.jQuery.extend({ supportedMethods: this.supportedMethods }, ApplicationHost.ApplicationHost.applicationEntryPointLoaded(libraryVersion, eventHandler, arguments.callee.caller));
                };

                ApplicationHostFacadeClass.prototype.exposeApplicationFacade = function (applicationEntryPointId) {
                    return ApplicationHost.ApplicationHost.exposeApplicationFacade(applicationEntryPointId, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.applicationEntryPointUnloaded = function () {
                    return ApplicationHost.ApplicationHost.applicationEntryPointUnloaded(arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.setCulture = function (culture) {
                    return ApplicationHost.ApplicationHost.setCulture(culture, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.startCaptureDomEvents = function (events) {
                    return ApplicationHost.ApplicationHost.startCaptureDomEvents(events, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.stopCaptureDomEvents = function (events) {
                    return ApplicationHost.ApplicationHost.stopCaptureDomEvents(events, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.setActiveApplicationEntryPoint = function (applicationEntryPointId, applicationSuiteId) {
                    return ApplicationHost.ApplicationHost.setActiveApplicationEntryPoint(applicationEntryPointId, applicationSuiteId, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.setApplicationEntryPointUrl = function (applicationEntryPointId, url, applicationSuiteId, allowedDomains) {
                    return ApplicationHost.ApplicationHost.setApplicationEntryPointUrl(applicationEntryPointId, url, applicationSuiteId, allowedDomains, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.callApplicationFacade = function (applicationEntryPointId, method, args, callback, applicationSuiteId, allowedDomains) {
                    return ApplicationHost.ApplicationHost.callApplicationFacade(applicationEntryPointId, method, args, callback, applicationSuiteId, allowedDomains, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.initializeApplicationSuite = function (includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions) {
                    return ApplicationHost.ApplicationHost.initializeApplicationSuite(includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.resetApplicationSuite = function () {
                    return ApplicationHost.ApplicationHost.resetApplicationSuite(arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.updateTargetDisplayUrl = function (url, caller) {
                    return ApplicationHost.ApplicationHost.updateTargetDisplayUrl(url, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.storeApplicationData = function (key, data) {
                    return ApplicationHost.ApplicationHost.storeApplicationData(key, data, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.storeApplicationSessionData = function (key, data) {
                    return ApplicationHost.ApplicationHost.storeApplicationSessionData(key, data, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.getApplicationData = function (key) {
                    return ApplicationHost.ApplicationHost.getApplicationData(key, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.getApplicationDataAsync = function (key, callback) {
                    (function (data) {
                        if (callback) {
                            callback(data);
                        }
                    })(ApplicationHost.ApplicationHost.getApplicationData(key, arguments.callee.caller));
                };

                ApplicationHostFacadeClass.prototype.getApplicationSessionData = function (key) {
                    return ApplicationHost.ApplicationHost.getApplicationSessionData(key, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.getApplicationSessionDataAsync = function (key, callback) {
                    (function (data) {
                        if (callback) {
                            callback(data);
                        }
                    })(ApplicationHost.ApplicationHost.getApplicationSessionData(key, arguments.callee.caller));
                };

                ApplicationHostFacadeClass.prototype.clearApplicationData = function () {
                    return ApplicationHost.ApplicationHost.clearApplicationData(arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.clearApplicationSessionData = function () {
                    return ApplicationHost.ApplicationHost.clearApplicationSessionData(arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.removeApplicationData = function (key) {
                    return ApplicationHost.ApplicationHost.removeApplicationData(key, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.removeApplicationSessionData = function (key) {
                    return ApplicationHost.ApplicationHost.removeApplicationSessionData(key, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.resolveCommonLibraryResources = function (resourceGroupName) {
                    return ApplicationHost.ApplicationHost.resolveCommonLibraryResources(resourceGroupName, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.resolveCommonLibraryResourcesAsync = function (resourceGroupName, callback) {
                    (function (result) {
                        if (callback) {
                            callback(result);
                        }
                    })(ApplicationHost.ApplicationHost.resolveCommonLibraryResources(resourceGroupName, arguments.callee.caller));
                };

                ApplicationHostFacadeClass.prototype.getCommonLibraryResources = function (files, version, onFileLoad, onFailure) {
                    return ApplicationHost.ApplicationHost.getCommonLibraryResources(files, version, onFileLoad, onFailure, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.getCommonLibraryResource = function (file, version, onSuccess, onFailure) {
                    return ApplicationHost.ApplicationHost.getCommonLibraryResource(file, version, onSuccess, onFailure, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.triggerAnalyticsEvent = function (event, object) {
                    return ApplicationHost.ApplicationHost.triggerAnalyticsEvent(event, object, arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.showTopBar = function () {
                    return ApplicationHost.ApplicationHost.showTopBar(arguments.callee.caller);
                };

                ApplicationHostFacadeClass.prototype.setTopBarOptions = function (options) {
                    return ApplicationHost.ApplicationHost.setTopBarOptions(options, arguments.callee.caller);
                };
                return ApplicationHostFacadeClass;
            })();
            ApplicationHost.ApplicationHostFacadeClass = ApplicationHostFacadeClass;
        })(Client.ApplicationHost || (Client.ApplicationHost = {}));
        var ApplicationHost = Client.ApplicationHost;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=ApplicationHostFacade.js.map
