var SDL;
(function (SDL) {
    (function (Client) {
        (function (ApplicationHost) {
            /// <reference path="ApplicationHost.ts" />
            (function (ApplicationHostFacade) {
                var supportedMethods = {};

                function applicationEntryPointLoaded(libraryVersion, eventHandler) {
                    return SDL.jQuery.extend({ supportedMethods: supportedMethods }, ApplicationHost.ApplicationHost.applicationEntryPointLoaded(libraryVersion, eventHandler, arguments.callee.caller));
                }
                ApplicationHostFacade.applicationEntryPointLoaded = applicationEntryPointLoaded;

                function exposeApplicationFacade(applicationEntryPointId) {
                    return ApplicationHost.ApplicationHost.exposeApplicationFacade(applicationEntryPointId, arguments.callee.caller);
                }
                ApplicationHostFacade.exposeApplicationFacade = exposeApplicationFacade;

                function applicationEntryPointUnloaded() {
                    return ApplicationHost.ApplicationHost.applicationEntryPointUnloaded(arguments.callee.caller);
                }
                ApplicationHostFacade.applicationEntryPointUnloaded = applicationEntryPointUnloaded;

                function setCulture(culture) {
                    return ApplicationHost.ApplicationHost.setCulture(culture, arguments.callee.caller);
                }
                ApplicationHostFacade.setCulture = setCulture;

                function startCaptureDomEvents(events) {
                    return ApplicationHost.ApplicationHost.startCaptureDomEvents(events, arguments.callee.caller);
                }
                ApplicationHostFacade.startCaptureDomEvents = startCaptureDomEvents;

                function stopCaptureDomEvents(events) {
                    return ApplicationHost.ApplicationHost.stopCaptureDomEvents(events, arguments.callee.caller);
                }
                ApplicationHostFacade.stopCaptureDomEvents = stopCaptureDomEvents;

                function setActiveApplicationEntryPoint(applicationEntryPointId, applicationSuiteId) {
                    return ApplicationHost.ApplicationHost.setActiveApplicationEntryPoint(applicationEntryPointId, applicationSuiteId, arguments.callee.caller);
                }
                ApplicationHostFacade.setActiveApplicationEntryPoint = setActiveApplicationEntryPoint;

                function setApplicationEntryPointUrl(applicationEntryPointId, url, applicationSuiteId, allowedDomains) {
                    return ApplicationHost.ApplicationHost.setApplicationEntryPointUrl(applicationEntryPointId, url, applicationSuiteId, allowedDomains, arguments.callee.caller);
                }
                ApplicationHostFacade.setApplicationEntryPointUrl = setApplicationEntryPointUrl;

                function callApplicationFacade(applicationEntryPointId, method, args, callback, applicationSuiteId, allowedDomains) {
                    return ApplicationHost.ApplicationHost.callApplicationFacade(applicationEntryPointId, method, args, callback, applicationSuiteId, allowedDomains, arguments.callee.caller);
                }
                ApplicationHostFacade.callApplicationFacade = callApplicationFacade;

                function initializeApplicationSuite(includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions) {
                    return ApplicationHost.ApplicationHost.initializeApplicationSuite(includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions, arguments.callee.caller);
                }
                ApplicationHostFacade.initializeApplicationSuite = initializeApplicationSuite;

                function resetApplicationSuite() {
                    return ApplicationHost.ApplicationHost.resetApplicationSuite(arguments.callee.caller);
                }
                ApplicationHostFacade.resetApplicationSuite = resetApplicationSuite;

                function updateTargetDisplayUrl(url, caller) {
                    return ApplicationHost.ApplicationHost.updateTargetDisplayUrl(url, arguments.callee.caller);
                }
                ApplicationHostFacade.updateTargetDisplayUrl = updateTargetDisplayUrl;

                function storeApplicationData(key, data) {
                    return ApplicationHost.ApplicationHost.storeApplicationData(key, data, arguments.callee.caller);
                }
                ApplicationHostFacade.storeApplicationData = storeApplicationData;

                function storeApplicationSessionData(key, data) {
                    return ApplicationHost.ApplicationHost.storeApplicationSessionData(key, data, arguments.callee.caller);
                }
                ApplicationHostFacade.storeApplicationSessionData = storeApplicationSessionData;

                function getApplicationData(key) {
                    return ApplicationHost.ApplicationHost.getApplicationData(key, arguments.callee.caller);
                }
                ApplicationHostFacade.getApplicationData = getApplicationData;

                function getApplicationSessionData(key) {
                    return ApplicationHost.ApplicationHost.getApplicationSessionData(key, arguments.callee.caller);
                }
                ApplicationHostFacade.getApplicationSessionData = getApplicationSessionData;

                function clearApplicationData() {
                    return ApplicationHost.ApplicationHost.clearApplicationData(arguments.callee.caller);
                }
                ApplicationHostFacade.clearApplicationData = clearApplicationData;

                function clearApplicationSessionData() {
                    return ApplicationHost.ApplicationHost.clearApplicationSessionData(arguments.callee.caller);
                }
                ApplicationHostFacade.clearApplicationSessionData = clearApplicationSessionData;

                function removeApplicationData(key) {
                    return ApplicationHost.ApplicationHost.removeApplicationData(key, arguments.callee.caller);
                }
                ApplicationHostFacade.removeApplicationData = removeApplicationData;

                function removeApplicationSessionData(key) {
                    return ApplicationHost.ApplicationHost.removeApplicationSessionData(key, arguments.callee.caller);
                }
                ApplicationHostFacade.removeApplicationSessionData = removeApplicationSessionData;

                function resolveCommonLibraryResources(resourceGroupName) {
                    return ApplicationHost.ApplicationHost.resolveCommonLibraryResources(resourceGroupName, arguments.callee.caller);
                }
                ApplicationHostFacade.resolveCommonLibraryResources = resolveCommonLibraryResources;

                function getCommonLibraryResources(files, version, onFileLoad, onFailure) {
                    return ApplicationHost.ApplicationHost.getCommonLibraryResources(files, version, onFileLoad, onFailure, arguments.callee.caller);
                }
                ApplicationHostFacade.getCommonLibraryResources = getCommonLibraryResources;

                function getCommonLibraryResource(file, version, onSuccess, onFailure) {
                    return ApplicationHost.ApplicationHost.getCommonLibraryResource(file, version, onSuccess, onFailure, arguments.callee.caller);
                }
                ApplicationHostFacade.getCommonLibraryResource = getCommonLibraryResource;

                function triggerAnalyticsEvent(event, object) {
                    return ApplicationHost.ApplicationHost.triggerAnalyticsEvent(event, object, arguments.callee.caller);
                }
                ApplicationHostFacade.triggerAnalyticsEvent = triggerAnalyticsEvent;

                function _expose() {
                    Client.CrossDomainMessaging.addAllowedHandlerBase(ApplicationHostFacade);

                    for (var method in ApplicationHostFacade) {
                        if (method != "_expose") {
                            supportedMethods[method] = true;
                        }
                    }
                }
                ApplicationHostFacade._expose = _expose;
            })(ApplicationHost.ApplicationHostFacade || (ApplicationHost.ApplicationHostFacade = {}));
            var ApplicationHostFacade = ApplicationHost.ApplicationHostFacade;
        })(Client.ApplicationHost || (Client.ApplicationHost = {}));
        var ApplicationHost = Client.ApplicationHost;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=ApplicationHostFacade.js.map
