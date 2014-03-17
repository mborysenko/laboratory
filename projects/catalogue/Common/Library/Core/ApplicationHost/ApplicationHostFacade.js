var SDL;
(function (SDL) {
    (function (Client) {
        (function (ApplicationHost) {
            /// <reference path="ApplicationHost.ts" />
            (function (ApplicationHostFacade) {
                var supportedMethods = {};

                function applicationEntryPointLoaded(libraryVersion, eventHandler) {
                    return SDL.jQuery.extend({ supportedMethods: supportedMethods }, SDL.Client.ApplicationHost.ApplicationHost.applicationEntryPointLoaded(libraryVersion, eventHandler));
                }
                ApplicationHostFacade.applicationEntryPointLoaded = applicationEntryPointLoaded;

                function exposeApplicationFacade(applicationEntryPointId) {
                    return SDL.Client.ApplicationHost.ApplicationHost.exposeApplicationFacade(applicationEntryPointId);
                }
                ApplicationHostFacade.exposeApplicationFacade = exposeApplicationFacade;

                function applicationEntryPointUnloaded() {
                    return SDL.Client.ApplicationHost.ApplicationHost.applicationEntryPointUnloaded();
                }
                ApplicationHostFacade.applicationEntryPointUnloaded = applicationEntryPointUnloaded;

                function setCulture(culture) {
                    return SDL.Client.ApplicationHost.ApplicationHost.setCulture(culture);
                }
                ApplicationHostFacade.setCulture = setCulture;

                function startCaptureDomEvents(events) {
                    return SDL.Client.ApplicationHost.ApplicationHost.startCaptureDomEvents(events);
                }
                ApplicationHostFacade.startCaptureDomEvents = startCaptureDomEvents;

                function stopCaptureDomEvents(events) {
                    return SDL.Client.ApplicationHost.ApplicationHost.stopCaptureDomEvents(events);
                }
                ApplicationHostFacade.stopCaptureDomEvents = stopCaptureDomEvents;

                function setActiveApplicationEntryPoint(applicationEntryPointId, applicationSuiteId) {
                    return SDL.Client.ApplicationHost.ApplicationHost.setActiveApplicationEntryPoint(applicationEntryPointId, applicationSuiteId);
                }
                ApplicationHostFacade.setActiveApplicationEntryPoint = setActiveApplicationEntryPoint;

                function setApplicationEntryPointUrl(applicationEntryPointId, url, applicationSuiteId, allowedDomains) {
                    return SDL.Client.ApplicationHost.ApplicationHost.setApplicationEntryPointUrl(applicationEntryPointId, url, applicationSuiteId, allowedDomains);
                }
                ApplicationHostFacade.setApplicationEntryPointUrl = setApplicationEntryPointUrl;

                function callApplicationFacade(applicationEntryPointId, method, args, callback, applicationSuiteId, allowedDomains) {
                    return SDL.Client.ApplicationHost.ApplicationHost.callApplicationFacade(applicationEntryPointId, method, args, callback, applicationSuiteId, allowedDomains);
                }
                ApplicationHostFacade.callApplicationFacade = callApplicationFacade;

                function initializeApplicationSuite(includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions) {
                    return SDL.Client.ApplicationHost.ApplicationHost.initializeApplicationSuite(includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions);
                }
                ApplicationHostFacade.initializeApplicationSuite = initializeApplicationSuite;

                function resetApplicationSuite() {
                    return SDL.Client.ApplicationHost.ApplicationHost.resetApplicationSuite();
                }
                ApplicationHostFacade.resetApplicationSuite = resetApplicationSuite;

                function storeApplicationData(key, data) {
                    return SDL.Client.ApplicationHost.ApplicationHost.storeApplicationData(key, data);
                }
                ApplicationHostFacade.storeApplicationData = storeApplicationData;

                function storeApplicationSessionData(key, data) {
                    return SDL.Client.ApplicationHost.ApplicationHost.storeApplicationSessionData(key, data);
                }
                ApplicationHostFacade.storeApplicationSessionData = storeApplicationSessionData;

                function getApplicationData(key) {
                    return SDL.Client.ApplicationHost.ApplicationHost.getApplicationData(key);
                }
                ApplicationHostFacade.getApplicationData = getApplicationData;

                function getApplicationSessionData(key) {
                    return SDL.Client.ApplicationHost.ApplicationHost.getApplicationSessionData(key);
                }
                ApplicationHostFacade.getApplicationSessionData = getApplicationSessionData;

                function clearApplicationData() {
                    return SDL.Client.ApplicationHost.ApplicationHost.clearApplicationData();
                }
                ApplicationHostFacade.clearApplicationData = clearApplicationData;

                function clearApplicationSessionData() {
                    return SDL.Client.ApplicationHost.ApplicationHost.clearApplicationSessionData();
                }
                ApplicationHostFacade.clearApplicationSessionData = clearApplicationSessionData;

                function removeApplicationData(key) {
                    return SDL.Client.ApplicationHost.ApplicationHost.removeApplicationData(key);
                }
                ApplicationHostFacade.removeApplicationData = removeApplicationData;

                function removeApplicationSessionData(key) {
                    return SDL.Client.ApplicationHost.ApplicationHost.removeApplicationSessionData(key);
                }
                ApplicationHostFacade.removeApplicationSessionData = removeApplicationSessionData;

                function resolveCommonLibraryResources(resourceGroupName) {
                    return SDL.Client.ApplicationHost.ApplicationHost.resolveCommonLibraryResources(resourceGroupName);
                }
                ApplicationHostFacade.resolveCommonLibraryResources = resolveCommonLibraryResources;

                function getCommonLibraryResources(files, version, onFileLoad, onFailure) {
                    return SDL.Client.ApplicationHost.ApplicationHost.getCommonLibraryResources(files, version, onFileLoad, onFailure);
                }
                ApplicationHostFacade.getCommonLibraryResources = getCommonLibraryResources;

                function getCommonLibraryResource(file, version, onSuccess, onFailure) {
                    return SDL.Client.ApplicationHost.ApplicationHost.getCommonLibraryResource(file, version, onSuccess, onFailure);
                }
                ApplicationHostFacade.getCommonLibraryResource = getCommonLibraryResource;

                SDL.Client.CrossDomainMessaging.addAllowedHandlerBase(ApplicationHostFacade);

                for (var method in ApplicationHostFacade) {
                    supportedMethods[method] = true;
                }
            })(ApplicationHost.ApplicationHostFacade || (ApplicationHost.ApplicationHostFacade = {}));
            var ApplicationHostFacade = ApplicationHost.ApplicationHostFacade;
        })(Client.ApplicationHost || (Client.ApplicationHost = {}));
        var ApplicationHost = Client.ApplicationHost;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=ApplicationHostFacade.js.map
