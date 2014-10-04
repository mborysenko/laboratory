/// <reference path="../../SDL.Client.Core/Resources/Resources.d.ts" />
/// <reference path="../Types/Url1.ts" />
/// <reference path="../CrossDomainMessaging/CrossDomainMessaging.ts" />
/// <reference path="Application.ts" />
var SDL;
(function (SDL) {
    (function (Client) {
        /**
        *	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
        **/
        (function (Application) {
            ;

            ;

            ;

            ;

            var ApplicationHostProxyClass = (function () {
                function ApplicationHostProxyClass() {
                    this.handlers = {};
                    this.supportedMethods = {
                        // overwritten if ApplicationHost provides a different list
                        applicationEntryPointLoaded: true,
                        exposeApplicationFacade: true,
                        applicationEntryPointUnloaded: true,
                        setCulture: true,
                        setActiveApplicationEntryPoint: true,
                        setApplicationEntryPointUrl: true,
                        callApplicationFacade: true,
                        initializeApplicationSuite: true,
                        resetApplicationSuite: true,
                        resolveCommonLibraryResources: true,
                        getCommonLibraryResources: true,
                        getCommonLibraryResource: true
                    };
                }
                ApplicationHostProxyClass.prototype.setCulture = function (culture) {
                    this.call("setCulture", [culture]);
                };

                ApplicationHostProxyClass.prototype.applicationEntryPointLoaded = function (coreVersion, callback) {
                    var _this = this;
                    var _callback = function (data) {
                        if (data) {
                            _this.version = data.version;
                            _this.libraryVersionSupported = data.libraryVersionSupported;
                            _this.activeApplicationEntryPointId = data.activeApplicationEntryPointId;
                            _this.activeApplicationId = data.activeApplicationId;
                            _this.culture = data.culture;
                            if (data.supportedMethods) {
                                _this.supportedMethods = data.supportedMethods;
                            }

                            if (callback) {
                                _callback.sourceDomain = arguments.callee.caller.sourceDomain;
                                _callback.sourceWindow = arguments.callee.caller.sourceWindow;
                                callback(data);
                            }
                        }
                    };

                    this.call("applicationEntryPointLoaded", [coreVersion, function (e) {
                            _this.onHostEvent(e);
                        }, _callback], _callback); // pass both result callback and the callback for asynchronous handling
                    // async callback will not be triggered if the synchronous result data is returned
                };

                ApplicationHostProxyClass.prototype.startCaptureDomEvents = function (events) {
                    this.call("startCaptureDomEvents", [events]);
                };

                ApplicationHostProxyClass.prototype.stopCaptureDomEvents = function (events) {
                    this.call("stopCaptureDomEvents", [events]);
                };

                ApplicationHostProxyClass.prototype.exposeApplicationFacade = function (applicationEntryPointId) {
                    if (!this.isTrusted) {
                        throw Error("Unable to expose application facade: application host is untrusted.");
                    }

                    if (Application.isApplicationFacadeSecure === undefined) {
                        Application.isApplicationFacadeSecure = true;
                        this.call("exposeApplicationFacade", [applicationEntryPointId]);
                    } else if (!Application.isApplicationFacadeSecure) {
                        throw Error("Application facade is already exposed as unsecure.");
                    }
                };

                ApplicationHostProxyClass.prototype.exposeApplicationFacadeUnsecure = function (applicationEntryPointId) {
                    if (Application.isApplicationFacadeSecure === undefined) {
                        Application.isApplicationFacadeSecure = false;
                        this.call("exposeApplicationFacade", [applicationEntryPointId]);
                    } else if (Application.isApplicationFacadeSecure) {
                        throw Error("Application facade is already exposed as secure.");
                    }
                };

                ApplicationHostProxyClass.prototype.applicationEntryPointUnloaded = function () {
                    this.call("applicationEntryPointUnloaded");
                };

                ApplicationHostProxyClass.prototype.resolveCommonLibraryResources = function (resourceGroupName, callback) {
                    if (this.isSupported("resolveCommonLibraryResourcesAsync")) {
                        this.call("resolveCommonLibraryResourcesAsync", [resourceGroupName, callback]);
                    } else {
                        this.call("resolveCommonLibraryResources", [resourceGroupName], callback);
                    }
                };

                ApplicationHostProxyClass.prototype.getCommonLibraryResources = function (files, version, onFileLoad, onFailure) {
                    this.call("getCommonLibraryResources", [files, version, onFileLoad, onFailure]);
                };

                ApplicationHostProxyClass.prototype.getCommonLibraryResource = function (file, version, onSuccess, onFailure) {
                    this.call("getCommonLibraryResource", [file, version, onSuccess, onFailure]);
                };

                ApplicationHostProxyClass.prototype.setActiveApplicationEntryPoint = function (applicationEntryPointId, applicationSuiteId) {
                    this.call("setActiveApplicationEntryPoint", [applicationEntryPointId, applicationSuiteId]);
                };

                ApplicationHostProxyClass.prototype.setApplicationEntryPointUrl = function (applicationEntryPointId, url, applicationSuiteId) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to set application entry point Url: application host is untrusted.");
                    }

                    if (applicationSuiteId && applicationSuiteId != Application.applicationSuiteId && (Application.trustedApplications ? (applicationSuiteId != Application.applicationSuiteId && Application.trustedApplications.indexOf(applicationSuiteId) == -1) : !Application.trustedApplicationDomains)) {
                        throw Error("Unable to set application entry point Url: application \"" + applicationSuiteId + "\" is untrusted.");
                    }

                    this.call("setApplicationEntryPointUrl", [
                        applicationEntryPointId, url, applicationSuiteId,
                        Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null]);
                };

                ApplicationHostProxyClass.prototype.setApplicationEntryPointUrlUnsecure = function (applicationEntryPointId, url, applicationSuiteId) {
                    this.call("setApplicationEntryPointUrl", [applicationEntryPointId, url, applicationSuiteId]);
                };

                ApplicationHostProxyClass.prototype.updateTargetDisplayUrlUnsecure = function (url) {
                    this.call("updateTargetDisplayUrl", [url]);
                };

                ApplicationHostProxyClass.prototype.callApplicationFacade = function (applicationEntryPointId, method, args, callback, applicationSuiteId) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to call application facade: application host is untrusted.");
                    }

                    if (applicationSuiteId && applicationSuiteId != Application.applicationSuiteId && (Application.trustedApplications ? (applicationSuiteId != Application.applicationSuiteId && Application.trustedApplications.indexOf(applicationSuiteId) == -1) : !Application.trustedApplicationDomains)) {
                        throw Error("Unable to call application facade: application \"" + applicationSuiteId + "\" is untrusted.");
                    }

                    this.call("callApplicationFacade", [
                        applicationEntryPointId, method, args, callback, applicationSuiteId,
                        Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null]);
                };

                ApplicationHostProxyClass.prototype.callApplicationFacadeUnsecure = function (applicationEntryPointId, method, args, callback, applicationSuiteId) {
                    this.call("callApplicationFacade", [applicationEntryPointId, method, args, callback, applicationSuiteId]);
                };

                ApplicationHostProxyClass.prototype.initializeApplicationSuite = function (includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions) {
                    this.call("initializeApplicationSuite", [includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions]);
                };

                ApplicationHostProxyClass.prototype.resetApplicationSuite = function () {
                    this.call("resetApplicationSuite");
                };

                ApplicationHostProxyClass.prototype.storeApplicationData = function (key, data) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to store application data: application host is untrusted.");
                    }
                    this.call("storeApplicationData", [key, data]);
                };

                ApplicationHostProxyClass.prototype.storeApplicationSessionData = function (key, data) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to store application session data: application host is untrusted.");
                    }
                    this.call("storeApplicationSessionData", [key, data]);
                };

                ApplicationHostProxyClass.prototype.getApplicationData = function (key, callback) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to get application data: application host is untrusted.");
                    }

                    if (this.isSupported("getApplicationDataAsync")) {
                        this.call("getApplicationDataAsync", [key, callback]);
                    } else {
                        this.call("getApplicationData", [key], callback);
                    }
                };

                ApplicationHostProxyClass.prototype.getApplicationSessionData = function (key, callback) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to get application session data: application host is untrusted.");
                    }

                    if (this.isSupported("getApplicationSessionDataAsync")) {
                        this.call("getApplicationSessionDataAsync", [key, callback]);
                    } else {
                        this.call("getApplicationSessionData", [key], callback);
                    }
                };

                ApplicationHostProxyClass.prototype.clearApplicationData = function () {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to clear application data: application host is untrusted.");
                    }
                    this.call("clearApplicationData");
                };

                ApplicationHostProxyClass.prototype.clearApplicationSessionData = function () {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to clear application session data: application host is untrusted.");
                    }
                    this.call("clearApplicationSessionData");
                };

                ApplicationHostProxyClass.prototype.removeApplicationData = function (key) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to remove application data: application host is untrusted.");
                    }
                    this.call("removeApplicationData", [key]);
                };

                ApplicationHostProxyClass.prototype.removeApplicationSessionData = function (key) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to remove application session data: application host is untrusted.");
                    }
                    this.call("removeApplicationSessionData", [key]);
                };

                ApplicationHostProxyClass.prototype.triggerAnalyticsEvent = function (event, object) {
                    if (this.isSupported("triggerAnalyticsEvent")) {
                        this.call("triggerAnalyticsEvent", [event, object]);
                    }
                };

                ApplicationHostProxyClass.prototype.showTopBar = function () {
                    this.call("showTopBar");
                };

                ApplicationHostProxyClass.prototype.setTopBarOptions = function (options) {
                    this.call("setTopBarOptions", [options]);
                };

                ApplicationHostProxyClass.prototype.addEventListener = function (event, handler) {
                    if (this.handlers) {
                        var e = this.handlers[event];
                        if (!e) {
                            e = this.handlers[event] = [];
                        }
                        e.push({ fnc: handler });
                    }
                };

                ApplicationHostProxyClass.prototype.removeEventListener = function (event, handler) {
                    if (this.handlers) {
                        var e = this.handlers[event];
                        if (e) {
                            var len = e.length;
                            for (var i = 0; i < len; i++) {
                                if (e[i].fnc == handler) {
                                    if (len == 1) {
                                        delete this.handlers[event];
                                    } else {
                                        for (var j = i + 1; j < len; j++) {
                                            e[j - 1] = e[j];
                                        }
                                        e.pop();
                                    }
                                    return;
                                }
                            }
                        }
                    }
                };

                ApplicationHostProxyClass.prototype.fireEvent = function (eventType, eventData) {
                    if (this.handlers) {
                        var eventObj = {
                            type: eventType,
                            target: this,
                            data: eventData
                        };

                        this._processHandlers(eventObj, eventType);
                        this._processHandlers(eventObj, "*");
                    }
                };

                ApplicationHostProxyClass.prototype.isSupported = function (method) {
                    return this.supportedMethods[method] || false;
                };

                ApplicationHostProxyClass.prototype.call = function (method, args, callback) {
                    if (this.isSupported(method)) {
                        Client.CrossDomainMessaging.call(window.parent, "SDL.Client.ApplicationHost.ApplicationHostFacade." + method, args, callback);
                    } else {
                        throw Error("ApplicationHost (ver. " + this.version + ") does not support method \"" + method + "\".");
                    }
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
                        return [localDomain];
                    } else {
                        for (var i = 0, len = domains.length; i < len; i++) {
                            if (Client.Types.Url.isSameDomain(domains[i], localDomain)) {
                                return domains;
                            }
                        }
                        return domains.concat(localDomain);
                    }
                };

                ApplicationHostProxyClass.prototype._processHandlers = function (eventObj, handlersCollectionName) {
                    var handlers = this.handlers && this.handlers[handlersCollectionName];
                    if (handlers) {
                        var handlersClone = handlers.concat();
                        for (var i = 0, len = handlersClone.length; i < len && handlers; i++) {
                            var handler = handlersClone[i];
                            if (handlers.indexOf(handler) != -1) {
                                handler.fnc.call(this, eventObj); // cannot cancel ApplicationHost events -> ignore the return value
                                handlers = this.handlers && this.handlers[handlersCollectionName];
                            }
                        }
                    }
                };
                return ApplicationHostProxyClass;
            })();
            Application.ApplicationHostProxyClass = ApplicationHostProxyClass;
        })(Client.Application || (Client.Application = {}));
        var Application = Client.Application;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=ApplicationHost.js.map
