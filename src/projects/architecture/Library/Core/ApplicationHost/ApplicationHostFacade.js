var SDL;
(function (SDL) {
    (function (Client) {
        (function (ApplicationHost) {
            /// <reference path="ApplicationHost.ts" />
            (function (ApplicationHostFacade) {
                function applicationEntryPointLoaded(libraryVersion, eventHandler) {
                    return ApplicationHost.ApplicationHost.applicationEntryPointLoaded(libraryVersion, eventHandler);
                }
                ApplicationHostFacade.applicationEntryPointLoaded = applicationEntryPointLoaded;

                function exposeApplicationFacade(applicationEntryPointId) {
                    return ApplicationHost.ApplicationHost.exposeApplicationFacade(applicationEntryPointId);
                }
                ApplicationHostFacade.exposeApplicationFacade = exposeApplicationFacade;

                function applicationEntryPointUnloaded() {
                    return ApplicationHost.ApplicationHost.applicationEntryPointUnloaded();
                }
                ApplicationHostFacade.applicationEntryPointUnloaded = applicationEntryPointUnloaded;

                function setCulture(culture) {
                    return ApplicationHost.ApplicationHost.setCulture(culture);
                }
                ApplicationHostFacade.setCulture = setCulture;

                function setActiveApplicationEntryPoint(applicationEntryPointId, applicationId) {
                    return ApplicationHost.ApplicationHost.setActiveApplicationEntryPoint(applicationEntryPointId, applicationId);
                }
                ApplicationHostFacade.setActiveApplicationEntryPoint = setActiveApplicationEntryPoint;

                function setApplicationEntryPointUrl(applicationEntryPointId, url, applicationId, allowedDomains) {
                    return ApplicationHost.ApplicationHost.setApplicationEntryPointUrl(applicationEntryPointId, url, applicationId, allowedDomains);
                }
                ApplicationHostFacade.setApplicationEntryPointUrl = setApplicationEntryPointUrl;

                function callApplicationFacade(applicationEntryPointId, method, args, callback, applicationId, allowedDomains) {
                    return ApplicationHost.ApplicationHost.callApplicationFacade(applicationEntryPointId, method, args, callback, applicationId, allowedDomains);
                }
                ApplicationHostFacade.callApplicationFacade = callApplicationFacade;

                function initializeApplicationSuite(includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions) {
                    return ApplicationHost.ApplicationHost.initializeApplicationSuite(includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions);
                }
                ApplicationHostFacade.initializeApplicationSuite = initializeApplicationSuite;

                function resetApplicationSuite() {
                    return ApplicationHost.ApplicationHost.resetApplicationSuite();
                }
                ApplicationHostFacade.resetApplicationSuite = resetApplicationSuite;

                function resolveCommonLibraryResources(resourceGroupName) {
                    return ApplicationHost.ApplicationHost.resolveCommonLibraryResources(resourceGroupName);
                }
                ApplicationHostFacade.resolveCommonLibraryResources = resolveCommonLibraryResources;

                function getCommonLibraryResources(files, version, onFileLoad, onFailure) {
                    return ApplicationHost.ApplicationHost.getCommonLibraryResources(files, version, onFileLoad, onFailure);
                }
                ApplicationHostFacade.getCommonLibraryResources = getCommonLibraryResources;

                function getCommonLibraryResource(file, version, onSuccess, onFailure) {
                    return ApplicationHost.ApplicationHost.getCommonLibraryResource(file, version, onSuccess, onFailure);
                }
                ApplicationHostFacade.getCommonLibraryResource = getCommonLibraryResource;

                Client.CrossDomainMessaging.addAllowedHandlerBase(ApplicationHostFacade);
            })(ApplicationHost.ApplicationHostFacade || (ApplicationHost.ApplicationHostFacade = {}));
            var ApplicationHostFacade = ApplicationHost.ApplicationHostFacade;
        })(Client.ApplicationHost || (Client.ApplicationHost = {}));
        var ApplicationHost = Client.ApplicationHost;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=ApplicationHostFacade.js.map
