var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="../../SDL.Client.Core/Resources/Resources.d.ts" />
        /// <reference path="../Types/Url1.ts" />
        /// <reference path="../CrossDomainMessaging/CrossDomainMessaging.ts" />
        /// <reference path="Application.ts" />
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
                }
                ApplicationHostProxyClass.prototype.setCulture = function (culture) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setCulture", [culture]);
                };

                ApplicationHostProxyClass.prototype.applicationEntryPointLoaded = function (coreVersion, callback) {
                    var _this = this;
                    var _callback = function (data) {
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

                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.applicationEntryPointLoaded", [coreVersion, function (e) {
                            _this.onHostEvent(e);
                        }], _callback);
                };

                ApplicationHostProxyClass.prototype.exposeApplicationFacade = function (applicationEntryPointId) {
                    if (!this.isTrusted) {
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

                ApplicationHostProxyClass.prototype.resolveCommonLibraryResources = function (resourceGroupName, callback) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.resolveCommonLibraryResources", [resourceGroupName], callback);
                };

                ApplicationHostProxyClass.prototype.getCommonLibraryResources = function (files, version, onFileLoad, onFailure) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.getCommonLibraryResources", [files, version, onFileLoad, onFailure]);
                };

                ApplicationHostProxyClass.prototype.getCommonLibraryResource = function (file, version, onSuccess, onFailure) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.getCommonLibraryResource", [file, version, onSuccess, onFailure]);
                };

                ApplicationHostProxyClass.prototype.setActiveApplicationEntryPoint = function (applicationEntryPointId, applicationSuiteId) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setActiveApplicationEntryPoint", [applicationEntryPointId, applicationSuiteId]);
                };

                ApplicationHostProxyClass.prototype.setApplicationEntryPointUrl = function (applicationEntryPointId, url, applicationSuiteId) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to set application entry point Url: application host is untrusted.");
                    }

                    if (applicationSuiteId && applicationSuiteId != Application.applicationSuiteId && (Application.trustedApplications ? (applicationSuiteId != Application.applicationSuiteId && Application.trustedApplications.indexOf(applicationSuiteId) == -1) : !Application.trustedApplicationDomains)) {
                        throw Error("Unable to set application entry point Url: application \"" + applicationSuiteId + "\" is untrusted.");
                    }

                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setApplicationEntryPointUrl", [
                        applicationEntryPointId,
                        url,
                        applicationSuiteId,
                        Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null
                    ]);
                };

                ApplicationHostProxyClass.prototype.setApplicationEntryPointUrlUnsecure = function (applicationEntryPointId, url, applicationSuiteId) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.setApplicationEntryPointUrl", [applicationEntryPointId, url, applicationSuiteId]);
                };

                ApplicationHostProxyClass.prototype.callApplicationFacade = function (applicationEntryPointId, method, args, callback, applicationSuiteId) {
                    if (!Application.ApplicationHost.isTrusted) {
                        throw Error("Unable to call application facade: application host is untrusted.");
                    }

                    if (applicationSuiteId && applicationSuiteId != Application.applicationSuiteId && (Application.trustedApplications ? (applicationSuiteId != Application.applicationSuiteId && Application.trustedApplications.indexOf(applicationSuiteId) == -1) : !Application.trustedApplicationDomains)) {
                        throw Error("Unable to call application facade: application \"" + applicationSuiteId + "\" is untrusted.");
                    }

                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.callApplicationFacade", [
                        applicationEntryPointId,
                        method,
                        args,
                        callback,
                        applicationSuiteId,
                        Application.trustedApplicationDomains ? this.getWithLocalDomain(Application.trustedApplicationDomains) : null
                    ]);
                };

                ApplicationHostProxyClass.prototype.callApplicationFacadeUnsecure = function (applicationEntryPointId, method, args, callback, applicationSuiteId) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.callApplicationFacade", [applicationEntryPointId, method, args, callback, applicationSuiteId]);
                };

                ApplicationHostProxyClass.prototype.initializeApplicationSuite = function (includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions) {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.initializeApplicationSuite", [includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions]);
                };

                ApplicationHostProxyClass.prototype.resetApplicationSuite = function () {
                    this.call("SDL.Client.ApplicationHost.ApplicationHostFacade.resetApplicationSuite");
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
                        // handlers can be added/removed while handling an event
                        // thus have to recheck them if at least one handler has been executed
                        var needPostprocess;
                        var processedHandlers = [];

                        do {
                            needPostprocess = false;

                            for (var i = 0; handlers && (i < handlers.length); i++) {
                                var handler = handlers[i];
                                if (processedHandlers.indexOf(handler) == -1) {
                                    needPostprocess = true;
                                    processedHandlers.push(handler);

                                    handler.fnc.call(this, eventObj);

                                    handlers = this.handlers && this.handlers[handlersCollectionName];
                                }
                            }
                        } while(needPostprocess);
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
