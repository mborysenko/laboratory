var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="..\Types\Types.d.ts" />
        /// <reference path="..\Types\ObjectWithEvents.ts" />
        /// <reference path="..\Resources\ResourceManager.ts" />
        /// <reference path="..\Resources\FileResourceHandler.ts" />
        /// <reference path="..\CrossDomainMessaging\CrossDomainMessaging.ts" />
        (function (Application) {
            ;

            ;

            eval(Client.Types.OO.enableCustomInheritance);
            var ApplicationHostProxyClass = (function (_super) {
                __extends(ApplicationHostProxyClass, _super);
                function ApplicationHostProxyClass() {
                    _super.apply(this, arguments);
                }
                ApplicationHostProxyClass.prototype.setCulture = function (culture) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setCulture", [culture]);
                };

                ApplicationHostProxyClass.prototype.applicationEntryPointLoaded = function (coreVersion, callback) {
                    var _this = this;
                    var _callback;
                    _callback = function (data) {
                        _this.libraryVersionSupported = data.libraryVersionSupported;
                        _this.activeApplicationEntryPointId = data.activeApplicationEntryPointId;
                        _this.activeApplicationId = data.activeApplicationId;
                        _this.culture = data.culture;
                        if (callback) {
                            _callback.sourceDomain = (arguments.callee.caller).sourceDomain;
                            _callback.sourceWindow = (arguments.callee.caller).sourceWindow;
                            callback(data);
                        }
                    };
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.applicationEntryPointLoaded", [coreVersion, this.getDelegate(this.onHostEvent)], _callback);
                };

                ApplicationHostProxyClass.prototype.exposeApplicationFacade = function (applicationEntryPointId) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to expose application facade: application host is untrusted.");
                    }

                    if (Application.isApplicationFacadeSecure === undefined) {
                        Application.isApplicationFacadeSecure = true;
                        this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.exposeApplicationFacade", [applicationEntryPointId]);
                    } else if (!Application.isApplicationFacadeSecure) {
                        throw Error("Application facade is already exposed as unsecure.");
                    }
                };

                ApplicationHostProxyClass.prototype.exposeApplicationFacadeUnsecure = function (applicationEntryPointId) {
                    if (Application.isApplicationFacadeSecure === undefined) {
                        Application.isApplicationFacadeSecure = false;
                        this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.exposeApplicationFacade", [applicationEntryPointId]);
                    } else if (Application.isApplicationFacadeSecure) {
                        throw Error("Application facade is already exposed as secure.");
                    }
                };

                ApplicationHostProxyClass.prototype.applicationEntryPointUnloaded = function () {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.applicationEntryPointUnloaded");
                };

                ApplicationHostProxyClass.prototype.resolveCommonLibraryResources = function (resourceGroupName, onSuccess) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.resolveCommonLibraryResources", [resourceGroupName], onSuccess);
                };

                ApplicationHostProxyClass.prototype.getCommonLibraryResources = function (files, version, onFileLoad, onFailure) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.getCommonLibraryResources", [files, version, onFileLoad, onFailure]);
                };

                ApplicationHostProxyClass.prototype.getCommonLibraryResource = function (file, version, onSuccess, onFailure) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.getCommonLibraryResource", [file, version, onSuccess, onFailure]);
                };

                ApplicationHostProxyClass.prototype.setActiveApplicationEntryPoint = function (applicationEntryPointId, applicationId) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setActiveApplicationEntryPoint", [applicationEntryPointId, applicationId]);
                };

                ApplicationHostProxyClass.prototype.setApplicationEntryPointUrl = function (applicationEntryPointId, url, applicationId) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to set application entry point Url: application host is untrusted.");
                    }

                    if (applicationId && applicationId != Application.applicationSuiteId && (Application.trustedApplications ? (applicationId != Application.applicationSuiteId && Application.trustedApplications.indexOf(applicationId) == -1) : !Application.trustedApplicationDomains)) {
                        throw Error("Unable to set application entry point Url: application \"" + applicationId + "\" is untrusted.");
                    }

                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setApplicationEntryPointUrl", [
                        applicationEntryPointId,
                        url,
                        applicationId,
                        Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null
                    ]);
                };

                ApplicationHostProxyClass.prototype.setApplicationEntryPointUrlUnsecure = function (applicationEntryPointId, url, applicationId) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setApplicationEntryPointUrl", [applicationEntryPointId, url, applicationId]);
                };

                ApplicationHostProxyClass.prototype.callApplicationFacade = function (applicationEntryPointId, method, args, callback, applicationId) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to call application facade: application host is untrusted.");
                    }

                    if (applicationId && applicationId != Application.applicationSuiteId && (Application.trustedApplications ? (applicationId != Application.applicationSuiteId && Application.trustedApplications.indexOf(applicationId) == -1) : !Application.trustedApplicationDomains)) {
                        throw Error("Unable to call application facade: application \"" + applicationId + "\" is untrusted.");
                    }

                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.callApplicationFacade", [
                        applicationEntryPointId,
                        method,
                        args,
                        callback,
                        applicationId,
                        Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null
                    ]);
                };

                ApplicationHostProxyClass.prototype.callApplicationFacadeUnsecure = function (applicationEntryPointId, method, args, callback, applicationId) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.callApplicationFacade", [applicationEntryPointId, method, args, callback, applicationId]);
                };

                ApplicationHostProxyClass.prototype.initializeApplicationSuite = function (includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.initializeApplicationSuite", [includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions]);
                };

                ApplicationHostProxyClass.prototype.resetApplicationSuite = function () {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.resetApplicationSuite");
                };

                ApplicationHostProxyClass.prototype.call = function (method, args, callback) {
                    Client.CrossDomainMessaging.call(window.parent, method, args, callback);
                };

                ApplicationHostProxyClass.prototype.onHostEvent = function (e) {
                    switch (e.type) {
                        case "culturechange":
                            this.culture = e.data.culture;
                            break;
                        case "applicationentrypointactivate":
                            this.activeApplicationEntryPointId = e.data.applicationEntryPointId;
                            this.activeApplicationId = e.data.applicationId;
                            break;
                    }
                    this.fireEvent(e.type, e.data);
                };

                ApplicationHostProxyClass.prototype.getWithLocalDomain = function (domains) {
                    var localDomain = Client.Types.Url.getDomain(window.location.href);
                    if (!domains) {
                        domains = [localDomain];
                    } else if (!Client.Types.Array.contains(domains, localDomain, Client.Types.Url.isSameDomain)) {
                        domains = domains.concat(localDomain);
                    }
                    return domains;
                };
                return ApplicationHostProxyClass;
            })(Client.Types.ObjectWithEvents);
            Application.ApplicationHostProxyClass = ApplicationHostProxyClass;
            SDL.Client.Types.OO.createInterface("SDL.Client.Application.ApplicationHostProxyClass", ApplicationHostProxyClass);
        })(Client.Application || (Client.Application = {}));
        var Application = Client.Application;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=ApplicationHost.js.map
