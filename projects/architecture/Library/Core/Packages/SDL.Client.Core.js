/*961,55873,4645,1124,2216,6507,12283,45706,130,4878,954,3280,1176,1619,3156,5539,3367,2648,9376,14937,1384,801,6244,7807,3820,3485,2458,1924,4060,2141,5654,4026,2152,20332,9285,1990,1571,619,851,3128,697,528,4620,3818,6248,760,727,898,1624,704,9188,1375*/var SDL;
(function (SDL) {
    (function (Client) {
        (function (ApplicationHost) {
            /// <reference path="ApplicationHost.ts" />
            (function (ApplicationManifestReceiver) {
                function registerApplication(applicationEntries) {
                    ApplicationHost.ApplicationHost.registerApplication(applicationEntries);
                }
                ApplicationManifestReceiver.registerApplication = registerApplication;
            })(ApplicationHost.ApplicationManifestReceiver || (ApplicationHost.ApplicationManifestReceiver = {}));
            var ApplicationManifestReceiver = ApplicationHost.ApplicationManifestReceiver;
        })(Client.ApplicationHost || (Client.ApplicationHost = {}));
        var ApplicationHost = Client.ApplicationHost;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=ApplicationManifestReceiver.js.map
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
        /// <reference path="..\Application\Application.ts"
        /// <reference path="..\Application\ApplicationFacade.ts"
        /// <reference path="..\Xml\Xml.d.ts" />
        /// <reference path="..\ConfigurationManager\ConfigurationManager.ts" />
        /// <reference path="..\CrossDomainMessaging\CrossDomainMessaging.ts" />
        /// <reference path="..\Types\Object.d.ts" />
        /// <reference path="..\Xml\Xml.d.ts" />
        /// <reference path="..\Types\Url.d.ts" />
        /// <reference path="..\Types\Array.d.ts" />
        /// <reference path="..\Resources\ResourceManager.ts" />
        /// <reference path="..\Resources\FileResourceHandler.ts" />
        /// <reference path="..\Resources\FileHandlers\CssFileHandler.ts" />
        /// <reference path="..\Event\EventRegister.d.ts" />
        /// <reference path="..\Event\Event.d.ts" />
        /// <reference path="ApplicationManifestReceiver.ts" />
        (function (ApplicationHost) {
            var Url = Client.Types.Url;

            ;

            ;

            ;

            ;

            ;

            ;

            ;

            ;

            ;

            ;

            eval(Client.Types.OO.enableCustomInheritance);
            var ApplicationHostClass = (function (_super) {
                __extends(ApplicationHostClass, _super);
                function ApplicationHostClass() {
                    _super.apply(this, arguments);
                    this.applications = [];
                    this.applicationsIndex = {};
                    this.selfTargetDisplay = {};
                    this.initialized = false;
                    this.libraryVersions = [];
                    this.initCallbacks = [];
                    this.applicationManifestsCount = 0;
                    this.applicationManifests = [];
                }
                ApplicationHostClass.prototype.applicationEntryPointLoaded = function (libraryVersion, eventHandler) {
                    var targetDisplay = this.getCallerTargetDisplay(true);
                    if (targetDisplay) {
                        this.removeHandler(targetDisplay);

                        if (eventHandler) {
                            (eventHandler).reoccuring = true;
                            targetDisplay.eventHandler = eventHandler;
                        }

                        return {
                            applicationSuiteId: targetDisplay.application.id,
                            libraryVersionSupported: !libraryVersion || this.libraryVersions.indexOf(libraryVersion) != -1,
                            culture: Client.Localization.getCulture(),
                            activeApplicationEntryPointId: this.activeApplicationEntryPointId,
                            activeApplicationId: this.activeApplicationId
                        };
                    }
                };

                ApplicationHostClass.prototype.exposeApplicationFacade = function (applicationEntryPointId) {
                    var targetDisplay = this.getCallerTargetDisplay(false);
                    if (targetDisplay) {
                        var application = targetDisplay.application;
                        var applicationEntryPoint = this.getApplicationEntryPointById(applicationEntryPointId, application);
                        if (!applicationEntryPoint || applicationEntryPoint.hidden) {
                            throw Error("Unknown application entry point ID: " + applicationEntryPointId + ".");
                        }

                        if (!applicationEntryPoint.domain.initialized) {
                            throw Error("Unable to determine valid origin domains for application facade \"" + applicationEntryPointId + "\" (application suite \"" + application.id + "\"). Deferred domain \"" + applicationEntryPoint.domain.id + "\" has not been uninitialized.");
                        }

                        if (!Client.Types.Array.contains(applicationEntryPoint.domain.validDomains, targetDisplay.loadedDomain, Url.isSameDomain)) {
                            throw Error("Application facade \"" + applicationEntryPointId + "\" (application suite \"" + application.id + "\") exposed from an unexpected domain: " + targetDisplay.loadedDomain);
                        }

                        var invocations = targetDisplay.delayedFacadeInvocations[applicationEntryPointId];
                        if (invocations) {
                            for (var i = 0; i < invocations.length; i++) {
                                invocations[i]();
                            }
                            targetDisplay.delayedFacadeInvocations[applicationEntryPointId] = null;
                        }
                        targetDisplay.exposedApplicationFacade = applicationEntryPointId;
                    }
                };

                ApplicationHostClass.prototype.applicationEntryPointUnloaded = function () {
                    var targetDisplay = this.getCallerTargetDisplay(true, false, true);
                    if (targetDisplay) {
                        targetDisplay.eventHandler = null;
                        targetDisplay.loadedDomain = null;
                        (targetDisplay).exposedApplicationFacade = null;
                        this.fireEvent("targetdisplayunload", { targetDisplay: targetDisplay });
                    }
                };

                ApplicationHostClass.prototype.setCulture = function (culture) {
                    if (this.getCallerTargetDisplay(true, true)) {
                        Client.Localization.setCulture(culture);
                    }
                };

                ApplicationHostClass.prototype.setActiveApplicationEntryPoint = function (applicationEntryPointId, applicationId) {
                    var targetDisplay = this.getCallerTargetDisplay(true, true);
                    if (targetDisplay) {
                        var applicationEntryPoint;
                        if (applicationEntryPointId || targetDisplay != this.selfTargetDisplay) {
                            applicationEntryPoint = this.getApplicationEntryPointById(applicationEntryPointId, applicationId ? this.applicationsIndex[applicationId] : targetDisplay.application);
                            if (!applicationEntryPoint || applicationEntryPoint.hidden) {
                                throw Error("Unable to activate application entry point '" + applicationEntryPointId + "' (application suite \"" + (applicationId || targetDisplay.application && targetDisplay.application.id) + "\"). Application entry point is not found.");
                            }
                        }

                        applicationId = applicationEntryPointId ? applicationId || targetDisplay.application.id : null;
                        if (applicationEntryPointId != this.activeApplicationEntryPointId || applicationId != this.activeApplicationId) {
                            this.activeApplicationEntryPointId = applicationEntryPointId;
                            this.activeApplicationId = applicationId;

                            if (applicationEntryPoint && applicationEntryPoint.contextual) {
                                applicationEntryPoint.contextual = false;
                                this.fireEvent("applicationentrypointcontextualactivate", { applicationEntryPointId: applicationEntryPointId, applicationId: applicationId });
                            }
                            this.fireEvent("applicationentrypointactivate", { applicationEntryPointId: applicationEntryPointId, applicationId: applicationId });
                            this.publishEvent("applicationentrypointactivate", { applicationEntryPointId: applicationEntryPointId, applicationId: applicationId });
                        }
                    }
                };

                ApplicationHostClass.prototype.setApplicationEntryPointUrl = function (applicationEntryPointId, url, applicationId, allowedDomains) {
                    var targetDisplay = this.getCallerTargetDisplay(true, true);
                    if (targetDisplay) {
                        var applicationEntryPoint = this.getApplicationEntryPointById(applicationEntryPointId, applicationId ? this.applicationsIndex[applicationId] : targetDisplay.application);
                        if (!applicationEntryPoint || applicationEntryPoint.hidden) {
                            throw Error("Unable to set URL for application entry point '" + applicationEntryPointId + "' (application suite \"" + (applicationId || targetDisplay.application && targetDisplay.application.id) + "\"). Application entry point is not found.");
                        }

                        if (applicationEntryPoint.url != url) {
                            var domain = Url.getDomain(url);
                            if (!applicationEntryPoint.domain.initialized) {
                                if (domain) {
                                    throw Error("Unable to set URL for application entry point '" + applicationEntryPointId + "'  (application suite \"" + (applicationId || targetDisplay.application.id) + "\") to \"" + url + "\". Deferred domain \"" + applicationEntryPoint.domain.id + "\" has not been uninitialized.");
                                } else {
                                    url = Url.combinePath(applicationEntryPoint.baseUrl, url);
                                }
                            } else {
                                if (allowedDomains && !Client.Types.Array.contains(allowedDomains, applicationEntryPoint.url, Url.isSameDomain)) {
                                    throw Error("Unable to set URL for application entry point '" + applicationEntryPointId + "' (application suite \"" + (applicationId || targetDisplay.application.id) + "\"). Target application entry point domain is untrusted: " + Url.getDomain(applicationEntryPoint.url) + ". Trusted domains are: " + allowedDomains.join(", "));
                                }

                                url = Url.combinePath(applicationEntryPoint.baseUrl, url);
                                if (domain && !Client.Types.Array.contains(applicationEntryPoint.domain.validDomains, Url.getDomain(url), Url.isSameDomain)) {
                                    throw Error("Unable to set URL for application entry point '" + applicationEntryPointId + "' (application suite \"" + (applicationId || targetDisplay.application.id) + "\"). New URL has an invalid domain: " + domain + ". Allowed domains are: " + applicationEntryPoint.domain.validDomains.join(", "));
                                }
                            }

                            if (applicationEntryPoint.url != url) {
                                applicationEntryPoint.url = url;
                                this.fireEvent("applicationentrypointurlchange", {
                                    applicationEntryPointId: applicationEntryPointId,
                                    applicationId: applicationId || targetDisplay.application.id,
                                    url: url
                                });
                            }
                        }
                    }
                };

                ApplicationHostClass.prototype.callApplicationFacade = function (applicationEntryPointId, method, args, callback, applicationId, allowedDomains) {
                    var targetDisplay = this.getCallerTargetDisplay(true, true);
                    if (targetDisplay) {
                        var applicationEntryPoint = this.getApplicationEntryPointById(applicationEntryPointId, applicationId ? this.applicationsIndex[applicationId] : targetDisplay.application);
                        if (!applicationEntryPoint || applicationEntryPoint.hidden) {
                            throw Error("Unable to call application facade '" + applicationEntryPointId + "' (application suite \"" + (applicationId || targetDisplay.application && targetDisplay.application.id) + "\"). Application facade is not found.");
                        }

                        var callerData = {
                            applicationId: targetDisplay.application && targetDisplay.application.id,
                            applicationDomain: targetDisplay.loadedDomain
                        };

                        var facadeTargetDisplay = applicationEntryPoint.targetDisplay;
                        var invocation = function () {
                            if (allowedDomains && !Client.Types.Array.contains(allowedDomains, applicationEntryPoint.url, Url.isSameDomain)) {
                                throw Error("Unable to call application facade '" + applicationEntryPointId + "' (application suite \"" + (applicationId || targetDisplay.application.id) + "\"). Target application domain is untrusted: " + Url.getDomain(applicationEntryPoint.url));
                            }

                            Client.CrossDomainMessaging.call(facadeTargetDisplay.frame.contentWindow, "SDL.Client.Application.ApplicationFacadeStub.callApplicationFacade", [method, args, callerData], callback);
                        };

                        if (facadeTargetDisplay.exposedApplicationFacade == applicationEntryPointId) {
                            // application loaded and facade exposed
                            invocation();
                        } else {
                            if (!facadeTargetDisplay.delayedFacadeInvocations[applicationEntryPointId]) {
                                facadeTargetDisplay.delayedFacadeInvocations[applicationEntryPointId] = [invocation];
                            } else {
                                facadeTargetDisplay.delayedFacadeInvocations[applicationEntryPointId].push(invocation);
                            }

                            if (!facadeTargetDisplay.frame) {
                                // targetDisplay of the requested application entry point is not used -> load the entry point
                                this.fireEvent("applicationfacaderequest", {
                                    applicationEntryPointId: applicationEntryPointId,
                                    applicationId: facadeTargetDisplay.application.id
                                });
                            }
                        }
                    }
                };

                ApplicationHostClass.prototype.initializeApplicationSuite = function (includeApplicationEntryPointIds, excludeApplicationEntryPointIds, domainDefinitions) {
                    var _this = this;
                    var targetDisplay = this.getCallerTargetDisplay(true);
                    if (targetDisplay) {
                        var application = targetDisplay.application;
                        if (application.authenticationUrl && !application.authenticated) {
                            application.authenticated = true;
                            if (includeApplicationEntryPointIds || excludeApplicationEntryPointIds) {
                                SDL.jQuery.each(application.entryPointGroups, function (index, entryPointGroup) {
                                    return SDL.jQuery.each(entryPointGroup.entryPoints, function (index, entryPoint) {
                                        if ((includeApplicationEntryPointIds && includeApplicationEntryPointIds.indexOf(entryPoint.id) == -1) || (excludeApplicationEntryPointIds && excludeApplicationEntryPointIds.indexOf(entryPoint.id) != -1)) {
                                            entryPoint.hidden = true;
                                        }
                                    });
                                });
                            }

                            if (domainDefinitions) {
                                SDL.jQuery.each(domainDefinitions, function (id, domainDefinition) {
                                    var domain = application.domains[id];
                                    if (!domain) {
                                        if (window.console) {
                                            window.console.warn("Unable to define domain \"" + id + "\" (application suite \"" + application.id + "\"). Domain is not found.");
                                        }
                                    } else if (!domain.deferred) {
                                        if (window.console) {
                                            window.console.warn("Unable to define domain \"" + id + "\" (application suite \"" + application.id + "\"). Domain is not deferred.");
                                        }
                                    } else if (!domain.initialized) {
                                        domain.initialized = true;
                                        if (domainDefinition) {
                                            domain.domain = Url.combinePath(domain.baseUrl, domainDefinition.domain || "");
                                            domain.validDomains = [domain.domain].concat(SDL.jQuery.map(domainDefinition.alternativeDomains || [], function (validDomain, index) {
                                                return Url.combinePath(domain.baseUrl, validDomain);
                                            }));
                                        }

                                        SDL.jQuery.each(application.entryPointGroups, function (index, entryPointGroup) {
                                            return SDL.jQuery.each(entryPointGroup.entryPoints, function (index, entryPoint) {
                                                if (entryPoint.domain == domain) {
                                                    if (!Url.isAbsoluteUrl(entryPoint.baseUrl)) {
                                                        entryPoint.baseUrl = Url.combinePath(domain.domain, entryPoint.baseUrl);
                                                    }

                                                    if (!Url.isAbsoluteUrl(entryPoint.url)) {
                                                        entryPoint.url = Url.combinePath(domain.domain, entryPoint.url);

                                                        _this.fireEvent("applicationentrypointurlchange", {
                                                            applicationEntryPointId: entryPoint.id,
                                                            applicationId: application.id,
                                                            url: entryPoint.url
                                                        });
                                                    }
                                                }
                                            });
                                        });
                                    }
                                });
                            }

                            if (window.console) {
                                SDL.jQuery.each(application.domains, function (index, domain) {
                                    if (!domain.initialized) {
                                        window.console.warn("Deferred domain \"" + domain.id + "\" (application suite \"" + application.id + "\") is left undefined.");
                                    }
                                });
                            }

                            this.fireEvent("applicationsuiteinitialize", {
                                applicationId: application.id,
                                includeApplicationEntryPointIds: includeApplicationEntryPointIds,
                                excludeApplicationEntryPointIds: excludeApplicationEntryPointIds
                            });
                        }
                        return;
                    }
                };

                ApplicationHostClass.prototype.resetApplicationSuite = function () {
                    var targetDisplay = this.getCallerTargetDisplay(true);
                    if (targetDisplay) {
                        var application = targetDisplay.application;
                        if (application.authenticationUrl && application.authenticated) {
                            application.authenticated = false;
                            SDL.jQuery.each(application.entryPointGroups, function (index, entryPointGroup) {
                                return SDL.jQuery.each(entryPointGroup.entryPoints, function (index, entryPoint) {
                                    entryPoint.hidden = false;
                                });
                            });

                            this.fireEvent("applicationsuitereset", { applicationId: application.id });
                        }
                        return;
                    }
                };

                ApplicationHostClass.prototype.resolveCommonLibraryResources = function (resourceGroupName) {
                    return Client.Resources.ResourceManager.resolveResources(resourceGroupName);
                };

                ApplicationHostClass.prototype.getCommonLibraryResources = function (files, version, onFileLoad, onFailure) {
                    var count = files && files.length;
                    if (count) {
                        if (onFileLoad) {
                            (onFileLoad).reoccuring = true;
                        }

                        SDL.jQuery.each(files, function (i, file) {
                            if (file.url) {
                                var url = file.url;
                                if (version && version != Client.Configuration.ConfigurationManager.coreVersion) {
                                    url = url.replace(/^~(\/Library)(\/|$)/i, "~/" + version + "/$1$2");
                                }
                                file.url = Url.normalize(url);
                            }

                            if (!file.url || file.url.indexOf("~/") != 0) {
                                if (onFileLoad && (onFileLoad).retire) {
                                    (onFileLoad).retire();
                                    onFileLoad = null;
                                }

                                if (onFailure) {
                                    onFailure("getCommonLibraryResource: library resource URL must start with ~/. Requested URL is '" + (file.url || "") + "'");
                                    onFailure = null;
                                }
                                return;
                            }

                            Client.Resources.FileResourceHandler.load(file, onFileLoad || onFailure ? function (file) {
                                if (onFileLoad) {
                                    var url = file.url;
                                    var data = file.data;
                                    if (Client.Resources.FileHandlers.CssFileHandler.supports(url)) {
                                        data = Client.Resources.FileHandlers.CssFileHandler.updatePaths(data, url, true);
                                    }
                                    onFileLoad({ url: url, data: data });
                                }

                                if (--count == 0) {
                                    if (onFileLoad && (onFileLoad).retire) {
                                        (onFileLoad).retire();
                                        onFileLoad = null;
                                    }

                                    if (onFailure && (onFailure).retire) {
                                        (onFailure).retire();
                                        onFailure = null;
                                    }
                                }
                            } : null, onFileLoad || onFailure ? function (file) {
                                if (onFileLoad && (onFileLoad).retire) {
                                    (onFileLoad).retire();
                                    onFileLoad = null;
                                }

                                if (onFailure) {
                                    onFailure(file && file.error);
                                    onFailure = null;
                                }
                            } : null);
                        });
                    } else {
                        if (onFileLoad && (onFileLoad).retire) {
                            (onFileLoad).retire();
                            onFileLoad = null;
                        }

                        if (onFailure && (onFailure).retire) {
                            (onFailure).retire();
                            onFailure = null;
                        }
                    }
                };

                ApplicationHostClass.prototype.getCommonLibraryResource = function (file, version, onSuccess, onFailure) {
                    if (file.url) {
                        var url = file.url;
                        if (version && version != Client.Configuration.ConfigurationManager.coreVersion) {
                            url = url.replace(/^~(\/Library)(\/|$)/i, "~/" + version + "/$1$2");
                        }
                        file.url = Url.normalize(url);
                    }

                    if (!file.url || file.url.indexOf("~/") != 0) {
                        if (onFailure) {
                            //onFailure.reoccuring = false; // is false by default
                            onFailure("getCommonLibraryResource: library resource URL must start with ~/. Requested URL is '" + (file.url || "") + "'");
                            onFailure = null;
                        }

                        if (onSuccess && (onSuccess).retire) {
                            (onSuccess).retire();
                            onSuccess = null;
                        }
                        return;
                    }

                    Client.Resources.FileResourceHandler.load(file, onSuccess || onFailure ? function (file) {
                        if (onSuccess) {
                            var url = file.url;
                            var data = file.data;
                            if (Client.Resources.FileHandlers.CssFileHandler.supports(url)) {
                                data = Client.Resources.FileHandlers.CssFileHandler.updatePaths(data, url, true);
                            }

                            //onSuccess.reoccuring = false; // is false by default
                            onSuccess(data);
                            onSuccess = null;
                        }
                        if (onFailure && (onFailure).retire) {
                            (onFailure).retire();
                            onFailure = null;
                        }
                    } : null, onSuccess || onFailure ? function (file) {
                        if (onFailure) {
                            //onFailure.reoccuring = false; // is false by default
                            onFailure(file && file.error);
                            onFailure = null;
                        }
                        if (onSuccess && (onSuccess).retire) {
                            (onSuccess).retire();
                            onSuccess = null;
                        }
                    } : null);
                };

                ApplicationHostClass.prototype.initialize = function (callback) {
                    if (!this.initialized) {
                        if (callback) {
                            this.initCallbacks.push(callback);
                        }

                        if (this.initialized === false) {
                            this.initialized = undefined;
                            Client.CrossDomainMessaging.addTrustedDomain("*");
                            this.loadApplicationManifests();
                        }
                    } else if (callback) {
                        callback();
                    }
                };

                ApplicationHostClass.prototype.registerApplication = function (applicationEntries) {
                    var sourceDomain = (arguments.callee).caller.caller.sourceDomain;
                    if (this.initialized === undefined && this.applicationManifestsCount > 0) {
                        var sourceWindow = (arguments.callee).caller.caller.sourceWindow;

                        for (var i = 0, len = this.applicationManifests.length; i < len; i++) {
                            var applicationManifestEntry = this.applicationManifests[i];
                            if (applicationManifestEntry.iframe.contentWindow == sourceWindow) {
                                if (applicationManifestEntry.timeout) {
                                    clearTimeout(applicationManifestEntry.timeout);
                                }

                                if (!Url.isSameDomain(applicationManifestEntry.domain, sourceDomain)) {
                                    throw Error("Call to 'registerApplication' from an unexpected domain: " + sourceDomain + ". Expected: " + applicationManifestEntry.domain);
                                }

                                var manifestDoc = Client.Xml.getNewXmlDocument(applicationEntries);
                                if (Client.Xml.hasParseError(manifestDoc)) {
                                    throw Error("Invalid xml loaded: " + applicationManifestEntry.url + "\n" + Client.Xml.getParseError(manifestDoc));
                                }
                                var importedNode = Client.Xml.importNode(Client.Configuration.ConfigurationManager.configuration.ownerDocument, manifestDoc.documentElement, true);
                                applicationManifestEntry.xmlElement.appendChild(importedNode);

                                var appId = Client.Xml.getInnerText(applicationManifestEntry.xmlElement, ".//configuration/applicationSuite/@id");
                                if (applicationManifestEntry.id != appId) {
                                    throw Error("Unexpected application suite id: \"" + appId + "\". Expected value is: \"" + applicationManifestEntry.id + "\"");
                                }

                                var iframe = applicationManifestEntry.iframe;
                                iframe.src = "about:blank";
                                document.body.removeChild(iframe);

                                this.applicationManifestLoaded();
                                return;
                            }
                        }
                    }
                    throw Error("Unexpected 'registerApplication' call from domain " + sourceDomain + ".");
                };

                ApplicationHostClass.prototype.publishEvent = function (type, data) {
                    SDL.jQuery.each(this.applications, function (index, application) {
                        return SDL.jQuery.each(application.targetDisplays, function (index, targetDisplay) {
                            if (targetDisplay.eventHandler) {
                                targetDisplay.eventHandler({ type: type, data: data });
                            }
                        });
                    });
                };

                ApplicationHostClass.prototype.getCallerTargetDisplay = function (allowAuthenticationTargetDisplay, allowSelfTargetDisplay, allowUnauthenticated) {
                    var sourceWindow;
                    var sourceDomain;

                    // (callee = this function).(caller = ApplicationHost's function).(caller = ApplicationHostFacade's function).(caller = CrossDomainMessaging's function)
                    var caller = (arguments.callee).caller;
                    if (!caller || !caller.caller || !caller.caller.caller || !caller.caller.caller.sourceWindow) {
                        if (allowSelfTargetDisplay) {
                            return this.selfTargetDisplay;
                        }
                    } else {
                        sourceWindow = caller.caller.caller.sourceWindow;
                        sourceDomain = caller.caller.caller.sourceDomain;
                    }

                    if (sourceWindow) {
                        for (var i = 0; i < this.applications.length; i++) {
                            var application = this.applications[i];

                            if (allowAuthenticationTargetDisplay) {
                                var authenticationTargetDisplay = application.authenticationTargetDisplay;
                                if (authenticationTargetDisplay && authenticationTargetDisplay.frame && authenticationTargetDisplay.frame.contentWindow == sourceWindow) {
                                    authenticationTargetDisplay.loadedDomain = sourceDomain;
                                    if (!Url.isSameDomain(application.authenticationUrl, sourceDomain)) {
                                        throw Error("Unexpected origin domain \"" + sourceDomain + "\" from authentication target display for application \"" + application.id + "\".\nExpected domain:\n" + Url.getDomain(application.authenticationUrl));
                                    }
                                    return authenticationTargetDisplay;
                                }
                            }

                            var targetDisplays = application.targetDisplays;
                            for (var j = 0, lenj = targetDisplays.length; j < lenj; j++) {
                                var targetDisplay = targetDisplays[j];
                                if (targetDisplay.frame && targetDisplay.frame.contentWindow == sourceWindow) {
                                    if (!allowUnauthenticated && application.authenticationUrl && !application.authenticated) {
                                        throw Error("Unexpected call from an unauthenticated application \"" + application.id + "\": domain \"" + sourceDomain + "\", target display \"" + targetDisplay.name + "\".");
                                    } else {
                                        targetDisplay.loadedDomain = sourceDomain;

                                        var validDomain = false;
                                        for (var k = 0, lenk = targetDisplay.domains.length; k < lenk; k++) {
                                            var domain = targetDisplay.domains[k];
                                            if (domain.initialized) {
                                                if (Client.Types.Array.contains(domain.validDomains, sourceDomain, Url.isSameDomain)) {
                                                    validDomain = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (!validDomain) {
                                            var expectedDomains = [];
                                            var deferredDomains = [];
                                            for (var k = 0, lenk = targetDisplay.domains.length; k < lenk; k++) {
                                                var domain = targetDisplay.domains[k];
                                                if (!domain.initialized) {
                                                    deferredDomains.push(domain.id);
                                                } else {
                                                    expectedDomains.push(domain.id + ": [" + domain.validDomains.join(", ") + "]");
                                                }
                                            }

                                            throw Error("Unexpected origin domain \"" + sourceDomain + "\" from target display \"" + targetDisplay.name + "\".\nExpected domains:\n" + expectedDomains.join(",\n") + (deferredDomains.length ? "\nUninitialized deferred domains: " + deferredDomains.join(", ") : ""));
                                        }

                                        return targetDisplay;
                                    }
                                }
                            }
                        }
                    }

                    throw Error("ApplicationHost: unable to determine caller's target display. Source domain is: " + sourceDomain);
                };

                ApplicationHostClass.prototype.removeHandler = function (targetDisplay) {
                    if (targetDisplay.eventHandler) {
                        (targetDisplay.eventHandler).retire();
                        targetDisplay.eventHandler = null;
                    }
                };

                ApplicationHostClass.prototype.getApplicationEntryPointById = function (applicationEntryPointId, application) {
                    if (application) {
                        var applicationId = application.id;
                        var entryPointGroups = application.entryPointGroups;
                        for (var i = 0, len = entryPointGroups.length; i < len; i++) {
                            var entryPoints = entryPointGroups[i].entryPoints;
                            for (var j = 0, lenj = entryPoints.length; j < lenj; j++) {
                                if (entryPoints[j].id == applicationEntryPointId) {
                                    return entryPoints[j];
                                }
                            }
                        }
                    }
                };

                // -------------------- Initialization --------------------
                ApplicationHostClass.prototype.loadApplicationManifests = function () {
                    var _this = this;
                    var nodes = Client.Xml.selectNodes(Client.Configuration.ConfigurationManager.configuration, "//configuration/applicationHost/applicationReferences/applicationReference[@url != '' and not(configuration/applicationSuite)]");
                    var externalReferencesCount = nodes.length;
                    if (externalReferencesCount) {
                        this.applicationManifestsCount = externalReferencesCount;

                        var allReferencesCount = Client.Xml.selectNodes(Client.Configuration.ConfigurationManager.configuration, "//configuration/applicationHost/applicationReferences/applicationReference").length;

                        var maxAge = (Client.Xml.getInnerText(Client.Configuration.ConfigurationManager.configuration, "//configuration/applicationHost/manifestCacheMaxAge") | 0) || 3600;
                        var reloadParameter = ((new Date().getTime() - 1380000000000) / (maxAge * 1000) | 0).toString();

                        var manifestTimeout = (Client.Xml.getInnerText(Client.Configuration.ConfigurationManager.configuration, "//configuration/applicationHost/manifestLoadTimeout") | 0) || 5;

                        Client.CrossDomainMessaging.addAllowedHandlerBase(ApplicationHost.ApplicationManifestReceiver);
                        SDL.jQuery.each(nodes, function (i, xmlElement) {
                            var baseUrlNodes = Client.Xml.selectNodes(xmlElement, "ancestor::configuration/@baseUrl");
                            var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

                            var url = xmlElement.getAttribute("url");
                            var id = xmlElement.getAttribute("id");
                            if (!id) {
                                throw Error("'id' not specified for application: " + url);
                            }

                            var domain = Url.getDomain(Url.getAbsoluteUrl(Url.combinePath(baseUrl, url)));

                            var iframe = document.createElement("iframe");
                            iframe.style.border = "none";
                            iframe.style.width = "1px";
                            iframe.style.height = "1px";
                            document.body.appendChild(iframe);

                            var manifest = {
                                iframe: iframe,
                                domain: domain,
                                url: url,
                                id: id,
                                xmlElement: xmlElement,
                                timeout: null
                            };

                            if (allReferencesCount > 1) {
                                // if multiple applications -> timeout after 5 seconds (do not timeout if a single application)
                                var timeoutHandler = function () {
                                    if (allReferencesCount > externalReferencesCount || _this.applicationManifestsCount < externalReferencesCount) {
                                        if (window.console) {
                                            window.console.warn("Failed to load referenced application manifest from \"" + url + "\" within " + manifestTimeout + " seconds.");
                                        }
                                        iframe.src = "about:blank";
                                        document.body.removeChild(iframe);
                                        _this.applicationManifestLoaded();
                                    } else {
                                        // none of the manifests are loaded -> wait further
                                        manifest.timeout = setTimeout(timeoutHandler, manifestTimeout * 1000);
                                    }
                                };

                                manifest.timeout = setTimeout(timeoutHandler, manifestTimeout * 1000);
                            }

                            _this.applicationManifests.push(manifest);
                            iframe.src = Url.setHashParameter(url, "t", reloadParameter);
                        });
                    } else {
                        this.applicationManifests = undefined;
                        this.initializeApplicationHost();
                    }
                };

                ApplicationHostClass.prototype.applicationManifestLoaded = function () {
                    this.applicationManifestsCount--;
                    if (this.applicationManifestsCount == 0) {
                        this.applicationManifests = undefined;
                        this.initializeApplicationHost();
                    }
                };

                ApplicationHostClass.prototype.initializeApplicationHost = function () {
                    var _this = this;
                    SDL.Client.Event.EventRegister.addEventHandler(SDL.Client.Localization, "culturechange", function (e) {
                        _this.publishEvent(e.type, e.data);
                    });

                    if (Client.Configuration.ConfigurationManager.coreVersion) {
                        this.libraryVersions.push(Client.Configuration.ConfigurationManager.coreVersion);
                    }

                    var nodes = Client.Xml.selectNodes(Client.Configuration.ConfigurationManager.configuration, "//configuration/applicationHost/libraryVersions/version");
                    var len = nodes.length;
                    for (var i = 0; i < len; i++) {
                        var version = Client.Xml.getInnerText(nodes[i]);
                        if (this.libraryVersions.indexOf(version) == -1) {
                            this.libraryVersions.push(version);
                        }
                    }

                    nodes = Client.Xml.selectNodes(Client.Configuration.ConfigurationManager.configuration, "//configuration/applicationHost/applicationReferences/applicationReference[.//configuration/applicationSuite]");
                    len = nodes.length;
                    if (len) {
                        for (var i = 0; i < len; i++) {
                            var applicationReferenceNode = nodes[i];

                            var baseUrlNodes = Client.Xml.selectNodes(applicationReferenceNode, "ancestor::configuration/@baseUrl");
                            var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

                            var appId = applicationReferenceNode.getAttribute("id");
                            if (this.applicationsIndex[appId]) {
                                throw Error("A duplicate application id encountered: " + appId);
                            }

                            var manifestUrl = Url.getAbsoluteUrl(Url.combinePath(baseUrl, applicationReferenceNode.getAttribute("url")));
                            var applicationDomain = Url.getDomain(manifestUrl);

                            var applicationSuiteNode = Client.Xml.selectSingleNode(applicationReferenceNode, ".//configuration/applicationSuite");
                            var authenticationUrl = applicationSuiteNode.getAttribute("authenticationUrl");

                            var domains = {};
                            var domainNodes = Client.Xml.selectNodes(applicationSuiteNode, "applicationDomains/applicationDomain[@id != '']");
                            for (var j = 0, lenj = domainNodes.length; j < lenj; j++) {
                                var domainNode = domainNodes[j];
                                var domainUrl = Url.combinePath(applicationDomain, domainNode.getAttribute("domain"));

                                var altDomainNodes = Client.Xml.selectNodes(domainNode, "alternativeDomain");
                                var validDomains = [domainUrl].concat(SDL.jQuery.map(altDomainNodes, function (altDomainsNode) {
                                    return Url.combinePath(applicationDomain, Client.Xml.getInnerText(altDomainsNode));
                                }));

                                var domainId = domainNode.getAttribute("id");
                                var deferredAttribute = domainNode.getAttribute("deferred");
                                var deferred = (deferredAttribute == "true" || deferredAttribute == "1");

                                if (deferred && !authenticationUrl && window.console) {
                                    window.console.warn("Deferred domain definition \"" + domainId + "\" encountered in an application suite \"" + appId + "\" without 'authenticationUrl'.");
                                }

                                domains[domainId] = {
                                    id: domainId,
                                    baseUrl: applicationDomain,
                                    domain: domainUrl,
                                    deferred: deferred,
                                    initialized: !deferred,
                                    validDomains: validDomains
                                };
                            }

                            if (authenticationUrl) {
                                authenticationUrl = Url.combinePath(manifestUrl, authenticationUrl);
                            }

                            var application = {
                                id: appId,
                                manifestUrl: manifestUrl,
                                authenticationUrl: authenticationUrl,
                                authenticationMode: applicationSuiteNode.getAttribute("authenticationMode"),
                                authenticationTargetDisplay: null,
                                domains: domains,
                                targetDisplays: [],
                                targetDisplaysIndex: {},
                                entryPointGroups: null,
                                entryPointGroupsIndex: {}
                            };

                            if (authenticationUrl) {
                                application.authenticationTargetDisplay = {
                                    application: application,
                                    frame: null
                                };
                                application.authenticated = false;
                            }
                            application.entryPointGroups = SDL.jQuery.map(Client.Xml.selectNodes(applicationSuiteNode, "applicationEntryPointGroups/applicationEntryPointGroup"), function (element) {
                                var group = _this.buildApplicationEntryPointGroup(element, domains, application);
                                application.entryPointGroupsIndex[group.id] = group;
                                return group;
                            });

                            this.applications.push(application);
                            this.applicationsIndex[appId] = application;
                        }
                    }

                    this.initialized = true;
                    for (var k = 0, lenk = this.initCallbacks.length; k < lenk; k++) {
                        this.initCallbacks[k]();
                    }
                    this.initCallbacks = undefined;
                };

                ApplicationHostClass.prototype.buildApplicationEntryPointGroup = function (entryPointGroupNode, domains, parentApplication) {
                    var _this = this;
                    var id = entryPointGroupNode.getAttribute("id") || "__group-" + Client.Types.Object.getNextId();
                    return {
                        id: id,
                        title: entryPointGroupNode.getAttribute("title"),
                        translations: this.buildNameTranslations(entryPointGroupNode),
                        entryPoints: SDL.jQuery.map(Client.Xml.selectNodes(entryPointGroupNode, "applicationEntryPoints/applicationEntryPoint"), function (element) {
                            return _this.buildApplicationEntryPoint(element, domains, parentApplication);
                        }),
                        application: parentApplication
                    };
                };

                ApplicationHostClass.prototype.buildApplicationEntryPoint = function (entryPointNode, domains, parentApplication) {
                    var id = entryPointNode.getAttribute("id");
                    var domain = domains[entryPointNode.getAttribute("domainId")];
                    var url = entryPointNode.getAttribute("url");
                    var icon = entryPointNode.getAttribute("icon");
                    var type = entryPointNode.getAttribute("type");
                    var contextual = entryPointNode.getAttribute("contextual");
                    var external = entryPointNode.getAttribute("external");
                    var overlay = entryPointNode.getAttribute("overlay");
                    var targetDisplayName = entryPointNode.getAttribute("targetDisplay") || id;
                    var baseUrl = domain ? (domain.deferred ? url : Url.combinePath(domain.domain, url)) : Url.getAbsoluteUrl(url);

                    var targetDisplay = parentApplication.targetDisplaysIndex[targetDisplayName];
                    if (!targetDisplay) {
                        targetDisplay = parentApplication.targetDisplaysIndex[targetDisplayName] = {
                            name: targetDisplayName,
                            application: parentApplication,
                            entryPoints: [],
                            domains: [domain],
                            frame: null,
                            delayedFacadeInvocations: {}
                        };

                        parentApplication.targetDisplays.push(targetDisplay);
                    } else if (targetDisplay.domains.indexOf(domain) == -1) {
                        targetDisplay.domains.push(domain);
                    }

                    var entryPoint = {
                        id: id,
                        title: entryPointNode.getAttribute("title"),
                        domain: domain,
                        baseUrl: baseUrl,
                        url: baseUrl,
                        icon: icon,
                        type: type,
                        translations: this.buildNameTranslations(entryPointNode),
                        hidden: false,
                        contextual: contextual == "true" || contextual == "1",
                        external: external == "true" || external == "1",
                        overlay: !(overlay == "false" || overlay == "0") && (overlay == "true" || overlay == "1" || undefined),
                        targetDisplay: targetDisplay,
                        application: parentApplication
                    };

                    if (icon) {
                        if (icon.indexOf("~/") == -1) {
                            entryPoint.icon = Url.combinePath(parentApplication.manifestUrl, icon);
                        } else {
                            entryPoint.icon = Url.combinePath(SDL.Client.Configuration.ConfigurationManager.corePath, icon.slice(2));
                        }
                    }

                    targetDisplay.entryPoints.push(entryPoint);
                    return entryPoint;
                };

                ApplicationHostClass.prototype.buildNameTranslations = function (parent) {
                    var translations = {};
                    var translationNodes = Client.Xml.selectNodes(parent, "translations/title[@lang]");
                    for (var i = 0, len = translationNodes.length; i < len; i++) {
                        var translationNode = translationNodes[i];
                        translations[translationNode.getAttribute("lang")] = Client.Xml.getInnerText(translationNode);
                    }
                    return translations;
                };
                return ApplicationHostClass;
            })(Client.Types.ObjectWithEvents);
            SDL.Client.Types.OO.createInterface("SDL.Client.ApplicationHost.ApplicationHostClass", ApplicationHostClass);
            ApplicationHost.ApplicationHost = new SDL.Client.ApplicationHost["ApplicationHostClass"]();
            ApplicationHost.ApplicationHost.initialize();
        })(Client.ApplicationHost || (Client.ApplicationHost = {}));
        var ApplicationHost = Client.ApplicationHost;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=ApplicationHost.js.map
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
/*! @namespace {SDL.Client.Exception.Exception} */
SDL.Client.Types.OO.createInterface("SDL.Client.Exception.Exception");

SDL.Client.Exception.Exception.$constructor = function SDL$Client$Exception$constructor(errorCode, message, description)
{
	var p = this.properties;
	p.errorCode = errorCode;
	p.message = message;
	p.description = description;
};

SDL.Client.Exception.Exception.prototype.getErrorCode = function SDL$Client$Exception$getErrorCode()
{
	return this.properties.errorCode;
};

SDL.Client.Exception.Exception.prototype.getMessage = function SDL$Client$Exception$getMessage()
{
	return this.properties.message;
};

SDL.Client.Exception.Exception.prototype.getDescription = function SDL$Client$Exception$getDescription()
{
	return this.properties.description;
};

SDL.Client.Exception.ErrorCodes = {};	// enum of error codes

(function()
{
	var next = 1;
	SDL.Client.Exception.registerErrorCode = function SDL$Client$Exception$registerErrorCode(alias)
	{
		if (!SDL.Client.Exception.ErrorCodes[alias])
		{
			SDL.Client.Exception.ErrorCodes[alias] = next++;
		}
	}
})();/*! @namespace {SDL.Client.Exception.ValidationException} */
SDL.Client.Types.OO.createInterface("SDL.Client.Exception.ValidationException");

SDL.Client.Exception.registerErrorCode("VALIDATION_ERROR");

SDL.Client.Exception.ValidationException.$constructor = function SDL$Client$ValidationException$constructor(validationResults)
{
	this.addInterface("SDL.Client.Exception.Exception", [SDL.Client.Exception.ErrorCodes.VALIDATION_ERROR, "Validation failed.", null]);
	var p = this.properties;
	if (validationResults)
	{
		p.validationResults = SDL.Client.Types.Object.clone(validationResults);
		p.empty = false;
	}
	else
	{
		p.validationResults = {};
		p.empty = true;
	}
};

SDL.Client.Exception.ValidationException.prototype.getValidationResults = function SDL$Client$ValidationException$getValidationResults()
{
	var p = this.properties;
	return p.empty ? null : p.validationResults;
};

SDL.Client.Exception.ValidationException.prototype.addValidationResult = function SDL$Client$ValidationException$addValidationResult(property, errorCode, message, description)
{
	var p = this.properties;
	p.empty = false;
	p.validationResults[property] = SDL.Client.Types.OO.implementsInterface(errorCode, "SDL.Client.Exception.Exception")
		? errorCode
		: new SDL.Client.Exception.Exception(errorCode, message, description);
};

SDL.Client.Exception.ValidationException.prototype.removeValidationResult = function SDL$Client$ValidationException$removeValidationResult(property)
{
	var p = this.properties;
	if (!p.empty)
	{
		if (!property)
		{
			p.validationResults = {};
			p.empty = true;
			return true;
		}
		else
		{
			if (p.validationResults[property])
			{
				delete p.validationResults[property];
				p.empty = SDL.jQuery.isEmptyObject(p.validationResults);
				return true;
			}
		}
	}
};

SDL.Client.Exception.ValidationException.prototype.getDescription = function SDL$Client$ValidationException$getDescription()
{
	var p = this.properties;
	return p.empty
		? "There are no validation errors"
		: "The following properties are invalid:" + SDL.jQuery.map(p.validationResults, function(exception, property) { return property; }).join(",");
};/*! @namespace {SDL.Client.Types.Date} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.Date");

/**
* Initialized when the code is first parsed with the milliseconds of the current moment.
* This variable can then be used for timing purposes.
* @type {Number}
*/
SDL.Client.Types.Date.initTime = new Date().getTime(),
	
/**
* Returns the number of milliseonds elapsed since another point in time.
* @param {Number} timeSince The millisecond representation of a time from which to measure the difference. If this
* value is not specified, the difference returned will be between the current moment and the time stored in <c>Date.initTime</c>
* @return {Number} The number of milliseonds elapsed since another point in time.
*/
SDL.Client.Types.Date.getTimer = function SDL$Client$Types$Date$getTimer(timeSince)
{
	return (new Date().getTime() - (timeSince || Date.initTime));
};

/**
* Attempts to parse the supplied date string using various formats and if successful returns a new date.
* The supported date formats are:
* <ul>
* <li>YYYY-MM-DD</li>
* @param {String} dateValue The date value string to parse
* @return {Date} A date parsed from the supplied string if sucessful, or a <c>null</c> if not.
*/
SDL.Client.Types.Date.parse = function SDL$Client$Types$Date$parse(dateValue)
{
	if (dateValue == null)
	{
		return null;
	}
	else if (dateValue instanceof Date)
	{
		return dateValue.getTime();
	}
	else if (dateValue instanceof Array)
	{
		if (dateValue.length == 3)
		{
			var currentDate = new Date(dateValue[2], dateValue[1]-1, dateValue[0]);
			if (isNaN(currentDate))
			{
				return null;
			}
			else
			{
				return currentDate.getTime();
			}
		}
		else
		{
			return null;
		}
	}
	else
	{
		var dateString = new String(dateValue);
		if (dateString.length == 0)
		{
			return null;
		}
		var date = null;

		// yyyy-mm-dd [hh:nn[:ss]] | yyyy/mm/dd [hh:nn[:ss]] | yyyy.mm.dd [hh:nn[:ss]]
		if (dateString.match(/(\d{1,2})([\.\-\/])(\d{1,2})\2(\d{4})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/))
		{
			date = new Date(RegExp.$4, RegExp.$3 -1, RegExp.$1, RegExp.$5 || 0, RegExp.$6 || 0, RegExp.$7 || 0);
		}
		// dd-mm-yyyy [hh:nn[:ss]] | dd-mm-yyyy [hh:nn[:ss]] | dd-mm-yyyy [hh:nn[:ss]]
		else if (dateString.match(/(\d{4})([\.\-\/])(\d{1,2})\2(\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/))
		{
			date = new Date(RegExp.$1, RegExp.$3 -1, RegExp.$4, RegExp.$5 || 0, RegExp.$6 || 0, RegExp.$7 || 0);
		}
		// js-milliseconds date
		else if (dateString.match(dateString.match(/^-?\d+$/)))
		{
			date = new Date(parseInt(dateString));
		}
		// js-string: www MMM dd hh:mm:ss ZON+dddd yyyy
		else if (dateString.match(/^\w{3}\s\w{2}\s\d{1,2}\s\d{2}:\d{2}:\d{2}\s\w{3}\+\d{4}\s\d{4}$/))
		{
			date = new Date(dateString);
		}
		return date;
	}
};

/**
* Tries to figure out if: startdate <= date <= endDate.
* @param {Date} date The date object to verify
* @param {Date} startDate The date object as the left limiter
* @param {Date} endDate The date object as the right limiter
* @return {Boolean} True is so, otheriwse false.
*/
SDL.Client.Types.Date.inRange = function SDL$Client$Types$Date$inRange(date, startDate, endDate)
{
	var sOk = SDL.Client.Type.isDate(startDate);
	var eOk = SDL.Client.Type.isDate(endDate);
		
	if ((!sOk && !eOk) ||
		(sOk && !eOk && ((startDate.getTime() - date.getTime()) <= 0)) ||
		(!sOk && eOk && ((date.getTime() - endDate.getTime()) <= 0)) ||
		(sOk && eOk && ((startDate.getTime() - date.getTime()) <= 0) && ((date.getTime() - endDate.getTime()) <= 0)))
	{
		return true;
	}
	else
	{
		return false;
	}
};

SDL.Client.Types.Date.toIsoString = function(date)
{
	return this.toString(date, "yyyy-MM-ddTHH:mm:ss");
};

SDL.Client.Types.Date.toString = function(date, format, formatLocale)
{
	if (date)
	{
		if (format == null)
		{
			return date.toString(date);
		}

		if (isNaN(date))
		{
			return "NaN";
		}

		var d = date.getDate();
		var day = date.getDay();
		var month = date.getMonth();
		var year = date.getFullYear();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		var milliseconds = date.getMilliseconds()
		var offset = date.getTimezoneOffset();

		var formatted = format.replace(/d{1,4}|M{1,4}|y{4}|y{2}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|f{1,3}|t{1,2}|z{1}|\'[^\']*\'/g, function($1)
		{
			switch ($1)
			{
				case "d":
					return d;
				case "dd":
					return (d < 10) ? "0" + d : d;
				case "ddd":
					return formatLocale.shortDayNames[day];
				case "dddd":
					return formatLocale.dayNames[day];
				case "M":
					return month + 1;
				case "MM":
					return (month < 9) ? "0" + (month + 1) : (month + 1);
				case "MMM":
					return formatLocale.shortMonthNames[month];
				case "MMMM":
					return formatLocale.monthNames[month];
				case "yy":
					var y = year % 100
					return (y < 10) ? "0" + y : y;
				case "yyyy":
					return year;
				case "H":
					return hours;
				case "HH":
					return (hours < 10) ? "0" + hours : hours;
				case "h":
					var h = (hours > 12 ? hours - 12 : (hours == 0 ? 12 : hours));
					return h;
				case "hh":
					var h = (hours > 12 ? hours - 12 : (hours == 0 ? 12 : hours));
					return (h < 10) ? "0" + h : h;
				case "m":
					return minutes;
				case "mm":
					return (minutes < 10) ? "0" + minutes : minutes;
				case "s":
					return seconds;
				case "ss":
					return (seconds < 10) ? "0" + seconds : seconds;
				case "f":
					return Math.round(milliseconds / 100);
				case "ff":
					var ms = Math.round(milliseconds / 10);
					return (ms < 10) ? "0" + ms : ms;
				case "fff":
					return (milliseconds < 10) ? "00" + milliseconds :
						(milliseconds < 100) ? "0" + milliseconds :
						milliseconds;
				case "t":
					return (hours < 12 ? formatLocale.am : formatLocale.pm).slice(0, 1);
				case "tt":
					return hours < 12 ? formatLocale.am : formatLocale.pm;
				case "z":
					var offset_hours = Math.floor(Math.abs(offset) / 60);
					var offset_minutes = Math.abs(offset) - (offset_hours * 60);
					var oh = offset_hours < 10 ? "0" + offset_hours : offset_hours;
					var om = offset_minutes < 10 ? "0" + offset_minutes : offset_minutes;
					return ("UTC" + (offset > 0 ? "-" : "+") + oh + om);
				default:
					return $1.replace(/\'/g, "");
			}
		});

		return formatted;
	}
};var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="globalize.d.ts" />
/// <reference path="../jQuery/SDL.jQuery.ts" />
/// <reference path="../../Types/Types.d.ts" />
/// <reference path="../../Types/Date.d.ts" />
/// <reference path="../../Types/String.d.ts" />
/// <reference path="../../Localization/Localization.ts" />
/// <reference path="../../Event/EventRegister.d.ts" />
/// <reference path="../../Resources/FileResourceHandler.ts" />
// load this module before globalize.js
var SDL;
(function (SDL) {
    ;

    eval(SDL.Client.Types.OO.enableCustomInheritance);
    var GlobalizeClass = (function (_super) {
        __extends(GlobalizeClass, _super);
        function GlobalizeClass() {
            var _this = this;
            _super.call(this);

            this._globalize = (window).Globalize;

            Object.defineProperty(this, "cultures", {
                get: function () {
                    if (!this._globalize)
                        throw "SDL.Globalize is not initialized.";
                    return this._globalize.cultures;
                },
                set: function (value) {
                    if (!this._globalize)
                        throw "SDL.Globalize is not initialized.";
                    this._globalize.cultures = value;
                },
                enumerable: true
            });

            Object.defineProperty(this, "cultureSelector", {
                get: function () {
                    if (!this._globalize)
                        throw "SDL.Globalize is not initialized.";
                    return this._globalize.cultureSelector;
                },
                set: function (value) {
                    if (!this._globalize)
                        throw "SDL.Globalize is not initialized.";
                    this._globalize.cultureSelector = value;
                },
                enumerable: true
            });

            SDL.Client.Event.EventRegister.addEventHandler(SDL.Client.Localization, "culturechange", function (e) {
                if (_this._globalize) {
                    _this.culture(e.data.culture);
                }
                SDL.Client.Resources.FileResourceHandler.updateCultureResources(function () {
                    _this.fireEvent("culturechange", { culture: e.data.culture });
                });
            });
        }
        GlobalizeClass.prototype.initializeNoConflict = function () {
            var _globalize = (window).Globalize;

            if (_globalize != this._globalize) {
                (window).Globalize = this._globalize;
                this._globalize = _globalize;
            }

            if (_globalize) {
                this.culture(SDL.Client.Localization.getCulture());
            }
        };

        GlobalizeClass.prototype.TranslateDate = function (date) {
            var date = SDL.Client.Types.Date.parse(date);
            return this.format(date, "d") + " " + this.format(date, "t");
        };

        GlobalizeClass.prototype.init = function (cultureSelector) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";
            return this._globalize.init.apply(this._globalize, arguments);
        };

        GlobalizeClass.prototype.culture = function () {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";

            if (arguments.length == 1) {
                var culture = arguments[0];
                if (!culture) {
                    return;
                } else if (SDL.Client.Type.isString(culture) && SDL.Client.Localization.getCulture() != culture) {
                    SDL.Client.Localization.setCulture(culture);
                    return;
                }
            }

            return this._globalize.culture.apply(this._globalize, arguments);
        };

        GlobalizeClass.prototype.addCultureInfo = function (cultureName, baseCultureName, info) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";

            if (typeof cultureName !== "string") {
                // cultureName argument is optional string. If not specified, assume info is first
                // and only argument. Specified info deep-extends current culture.
                info = cultureName;
                cultureName = baseCultureName = this.culture().name;
            } else if (typeof baseCultureName !== "string") {
                // baseCultureName argument is optional string. If not specified, assume info is second
                // argument. Specified info deep-extends specified culture.
                // If specified culture does not exist, create by deep-extending default
                info = baseCultureName;
                baseCultureName = !this.cultures[cultureName] ? "default" : cultureName;
            } else {
                // cultureName and baseCultureName specified
                base = this.cultures[baseCultureName];
            }

            var isNew = !this.cultures[cultureName];
            var base = this.cultures[baseCultureName];
            var prevMessages = isNew ? null : this.cultures[cultureName].messages;

            this.cultures[cultureName] = SDL.jQuery.extend(true, {}, base, info, { messages: null }, { messages: SDL.jQuery.extend({}, prevMessages, info.messages) });

            if (isNew) {
                this.cultures[cultureName].calendar = this.cultures[cultureName].calendars.standard;
            }
        };

        GlobalizeClass.prototype.findClosestCulture = function (cultureSelector, skipCount) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";

            var match;
            if (cultureSelector == undefined) {
                cultureSelector = this._globalize.cultureSelector;
            }

            if (cultureSelector) {
                var names = SDL.Client.Type.isString(cultureSelector) ? cultureSelector.split(",") : cultureSelector;

                if (SDL.Client.Type.isArray(names)) {
                    var lang, cultures = this._globalize.cultures, list = names, i, l = list.length, prioritized = [];
                    for (i = 0; i < l; i++) {
                        cultureSelector = SDL.jQuery.trim(list[i]);
                        var pri, parts = cultureSelector.split(";");
                        lang = SDL.jQuery.trim(parts[0]);
                        if (parts.length === 1) {
                            pri = 1;
                        } else {
                            cultureSelector = SDL.jQuery.trim(parts[1]);
                            if (cultureSelector.indexOf("q=") === 0) {
                                cultureSelector = cultureSelector.substr(2);
                                pri = parseFloat(cultureSelector);
                                pri = isNaN(pri) ? 0 : pri;
                            } else {
                                pri = 1;
                            }
                        }
                        prioritized.push({ lang: lang, pri: pri });
                    }
                    prioritized.sort(function (a, b) {
                        if (a.pri < b.pri) {
                            return 1;
                        } else if (a.pri > b.pri) {
                            return -1;
                        }
                        return 0;
                    });

                    for (i = 0; i < l; i++) {
                        lang = prioritized[i].lang;
                        match = cultures[lang];
                        if (match && (!skipCount || !skipCount--)) {
                            return match;
                        }
                    }

                    for (i = 0; i < l; i++) {
                        lang = prioritized[i].lang;
                        do {
                            var index = lang.lastIndexOf("-");
                            if (index === -1) {
                                break;
                            }

                            // strip off the last part. e.g. en-US => en
                            lang = lang.substr(0, index);
                            match = cultures[lang];
                            if (match && (!skipCount || !skipCount--)) {
                                return match;
                            }
                        } while(1);
                    }

                    for (i = 0; i < l; i++) {
                        lang = prioritized[i].lang;
                        for (var cultureKey in cultures) {
                            var culture = cultures[cultureKey];
                            if (culture.language === lang && (!skipCount || !skipCount--)) {
                                return culture;
                            }
                        }
                    }
                } else if (SDL.Client.Type.isObject(names)) {
                    if (!skipCount) {
                        return names;
                    } else {
                        return this.findClosestCulture((names).name, skipCount);
                    }
                }
            }
            return !skipCount ? this._globalize.cultures["default"] : null;
        };

        GlobalizeClass.prototype.format = function (value, format, cultureSelector) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";
            return this._globalize.format.apply(this._globalize, arguments);
        };

        GlobalizeClass.prototype.localize = function (key, parameters, cultureSelector) {
            if (key) {
                if (!this._globalize)
                    throw "SDL.Globalize is not initialized.";

                if (!cultureSelector && parameters && !SDL.Client.Type.isArray(parameters)) {
                    cultureSelector = parameters;
                    parameters = null;
                }

                var ckipCount = 0;
                var culture;
                var message;
                do {
                    culture = this.findClosestCulture(cultureSelector, ckipCount++);
                    if (culture) {
                        message = culture.messages[key];
                        if (message != null) {
                            if (SDL.Client.Type.isArray(parameters)) {
                                message = SDL.Client.Types.String.format(message, parameters);
                            }
                            return message;
                        }
                    }
                } while(culture);
            }
        };

        GlobalizeClass.prototype.parseDate = function (value, formats, cultureSelector) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";
            return this._globalize.parseDate.apply(this._globalize, arguments);
        };

        GlobalizeClass.prototype.parseInt = function (value, radix, cultureSelector) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";
            return this._globalize.parseInt.apply(this._globalize, arguments);
        };

        GlobalizeClass.prototype.parseFloat = function (value, radix, cultureSelector) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";
            return this._globalize.parseFloat.apply(this._globalize, arguments);
        };
        return GlobalizeClass;
    })(SDL.Client.Types.ObjectWithEvents);
    SDL.GlobalizeClass = GlobalizeClass;
    SDL.Client.Types.OO.createInterface("SDL.GlobalizeClass", GlobalizeClass);
})(SDL || (SDL = {}));

var SDL;
(function (SDL) {
    SDL.Globalize = new SDL.GlobalizeClass();
})(SDL || (SDL = {}));
//@ sourceMappingURL=SDL.Globalize.js.map
/*!
 * Globalize
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

(function( window, undefined ) {

var Globalize,
	// private variables
	regexHex,
	regexInfinity,
	regexParseFloat,
	regexTrim,
	// private JavaScript utility functions
	arrayIndexOf,
	endsWith,
	extend,
	isArray,
	isFunction,
	isObject,
	startsWith,
	trim,
	truncate,
	zeroPad,
	// private Globalization utility functions
	appendPreOrPostMatch,
	expandFormat,
	formatDate,
	formatNumber,
	getTokenRegExp,
	getEra,
	getEraYear,
	parseExact,
	parseNegativePattern;

// Global variable (Globalize) or CommonJS module (globalize)
Globalize = function( cultureSelector ) {
	return new Globalize.prototype.init( cultureSelector );
};

if ( typeof require !== "undefined" &&
	typeof exports !== "undefined" &&
	typeof module !== "undefined" ) {
	// Assume CommonJS
	module.exports = Globalize;
} else {
	// Export as global variable
	window.Globalize = Globalize;
}

Globalize.cultures = {};

Globalize.prototype = {
	constructor: Globalize,
	init: function( cultureSelector ) {
		this.cultures = Globalize.cultures;
		this.cultureSelector = cultureSelector;

		return this;
	}
};
Globalize.prototype.init.prototype = Globalize.prototype;

// 1. When defining a culture, all fields are required except the ones stated as optional.
// 2. Each culture should have a ".calendars" object with at least one calendar named "standard"
//    which serves as the default calendar in use by that culture.
// 3. Each culture should have a ".calendar" object which is the current calendar being used,
//    it may be dynamically changed at any time to one of the calendars in ".calendars".
Globalize.cultures[ "default" ] = {
	// A unique name for the culture in the form <language code>-<country/region code>
	name: "en",
	// the name of the culture in the english language
	englishName: "English",
	// the name of the culture in its own language
	nativeName: "English",
	// whether the culture uses right-to-left text
	isRTL: false,
	// "language" is used for so-called "specific" cultures.
	// For example, the culture "es-CL" means "Spanish, in Chili".
	// It represents the Spanish-speaking culture as it is in Chili,
	// which might have different formatting rules or even translations
	// than Spanish in Spain. A "neutral" culture is one that is not
	// specific to a region. For example, the culture "es" is the generic
	// Spanish culture, which may be a more generalized version of the language
	// that may or may not be what a specific culture expects.
	// For a specific culture like "es-CL", the "language" field refers to the
	// neutral, generic culture information for the language it is using.
	// This is not always a simple matter of the string before the dash.
	// For example, the "zh-Hans" culture is netural (Simplified Chinese).
	// And the "zh-SG" culture is Simplified Chinese in Singapore, whose lanugage
	// field is "zh-CHS", not "zh".
	// This field should be used to navigate from a specific culture to it's
	// more general, neutral culture. If a culture is already as general as it
	// can get, the language may refer to itself.
	language: "en",
	// numberFormat defines general number formatting rules, like the digits in
	// each grouping, the group separator, and how negative numbers are displayed.
	numberFormat: {
		// [negativePattern]
		// Note, numberFormat.pattern has no "positivePattern" unlike percent and currency,
		// but is still defined as an array for consistency with them.
		//   negativePattern: one of "(n)|-n|- n|n-|n -"
		pattern: [ "-n" ],
		// number of decimal places normally shown
		decimals: 2,
		// string that separates number groups, as in 1,000,000
		",": ",",
		// string that separates a number from the fractional portion, as in 1.99
		".": ".",
		// array of numbers indicating the size of each number group.
		// TODO: more detailed description and example
		groupSizes: [ 3 ],
		// symbol used for positive numbers
		"+": "+",
		// symbol used for negative numbers
		"-": "-",
		// symbol used for NaN (Not-A-Number)
		"NaN": "NaN",
		// symbol used for Negative Infinity
		negativeInfinity: "-Infinity",
		// symbol used for Positive Infinity
		positiveInfinity: "Infinity",
		percent: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
			//   positivePattern: one of "n %|n%|%n|% n"
			pattern: [ "-n %", "n %" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent a percentage
			symbol: "%"
		},
		currency: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
			//   positivePattern: one of "$n|n$|$ n|n $"
			pattern: [ "($n)", "$n" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent currency
			symbol: "$"
		}
	},
	// calendars defines all the possible calendars used by this culture.
	// There should be at least one defined with name "standard", and is the default
	// calendar used by the culture.
	// A calendar contains information about how dates are formatted, information about
	// the calendar's eras, a standard set of the date formats,
	// translations for day and month names, and if the calendar is not based on the Gregorian
	// calendar, conversion functions to and from the Gregorian calendar.
	calendars: {
		standard: {
			// name that identifies the type of calendar this is
			name: "Gregorian_USEnglish",
			// separator of parts of a date (e.g. "/" in 11/05/1955)
			"/": "/",
			// separator of parts of a time (e.g. ":" in 05:44 PM)
			":": ":",
			// the first day of the week (0 = Sunday, 1 = Monday, etc)
			firstDay: 0,
			days: {
				// full day names
				names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
				// abbreviated day names
				namesAbbr: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
				// shortest day names
				namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
			},
			months: {
				// full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
				names: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
				// abbreviated month names
				namesAbbr: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ]
			},
			// AM and PM designators in one of these forms:
			// The usual view, and the upper and lower case versions
			//   [ standard, lowercase, uppercase ]
			// The culture does not use AM or PM (likely all standard date formats use 24 hour time)
			//   null
			AM: [ "AM", "am", "AM" ],
			PM: [ "PM", "pm", "PM" ],
			eras: [
				// eras in reverse chronological order.
				// name: the name of the era in this culture (e.g. A.D., C.E.)
				// start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
				// offset: offset in years from gregorian calendar
				{
					"name": "A.D.",
					"start": null,
					"offset": 0
				}
			],
			// when a two digit year is given, it will never be parsed as a four digit
			// year greater than this year (in the appropriate era for the culture)
			// Set it as a full year (e.g. 2029) or use an offset format starting from
			// the current year: "+19" would correspond to 2029 if the current year 2010.
			twoDigitYearMax: 2029,
			// set of predefined date and time patterns used by the culture
			// these represent the format someone in this culture would expect
			// to see given the portions of the date that are shown.
			patterns: {
				// short date pattern
				d: "M/d/yyyy",
				// long date pattern
				D: "dddd, MMMM dd, yyyy",
				// short time pattern
				t: "h:mm tt",
				// long time pattern
				T: "h:mm:ss tt",
				// long date, short time pattern
				f: "dddd, MMMM dd, yyyy h:mm tt",
				// long date, long time pattern
				F: "dddd, MMMM dd, yyyy h:mm:ss tt",
				// month/day pattern
				M: "MMMM dd",
				// month/year pattern
				Y: "yyyy MMMM",
				// S is a sortable format that does not vary by culture
				S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
			}
			// optional fields for each calendar:
			/*
			monthsGenitive:
				Same as months but used when the day preceeds the month.
				Omit if the culture has no genitive distinction in month names.
				For an explaination of genitive months, see http://blogs.msdn.com/michkap/archive/2004/12/25/332259.aspx
			convert:
				Allows for the support of non-gregorian based calendars. This convert object is used to
				to convert a date to and from a gregorian calendar date to handle parsing and formatting.
				The two functions:
					fromGregorian( date )
						Given the date as a parameter, return an array with parts [ year, month, day ]
						corresponding to the non-gregorian based year, month, and day for the calendar.
					toGregorian( year, month, day )
						Given the non-gregorian year, month, and day, return a new Date() object
						set to the corresponding date in the gregorian calendar.
			*/
		}
	},
	// For localized strings
	messages: {}
};

Globalize.cultures[ "default" ].calendar = Globalize.cultures[ "default" ].calendars.standard;

Globalize.cultures.en = Globalize.cultures[ "default" ];

Globalize.cultureSelector = "en";

//
// private variables
//

regexHex = /^0x[a-f0-9]+$/i;
regexInfinity = /^[+\-]?infinity$/i;
regexParseFloat = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/;
regexTrim = /^\s+|\s+$/g;

//
// private JavaScript utility functions
//

arrayIndexOf = function( array, item ) {
	if ( array.indexOf ) {
		return array.indexOf( item );
	}
	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[i] === item ) {
			return i;
		}
	}
	return -1;
};

endsWith = function( value, pattern ) {
	return value.substr( value.length - pattern.length ) === pattern;
};

extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target) ) {
		target = {};
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];

					} else {
						clone = src && isObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

isArray = Array.isArray || function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Array]";
};

isFunction = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Function]";
};

isObject = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Object]";
};

startsWith = function( value, pattern ) {
	return value.indexOf( pattern ) === 0;
};

trim = function( value ) {
	return ( value + "" ).replace( regexTrim, "" );
};

truncate = function( value ) {
	if ( isNaN( value ) ) {
		return NaN;
	}
	return Math[ value < 0 ? "ceil" : "floor" ]( value );
};

zeroPad = function( str, count, left ) {
	var l;
	for ( l = str.length; l < count; l += 1 ) {
		str = ( left ? ("0" + str) : (str + "0") );
	}
	return str;
};

//
// private Globalization utility functions
//

appendPreOrPostMatch = function( preMatch, strings ) {
	// appends pre- and post- token match strings while removing escaped characters.
	// Returns a single quote count which is used to determine if the token occurs
	// in a string literal.
	var quoteCount = 0,
		escaped = false;
	for ( var i = 0, il = preMatch.length; i < il; i++ ) {
		var c = preMatch.charAt( i );
		switch ( c ) {
			case "\'":
				if ( escaped ) {
					strings.push( "\'" );
				}
				else {
					quoteCount++;
				}
				escaped = false;
				break;
			case "\\":
				if ( escaped ) {
					strings.push( "\\" );
				}
				escaped = !escaped;
				break;
			default:
				strings.push( c );
				escaped = false;
				break;
		}
	}
	return quoteCount;
};

expandFormat = function( cal, format ) {
	// expands unspecified or single character date formats into the full pattern.
	format = format || "F";
	var pattern,
		patterns = cal.patterns,
		len = format.length;
	if ( len === 1 ) {
		pattern = patterns[ format ];
		if ( !pattern ) {
			throw "Invalid date format string \'" + format + "\'.";
		}
		format = pattern;
	}
	else if ( len === 2 && format.charAt(0) === "%" ) {
		// %X escape format -- intended as a custom format string that is only one character, not a built-in format.
		format = format.charAt( 1 );
	}
	return format;
};

formatDate = function( value, format, culture ) {
	var cal = culture.calendar,
		convert = cal.convert,
		ret;

	if ( !format || !format.length || format === "i" ) {
		if ( culture && culture.name.length ) {
			if ( convert ) {
				// non-gregorian calendar, so we cannot use built-in toLocaleString()
				ret = formatDate( value, cal.patterns.F, culture );
			}
			else {
				var eraDate = new Date( value.getTime() ),
					era = getEra( value, cal.eras );
				eraDate.setFullYear( getEraYear(value, cal, era) );
				ret = eraDate.toLocaleString();
			}
		}
		else {
			ret = value.toString();
		}
		return ret;
	}

	var eras = cal.eras,
		sortable = format === "s";
	format = expandFormat( cal, format );

	// Start with an empty string
	ret = [];
	var hour,
		zeros = [ "0", "00", "000" ],
		foundDay,
		checkedDay,
		dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
		quoteCount = 0,
		tokenRegExp = getTokenRegExp(),
		converted;

	function padZeros( num, c ) {
		var r, s = num + "";
		if ( c > 1 && s.length < c ) {
			r = ( zeros[c - 2] + s);
			return r.substr( r.length - c, c );
		}
		else {
			r = s;
		}
		return r;
	}

	function hasDay() {
		if ( foundDay || checkedDay ) {
			return foundDay;
		}
		foundDay = dayPartRegExp.test( format );
		checkedDay = true;
		return foundDay;
	}

	function getPart( date, part ) {
		if ( converted ) {
			return converted[ part ];
		}
		switch ( part ) {
			case 0:
				return date.getFullYear();
			case 1:
				return date.getMonth();
			case 2:
				return date.getDate();
			default:
				throw "Invalid part value " + part;
		}
	}

	if ( !sortable && convert ) {
		converted = convert.fromGregorian( value );
	}

	for ( ; ; ) {
		// Save the current index
		var index = tokenRegExp.lastIndex,
			// Look for the next pattern
			ar = tokenRegExp.exec( format );

		// Append the text before the pattern (or the end of the string if not found)
		var preMatch = format.slice( index, ar ? ar.index : format.length );
		quoteCount += appendPreOrPostMatch( preMatch, ret );

		if ( !ar ) {
			break;
		}

		// do not replace any matches that occur inside a string literal.
		if ( quoteCount % 2 ) {
			ret.push( ar[0] );
			continue;
		}

		var current = ar[ 0 ],
			clength = current.length;

		switch ( current ) {
			case "ddd":
				//Day of the week, as a three-letter abbreviation
			case "dddd":
				// Day of the week, using the full name
				var names = ( clength === 3 ) ? cal.days.namesAbbr : cal.days.names;
				ret.push( names[value.getDay()] );
				break;
			case "d":
				// Day of month, without leading zero for single-digit days
			case "dd":
				// Day of month, with leading zero for single-digit days
				foundDay = true;
				ret.push(
					padZeros( getPart(value, 2), clength )
				);
				break;
			case "MMM":
				// Month, as a three-letter abbreviation
			case "MMMM":
				// Month, using the full name
				var part = getPart( value, 1 );
				ret.push(
					( cal.monthsGenitive && hasDay() ) ?
					( cal.monthsGenitive[ clength === 3 ? "namesAbbr" : "names" ][ part ] ) :
					( cal.months[ clength === 3 ? "namesAbbr" : "names" ][ part ] )
				);
				break;
			case "M":
				// Month, as digits, with no leading zero for single-digit months
			case "MM":
				// Month, as digits, with leading zero for single-digit months
				ret.push(
					padZeros( getPart(value, 1) + 1, clength )
				);
				break;
			case "y":
				// Year, as two digits, but with no leading zero for years less than 10
			case "yy":
				// Year, as two digits, with leading zero for years less than 10
			case "yyyy":
				// Year represented by four full digits
				part = converted ? converted[ 0 ] : getEraYear( value, cal, getEra(value, eras), sortable );
				if ( clength < 4 ) {
					part = part % 100;
				}
				ret.push(
					padZeros( part, clength )
				);
				break;
			case "h":
				// Hours with no leading zero for single-digit hours, using 12-hour clock
			case "hh":
				// Hours with leading zero for single-digit hours, using 12-hour clock
				hour = value.getHours() % 12;
				if ( hour === 0 ) hour = 12;
				ret.push(
					padZeros( hour, clength )
				);
				break;
			case "H":
				// Hours with no leading zero for single-digit hours, using 24-hour clock
			case "HH":
				// Hours with leading zero for single-digit hours, using 24-hour clock
				ret.push(
					padZeros( value.getHours(), clength )
				);
				break;
			case "m":
				// Minutes with no leading zero for single-digit minutes
			case "mm":
				// Minutes with leading zero for single-digit minutes
				ret.push(
					padZeros( value.getMinutes(), clength )
				);
				break;
			case "s":
				// Seconds with no leading zero for single-digit seconds
			case "ss":
				// Seconds with leading zero for single-digit seconds
				ret.push(
					padZeros( value.getSeconds(), clength )
				);
				break;
			case "t":
				// One character am/pm indicator ("a" or "p")
			case "tt":
				// Multicharacter am/pm indicator
				part = value.getHours() < 12 ? ( cal.AM ? cal.AM[0] : " " ) : ( cal.PM ? cal.PM[0] : " " );
				ret.push( clength === 1 ? part.charAt(0) : part );
				break;
			case "f":
				// Deciseconds
			case "ff":
				// Centiseconds
			case "fff":
				// Milliseconds
				ret.push(
					padZeros( value.getMilliseconds(), 3 ).substr( 0, clength )
				);
				break;
			case "z":
				// Time zone offset, no leading zero
			case "zz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), clength )
				);
				break;
			case "zzz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), 2 ) +
					// Hard coded ":" separator, rather than using cal.TimeSeparator
					// Repeated here for consistency, plus ":" was already assumed in date parsing.
					":" + padZeros( Math.abs(value.getTimezoneOffset() % 60), 2 )
				);
				break;
			case "g":
			case "gg":
				if ( cal.eras ) {
					ret.push(
						cal.eras[ getEra(value, eras) ].name
					);
				}
				break;
		case "/":
			ret.push( cal["/"] );
			break;
		default:
			throw "Invalid date format pattern \'" + current + "\'.";
		}
	}
	return ret.join( "" );
};

// formatNumber
(function() {
	var expandNumber;

	expandNumber = function( number, precision, formatInfo ) {
		var groupSizes = formatInfo.groupSizes,
			curSize = groupSizes[ 0 ],
			curGroupIndex = 1,
			factor = Math.pow( 10, precision ),
			rounded = Math.round( number * factor ) / factor;

		if ( !isFinite(rounded) ) {
			rounded = number;
		}
		number = rounded;

		var numberString = number+"",
			right = "",
			split = numberString.split( /e/i ),
			exponent = split.length > 1 ? parseInt( split[1], 10 ) : 0;
		numberString = split[ 0 ];
		split = numberString.split( "." );
		numberString = split[ 0 ];
		right = split.length > 1 ? split[ 1 ] : "";

		if ( exponent > 0 ) {
			right = zeroPad( right, exponent, false );
			numberString += right.slice( 0, exponent );
			right = right.substr( exponent );
		}
		else if ( exponent < 0 ) {
			exponent = -exponent;
			numberString = zeroPad( numberString, exponent + 1, true );
			right = numberString.slice( -exponent, numberString.length ) + right;
			numberString = numberString.slice( 0, -exponent );
		}

		if ( precision > 0 ) {
			right = formatInfo[ "." ] +
				( (right.length > precision) ? right.slice(0, precision) : zeroPad(right, precision) );
		}
		else {
			right = "";
		}

		var stringIndex = numberString.length - 1,
			sep = formatInfo[ "," ],
			ret = "";

		while ( stringIndex >= 0 ) {
			if ( curSize === 0 || curSize > stringIndex ) {
				return numberString.slice( 0, stringIndex + 1 ) + ( ret.length ? (sep + ret + right) : right );
			}
			ret = numberString.slice( stringIndex - curSize + 1, stringIndex + 1 ) + ( ret.length ? (sep + ret) : "" );

			stringIndex -= curSize;

			if ( curGroupIndex < groupSizes.length ) {
				curSize = groupSizes[ curGroupIndex ];
				curGroupIndex++;
			}
		}

		return numberString.slice( 0, stringIndex + 1 ) + sep + ret + right;
	};

	formatNumber = function( value, format, culture ) {
		if ( !isFinite(value) ) {
			if ( value === Infinity ) {
				return culture.numberFormat.positiveInfinity;
			}
			if ( value === -Infinity ) {
				return culture.numberFormat.negativeInfinity;
			}
			return culture.numberFormat.NaN;
		}
		if ( !format || format === "i" ) {
			return culture.name.length ? value.toLocaleString() : value.toString();
		}
		format = format || "D";

		var nf = culture.numberFormat,
			number = Math.abs( value ),
			precision = -1,
			pattern;
		if ( format.length > 1 ) precision = parseInt( format.slice(1), 10 );

		var current = format.charAt( 0 ).toUpperCase(),
			formatInfo;

		switch ( current ) {
			case "D":
				pattern = "n";
				number = truncate( number );
				if ( precision !== -1 ) {
					number = zeroPad( "" + number, precision, true );
				}
				if ( value < 0 ) number = "-" + number;
				break;
			case "N":
				formatInfo = nf;
				/* falls through */
			case "C":
				formatInfo = formatInfo || nf.currency;
				/* falls through */
			case "P":
				formatInfo = formatInfo || nf.percent;
				pattern = value < 0 ? formatInfo.pattern[ 0 ] : ( formatInfo.pattern[1] || "n" );
				if ( precision === -1 ) precision = formatInfo.decimals;
				number = expandNumber( number * (current === "P" ? 100 : 1), precision, formatInfo );
				break;
			default:
				throw "Bad number format specifier: " + current;
		}

		var patternParts = /n|\$|-|%/g,
			ret = "";
		for ( ; ; ) {
			var index = patternParts.lastIndex,
				ar = patternParts.exec( pattern );

			ret += pattern.slice( index, ar ? ar.index : pattern.length );

			if ( !ar ) {
				break;
			}

			switch ( ar[0] ) {
				case "n":
					ret += number;
					break;
				case "$":
					ret += nf.currency.symbol;
					break;
				case "-":
					// don't make 0 negative
					if ( /[1-9]/.test(number) ) {
						ret += nf[ "-" ];
					}
					break;
				case "%":
					ret += nf.percent.symbol;
					break;
			}
		}

		return ret;
	};

}());

getTokenRegExp = function() {
	// regular expression for matching date and time tokens in format strings.
	return (/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g);
};

getEra = function( date, eras ) {
	if ( !eras ) return 0;
	var start, ticks = date.getTime();
	for ( var i = 0, l = eras.length; i < l; i++ ) {
		start = eras[ i ].start;
		if ( start === null || ticks >= start ) {
			return i;
		}
	}
	return 0;
};

getEraYear = function( date, cal, era, sortable ) {
	var year = date.getFullYear();
	if ( !sortable && cal.eras ) {
		// convert normal gregorian year to era-shifted gregorian
		// year by subtracting the era offset
		year -= cal.eras[ era ].offset;
	}
	return year;
};

// parseExact
(function() {
	var expandYear,
		getDayIndex,
		getMonthIndex,
		getParseRegExp,
		outOfRange,
		toUpper,
		toUpperArray;

	expandYear = function( cal, year ) {
		// expands 2-digit year into 4 digits.
		if ( year < 100 ) {
			var now = new Date(),
				era = getEra( now ),
				curr = getEraYear( now, cal, era ),
				twoDigitYearMax = cal.twoDigitYearMax;
			twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt( twoDigitYearMax, 10 ) : twoDigitYearMax;
			year += curr - ( curr % 100 );
			if ( year > twoDigitYearMax ) {
				year -= 100;
			}
		}
		return year;
	};

	getDayIndex = function	( cal, value, abbr ) {
		var ret,
			days = cal.days,
			upperDays = cal._upperDays;
		if ( !upperDays ) {
			cal._upperDays = upperDays = [
				toUpperArray( days.names ),
				toUpperArray( days.namesAbbr ),
				toUpperArray( days.namesShort )
			];
		}
		value = toUpper( value );
		if ( abbr ) {
			ret = arrayIndexOf( upperDays[1], value );
			if ( ret === -1 ) {
				ret = arrayIndexOf( upperDays[2], value );
			}
		}
		else {
			ret = arrayIndexOf( upperDays[0], value );
		}
		return ret;
	};

	getMonthIndex = function( cal, value, abbr ) {
		var months = cal.months,
			monthsGen = cal.monthsGenitive || cal.months,
			upperMonths = cal._upperMonths,
			upperMonthsGen = cal._upperMonthsGen;
		if ( !upperMonths ) {
			cal._upperMonths = upperMonths = [
				toUpperArray( months.names ),
				toUpperArray( months.namesAbbr )
			];
			cal._upperMonthsGen = upperMonthsGen = [
				toUpperArray( monthsGen.names ),
				toUpperArray( monthsGen.namesAbbr )
			];
		}
		value = toUpper( value );
		var i = arrayIndexOf( abbr ? upperMonths[1] : upperMonths[0], value );
		if ( i < 0 ) {
			i = arrayIndexOf( abbr ? upperMonthsGen[1] : upperMonthsGen[0], value );
		}
		return i;
	};

	getParseRegExp = function( cal, format ) {
		// converts a format string into a regular expression with groups that
		// can be used to extract date fields from a date string.
		// check for a cached parse regex.
		var re = cal._parseRegExp;
		if ( !re ) {
			cal._parseRegExp = re = {};
		}
		else {
			var reFormat = re[ format ];
			if ( reFormat ) {
				return reFormat;
			}
		}

		// expand single digit formats, then escape regular expression characters.
		var expFormat = expandFormat( cal, format ).replace( /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1" ),
			regexp = [ "^" ],
			groups = [],
			index = 0,
			quoteCount = 0,
			tokenRegExp = getTokenRegExp(),
			match;

		// iterate through each date token found.
		while ( (match = tokenRegExp.exec(expFormat)) !== null ) {
			var preMatch = expFormat.slice( index, match.index );
			index = tokenRegExp.lastIndex;

			// don't replace any matches that occur inside a string literal.
			quoteCount += appendPreOrPostMatch( preMatch, regexp );
			if ( quoteCount % 2 ) {
				regexp.push( match[0] );
				continue;
			}

			// add a regex group for the token.
			var m = match[ 0 ],
				len = m.length,
				add;
			switch ( m ) {
				case "dddd": case "ddd":
				case "MMMM": case "MMM":
				case "gg": case "g":
					add = "(\\D+)";
					break;
				case "tt": case "t":
					add = "(\\D*)";
					break;
				case "yyyy":
				case "fff":
				case "ff":
				case "f":
					add = "(\\d{" + len + "})";
					break;
				case "dd": case "d":
				case "MM": case "M":
				case "yy": case "y":
				case "HH": case "H":
				case "hh": case "h":
				case "mm": case "m":
				case "ss": case "s":
					add = "(\\d\\d?)";
					break;
				case "zzz":
					add = "([+-]?\\d\\d?:\\d{2})";
					break;
				case "zz": case "z":
					add = "([+-]?\\d\\d?)";
					break;
				case "/":
					add = "(\\/)";
					break;
				default:
					throw "Invalid date format pattern \'" + m + "\'.";
			}
			if ( add ) {
				regexp.push( add );
			}
			groups.push( match[0] );
		}
		appendPreOrPostMatch( expFormat.slice(index), regexp );
		regexp.push( "$" );

		// allow whitespace to differ when matching formats.
		var regexpStr = regexp.join( "" ).replace( /\s+/g, "\\s+" ),
			parseRegExp = { "regExp": regexpStr, "groups": groups };

		// cache the regex for this format.
		return re[ format ] = parseRegExp;
	};

	outOfRange = function( value, low, high ) {
		return value < low || value > high;
	};

	toUpper = function( value ) {
		// "he-IL" has non-breaking space in weekday names.
		return value.split( "\u00A0" ).join( " " ).toUpperCase();
	};

	toUpperArray = function( arr ) {
		var results = [];
		for ( var i = 0, l = arr.length; i < l; i++ ) {
			results[ i ] = toUpper( arr[i] );
		}
		return results;
	};

	parseExact = function( value, format, culture ) {
		// try to parse the date string by matching against the format string
		// while using the specified culture for date field names.
		value = trim( value );
		var cal = culture.calendar,
			// convert date formats into regular expressions with groupings.
			// use the regexp to determine the input format and extract the date fields.
			parseInfo = getParseRegExp( cal, format ),
			match = new RegExp( parseInfo.regExp ).exec( value );
		if ( match === null ) {
			return null;
		}
		// found a date format that matches the input.
		var groups = parseInfo.groups,
			era = null, year = null, month = null, date = null, weekDay = null,
			hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
			pmHour = false;
		// iterate the format groups to extract and set the date fields.
		for ( var j = 0, jl = groups.length; j < jl; j++ ) {
			var matchGroup = match[ j + 1 ];
			if ( matchGroup ) {
				var current = groups[ j ],
					clength = current.length,
					matchInt = parseInt( matchGroup, 10 );
				switch ( current ) {
					case "dd": case "d":
						// Day of month.
						date = matchInt;
						// check that date is generally in valid range, also checking overflow below.
						if ( outOfRange(date, 1, 31) ) return null;
						break;
					case "MMM": case "MMMM":
						month = getMonthIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "M": case "MM":
						// Month.
						month = matchInt - 1;
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "y": case "yy":
					case "yyyy":
						year = clength < 4 ? expandYear( cal, matchInt ) : matchInt;
						if ( outOfRange(year, 0, 9999) ) return null;
						break;
					case "h": case "hh":
						// Hours (12-hour clock).
						hour = matchInt;
						if ( hour === 12 ) hour = 0;
						if ( outOfRange(hour, 0, 11) ) return null;
						break;
					case "H": case "HH":
						// Hours (24-hour clock).
						hour = matchInt;
						if ( outOfRange(hour, 0, 23) ) return null;
						break;
					case "m": case "mm":
						// Minutes.
						min = matchInt;
						if ( outOfRange(min, 0, 59) ) return null;
						break;
					case "s": case "ss":
						// Seconds.
						sec = matchInt;
						if ( outOfRange(sec, 0, 59) ) return null;
						break;
					case "tt": case "t":
						// AM/PM designator.
						// see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
						// the AM tokens. If not, fail the parse for this format.
						pmHour = cal.PM && ( matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2] );
						if (
							!pmHour && (
								!cal.AM || ( matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2] )
							)
						) return null;
						break;
					case "f":
						// Deciseconds.
					case "ff":
						// Centiseconds.
					case "fff":
						// Milliseconds.
						msec = matchInt * Math.pow( 10, 3 - clength );
						if ( outOfRange(msec, 0, 999) ) return null;
						break;
					case "ddd":
						// Day of week.
					case "dddd":
						// Day of week.
						weekDay = getDayIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(weekDay, 0, 6) ) return null;
						break;
					case "zzz":
						// Time zone offset in +/- hours:min.
						var offsets = matchGroup.split( /:/ );
						if ( offsets.length !== 2 ) return null;
						hourOffset = parseInt( offsets[0], 10 );
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						var minOffset = parseInt( offsets[1], 10 );
						if ( outOfRange(minOffset, 0, 59) ) return null;
						tzMinOffset = ( hourOffset * 60 ) + ( startsWith(matchGroup, "-") ? -minOffset : minOffset );
						break;
					case "z": case "zz":
						// Time zone offset in +/- hours.
						hourOffset = matchInt;
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						tzMinOffset = hourOffset * 60;
						break;
					case "g": case "gg":
						var eraName = matchGroup;
						if ( !eraName || !cal.eras ) return null;
						eraName = trim( eraName.toLowerCase() );
						for ( var i = 0, l = cal.eras.length; i < l; i++ ) {
							if ( eraName === cal.eras[i].name.toLowerCase() ) {
								era = i;
								break;
							}
						}
						// could not find an era with that name
						if ( era === null ) return null;
						break;
				}
			}
		}
		var result = new Date(), defaultYear, convert = cal.convert;
		defaultYear = convert ? convert.fromGregorian( result )[ 0 ] : result.getFullYear();
		if ( year === null ) {
			year = defaultYear;
		}
		else if ( cal.eras ) {
			// year must be shifted to normal gregorian year
			// but not if year was not specified, its already normal gregorian
			// per the main if clause above.
			year += cal.eras[( era || 0 )].offset;
		}
		// set default day and month to 1 and January, so if unspecified, these are the defaults
		// instead of the current day/month.
		if ( month === null ) {
			month = 0;
		}
		if ( date === null ) {
			date = 1;
		}
		// now have year, month, and date, but in the culture's calendar.
		// convert to gregorian if necessary
		if ( convert ) {
			result = convert.toGregorian( year, month, date );
			// conversion failed, must be an invalid match
			if ( result === null ) return null;
		}
		else {
			// have to set year, month and date together to avoid overflow based on current date.
			result.setFullYear( year, month, date );
			// check to see if date overflowed for specified month (only checked 1-31 above).
			if ( result.getDate() !== date ) return null;
			// invalid day of week.
			if ( weekDay !== null && result.getDay() !== weekDay ) {
				return null;
			}
		}
		// if pm designator token was found make sure the hours fit the 24-hour clock.
		if ( pmHour && hour < 12 ) {
			hour += 12;
		}
		result.setHours( hour, min, sec, msec );
		if ( tzMinOffset !== null ) {
			// adjust timezone to utc before applying local offset.
			var adjustedMin = result.getMinutes() - ( tzMinOffset + result.getTimezoneOffset() );
			// Safari limits hours and minutes to the range of -127 to 127.  We need to use setHours
			// to ensure both these fields will not exceed this range.	adjustedMin will range
			// somewhere between -1440 and 1500, so we only need to split this into hours.
			result.setHours( result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60 );
		}
		return result;
	};
}());

parseNegativePattern = function( value, nf, negativePattern ) {
	var neg = nf[ "-" ],
		pos = nf[ "+" ],
		ret;
	switch ( negativePattern ) {
		case "n -":
			neg = " " + neg;
			pos = " " + pos;
			/* falls through */
		case "n-":
			if ( endsWith(value, neg) ) {
				ret = [ "-", value.substr(0, value.length - neg.length) ];
			}
			else if ( endsWith(value, pos) ) {
				ret = [ "+", value.substr(0, value.length - pos.length) ];
			}
			break;
		case "- n":
			neg += " ";
			pos += " ";
			/* falls through */
		case "-n":
			if ( startsWith(value, neg) ) {
				ret = [ "-", value.substr(neg.length) ];
			}
			else if ( startsWith(value, pos) ) {
				ret = [ "+", value.substr(pos.length) ];
			}
			break;
		case "(n)":
			if ( startsWith(value, "(") && endsWith(value, ")") ) {
				ret = [ "-", value.substr(1, value.length - 2) ];
			}
			break;
	}
	return ret || [ "", value ];
};

//
// public instance functions
//

Globalize.prototype.findClosestCulture = function( cultureSelector ) {
	return Globalize.findClosestCulture.call( this, cultureSelector );
};

Globalize.prototype.format = function( value, format, cultureSelector ) {
	return Globalize.format.call( this, value, format, cultureSelector );
};

Globalize.prototype.localize = function( key, cultureSelector ) {
	return Globalize.localize.call( this, key, cultureSelector );
};

Globalize.prototype.parseInt = function( value, radix, cultureSelector ) {
	return Globalize.parseInt.call( this, value, radix, cultureSelector );
};

Globalize.prototype.parseFloat = function( value, radix, cultureSelector ) {
	return Globalize.parseFloat.call( this, value, radix, cultureSelector );
};

Globalize.prototype.culture = function( cultureSelector ) {
	return Globalize.culture.call( this, cultureSelector );
};

//
// public singleton functions
//

Globalize.addCultureInfo = function( cultureName, baseCultureName, info ) {

	var base = {},
		isNew = false;

	if ( typeof cultureName !== "string" ) {
		// cultureName argument is optional string. If not specified, assume info is first
		// and only argument. Specified info deep-extends current culture.
		info = cultureName;
		cultureName = this.culture().name;
		base = this.cultures[ cultureName ];
	} else if ( typeof baseCultureName !== "string" ) {
		// baseCultureName argument is optional string. If not specified, assume info is second
		// argument. Specified info deep-extends specified culture.
		// If specified culture does not exist, create by deep-extending default
		info = baseCultureName;
		isNew = ( this.cultures[ cultureName ] == null );
		base = this.cultures[ cultureName ] || this.cultures[ "default" ];
	} else {
		// cultureName and baseCultureName specified. Assume a new culture is being created
		// by deep-extending an specified base culture
		isNew = true;
		base = this.cultures[ baseCultureName ];
	}

	this.cultures[ cultureName ] = extend(true, {},
		base,
		info
	);
	// Make the standard calendar the current culture if it's a new culture
	if ( isNew ) {
		this.cultures[ cultureName ].calendar = this.cultures[ cultureName ].calendars.standard;
	}
};

Globalize.findClosestCulture = function( name ) {
	var match;
	if ( !name ) {
		return this.findClosestCulture( this.cultureSelector ) || this.cultures[ "default" ];
	}
	if ( typeof name === "string" ) {
		name = name.split( "," );
	}
	if ( isArray(name) ) {
		var lang,
			cultures = this.cultures,
			list = name,
			i, l = list.length,
			prioritized = [];
		for ( i = 0; i < l; i++ ) {
			name = trim( list[i] );
			var pri, parts = name.split( ";" );
			lang = trim( parts[0] );
			if ( parts.length === 1 ) {
				pri = 1;
			}
			else {
				name = trim( parts[1] );
				if ( name.indexOf("q=") === 0 ) {
					name = name.substr( 2 );
					pri = parseFloat( name );
					pri = isNaN( pri ) ? 0 : pri;
				}
				else {
					pri = 1;
				}
			}
			prioritized.push({ lang: lang, pri: pri });
		}
		prioritized.sort(function( a, b ) {
			if ( a.pri < b.pri ) {
				return 1;
			} else if ( a.pri > b.pri ) {
				return -1;
			}
			return 0;
		});
		// exact match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			match = cultures[ lang ];
			if ( match ) {
				return match;
			}
		}

		// neutral language match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			do {
				var index = lang.lastIndexOf( "-" );
				if ( index === -1 ) {
					break;
				}
				// strip off the last part. e.g. en-US => en
				lang = lang.substr( 0, index );
				match = cultures[ lang ];
				if ( match ) {
					return match;
				}
			}
			while ( 1 );
		}

		// last resort: match first culture using that language
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			for ( var cultureKey in cultures ) {
				var culture = cultures[ cultureKey ];
				if ( culture.language === lang ) {
					return culture;
				}
			}
		}
	}
	else if ( typeof name === "object" ) {
		return name;
	}
	return match || null;
};

Globalize.format = function( value, format, cultureSelector ) {
	var culture = this.findClosestCulture( cultureSelector );
	if ( value instanceof Date ) {
		value = formatDate( value, format, culture );
	}
	else if ( typeof value === "number" ) {
		value = formatNumber( value, format, culture );
	}
	return value;
};

Globalize.localize = function( key, cultureSelector ) {
	return this.findClosestCulture( cultureSelector ).messages[ key ] ||
		this.cultures[ "default" ].messages[ key ];
};

Globalize.parseDate = function( value, formats, culture ) {
	culture = this.findClosestCulture( culture );

	var date, prop, patterns;
	if ( formats ) {
		if ( typeof formats === "string" ) {
			formats = [ formats ];
		}
		if ( formats.length ) {
			for ( var i = 0, l = formats.length; i < l; i++ ) {
				var format = formats[ i ];
				if ( format ) {
					date = parseExact( value, format, culture );
					if ( date ) {
						break;
					}
				}
			}
		}
	} else {
		patterns = culture.calendar.patterns;
		for ( prop in patterns ) {
			date = parseExact( value, patterns[prop], culture );
			if ( date ) {
				break;
			}
		}
	}

	return date || null;
};

Globalize.parseInt = function( value, radix, cultureSelector ) {
	return truncate( Globalize.parseFloat(value, radix, cultureSelector) );
};

Globalize.parseFloat = function( value, radix, cultureSelector ) {
	// radix argument is optional
	if ( typeof radix !== "number" ) {
		cultureSelector = radix;
		radix = 10;
	}

	var culture = this.findClosestCulture( cultureSelector );
	var ret = NaN,
		nf = culture.numberFormat;

	if ( value.indexOf(culture.numberFormat.currency.symbol) > -1 ) {
		// remove currency symbol
		value = value.replace( culture.numberFormat.currency.symbol, "" );
		// replace decimal seperator
		value = value.replace( culture.numberFormat.currency["."], culture.numberFormat["."] );
	}

	//Remove percentage character from number string before parsing
	if ( value.indexOf(culture.numberFormat.percent.symbol) > -1){
		value = value.replace( culture.numberFormat.percent.symbol, "" );
	}

	// remove spaces: leading, trailing and between - and number. Used for negative currency pt-BR
	value = value.replace( / /g, "" );

	// allow infinity or hexidecimal
	if ( regexInfinity.test(value) ) {
		ret = parseFloat( value );
	}
	else if ( !radix && regexHex.test(value) ) {
		ret = parseInt( value, 16 );
	}
	else {

		// determine sign and number
		var signInfo = parseNegativePattern( value, nf, nf.pattern[0] ),
			sign = signInfo[ 0 ],
			num = signInfo[ 1 ];

		// #44 - try parsing as "(n)"
		if ( sign === "" && nf.pattern[0] !== "(n)" ) {
			signInfo = parseNegativePattern( value, nf, "(n)" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		// try parsing as "-n"
		if ( sign === "" && nf.pattern[0] !== "-n" ) {
			signInfo = parseNegativePattern( value, nf, "-n" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		sign = sign || "+";

		// determine exponent and number
		var exponent,
			intAndFraction,
			exponentPos = num.indexOf( "e" );
		if ( exponentPos < 0 ) exponentPos = num.indexOf( "E" );
		if ( exponentPos < 0 ) {
			intAndFraction = num;
			exponent = null;
		}
		else {
			intAndFraction = num.substr( 0, exponentPos );
			exponent = num.substr( exponentPos + 1 );
		}
		// determine decimal position
		var integer,
			fraction,
			decSep = nf[ "." ],
			decimalPos = intAndFraction.indexOf( decSep );
		if ( decimalPos < 0 ) {
			integer = intAndFraction;
			fraction = null;
		}
		else {
			integer = intAndFraction.substr( 0, decimalPos );
			fraction = intAndFraction.substr( decimalPos + decSep.length );
		}
		// handle groups (e.g. 1,000,000)
		var groupSep = nf[ "," ];
		integer = integer.split( groupSep ).join( "" );
		var altGroupSep = groupSep.replace( /\u00A0/g, " " );
		if ( groupSep !== altGroupSep ) {
			integer = integer.split( altGroupSep ).join( "" );
		}
		// build a natively parsable number string
		var p = sign + integer;
		if ( fraction !== null ) {
			p += "." + fraction;
		}
		if ( exponent !== null ) {
			// exponent itself may have a number patternd
			var expSignInfo = parseNegativePattern( exponent, nf, "-n" );
			p += "e" + ( expSignInfo[0] || "+" ) + expSignInfo[ 1 ];
		}
		if ( regexParseFloat.test(p) ) {
			ret = parseFloat( p );
		}
	}
	return ret;
};

Globalize.culture = function( cultureSelector ) {
	// setter
	if ( typeof cultureSelector !== "undefined" ) {
		this.cultureSelector = cultureSelector;
	}
	// getter
	return this.findClosestCulture( cultureSelector ) || this.cultures[ "default" ];
};

}( this ));
/// <reference path="SDL.Globalize.ts" />
SDL.Globalize.initializeNoConflict();
//@ sourceMappingURL=SDL.Globalize.init.js.map
/*! @namespace {SDL.Client.MessageCenter} */
SDL.Client.Type.registerNamespace("SDL.Client.MessageCenter");

SDL.Client.MessageCenter.MessageType =
{
	NOTIFICATION: "notification",
	ERROR: "error",
	WARNING: "warning",
	QUESTION: "question",
	PROGRESS: "progress",
	GOAL: "goal"
}
SDL.Client.MessageCenter.MessageTypesRegistry = { };

SDL.Client.MessageCenter.localMessages = [];

SDL.Client.MessageCenter.getInstance = function SDL$Client$MessageCenter$getInstance()
{
	throw Error("SDL.Client.MessageCenter.getInstance() method is not implemented.");
};

SDL.Client.MessageCenter.createMessage = function SDL$Client$MessageCenter$createMessage(messageType, title, description, options)
{
	var msg = this.getInstance().createMessage(messageType, title, description, options);
	if (msg && options && options.localToWindow)
	{
		SDL.Client.MessageCenter.localMessages.push(msg.getId());
	}
	return msg;
};

SDL.Client.MessageCenter.registerMessage = function SDL$Client$MessageCenter$registerMessage(type, title, description, options)
{
	var msg = this.createMessage(type, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.registerNotification = function SDL$Client$MessageCenter$registerNotification(title, description, options)
{
	var msg = this.createMessage(SDL.Client.MessageCenter.MessageType.NOTIFICATION, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.registerError = function SDL$Client$MessageCenter$registerError(title, description, options)
{
	var msg = this.createMessage(SDL.Client.MessageCenter.MessageType.ERROR, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.registerException = function SDL$Client$MessageCenter$registerException(exception, options)
{
	this.registerError(exception.getMessage(), exception.getDescription(), options);
};

SDL.Client.MessageCenter.registerWarning = function SDL$Client$MessageCenter$registerWarning(title, description, options)
{
	var msg = this.createMessage(SDL.Client.MessageCenter.MessageType.WARNING, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.registerQuestion = function SDL$Client$MessageCenter$registerQuestion(title, description, options)
{
	var msg = this.createMessage(SDL.Client.MessageCenter.MessageType.QUESTION, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.registerProgress = function SDL$Client$MessageCenter$registerProgress(title, description, options)
{
	var msg = this.createMessage(SDL.Client.MessageCenter.MessageType.PROGRESS, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.registerGoal = function SDL$Client$MessageCenter$registerGoal(title, description, options)
{
	var msg = this.createMessage(SDL.Client.MessageCenter.MessageType.GOAL, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.getMessageByID = function SDL$Client$MessageCenter$getMessageByID(id)
{
	var instance = this.getInstance();
	if (instance)
	{
		return instance.getMessageByID(id);
	}
};

SDL.Client.MessageCenter.getMessages = function SDL$Client$MessageCenter$getMessages()
{
	return this.getInstance().getMessages();
};

SDL.Client.MessageCenter.getActiveMessages = function SDL$Client$MessageCenter$getActiveMessages()
{
	return this.getInstance().getActiveMessages();
};

SDL.Client.MessageCenter.executeAction = function SDL$Client$MessageCenter$executeAction(messageID, action, params)
{
	this.getInstance().executeAction(messageID, action, params);
};

SDL.Client.MessageCenter.addEventListener = function SDL$Client$MessageCenter$addEventListener(event, handler)
{
	SDL.Client.Event.EventRegister.addEventHandler(this.getInstance(), event, handler);
};

SDL.Client.MessageCenter.removeEventListener = function SDL$Client$MessageCenter$removeEventListener(event, handler)
{
	var instance = this.getInstance();
	if (instance)
	{
		SDL.Client.Event.EventRegister.removeEventHandler(instance, event, handler);
	}
};

SDL.Client.MessageCenter.archiveLocalMessages = function SDL$Client$MessageCenter$archiveLocalMessages()
{
	var messages = SDL.Client.MessageCenter.localMessages;
	if (messages.length)
	{
		var instance = SDL.Client.MessageCenter.getInstance();
		for (var i = 0; i < messages.length; i++)
		{
			instance.executeAction("archive", messages[i]);
		}
	}
};
SDL.Client.Event.EventRegister.addEventHandler(window, "unload", SDL.Client.MessageCenter.archiveLocalMessages);/*! @namespace {SDL.Client.Models.MarshallableArray} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MarshallableArray");

SDL.Client.Models.MarshallableArray.$constructor = function SDL$Client$Models$MarshallableArray$constructor()
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	this.properties.array = [];
};

SDL.Client.Models.MarshallableArray.prototype.getArray = function SDL$Client$Models$MarshallableArray$getArray()
{
	return this.properties.array;
};

SDL.Client.Models.MarshallableArray.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MarshallableArray$pack()
{
	return {array: this.properties.array};
});

SDL.Client.Models.MarshallableArray.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MarshallableArray$unpack(data)
{
	if (data && data.array)
	{
		this.properties.array = SDL.Client.Types.Array.clone(data.array);
	}
});/*! @namespace {SDL.Client.Models.MarshallableObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MarshallableObject");

SDL.Client.Models.MarshallableObject.$constructor = function SDL$Client$Models$MarshallableObject$constructor()
{
	this.addInterface("SDL.Client.Types.ObjectWithEvents");

	this.properties.target;
	this.properties.marshalling;

	//Copy the block within the comment below to a class implementing SDL.Client.Models.MarshallableObject
	/*

	// [optional]
	// implement pack whenever needed for marshalling
	this.pack = SDL.Client.Types.OO.nonInheritable(function()
	{
		return null;	// returns an object that packs private variables
	});

	// [optional]
	// implement unpack whenever needed for marshalling
	this.unpack = SDL.Client.Types.OO.nonInheritable(function(data)
	{
		//gets an object and unpacks it to private variables, making sure all object (reference type) variables are recreated locally
	});
	*/
};

SDL.Client.Models.MarshallableObject.prototype.getMarshalObject = function SDL$Client$Models$MarshallableObject$getMarshalObject()
{
	return this.properties.target;
};

SDL.Client.Models.MarshallableObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MarshallableObject$pack()
{
	var properties = this.properties;
	return {"handlers": properties.handlers};
});

SDL.Client.Models.MarshallableObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MarshallableObject$unpack(data)
{
	if (data && data.handlers)
	{
		var handlers = {};
		var events = data.handlers;
		for (var e in events)
		{
			var h = events[e];
			var tmp = handlers[e] = [];
			for (var i = 0; i < h.length; i++)
			{
				tmp[i] = {fnc: h[i].fnc};
			}
		}
		this.properties.handlers = handlers;
	}
});

SDL.Client.Models.MarshallableObject.prototype._marshalData = function SDL$Client$Models$MarshallableObject$_marshalData(target)
{
	var p = this.properties;
	p.marshalling = true;
	p.target = target;
	var targetInterfaces = target.interfaces;
	var sourceInterfaces = this.interfaces;
	if (sourceInterfaces && targetInterfaces)
	{
		for (var iface in targetInterfaces)
		{
			var targetBase = targetInterfaces[iface];
			var sourceBase = sourceInterfaces[iface];
			if (targetBase.unpack && sourceBase.pack)
			{
				try
				{
					targetBase.unpack(sourceBase.pack());
				}
				catch (err)
				{
					alert("Failed to marshal interface \"" + iface + "\": " + err.message);
				}
			}
		}
	}
	p.marshalling = false;
	this.fireEvent("marshal");
	p.handlers = undefined;	// after marshalling the target object is responsible for firing all events
};

SDL.Client.Models.MarshallableObject.prototype._initializeMarshalledObject = function SDL$Client$Models$MarshallableObject$_initializeMarshalledObject(object)
{
	if (object && object._marshalData && this.getTypeName() == object.getTypeName())
	{
		object._marshalData(this);
		this.callInterfaces("afterInitializeMarshalledObject", [object]);
		return true;
	}
};

SDL.Client.Models.MarshallableObject.prototype.isMarshalling = function SDL$Client$Models$MarshallableObject$isMarshalling()
{
	return this.properties.marshalling || false;
};/*! @namespace {SDL.Client.Models.IdentifiableObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.IdentifiableObject");

/*
	Adds an identifier (ID) to an object.
*/
SDL.Client.Models.IdentifiableObject.$constructor = function SDL$Client$Models$IdentifiableObject$constructor(id)
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	var p = this.properties;
	p.id = id;
};

/*
	Returns the ID of the object.
*/
SDL.Client.Models.IdentifiableObject.prototype.getId = function SDL$Client$Models$IdentifiableObject$getId()
{
	return this.properties.id;
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.IdentifiableObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$IdentifiableObject$pack()
{
	var p = this.properties;
	return {
		id: p.id
	};
});

SDL.Client.Models.IdentifiableObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$IdentifiableObject$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.id = data.id;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides
/*! @namespace {SDL.Client.Models.ModelObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.ModelObject");

/*
	Makes an object "model-aware".
	Model object knows its implementing model (model factory), its own item type, it can be marshalled and trigger events.
*/
SDL.Client.Models.ModelObject.$constructor = function SDL$Client$Models$ModelObject$constructor(id)
{
	SDL.Client.Diagnostics.Assert.areEqual(SDL.Client.Models.getRepositoryOwningWindow(), window,
		"An object of type SDL.Client.Models.ModelObject can only be created in the context of ModelRepository");

	this.addInterface("SDL.Client.Models.IdentifiableObject", [id]);

	var p = this.properties;
	p.modelFactory;
	p.itemType;
};

/*
	Returns the Model object that manages the current item.
	Different models can be registered with the system, each managing a specific domain.
	A Model is determined based on the item ID (the prefix used in the ID).
*/
SDL.Client.Models.ModelObject.prototype.getModelFactory = function SDL$Client$Models$ModelObject$getModelFactory()
{
	var p = this.properties;
	if (p.modelFactory === undefined)
	{
		p.modelFactory = SDL.Client.Models.getModelFactory(this.getId());
	}
	return p.modelFactory;
};

/*
	Returns the string specifying the type of the item defined by the corresponding domain model.
*/
SDL.Client.Models.ModelObject.prototype.getItemType = function SDL$Client$Models$ModelObject$getItemType()
{
	var p = this.properties;
	if (p.itemType === undefined)
	{
		p.itemType = this.getModelFactory().getItemType(this.getId());
	}
	return p.itemType;
};/*! @namespace {SDL.Client.Models.CacheableObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.CacheableObject");

SDL.Client.Models.CacheableObject.$constructor = function SDL$Client$Models$CacheableObject$constructor()
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	var p = this.properties;
	p.timeStamps = {}; //times of loading of data, item can have multiple pieces of data cached separately
	p.maxAge;
};

SDL.Client.Models.CacheableObject.prototype.getMaxAge = function SDL$Client$Models$CacheableObject$getMaxAge()
{
	var p = this.properties;
	if (p.maxAge == undefined)
	{
		var interfaces = this.getInterfaceNames();
		var xpath = "//configuration/customSections/models:domainModels/models:caching/models:cache[(@implementation=\"" +
			interfaces.join("\" or @implementation=\"") + "\") and (number(@max-age) = @max-age) and (not(@priority) or number(@priority) = @priority)]";

		var settings = SDL.Client.Xml.selectNodes(SDL.Client.Configuration.ConfigurationManager.configuration, xpath);
		if (settings.length)
		{
			var maxAgeIndex = 0;
			var maxPrio = Number(settings[0].getAttribute("priority")) || 0;

			for (var i = 1, len = settings.length; i < len; i++)
			{
				var prio = Number(settings[i].getAttribute("priority")) || 0;
				if (prio > maxPrio)
				{
					maxAgeIndex = i;
					prio = maxPrio;
				}
			}
			p.maxAge = Number(settings[maxAgeIndex].getAttribute("max-age"));
		}
		else
		{
			p.maxAge = null;
		}
	}
	return p.maxAge;
};

SDL.Client.Models.CacheableObject.prototype.isCacheValid = function SDL$Client$Models$CacheableObject$isCacheValid(data)
{
	var maxAge = this.getMaxAge();
	return maxAge == undefined || (maxAge * 1000 > (new Date()).getTime() - this.getTimeStamp(data));
};

SDL.Client.Models.CacheableObject.prototype.invalidateCache = function SDL$Client$Models$CacheableObject$invalidateCache(data)
{
	if (data != undefined)
	{
		delete this.properties.timeStamps[data]
	}
	else
	{
		this.properties.timeStamps = {};
	}
};

/**
@return {Date}
*/
SDL.Client.Models.CacheableObject.prototype.getTimeStamp = function SDL$Client$Models$CacheableObject$getTimeStamp(data)
{
	return this.properties.timeStamps[data || ""] || 0;
};

SDL.Client.Models.CacheableObject.prototype.setTimeStamp = function SDL$Client$Models$CacheableObject$setTimeStamp(timeStamp, data)
{
	this.properties.timeStamps[data || ""] = timeStamp;
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.CacheableObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$CacheableObject$pack()
{
	var p = this.properties;
	return {
				timeStamps: p.timeStamps,
				maxAge: p.maxAge
			};
});

SDL.Client.Models.CacheableObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$CacheableObject$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.timeStamps = SDL.Client.Types.Object.clone(data.timeStamps);
		p.maxAge = data.maxAge;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides/*! @namespace {SDL.Client.Models.LoadableObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.LoadableObject");

/*
An interface that provides base implementation for loading and unloading an item.
It triggers related events (loading, load, loadfailed), manages item timestamp and its cached state.
Interfaces inheriting from SDL.Client.Models.LoadableObject will override _executeLoad() method
to implent the actual loading of data from a server and _processLoadResult() to handle the loaded data.
*/
SDL.Client.Models.LoadableObject.$constructor = function SDL$Client$Models$LoadableObject$constructor()
{
	this.addInterface("SDL.Client.Models.CacheableObject");

	var p = this.properties;
	p.loading = false;
	p.loaded = false;
};

SDL.Client.Models.LoadableObject.prototype._invalidateCachedState = function SDL$Client$Models$LoadableObject$_invalidateCachedState()
{
	this.callInterfaces("invalidateInterfaceCachedState");
	this.properties.loaded = false;
};

/*
Load object's data from the server.
If the data is already loaded the data will not be requested from the server and the method will return false.
Pass reload = true to force the loading of the data.
The method returns true of a request is made to the server.
When data is loaded the object will trigger "load" event if the operation was successfull
or "loadfailed" if loading did not succeed.
*/
SDL.Client.Models.LoadableObject.prototype.load = function SDL$Client$Models$LoadableObject$load(reload)
{
	if (!this.isLoading() && (reload || !this.isLoaded(true)))
	{
		this._setLoading();
		this._executeLoad(reload);
		return true;
	}
	else
	{
		return this.isLoading();
	}
};

/*
Invalidates the loaded data and triggers "unload" event.
*/
SDL.Client.Models.LoadableObject.prototype.unload = function SDL$Client$Models$LoadableObject$unload()
{
	this._invalidateCachedState();
	this.fireEvent("unload");
};

/*
Returns true if the object's data has been loaded from the server.
*/
SDL.Client.Models.LoadableObject.prototype.isLoaded = function SDL$Client$Models$LoadableObject$isLoaded(checkCacheValidity)
{
	return this.properties.loaded && (!checkCacheValidity || this.isCacheValid());
};

SDL.Client.Models.LoadableObject.prototype._setLoaded = function SDL$Client$Models$LoadableObject$_setLoaded()
{
	this.callInterfaces("beforeSetLoaded");
	this.properties.loading = false;
	this.properties.loaded = true;
	this.fireEvent("load");
	this.callInterfaces("afterSetLoaded");
};

/*
Returns true if object's data is being loaded from the server
*/
SDL.Client.Models.LoadableObject.prototype.isLoading = function SDL$Client$Models$LoadableObject$isLoading()
{
	return this.properties.loading;
};

SDL.Client.Models.LoadableObject.prototype._setLoading = function SDL$Client$Models$LoadableObject$_setLoading()
{
	this.properties.loading = true;
	this.fireEvent("loading");
};

SDL.Client.Models.LoadableObject.prototype._executeLoad = function SDL$Client$Models$LoadableObject$_executeLoad(reload)
{
	this._onLoad(); // to be overridden
};

SDL.Client.Models.LoadableObject.prototype._onLoad = function SDL$Client$Models$LoadableObject$_onLoad(result, webRequest)
{
	this._processLoadResult(result, webRequest);
	this.setTimeStamp(new Date().getTime());
	this._setLoaded();
};

SDL.Client.Models.LoadableObject.prototype._processLoadResult = function SDL$Client$Models$LoadableObject$_processLoadResult(result, webRequest)
{
	this._invalidateCachedState();
	// to be overridden
};

SDL.Client.Models.LoadableObject.prototype._onLoadFailed = function SDL$Client$Models$LoadableObject$_onLoadFailed(error, webRequest)
{
	var p = this.properties;
	p.loading = false;

	if (SDL.Client.Type.isString(error))
	{
		var errorCode = webRequest ? webRequest.statusCode : null;
		this.registerError(errorCode, error);
		this.fireEvent("loadfailed", { error: error, errorCode: errorCode });
	}
	else
	{
		if (!error.errorCode && webRequest)
		{
			error.errorCode = webRequest.statusCode;
		}
		this.registerError(error.errorCode, error.message);
		this.fireEvent("loadfailed", error);
	}
	this.callInterfaces("afterLoadFailed", [error, webRequest]);
};

SDL.Client.Models.LoadableObject.prototype.registerError = function SDL$Client$Models$LoadableObject$registerError(errorCode, errorMessage)
{
	SDL.Client.MessageCenter.registerException(new SDL.Client.Exception.Exception(errorCode, errorMessage));
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.LoadableObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$LoadableObject$pack()
{
	var p = this.properties;
	return {
		loading: p.loading,
		loaded: p.loaded
	};
});

SDL.Client.Models.LoadableObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$LoadableObject$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.loading = data.loading;
		p.loaded = data.loaded;
	}
});

SDL.Client.Models.LoadableObject.prototype.afterInitializeMarshalledObject = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$LoadableObject$afterInitializeMarshalledObject(object)
{
	var p = this.properties;
	if (p.loading)
	{
		// the item was loading before marshalling -> make sure it gets loaded in the new model repository
		p.loading = false;
		this.load(true);
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides
/*! @namespace {SDL.Client.Models.UpdatableObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.UpdatableObject");

/*
	Defines methods for an object to update its data based on data loaded by an {SDL.Client.Models.UpdatableListObject} object.
*/
SDL.Client.Models.UpdatableObject.$constructor = function SDL$Client$Models$UpdatableObject$constructor(id)
{
	this.addInterface("SDL.Client.Models.IdentifiableObject", [id]);
	this.addInterface("SDL.Client.Models.LoadableObject");

	var p = this.properties;
	p.lastUpdateCheckTimeStamp = 0;
};

/*
	Sets the timestamp (number) indicating the last time the item was updated with list data using setDataFromList() method.
	This timestamp is used to optimize the process of updating the item using list data: only {SDL.Client.Models.UpdatableListObject} lists that
	have been loaded later than the item's lastUpdateCheckTimeStamp will be queried to update the item.
*/
SDL.Client.Models.UpdatableObject.prototype.setLastUpdateCheckTimeStamp = function SDL$Client$Models$UpdatableObject$setLastUpdateCheckTimeStamp(timeStamp)
{
	this.properties.lastUpdateCheckTimeStamp = timeStamp;
};

/*
	Gets the timestamp (number) indicating the last time the item was updated with list data using setDataFromList() method.
	This timestamp is used to optimize the process of updating the item using list data: only {SDL.Client.Models.UpdatableListObject} lists that
	have been loaded later than the item's lastUpdateCheckTimeStamp will be queried to update the item.
*/
SDL.Client.Models.UpdatableObject.prototype.getLastUpdateCheckTimeStamp = function SDL$Client$Models$UpdatableObject$getLastUpdateCheckTimeStamp()
{
	return this.properties.lastUpdateCheckTimeStamp;
};


SDL.Client.Models.UpdatableObject.prototype.afterSetLoaded = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$UpdatableObject$afterSetLoaded()
{
	SDL.Client.Models.itemUpdated(this);
});


/*
	The method uses data loaded by an {SDL.Client.Models.UpdatableListObject} to initialize the cached state of the item without
	the need to load the full item data from the server.
*/
SDL.Client.Models.UpdatableObject.prototype.setDataFromList = function SDL$Client$Models$UpdatableObject$setDataFromList(data, parentId, timeStamp)
{
	if (!timeStamp || timeStamp > this.getTimeStamp())
	{
		this.updateData(data, parentId);

		if (timeStamp)
		{
			this.setTimeStamp(timeStamp);
		}
	}
};

/*
	The method uses the provided item data to set the cached state of the item.
*/
SDL.Client.Models.UpdatableObject.prototype.updateData = function SDL$Client$Models$UpdatableObject$updateData(data, parentId)
{
	// to be overriden
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.UpdatableObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$UpdatableObject$pack()
{
	var p = this.properties;
	return {
				lastUpdateCheckTimeStamp: p.lastUpdateCheckTimeStamp
			};
});
SDL.Client.Models.UpdatableObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$UpdatableObject$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.lastUpdateCheckTimeStamp = data.lastUpdateCheckTimeStamp;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides/*! @namespace {SDL.Client.Models.UpdatableListObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.UpdatableListObject");

/*
	An interface to define methods for a list object that can be dynamically updated when
	an item in the list is changed. SDL.Client.Models.UpdatableListObject will also notify {SDL.Client.Models.UpdatableObject}
	items in the list when new list data is loaded from the server.
	A list of SDL.Client.Models.UpdatableListObject objects is maintained in the ModelRepository. Whenever a new
	instance of {SDL.Client.Models.UpdatableObject} is cerated in the ModelRepository all SDL.Client.Models.UpdatableListObject's
	are queried for data for the item.
*/
SDL.Client.Models.UpdatableListObject.$constructor = function SDL$Client$Models$UpdatableListObject$constructor(id)
{
	this.addInterface("SDL.Client.Models.IdentifiableObject", [id]);
	this.addInterface("SDL.Client.Models.LoadableObject");
};

SDL.Client.Models.UpdatableListObject.prototype.beforeSetLoaded = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$UpdatableListObject$beforeSetLoaded()
{
	SDL.Client.Models.registerList(this);
});

SDL.Client.Models.UpdatableListObject.prototype.unload = function SDL$Client$Models$UpdatableListObject$unload()
{
	SDL.Client.Models.unregisterList(this);
	this.callBase("SDL.Client.Models.LoadableObject", "unload");
};

/*
	Informs the list that an item has been updated.
	Allows the list to update it's state and trigger "itemupdate" or "itemadd" event.
*/
SDL.Client.Models.UpdatableListObject.prototype.itemUpdated = function SDL$Client$Models$UpdatableListObject$itemUpdated(item)
{
	// this.fireEvent("itemupdate", {item: item}) if the item is and stays in the list
	// this.fireEvent("itemadd", {item: item}) if the item has been added to the list
};

/*
	Informs the list that an item has been removed from the list.
	Allows the list to update it's state and trigger "itemremove" event.
*/
SDL.Client.Models.UpdatableListObject.prototype.itemRemoved = function SDL$Client$Models$UpdatableListObject$itemRemoved(itemId)
{
	// this.fireEvent("itemremove", , {itemId: itemId}); if item was in the list
};

/*
	If the list has some data related to an item, this data can be used to initialize the state
	of the {SDL.Client.Models.UpdatableObject} item without loading the full item from the server.
	updateItemData() will extract data related to the item from the list and pass it to the item object.
*/
SDL.Client.Models.UpdatableListObject.prototype.updateItemData = function SDL$Client$Models$UpdatableListObject$updateItemData(item)
{
};/*! @namespace {SDL.Client.Repository.RepositoryBase} */
SDL.Client.Types.OO.createInterface("SDL.Client.Repository.RepositoryBase");

SDL.Client.Repository.ModelRepositoryDiscoveryMode = {
	NONE: 0,
	TOP: 1,
	OPENER: 2,
	FULL: 3
};

SDL.Client.Repository.RepositoryBase.$constructor = function SDL$Client$Repository$RepositoryBase$constructor(mode, identifier)
{
	this.addInterface("SDL.Client.Models.IdentifiableObject", [identifier]);

	var items = {};
	var uniqueId = 0;

	// ------- SDL.Client.Models.MarshallableObject methods implementations/overrides
	this.pack = SDL.Client.Types.OO.nonInheritable(function()
	{
		var data = { "items": items, "uniqueId": uniqueId };
		return data;
	});

	this.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Repository$RepositoryBase$unpack(data)
	{
		if (data)
		{
			uniqueId = data.uniqueId || 0;
			if (data.items)
			{
				for (var id in data.items)
				{
					var item = SDL.Client.Types.OO.importObject(data.items[id]);
					if (item)
					{
						items[id] = item;
					}
				}
			}
		}
	});
	// ------- end of SDL.Client.Models.MarshallableObject overrides

	// ------- SDL.Client.Types.DisposableObject methods overrides
	this.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Repository$RepositoryBase$disposeInterface()
	{
		if (mode >= SDL.Client.Repository.ModelRepositoryDiscoveryMode.FULL)
		{
			window.name = undefined;
			if (window.top != window)
			{
				try
				{
					window.top.name = undefined;
				}
				catch (err)
				{
					//it might fail if the page is loaded in a frame
				}
			}
		}
		SDL.Client.Event.EventRegister.removeEventHandler(SDL.Client.Event.EventRegister, "beforedispose", this.getDelegate(this._onWindowUnload));
	});
	// ------- end of SDL.Client.Types.DisposableObject overrides

	this.getOwningWindow = function SDL$Client$Repository$RepositoryBase$getOwningWindow()
	{
		return window;
	};

	this.getUniqueId = function SDL$Client$Repository$RepositoryBase$getUniqueId()
	{
		return "id_" + (++uniqueId);
	};

	this.getItem = function SDL$Client$Repository$RepositoryBase$getItem(id)
	{
		return items[id];
	};

	this.setItem = function SDL$Client$Repository$RepositoryBase$setItem(id, item)
	{
		items[id] = item;
	};

	this.removeItem = function SDL$Client$Repository$RepositoryBase$removeItem(id)
	{
		delete items[id];
	};

	this.createItem = function SDL$Client$Repository$RepositoryBase$createItem(id, type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10)
	{
		// Unfortunatelly, apply(object, arguments) cannot by used with constructors
		var resolveNamespace = SDL.Client.Type.resolveNamespace(type);
		if (resolveNamespace)
		{
			var item = (items[id] = new (resolveNamespace)(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10));
			if (item)
			{
				return item;
			}
		}
		return null;
	};

	this.getItems = function SDL$Client$Repository$RepositoryBase$getItems()
	{
		return items;
	};

	this._onWindowUnload = function SDL$Client$Repository$RepositoryBase$_onWindowUnload()
	{
		this.dispose();
	};

	//-- start of initialization --
	if (mode >= SDL.Client.Repository.ModelRepositoryDiscoveryMode.FULL)
	{
		// set window name to be able to connect to it using window.open
		window.name = identifier;
		if (window.top != window)
		{
			try
			{
				window.top.name = identifier;
			}
			catch (err)
			{
				//it might fail if the page is loaded in a frame
			}
		}
	}

	SDL.Client.Event.EventRegister.addEventHandler(SDL.Client.Event.EventRegister, "beforedispose", this.getDelegate(this._onWindowUnload));	// making sure the repository is disposed last
	//-- end of initialization --
};

// SDL.Client.Repository.RepositoryBase static members
SDL.Client.Repository.RepositoryBase.findRepository = function SDL$Client$Repository$RepositoryBase$findRepository(mode, identifier)
{
	var checkedTopWindows = [];

	var findRepositoryInFrame = function SDL$Client$Repository$RepositoryBase$findRepositoryInFrame(win)
	{
		var repository;

		try
		{
			if (win.SDL && win.SDL.Client)
			{
				repository = win.SDL.Client.ModelRepository;
				if (repository && (repository.getId() != identifier  || repository.getDisposing() || repository.getDisposed()))
				{
					repository = null;
				}
			}
		}
		catch (err)
		{
			// might fail due to different domain
			repository = null;
		}

        if (!repository)
		{
			for (var i = 0, len = win.frames.length; !repository && i < len; i++)
			{
			    if (win.frames[i])
                {
				    repository = findRepositoryInFrame(win.frames[i]);                    
                }
			}
		}
		return repository;
	};

	var findRepositoryInWindow = function SDL$Client$Repository$RepositoryBase$findRepositoryInWindow(win, noOpener)
	{
		if (mode >= SDL.Client.Repository.ModelRepositoryDiscoveryMode.TOP)
		{
			var top = win ? win.top : window.top;
			if (SDL.jQuery.inArray(top, checkedTopWindows) == -1)
			{
				var repository = findRepositoryInFrame(top);

				if (!noOpener && !repository && mode >= SDL.Client.Repository.ModelRepositoryDiscoveryMode.OPENER)
				{
					checkedTopWindows.push(top);

					var opener;
					try
					{
						opener = top.opener;
					}
					catch(err)
					{
						opener = null;
					}

					if (opener)
					{
						repository = findRepositoryInWindow(opener);
					}
				}
				return repository;
			}
		}
	};

	var repository = findRepositoryInWindow();

	if (!repository && mode >= SDL.Client.Repository.ModelRepositoryDiscoveryMode.FULL)
	{
		var win = window.open("", identifier, "top=10000,left=10000,width=100,height=100");

		if (win && !win.closed && SDL.jQuery.inArray(win, checkedTopWindows) == -1)
		{
			var toClose;
			try
			{
				toClose = (win.location.href == "about:blank");
			}
			catch (err)
			{
				toClose = false;
			}

			if (!toClose)
			{
				var winOpener;
				try
				{
					winOpener = win.opener;
				}
				catch(err)
				{
					winOpener = null;
				}

				try
				{
					toClose = (winOpener == window && win.document && win.document.body && win.document.body.innerHTML.length == 0);
				}
				catch (err)
				{
					toClose = true;
				}
			}

			if (toClose)
			{
				try
				{
					win.close();
				}
				catch (err)
				{ }
			}
			else
			{
				repository = findRepositoryInWindow(win);

				if (!repository)
				{
					try
					{
						win.name = undefined; //clear the name of that window, apparently something has gone wrong there during unload
					}
					catch (err)
					{ }
				}
			}
		}
		
		if (!repository)
		{
			// multiple iframes, if loading simultaneously, might not have discovered each other, then all would try window.open(),
			// then would create their own repositories. Trying to prevent this by inspecting the local window again
			checkedTopWindows = [];
			repository = findRepositoryInWindow(window.top, true);
		}
	}

	return repository;
};

SDL.Client.Repository.RepositoryBase.initRepository = function SDL$Client$Repository$RepositoryBase$initRepository(mode, identifier)
{
	mode = (!isNaN(mode) && (mode || mode === SDL.Client.Repository.ModelRepositoryDiscoveryMode.NONE))
		? Number(mode)
		: SDL.Client.Repository.ModelRepositoryDiscoveryMode.FULL;

	identifier = ("sdl_repository_" + document.location.protocol + document.location.host + "_" + document.location.port + "_" + (identifier || "")).replace(/[\:\/\\\.\-]/g, "_");

	function connectToRepository()
	{
		var modelRepository = SDL.Client.Repository.RepositoryBase.findRepository(mode, identifier);
		if (modelRepository)
		{
			SDL.Client.Event.EventRegister.addEventHandler(modelRepository, "beforedispose", onRepositoryDispose);
			SDL.Client.Event.EventRegister.addEventHandler(modelRepository, "marshal", onRepositoryMarshal);
		}
		return modelRepository;
	};

	function onRepositoryDispose()
	{
		var win = window;
		var evt;
		
		do
		{
			try
			{
				evt = win.SDL &&  win.SDL.Client &&  win.SDL.Client.Event &&  win.SDL.Client.Event.EventRegister;
			}
			catch (err)
			{
				// would fail if cross-domain
			}

			if (evt && evt.isUnloading())
			{
				//if window is being closed -> ignore the event, can't do much anyway
				return;
			}

			try
			{
				win = (win.parent != win) ? win.parent : null;
			}
			catch (err)
			{
				win = null;
				// would fail if an iframe in a document from another domain
			}
		}
		while (win);

		SDL.Client.Event.EventRegister.removeEventHandler(SDL.Client.ModelRepository, "beforedispose", onRepositoryDispose);
		SDL.Client.Event.EventRegister.removeEventHandler(SDL.Client.ModelRepository, "marshal", onRepositoryMarshal);
		
		SDL.Client.ModelRepository = SDL.Client.Types.OO.importObject(SDL.Client.ModelRepository);
	};

	function onRepositoryMarshal()
	{
		var marshalRepository = SDL.Client.ModelRepository.getMarshalObject();
		if (marshalRepository && !marshalRepository.getDisposing())
		{
			SDL.Client.ModelRepository = marshalRepository;
		}
	};

	SDL.Client.ModelRepository = connectToRepository() || new SDL.Client.Repository.RepositoryBase(mode, identifier);
};/*! @namespace {SDL.Client.Models} */
SDL.Client.Type.registerNamespace("SDL.Client.Models");

SDL.Client.Models.ItemType =
	{
		NONE: 0
	};

(function()
{
	var models = SDL.Client.Models;

	models.idMatches = {};
	models.itemTypes = {};

	/*
		Registers a domain model factory {SDL.Client.ModelFactory}.
		matchPattern is a regular expression object or a string that matches
			ID's of items managed by the model factory {SDL.Client.ModelFactory}.
		factory is a domain model factory object. A model factory provides a number of methods to manage
			model items that belong to a certain domain.
		itemTypes is an array of object of the following form:
			{
				id: ...,		// item type id, i.e. CMIS.Model.getDocumentType()
				alias: ...,		// a string to be added to {SDL.Client.Models.ItemType} enum,
								// i.e. "CMIS_DOCUMENT"
				implementation: ...	// a string, the class implementing the given item type,
								// i.e. "{Cmis.Document}"
			}
	*/
	models.registerModelFactory = function SDL$Client$Models$registerModelFactory(matchPattern, factory, itemTypes)
	{
		if (!(matchPattern in this.idMatches))
		{
			if (!SDL.Client.Types.OO.implementsInterface(factory, "SDL.Client.Models.ModelFactory"))
			{
				SDL.Client.Diagnostics.Assert.raiseError("SDL.Client.Models.ModelFactory object is not specified for item types with idmatch: " + matchPattern);
			}
			this.idMatches[matchPattern] = { regExp: new RegExp(matchPattern), factory: factory };
		}
		else
		{
			factory = this.idMatches[matchPattern].factory;
		}

		if (itemTypes)
		{
			for (var i = 0, len = itemTypes.length; i < len; i++)
			{
				this.registerItemType(itemTypes[i], factory);
			}
		}
	};

	/*
		Associates a specific itemType with a model factory {SDL.Client.ModelFactory}.
	*/
	models.registerItemType = function SDL$Client$Models$registerItemType(itemType, factory)
	{
		var id = itemType.id;
		SDL.Client.Models.ItemType[itemType.alias] = id;

		if (itemType.implementation)
		{
			var impl = SDL.Client.Type.resolveNamespace(itemType.implementation);
			if (impl)
			{
				impl.ItemType = id;
			}
			else
			{
				SDL.Client.Diagnostics.Assert.raiseError("Type implementation \"" + itemType.implementation + "\" is missing.");
			}
		}
		itemType.factory = factory;
		this.itemTypes[id] = itemType;
	};

	/*
		Returns the Model (model factory) object for the given item.
		The model factory is resolved based on the ID of the item.
		Every model factory registers itself using registerModelFactory() method
	*/
	models.getModelFactory = function SDL$Client$Models$getModelFactory(item)
	{
		if (item)
		{
			if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
			{
				item = item.getId();
			}

			var idMatchRegistry = this.idMatches;
			for (var idmatch in idMatchRegistry)
			{
				if (idmatch)
				{
					if (idMatchRegistry[idmatch].regExp.test(item))
					{
						return idMatchRegistry[idmatch].factory;
					}
				}
			}
			if ("" in idMatchRegistry)
			{
				return idMatchRegistry[""].factory;
			}
		}
	};

	/*
		Returns the owning window of the SDL.Client.Models object.
	*/
	models.getOwningWindow = function SDL$Client$Models$getOwningWindow()
	{
		return window;
	};

	/*
		Returns the owning window of the model repository.
	*/
	models.getRepositoryOwningWindow = function()
	{
		var repository = SDL.Client.ModelRepository;
		if (repository.isMarshalling())
		{
			return repository.getMarshalObject().getOwningWindow();
		}
		else
		{
			return repository.getOwningWindow();
		}
	};

	/*
		Returns a list of all registered Models (model factories).
		Every model factory registers itself using registerModelFactory() method.
	*/
	models.getModelFactories = function SDL$Client$Models$getModelFactories()
	{
		var factories = [];
		var idMatchRegistry = this.idMatches;
		for (var idmatch in idMatchRegistry)
		{
			var factory = idMatchRegistry[idmatch].factory;
			if (factory && SDL.jQuery.inArray(factory, factories) == -1)
			{
				factories.push(factory);
			}
		}
		return factories;
	};

	/*
		Returns an domain model object for the specified ID.
		Examples:
			var schema = SDL.Client.Models.getItem("/schemas/schema.xsd");
			var item = SDL.Client.Models.getItem("url:document//doc.xml");
	*/
	models.getItem = function SDL$Client$Models$getItem(id)
	{
		var factory = this.getModelFactory(id);
		if (factory)
		{
			return factory.getItem(id);
		}
	};

	/*
		Creates a new domain model object instance in the {SDL.Client.ModelRepository} based on the provided item type.
		Example:
			var item = SDL.Client.Models.createNewItem({SDL.Client.Models.ItemType}.CMIS_DOCUMENT);
	*/
	models.createNewItem = function SDL$Client$Models$createNewItem(type)
	{
		var itemTypeData = this.itemTypes[type];
		if (itemTypeData)
		{
			return itemTypeData.factory.createNewItem(type);
		}
		else
		{
			SDL.Client.Diagnostics.Assert.raiseError("Cannot determine a model factory for item type \"" + type + "\".");
		}
	};

	/*
		Returns an item type for the given ID.
		Example:
			SDL.Client.Models.getItemType("/schemas/schema.xsd") == {SDL.Client.Models.ItemType}.URL_DOCUMENT;
	*/
	models.getItemType = function SDL$Client$Models$getItemType(id)
	{
		var factory = this.getModelFactory(id);
		if (factory)
		{
			return factory.getItemType(id);
		}
	};

	/*
		Returns a string that can be used as an ID for a domain model object instance.
	*/
	models.getUniqueId = function SDL$Client$Models$getUniqueId()
	{
		var repository = SDL.Client.ModelRepository;
		var id;
		if (repository.isMarshalling())
		{
			id = repository.getMarshalObject().getUniqueId();
		}
		else
		{
			id = repository.getUniqueId();
		}

		return id;
	};

	/*
		Adds the provided item to {SDL.Client.ModelRepository} with the specified ID.
	*/
	models.addToRepository = function SDL$Client$Models$addToRepository(id, item)
	{
		var repository = SDL.Client.ModelRepository;
		var result;
		if (!repository.getDisposing() && !repository.getDisposed())
		{
			result = repository.setItem(id, item);
		}
		else if (repository.isMarshalling())
		{
			result = repository.getMarshalObject().setItem(id, item);
		}

		return result;
	};

	/*
		Returns an item with the specified ID from {SDL.Client.ModelRepository}.
	*/
	models.getFromRepository = function SDL$Client$Models$getFromRepository(id)
	{
		var item;
		var repository = SDL.Client.ModelRepository;

		if (!repository.getDisposing() && !repository.getDisposed())
		{
			item = repository.getItem(id);
		}
		else if (repository.isMarshalling())
		{
			var repositoryMarshalTarget = repository.getMarshalObject();
			item = repositoryMarshalTarget.getItem(id);
			if (!item)
			{
				item = repository.getItem(id);
				if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.MarshallableObject") && item.isMarshalling())
				{
					item = item.getMarshalObject();
				}
			}
		}

		return item;
	};

	/*
		Creates a new instance of an object in {SDL.Client.ModelRepository} based on the provided ID, type and constructor arguments.
		Passed 'type' parameter can be a domain model item type or a class name (constructor).
		Examples:
			var item = SDL.Client.Models.createInRepository(url, {SDL.Client.Models.ItemType}.URL_DOCUMENT, url);
	*/
	models.createInRepository = function SDL$Client$Models$createInRepository(id, type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10)
	{
		var repository = SDL.Client.ModelRepository;
		if (repository.isMarshalling())
		{
			repository = repository.getMarshalObject();
		}

		var item;
		if (!repository.getDisposing() && !repository.getDisposed())
		{
			// apply() would not work across windows, have to specify the list of arguments explicitly
			if (type in this.itemTypes)
			{
				// resolve implementation based on the configuration
				var itemTypeData = this.itemTypes[type];
				if (itemTypeData)
				{
					var className = itemTypeData.implementation;
					if (className)
					{
						item = repository.createItem(id, className, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
					}
					else
					{
						SDL.Client.Diagnostics.Assert.raiseError("Implementation is not defined for item type \"" + type + "\"");
					}
				}
			}
			else
			{
				item = repository.createItem(id, type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
			}
		}

		return item;
	};

	/*
		Removes an object with the specified ID from {SDL.Client.ModelRepository}.
	*/
	models.removeFromRepository = function SDL$Client$Models$removeFromRepository(id)
	{
		var repository = SDL.Client.ModelRepository;
		repository.removeItem(id);
		if (repository.isMarshalling())
		{
			repository.getMarshalObject().removeItem(id);
		}
	};

	/*
		Changes the ID of an object in {SDL.Client.ModelRepository}.
	*/
	models.updateItemId = function SDL$Client$Models$updateItemId(oldId, newId)
	{
		var item;
		var repository = SDL.Client.ModelRepository;
		if (repository.isMarshalling())
		{
			var repositoryMarshalTarget = repository.getMarshalObject();
			item = repositoryMarshalTarget.getItem(id);
			if (item)
			{
				repositoryMarshalTarget.removeItem(oldId);
				repositoryMarshalTarget.setItem(newId, item);
				repository.removeItem(oldId);
			}
		}

		if (!item)
		{
			item = repository.getItem(oldId);
			repository.removeItem(oldId);
			repository.setItem(newId, item);
		}
	};

	/*
		Returns an {SDL.Client.MarshallableArray} collection of all registered {SDL.Client.Models.UpdatableListObject} objects.
	*/
	models.getListsRegistry = function SDL$Client$Models$getListsRegistry()
	{
		var lists = (this.getFromRepository("models-list-registry") ||
			this.createInRepository("models-list-registry", "SDL.Client.Models.MarshallableArray"));
		return lists ? lists.getArray() : null;
	};

	/*
		Adds an {SDL.Client.Models.UpdatableListObject} object to the collection of registered lists.
	*/
	models.registerList = function SDL$Client$Models$registerList(list)
	{
		var lists = this.getListsRegistry();
		if (lists && SDL.Client.Types.OO.implementsInterface(list, "SDL.Client.Models.UpdatableListObject"))
		{
			var listId = list.getId();
			var index = SDL.jQuery.inArray(listId, lists);
			if (index != -1)
			{
				SDL.Client.Types.Array.move(lists, index, lists.length - 1);
			}
			else
			{
				lists.push(listId);
			}
		}
	};

	/*
		Removes an {SDL.Client.Models.UpdatableListObject} object from the collection of registered lists.
	*/
	models.unregisterList = function SDL$Client$Models$unregisterList(list)
	{
		var lists = this.getListsRegistry();
		if (lists)
		{
			var index = SDL.jQuery.inArray(list.getId(), lists);
			if (index != -1)
			{
				SDL.Client.Types.Array.removeAt(lists, index);
			}
		}
	};

	/*
		Calls {SDL.Client.Models.UpdatableListObject}::itemUpdated method for all registered lists.
	*/
	models.itemUpdated = function SDL$Client$Models$itemUpdated(item, oldId)
	{
		if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.UpdatableObject"))
		{
			var lists = this.getListsRegistry();
			if (lists)
			{
				lists = SDL.Client.Types.Array.clone(lists);
				for (var i = 0, len = lists.length; i < len; i++)
				{
					var list = this.getFromRepository(lists[i])
					if (list)
					{
						list.itemUpdated(item, oldId);
					}
				}
			}
		}
	};

	/*
		Calls {SDL.Client.Models.UpdatableListObject}::itemRemoved method for all registered lists.
	*/
	models.itemRemoved = function SDL$Client$Models$itemRemoved(id)
	{
		var lists = this.getListsRegistry();
		if (lists)
		{
			lists = SDL.Client.Types.Array.clone(lists);
			for (var i = 0, len = lists.length; i < len; i++)
			{
				var list = this.getItem(lists[i]);
				if (list)
				{
					list.itemRemoved(id);
				}
			}
		}
	};

	/*
		Calls {SDL.Client.Models.UpdatableListObject}::updateItemData method for all registered lists.
	*/
	models.updateItemData = function SDL$Client$Models$updateItemData(item)
	{
		if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.UpdatableObject"))
		{
			var lists = this.getListsRegistry();
			if (lists && lists.length > 0)
			{
				lists = SDL.Client.Types.Array.clone(lists);
				var timeStamp = item.getLastUpdateCheckTimeStamp();
				var listTimeStamp = 0;
				for (var i = 0; i < lists.length; i++)	//loop from older to newer lists, so most recent values ovewrite obsolete values; lists.length might change during the operation
				{
					var list = this.getItem(lists[i]);
					if (list)
					{
						listTimeStamp = list.getTimeStamp();
						if (listTimeStamp > timeStamp)
						{
							// timeStamp will change here, but it doesn't matter as the list of lists is ordered by timeStamp
							list.updateItemData(item);
						}
					}
				}
				if (listTimeStamp > timeStamp)
				{
					item.setLastUpdateCheckTimeStamp(listTimeStamp); //set the time stamp to the last checked list's time stamp
				}
			}
		}
	};

	/*
	Calls {SDL.Client.Models.LoadableObject:load} method on the item and executes a callback function when operation is finished.
	This is a helper method that should only be called from within a domain model implementation.
	*/
	models.loadItem = function SDL$Client$Models$loadItem(item, reload, onSuccess, onFailure)
	{
		if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.LoadableObject"))
		{
			if (!reload && item.isLoaded())
			{
				onSuccess();
			}
			else
			{
				var loaded = function(event)
				{
					var item = event.target;
					SDL.Client.Event.EventRegister.removeEventHandler(item, "load", loaded);
					SDL.Client.Event.EventRegister.removeEventHandler(item, "loadfailed", loadFailed);
					onSuccess();
				}
				var loadFailed = function(event)
				{
					var item = event.target;
					SDL.Client.Event.EventRegister.removeEventHandler(item, "load", loaded);
					SDL.Client.Event.EventRegister.removeEventHandler(item, "loadfailed", loadFailed);
					onFailure(event.data.error);
				}

				SDL.Client.Event.EventRegister.addEventHandler(item, "load", loaded);
				SDL.Client.Event.EventRegister.addEventHandler(item, "loadfailed", loadFailed);
				item.load();
			}
		}
	};

	var discoveryMode = SDL.Client.Configuration.ConfigurationManager.getAppSetting("modelRepositoryDiscoveryMode");
	var repositoryId = SDL.Client.Configuration.ConfigurationManager.getAppSetting("modelRepositoryId");
	SDL.Client.Repository.RepositoryBase.initRepository(discoveryMode, repositoryId);	// initializes SDL.Client.ModelRepository object
}
)();
/*! @namespace {SDL.Client.Models.ModelFactory} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.ModelFactory");

/*
	Defines interface for a Domain Model Factory. A domain model factory manages
	objects that belong to a specific domain model.
	A domain model factory can be registered with {SDL.Client.Models} models facade.
*/


/*
	Returns the item type of the provided item.
*/
SDL.Client.Models.ModelFactory.prototype.getItemType = function SDL$Client$Models$ModelFactory$getItemType(item)
{
};

/*
	Returns an instance of a domain model item with the specified ID.
*/
SDL.Client.Models.ModelFactory.prototype.getItem = function SDL$Client$Models$ModelFactory$getItem(id)
{
	if (!id)
	{
		return null;
	}

	var item = SDL.Client.Models.getFromRepository(id);
	if (!item)
	{
		item = SDL.Client.Models.createInRepository(id, this.getItemType(id), id);
	}

	if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.UpdatableObject"))
	{
		//this will initialize the item with static data, if found in any of the loaded lists
		SDL.Client.Models.updateItemData(item);
	}

	return item;
};

/*
	Creates an instance of a new (non-existing) domain model item based on the specified Item Type.
*/
SDL.Client.Models.ModelFactory.prototype.createNewItem = function SDL$Client$Models$ModelFactory$createNewItem(type)
{
};/*! @namespace {SDL.Client.Types.Number} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.Number");

SDL.Client.Types.Number.toNumber = function SDL$Client$Types$Number$toNumber(value)
{
	return Number(this.toNumberString(value));
};

SDL.Client.Types.Number.toNumberString = function SDL$Client$Types$Number$toNumberString(value)
{
	if (isNaN(Number(value)) && SDL.Client.Type.isString(value))
	{
		// convert japanese numbers
		return value.replace(/[\u3002\uff0e\uff0d\uff61\uff10-\uff19]/g, function(c)
		{
			var charCode = c.charCodeAt(0);
			switch (charCode)
			{
				case 0x3002:
				case 0xff0e:
				case 0xff61:
					return ".";
				case 0xff0d:
					return "-";
				default:
					return charCode - 0xff10;	//0xff10 -> '0'
			}
		});
	}
	return value;
};/*! @namespace {SDL.Client.Models.Base.ContinuousIterationObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ContinuousIterationObject");
 
/**
 * Represents a Continuous Iteration object.
 * @namespace {SDL.Client.Models.Base}
 * @constructor
 * @param {String} parentId The parent item's Id    
 * @event update Fires when object is updated.
 * @event error Fires when object update failed.
 */
SDL.Client.Models.Base.ContinuousIterationObject.$constructor = function SDL$Client$Models$Base$ContinuousIterationObject$constructor(id)
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	var p = this.properties;
	p.id = id;
	p.operationId;
	p.active;
	p.toCancel;
	p.cancelled;
	p.timeout;
	p.itemsCount;
	p.itemsDoneCount;
	p.errorsCount;
	p.items;
	p.operation;
};

/**
 * Return iterations object id.
 * @return {String} The iterations object id.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.getId = function SDL$Client$Models$Base$ContinuousIterationObject$getId()
{
	return this.properties.id;
};

/**
 * Return the total operations count.
 * @return {Number} The total number of operations.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.getItemsCount = function SDL$Client$Models$Base$ContinuousIterationObject$getItemsCount()
{
	return this.properties.itemsCount;
};

/**
 * Return the operations done count.
 * @return {Number} The number of done operations.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.getItemsDoneCount = function SDL$Client$Models$Base$ContinuousIterationObject$getItemsDoneCount()
{
	return this.properties.itemsDoneCount;
};

/**
 * Return the operation errors count.
 * @return {Number} The number of errors.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.getErrorsCount = function SDL$Client$Models$Base$ContinuousIterationObject$getErrorsCount()
{
	return this.properties.errorsCount;
};

/**
 * Return the operation errors.
 * @return {Object} The errors list.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.getErrorDetails = function SDL$Client$Models$Base$ContinuousIterationObject$getErrorDetails()
{
};

/**
 * Indicates whether the operations is active or now.
 * @return {Boolean} <c>true</c> if the operation is active, otherwise <c>false</c>.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.isActive = function SDL$Client$Models$Base$ContinuousIterationObject$isActive()
{
	return this.properties.active || false;
};

/**
 * Stops iteration.
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype.stop = function SDL$Client$Models$Base$ContinuousIterationObject$stop()
{
	var p = this.properties;
	if (p.active && !p.cancelled)
	{
		if (p.operationId)
		{
			p.cancelled = true;
			p.toCancel = false;
			this._executeStopContinuousIteration(p.operationId, this.getDelegate(this._onUpdate), this.getDelegate(this._onError));
		}
		else
		{
			p.toCancel = true;
		}
	}
};

/**
 * Queries the iteration state.
 * @private
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype._queryState = function SDL$Client$Models$Base$ContinuousIterationObject$_queryState()
{
	var p = this.properties;
	if (p.active)
	{
		this._executeQueryContinuousIteration(p.operationId, this.getDelegate(this._onUpdate), this.getDelegate(this._onError));
	}
};

/**
 * Executes after the Iteration Item was updated.
 * @param {Object} result The update result.
 * @private
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype._onUpdate = function SDL$Client$Models$Base$ContinuousIterationObject$_onUpdate(result)
{
	this.fireEvent("update");
};

/**
 * Executes after this Item has failed iteration.
 * @param {Object} error The error.
 * @private
 */
SDL.Client.Models.Base.ContinuousIterationObject.prototype._onError = function SDL$Client$Models$Base$ContinuousIterationObject$_onError(error)
{
	var p = this.properties;
	p.active = false;
	SDL.Client.MessageCenter.registerError(error);
	this.fireEvent("error", { error: error });
};

/**
* Server call for stop Iteration item.
* @param {String} id The id of the Item to be loaded.
* @param {Function} success The callback to be caled on load success.
* @param {Function} failure the callback to be called on load failure.
*/
SDL.Client.Models.Base.ContinuousIterationObject.prototype._executeStopContinuousIteration = function SDL$Client$Models$Base$ContinuousIterationObject$_executeStopContinuousIteration(id, success, failure)
{
	SDL.Client.Diagnostics.Assert.raiseError("This method must be implemented in child implementations");
};

/**
* Server call for query Iteration item
* @param {String} id The id of the Item to be loaded.
* @param {Function} success The callback to be caled on load success.
* @param {Function} failure the callback to be called on load failure.
*/
SDL.Client.Models.Base.ContinuousIterationObject.prototype._executeQueryContinuousIteration = function SDL$Client$Models$Base$ContinuousIterationObject$_executeQueryContinuousIteration(id, success, failure)
{
	SDL.Client.Diagnostics.Assert.raiseError("This method must be implemented in child implementations");
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.ContinuousIterationObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ContinuousIterationObject$pack()
{
	var p = this.properties;
	return {
		operationId: p.operationId,
		active: p.active,
		cancelled: p.cancelled,
		toCancel: p.toCancel,
		items: p.items,
		operation: p.operation
	};
});

SDL.Client.Models.Base.ContinuousIterationObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ContinuousIterationObject$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.operationId = data.operationId;
		p.active = data.active;
		p.cancelled = data.cancelled;
		p.toCancel = data.toCancel;
		p.items = SDL.Client.Types.Array.clone(data.items);
		p.operation = data.operation;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides/*! @namespace {SDL.Client.Models.Base.EditableItem} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.EditableItem");

/*
	Base implementation of editable items (items that can be loaded, changed and saved back).
*/
SDL.Client.Models.Base.EditableItem.$constructor = function SDL$Client$Models$Base$EditableItem$constructor(id)
{
	this.addInterface("SDL.Client.Models.Base.Item", [id]);

	var p = this.properties;
	p.changed;
	p.saving;
	p.validationException;
};

SDL.Client.Models.Base.EditableItem.prototype.invalidateInterfaceCachedState = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$EditableItem$invalidateInterfaceCachedState()
{
	var p = this.properties;
	p.changed = false;
	p.validationException = undefined;
});

/*
	Returns a boolean indicating whether properties of the document can be edited.
*/
SDL.Client.Models.Base.EditableItem.prototype.canEditProperties = function SDL$Client$Models$Base$EditableItem$canEditProperties()
{
	return true;
};

/*
	Sets a flag and triggers an event when the item has changed.
*/
SDL.Client.Models.Base.EditableItem.prototype.setChanged = function SDL$Client$Models$Base$EditableItem$setChanged(changeData)
{
	var p = this.properties;
	this._removeValidationResult(changeData && changeData.property || null);
	if (!p.changed || changeData)
	{
		p.changed = true;
		this.fireEvent("change", changeData);
	}
};

/*
	Returns a boolean indicating whether the document has unsaved changes.
*/
SDL.Client.Models.Base.EditableItem.prototype.isChanged = function SDL$Client$Models$Base$EditableItem$isChanged()
{
	return this.properties.changed || false;
};

SDL.Client.Models.Base.EditableItem.prototype.load = function SDL$Client$Models$Base$EditableItem$load(reload)
{
	if (reload || !this.isChanged())
	{
		return this.callBase("SDL.Client.Models.Base.Item", "load", [reload]);
	}
	else
	{
		return false;
	}
};

/*
	Returns a boolean indicating whether the document has unsaved changes.
*/
SDL.Client.Models.Base.EditableItem.prototype.setTitle = function SDL$Client$Models$Base$EditableItem$setTitle(value)
{
	if (this.canEditProperties() && this.getTitle() != value)
	{
		this.properties.title = value;
		this.setChanged({ property: "title", value: value });
	}
};

/*
	Returns a boolean indicating whether the changes to the current document can be saved.
*/
SDL.Client.Models.Base.EditableItem.prototype.canSave = function SDL$Client$Models$Base$EditableItem$canSave()
{
	return this.isChanged();
};

/*
	Saves item's changed data to the server. If the item has not changed then returns false, true otherwise.
	Save can be cancelled by validate() method if the data is not valid.
	The method is asynchronous, it will trigger "save" or "savefailed" event when the operation completes.
	If save is successful it will trigger "load" event as well when the operation completes, or "loadfailed" otherwise.
*/

SDL.Client.Models.Base.EditableItem.prototype.save = function SDL$Client$Models$Base$EditableItem$save()
{
	this.collectData();
	if (this.canSave() && this.validate())
	{
		this._setSaving();
		this._setLoading();
		this._executeSave();
		return true;
	}
	else
	{
		return false;
	}
};

/*
	Fires 'collectdata' event that allows GUI's to apply their changes to the item and perform validation.
*/
SDL.Client.Models.Base.EditableItem.prototype.collectData = function SDL$Client$Models$Base$EditableItem$collectData()
{
	this.fireEvent("collectdata");
};

/*
	Fires 'validate' event that allows GUI's to perform validation.
	This event can be cancelled, then validate() will return false
*/
SDL.Client.Models.Base.EditableItem.prototype.validate = function SDL$Client$Models$Base$EditableItem$validate()
{
	var p = this.properties;

	if (p.validationException)
	{
		this.fireEvent("validatefailed", p.validationException);
		return false;
	}
	else
	{
		var e = this.fireEvent("validate", new SDL.Client.Exception.ValidationException());
		if (e && e.defaultPrevented)
		{
			// validation exception generated by a view is not stored with the item
			// and is only availalble as part of "validatefailed" event's data.
			// for validation rules that are applicable regardless of views loaded
			// validation should be implemented by the item itself by overriding the 'validate()' method

			this.fireEvent("validatefailed", e.data);
			return false;
		}
		else
		{
			return true;
		}
	}
};

SDL.Client.Models.Base.EditableItem.prototype._addValidationResult = function SDL$Client$Models$Base$EditableItem$_addValidationResult(property, errorCode, message, description)
{
	var validationException = this.properties.validationException;
	if (!validationException)
	{
		validationException = this.properties.validationException = new SDL.Client.Exception.ValidationException();
	}
	validationException.addValidationResult(property, errorCode, message, description)
};

SDL.Client.Models.Base.EditableItem.prototype._removeValidationResult = function SDL$Client$Models$Base$EditableItem$_removeValidationResult(property)
{
	var p = this.properties;
	if (p.validationException)
	{
		p.validationException.removeValidationResult(property);
		if (!p.validationException.getValidationResults())
		{
			p.validationException = null;
		}
	}
};

SDL.Client.Models.Base.EditableItem.prototype.getValidationException = function SDL$Client$Models$Base$EditableItem$getValidationException()
{
	return this.properties.validationException;
};

/*
	Returns a boolean indicating whether the current item is being saved.
*/
SDL.Client.Models.Base.EditableItem.prototype.isSaving = function SDL$Client$Models$Base$EditableItem$isSaving()
{
	return this.properties.saving;
};

SDL.Client.Models.Base.EditableItem.prototype._setSaving = function SDL$Client$Models$Base$EditableItem$_setSaving()
{
	this.properties.saving = true;
	this.fireEvent("saving");
};

SDL.Client.Models.Base.EditableItem.prototype._setSaved = function SDL$Client$Models$Base$EditableItem$_setSaved()
{
	this.properties.saving = false;
	this.fireEvent("save");
};

SDL.Client.Models.Base.EditableItem.prototype._executeSave = function SDL$Client$Models$Base$EditableItem$_executeSave()
{
	this._onLoad();	// to be overridden
};

SDL.Client.Models.Base.EditableItem.prototype.afterSetLoaded = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$EditableItem$afterSetLoaded()
{
	if (this.isSaving())
	{
		this._setSaved();
	}
});

SDL.Client.Models.Base.EditableItem.prototype.afterLoadFailed = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$EditableItem$afterLoadFailed(error, webRequest)
{
	if (this.isSaving())
	{
		this.properties.saving = false;
		this.fireEvent("savefailed", {error: error, errorCode: webRequest ? webRequest.statusCode : null});
	}
});

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.EditableItem.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$EditableItem$pack()
{
	var p = this.properties;
	return {
		saving: p.saving,
		changed: p.changed,
		validationException: p.validationException
	};
});

SDL.Client.Models.Base.EditableItem.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$EditableItem$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.saving = data.saving;
		p.changed = data.changed;
		if (data.validationException)
		{
			p.validationException = new SDL.Client.Exception.ValidationException(data.validationException.getValidationResults());
		}
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides
/*! @namespace {SDL.Client.Models.Base.EditableXmlBasedObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.EditableXmlBasedObject");

/*
	Adds an ability for an {SDL.Client.XmlBasedObject} to modify its xml data.
*/
SDL.Client.Models.Base.EditableXmlBasedObject.$constructor = function SDL$Client$Models$Base$EditableXmlBasedObject$constructor(id, parentId, filter)
{
	this.addInterface("SDL.Client.Models.Base.XmlBasedObject");

	var p = this.properties;
	p.changeXml;
	p.changeXmlDocument;
};

/*
	Sets a changed xml string to the object.
*/
SDL.Client.Models.Base.EditableXmlBasedObject.prototype.setChangeXml = function SDL$Client$Models$Base$EditableXmlBasedObject$setChangeXml(value)
{
	 var p = this.properties;
	 p.changeXml = value;
	 p.changeXmlDocument = undefined;
};

/*
	Gets a changed xml string from the object.
*/
SDL.Client.Models.Base.EditableXmlBasedObject.prototype.getChangeXml = function SDL$Client$Models$Base$EditableXmlBasedObject$getChangeXml()
{
	var p = this.properties;
	if (p.changeXml === undefined && p.changeXmlDocument)
	{
		p.changeXml = SDL.Client.Xml.getOuterXml(p.changeXmlDocument) || null;
	}
	return p.changeXml;
};

/*
	Gets a changed xml from the object as an xml document.
*/
SDL.Client.Models.Base.EditableXmlBasedObject.prototype.getChangeXmlDocument = function SDL$Client$Models$Base$EditableXmlBasedObject$getChangeXmlDocument()
{
	var p = this.properties;
	if (!p.changeXmlDocument)
	{
		var xml = this.getChangeXml();
		if (xml)
		{
			p.changeXmlDocument = SDL.Client.Xml.getNewXmlDocument(xml);
		}
	}
	return this.properties.changeXmlDocument;
};

SDL.Client.Models.Base.EditableXmlBasedObject.prototype._createChangeXml = function SDL$Client$Models$Base$EditableXmlBasedObject$_createChangeXml()
{
	var p = this.properties;
	if (!this.getChangeXml() && this.isLoaded())
	{
		var xmlDoc = SDL.Client.Xml.getNewXmlDocument(this.getXml());
		SDL.Client.Xml.setInnerText(xmlDoc.documentElement, "");
		p.changeXml = SDL.Client.Xml.getOuterXml(xmlDoc);
	}
	return p.changeXml;
};

SDL.Client.Models.Base.EditableXmlBasedObject.prototype._ensureXmlElement = function SDL$Client$Models$Base$EditableXmlBasedObject$_ensureXmlElement(xpath, parent)
{
	this._createChangeXml();
	var xmlDoc = this.getChangeXmlDocument();
	if (xmlDoc)
	{
		if (!parent)
		{
			parent = xmlDoc.documentElement;
		}

		var node;
		if (!xpath)
		{
			node = parent;
		}
		else
		{
			node = SDL.Client.Xml.selectSingleNode(parent, xpath)
			if (!node)
			{
				var m = xpath.match(/^(.*)\/([^\/]+)$/);
				if (m)
				{
					var parentXpath = m[1];
					if (parentXpath)
					{
						parent = this._ensureXmlElement(parentXpath, parent);
						xpath = m[2];
					}
				}
				m = xpath.match(/^(([^\:]+)\:)?([^\:]+)$/);
				if (m)
				{
					var prefix = m[2];
					var name = m[3];
					var ns = prefix ? SDL.Client.Xml.Namespaces[prefix] :"";

					node = SDL.Client.Xml.createElementNS(xmlDoc, ns, name);
					parent.appendChild(node);
					this.properties.changeXml = undefined;
				}
			}
		}
		return node;
	}
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.EditableXmlBasedObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$EditableXmlBasedObject$pack()
{
	var p = this.properties;
	return {
		changeXml: this.getChangeXml()
	};
});

SDL.Client.Models.Base.EditableXmlBasedObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$EditableXmlBasedObject$unpack(data)
{
	var p = this.properties;
	if (data)
	{
		p.changeXml = data.changeXml;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides/*! @namespace {SDL.Client.Models.Base.FilteredNavigationObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.FilteredNavigationObject");

/*
	Base implementation of a FilteredNavigationObject used for navigation.
*/
SDL.Client.Models.Base.FilteredNavigationObject.$constructor = function SDL$Client$Models$Base$FilteredNavigationObject$constructor(id, parentId, filter)
{
	this.addInterface("SDL.Client.Models.IdentifiableObject", [id]);

	var p = this.properties;
	p.parentId = parentId;
	p.filterOptions = filter;
	p.filter = null;
};

/*
	Returns the ID of an {SDL.Client.Models.Base.ListProvider} object that created the current list using {SDL.Client.Models.Base.ListProvider:getList} method.
*/
SDL.Client.Models.Base.FilteredNavigationObject.prototype.getParentId = function SDL$Client$Models$Base$FilteredNavigationObject$getParentId()
{
	return this.properties.parentId;
};

/*
	Returns an {SDL.Client.Models.Base.ListProvider} object that created the current list using {SDL.Client.Models.Base.ListProvider:getList} method.
*/
SDL.Client.Models.Base.FilteredNavigationObject.prototype.getParent = function SDL$Client$Models$Base$FilteredNavigationObject$getParent()
{
	return SDL.Client.Models.getItem(this.getParentId());
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that is used for creating an {SDL.Client.Models.Base.ListFilter} object
*/
SDL.Client.Models.Base.FilteredNavigationObject.prototype.getListFilterType = function SDL$Client$Models$Base$FilteredNavigationObject$getListFilterType()
{
	return "SDL.Client.Models.Base.ListFilter";
};

/*
	Returns a javascript object that is used for creating an {SDL.Client.Models.Base.ListFilter} object
*/
SDL.Client.Models.Base.FilteredNavigationObject.prototype.getListFilterOptions = function SDL$Client$Models$Base$FilteredNavigationObject$getListFilterOptions()
{
	return this.properties.filterOptions;
};

/*
	Returns an {SDL.Client.Models.Base.ListFilter} object
*/
SDL.Client.Models.Base.FilteredNavigationObject.prototype.getListFilter = function SDL$Client$Models$Base$FilteredNavigationObject$getListFilter()
{
	var p = this.properties;
	if (!p.filter)
	{
		var filterType = SDL.Client.Type.resolveNamespace(this.getListFilterType());
		p.filter = new filterType(p.filterOptions);
	}
	return p.filter;
};

/*
	Returns true if the current list object can be used for the specified filter (see {SDL.Client.Models.Base.ListProvider:getList}).
*/
SDL.Client.Models.Base.FilteredNavigationObject.prototype.isFilterApplied = function SDL$Client$Models$Base$FilteredNavigationObject$isFilterApplied(filter)
{
	return this.getListFilter().equals(filter);
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.FilteredNavigationObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$FilteredNavigationObject$pack()
{
	var p = this.properties;
	return {
		parentId: p.parentId,
		filter: p.filter
	};
});

SDL.Client.Models.Base.FilteredNavigationObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$FilteredNavigationObject$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.parentId = data.parentId;
		if (data.filter)
		{
			p.filter = SDL.Client.Types.OO.importObject(data.filter);
		}
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides
/*! @namespace {SDL.Client.Models.Base.Item} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.Item");

/*
	Base implementation for a typical domain model item.
*/
SDL.Client.Models.Base.Item.$constructor = function SDL$Client$Models$Base$Item$constructor(id)
{
	this.addInterface("SDL.Client.Models.ModelObject", [id]);
	this.addInterface("SDL.Client.Models.LoadableObject");

	var p = this.properties;
	p.title;
	p.lastModified;
};

SDL.Client.Models.Base.Item.prototype.invalidateInterfaceCachedState = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Item$invalidateInterfaceCachedState()
{
	var p = this.properties;
	p.title = undefined;
});

SDL.Client.Models.Base.Item.prototype.getTitle = function SDL$Client$Models$Base$Item$getTitle()
{
	return this.properties.title;
};

/*
	Returns the last modified date of the item, presented as an ISO string.
*/
SDL.Client.Models.Base.Item.prototype.getLastModifiedDateString = function SDL$Client$Models$Base$Item$getLastModifiedDateString()
{
	return this.properties.lastModified;
};

/*
	Returns the ID of the item as stored in its managing CMS.
	Example:
		var id = Cmis.Model.getModelSpecificUri("workspace://SpacesStore/2c5de88b-92cb-403c-ab13-43e87f9490b1",
			"f16674d1-a258-4d64-bafb-55eb44a4d8be", {SDL.Client.Models.ItemType}.CMIS_DOCUMENT);
		var item = {SDL.Client.Models}.getItem(id);
		item.getId();			//	"cmis:document/f16674d1-a258-4d64-bafb-55eb44a4d8be/workspace%3A%2F%2FSpacesStore%2F2c5de88b-92cb-403c-ab13-43e87f9490b1"
		item.getOriginalId();	//	"workspace://SpacesStore/2c5de88b-92cb-403c-ab13-43e87f9490b1"
*/
SDL.Client.Models.Base.Item.prototype.getOriginalId = function SDL$Client$Models$Base$Item$getOriginalId()
{
	return this.getModelFactory().getOriginalId(this.getId());
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.Item.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Item$pack()
{
	var p = this.properties;
	return {
		title: p.title,
		lastModified: p.lastModified
	};
});

SDL.Client.Models.Base.Item.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Item$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.title = data.title;
		p.lastModified = data.lastModified;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides/*! @namespace {SDL.Client.Models.Base.List} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.List");

/*
	Base implementation of a List object used for navigating.
*/
SDL.Client.Models.Base.List.$constructor = function SDL$Client$Models$Base$List$constructor(id, parentId, filter)
{
	this.addInterface("SDL.Client.Models.Base.FilteredNavigationObject", [id, parentId, filter]);
	this.addInterface("SDL.Client.Models.UpdatableListObject", [id]);

	var p = this.properties;
	p.items;
};

SDL.Client.Models.Base.List.prototype.invalidateInterfaceCachedState = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$List$invalidateInterfaceCachedState()
{
	this.properties.items = undefined;
});

SDL.Client.Models.Base.List.prototype.isLoaded = function SDL$Client$Models$Base$List$isLoaded(checkCacheValidity)
{
	return !!this.getItems(checkCacheValidity);
};

SDL.Client.Models.Base.List.prototype.getItems = function SDL$Client$Models$Base$List$getItems(onlyValiadCache)
{
	return (!onlyValiadCache || this.isCacheValid()) && this.properties.items;
};

SDL.Client.Models.Base.List.prototype.getItem = function SDL$Client$Models$Base$List$getItem(id)
{
	// to be overridden
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.List.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$List$pack()
{
	var p = this.properties;
	return {
		items: p.items
	};
});

SDL.Client.Models.Base.List.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$List$unpack(data)
{
	if (data && data.items)
	{
		var items = this.properties.items = [];
		for (var i = 0, len = data.items.length; i < len; i++)
		{
			items.push(SDL.Client.Types.Object.clone(data.items[i]));
		}
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides
/*! @namespace {SDL.Client.Models.Base.ListFilter} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ListFilter");

/*
	Base implementation of a filter object passed as a parameter to {SDL.Client.Models.Base.ListProvider}::getList() method.
	ListFilter defines the types of items to be returned/shown in a specific list.
*/
SDL.Client.Models.Base.ListFilter.$constructor = function SDL$Client$Models$Base$ListFilter$constructor(properties)
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	if (properties)
	{
		var p = this.properties;

		p.forTree = properties.forTree;
		if (properties.itemTypes)
		{
			p.itemTypes = SDL.Client.Types.Array.normalize(SDL.Client.Types.Array.clone(properties.itemTypes));
		}
		p.relatedItem = properties.relatedItem;
		p.searchText = properties.searchText;
	}
};

SDL.Client.Models.Base.ListFilter.prototype.setForTree = function SDL$Client$Models$Base$ListFilter$setForTree(value)
{
	this.properties.forTree = value;
};

SDL.Client.Models.Base.ListFilter.prototype.getForTree = function SDL$Client$Models$Base$ListFilter$getForTree()
{
	return this.properties.forTree || false;
};

SDL.Client.Models.Base.ListFilter.prototype.setItemTypes = function SDL$Client$Models$Base$ListFilter$setItemTypes(value)
{
	this.properties.itemTypes = value ? SDL.Client.Types.Array.normalize(SDL.Client.Types.Array.clone(value)) : undefined;
};

SDL.Client.Models.Base.ListFilter.prototype.getItemTypes = function SDL$Client$Models$Base$ListFilter$getItemTypes()
{
	return this.properties.itemTypes || null;
};

SDL.Client.Models.Base.ListFilter.prototype.setRelatedItem = function SDL$Client$Models$Base$ListFilter$setRelatedItem(value)
{
	this.properties.relatedItem = value;
};

SDL.Client.Models.Base.ListFilter.prototype.getRelatedItem = function SDL$Client$Models$Base$ListFilter$getRelatedItem()
{
	return this.properties.relatedItem || null;
};

SDL.Client.Models.Base.ListFilter.prototype.setSearchText = function SDL$Client$Models$Base$ListFilter$setSearchText(value)
{
	this.properties.searchText = value;
};

SDL.Client.Models.Base.ListFilter.prototype.getSearchText = function SDL$Client$Models$Base$ListFilter$getSearchText()
{
	return this.properties.searchText || null;
};

SDL.Client.Models.Base.ListFilter.prototype.equals = function SDL$Client$Models$Base$ListFilter$equals(filter)
{
	if (filter)
	{
		if (SDL.Client.Types.OO.implementsInterface(filter, "SDL.Client.Models.Base.ListFilter"))
		{
			return (this == filter) ||
				(
					this.getForTree() == filter.getForTree() &&
					this.getRelatedItem() == filter.getRelatedItem() &&
					this.getSearchText() == filter.getSearchText() &&
					SDL.Client.Types.Array.areEqual(this.getItemTypes(), filter.getItemTypes())
				);
		}
		else
		{
			return (this.getForTree() == (filter.forTree || false) &&
				this.getRelatedItem() == (filter.relatedItem || null) &&
				this.getSearchText() == (filter.searchText || null) &&
				SDL.Client.Types.Array.areEqual(this.getItemTypes(), filter.itemTypes || null));
		}
	}
	else
	{
		return !this.getForTree() && !this.getRelatedItem() && !this.getItemTypes();
	}
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.ListFilter.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ListFilter$pack()
{
	var p = this.properties;
	return {
		forTree: p.forTree,
		itemTypes: p.itemTypes,
		relatedItem: p.relatedItem,
		searchText: p.searchText
	};
});

SDL.Client.Models.Base.ListFilter.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ListFilter$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.forTree = data.forTree;
		if (data.itemTypes)
		{
			p.itemTypes = SDL.Client.Types.Array.clone(data.itemTypes);
		}
		p.relatedItem = data.relatedItem;
		p.searchText = data.searchText;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides/*! @namespace {SDL.Client.Models.Base.ListProvider} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ListProvider");

/*
	Base implementation of an object used for navigation
*/
SDL.Client.Models.Base.ListProvider.$constructor = function SDL$Client$Models$Base$ListProvider$constructor(id)
{
	this.addInterface("SDL.Client.Models.ModelObject", [id]);
	var p = this.properties;
	p.lists = [];
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that is used for creating an {SDL.Client.Models.Base.List} object
	returned by {SDL.Client.Models.Base.ListProvider:getList}.
*/
SDL.Client.Models.Base.ListProvider.prototype.getListType = function SDL$Client$Models$Base$ListProvider$getListType(filter)
{
	return "SDL.Client.Models.Base.List";
};

SDL.Client.Models.Base.ListProvider.prototype.getList = function SDL$Client$Models$Base$ListProvider$getList(filter)
{
	filter = SDL.Client.Types.Object.clone(filter);

	var p = this.properties;

	for (var i = 0, len = p.lists.length; i < len; i++)
	{
		var list = SDL.Client.Models.getFromRepository(p.lists[i]);
		if (list.isFilterApplied(filter))
		{
			return list;
		}
	}

	var listType = this.getListType(filter);
	var id = this.getId();
	var model = this.getModelFactory();
	var listId = model.getModelSpecificUri(id + "-" + SDL.Client.Models.getUniqueId(), model.getListType());
	p.lists.push(listId);
	return SDL.Client.Models.createInRepository(listId, listType, listId, id, filter);
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.ListProvider.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ListProvider$pack()
{
	var p = this.properties;
	return {
		lists: p.lists
	};
});

SDL.Client.Models.Base.ListProvider.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ListProvider$unpack(data)
{
	if (data && data.lists)
	{
		var p = this.properties;
		p.lists = SDL.Client.Types.Array.clone(data.lists);
	}
});

// ------- end of SDL.Client.Models.MarshallableObject overrides
/*! @namespace {SDL.Client.Models.Base.ModelFactory} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ModelFactory");

/*
	Implements a model factory that can be used as a base for other model factories.
*/
SDL.Client.Models.Base.ModelFactory.$constructor = function SDL$Client$Models$Base$ModelFactory$constructor()
{
	this.addInterface("SDL.Client.Models.ModelFactory");

	var p = this.properties;
	p.idMatchRegExp;

	p.settings = {
		// prefix used by the current instance of domain model factory
		prefix: undefined
	};
};

/*
	Returns a string used as a prefix for item ID's managed by the current model factory.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getPrefix = function SDL$Client$Models$Base$ModelFactory$getPrefix()
{
	return this.properties.settings.prefix;
};

SDL.Client.Models.Base.ModelFactory.prototype.getItemType = function SDL$Client$Models$Base$ModelFactory$getItemType(item)
{
	if (item)
	{
		if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
		{
			item = item.getId();
		}

		if (SDL.Client.Type.isString(item))
		{
			var m = item.match(this.getIdMatchRegExp());
			if (m)
			{
				return m[1] + m[2];
			}
			else
			{
				return item;
			}
		}
	}
};

/*
	Returns the ID of the global root folder {SDL.Client.Models.Base.ModelsBrowser}.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getSystemRootId = function SDL$Client$Models$Base$ModelFactory$getSystemRootId()
{
	return null;
};

/*
	Returns the title of the root folder of the system represented by the current model factory.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getSystemRootTitle = function SDL$Client$Models$Base$ModelFactory$getSystemRootTitle()
{
	return null;
};

/*
	Returns the root folder {SDL.Client.Models.Base.ListProvider} of the system represented by the current model factory.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getSystemRoot = function SDL$Client$Models$Base$ModelFactory$getSystemRoot()
{
	var id = this.getSystemRootId();
	if (id)
	{
		return this.getItem(id);
	}
};

/*
	Returns true if the provided id is for the specific domain model factory.
	Example:
		SDL.Client.Models.URL.Model.isModelSpecificUri("url:document//schemas/schema.xsd");
				// true, ID is using the domain model prefix
		CMIS.Model.isModelSpecificUri("url:document//schemas/schema.xsd");
				// false, domain model prefix does not match the ID prefix
		SDL.Client.Models.URL.Model.isModelSpecificUri("/schemas/schema.xsd");
				// false, ID is not using the domain model prefix
*/
SDL.Client.Models.Base.ModelFactory.prototype.isModelSpecificUri = function SDL$Client$Models$Base$ModelFactory$isModelSpecificUri(id)
{
	return this.getIdMatchRegExp().test(id);
},

/*
	Returns a model specific ID for the id and the item type specified.
	Example:
		SDL.Client.Models.URL.Model.getModelSpecificUri("/schemas/schema.xsd", {SDL.Client.Models.ItemType}.BASE_URL_DOCUMENT);
				// returns "url:document//schemas/schema.xsd"
*/
SDL.Client.Models.Base.ModelFactory.prototype.getModelSpecificUri = function SDL$Client$Models$Base$ModelFactory$getModelSpecificUri(id, type)
{
	return type + "/" + this.getOriginalId(id);
};

/*
	Returns the original id. Reverse of {SDL.Client.Models.Base.ModelFactory:getModelSpecificUri}.
	Example:
		SDL.Client.Models.URL.Model.getOriginalId("url:document//schemas/schema.xsd");
				// returns "/schemas/schema.xsd"
*/
SDL.Client.Models.Base.ModelFactory.prototype.getOriginalId = function SDL$Client$Models$Base$ModelFactory$getOriginalId(modelSpecificId)
{
	return modelSpecificId.replace(this.getIdMatchRegExp(), "");
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that corresponds to the folder type.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getFolderType = function SDL$Client$Models$Base$ModelFactory$getFolderType()
{
	return this.properties.settings.prefix + "folder";
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that corresponds to the document type for documents.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getDocumentType = function SDL$Client$Models$Base$ModelFactory$getDocumentType()
{
	return  this.properties.settings.prefix + "document";
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that corresponds to the list type.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getListType = function SDL$Client$Models$Base$ModelFactory$getListType()
{
	return  this.properties.settings.prefix + "list";
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that corresponds to the list type.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getTreeType = function SDL$Client$Models$Base$ModelFactory$getTreeType()
{
	return  this.properties.settings.prefix + "tree";
};

/*
	Returns a regular expression that matches ID's of items managed by the current domain model factory.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getIdMatchRegExp = function SDL$Client$Models$Base$ModelFactory$getIdMatchRegExp()
{
	var p = this.properties;
	if (p.idMatchRegExp === undefined)
	{
		p.idMatchRegExp = new RegExp("^(" + SDL.Client.Types.RegExp.escape(p.settings.prefix) + ")([^\\/]+)(\\/?|$)");
	}
	return p.idMatchRegExp;
};

/*
	Returns settings for the current Model Factory.The settings object defines the properties that can be overridden in child classes
*/
SDL.Client.Models.Base.ModelFactory.prototype.getSettings = function SDL$Client$Models$Base$ModelFactory$getSettings()
{
	return this.properties.settings;
};/*! @namespace {SDL.Client.Models.Base.ObjectWithEditor} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ObjectWithEditor");

SDL.Client.Models.Base.ObjectWithEditor.$constructor = function SDL$Client$Models$Base$ObjectWithEditor$constructor(id)
{
	this.addInterface("SDL.Client.Models.MarshallableObject");
	this.properties.display;
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.openInEditor = function SDL$Client$Models$Base$ObjectWithEditor$openInEditor(url, optWindow, params, features)
{
	var display = this.getEditor();
	var hasPopupBlocker = false;
	if (!display)
	{
		// fix for gecko to be able to open the popup, otherwise firefox won't open it :(
		var prefix = "";
		if (SDL.jQuery.browser.mozilla)
		{
			var loc = window.location;
			prefix = loc.protocol + "//" + loc.hostname + ((loc.port == 80) ? "" : (":" + loc.port));
		}

		this.properties.display = display = optWindow ||
			(
				features
					? window.open(prefix + this.expandEditorUrl(url, params), "", features)
					: window.open(prefix + this.expandEditorUrl(url, params))
			);
		
		if (!display)
		{
			this.fireEvent("editoropenfailed");
		} 
		else
		{
			this.fireEvent("editoropen");
		}
	}
	else if (display != optWindow)
	{
		setTimeout(this.getDelegate(this.forceFocusToEditor), 0);
	}

	if (display)
	{
		display.focus();
	}

	return display;
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.forceFocusToEditor = function SDL$Client$Models$Base$ObjectWithEditor$forceFocusToEditor()
{
	var display = this.getEditor();
	if (display)
	{
		display.alert(this.getMessageAlreadyOpen());
	}
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.getMessageItemAlreadyOpen = function SDL$Client$Models$Base$ObjectWithEditor$getMessageItemAlreadyOpen()
{
	return "Item is already open.";
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.closeEditor = function SDL$Client$Models$Base$ObjectWithEditor$closeEditor(optWindow)
{
	var display = this.getEditor();
	if (display)
	{
		display.close();
	}
	return display;
};

/*
	Item editor implementation should call item.onEditorUnload when the editor window gets closed
*/
SDL.Client.Models.Base.ObjectWithEditor.prototype.onEditorUnload = function SDL$Client$Models$Base$ObjectWithEditor$onEditorUnload()
{
	this.properties.display = undefined;
	this.fireEvent("editorclose");
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.getEditor = function SDL$Client$Models$Base$ObjectWithEditor$getEditor()
{
	var display = this.properties.display;
	if (display && !display.closed)
	{
		try
		{
			//if (!!(display.SDL))	// <- commented out because it causes a memory leak in IE
			{
				return display;
			}
		}
		catch (err)
		{
			// the window appears to have been reloaded, can't access
		}
	}
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.expandEditorUrl = function SDL$Client$Models$Base$ObjectWithEditor$expandEditorUrl(url, params)
{
	SDL.Client.Diagnostics.Assert.raiseError("Editor URL is undefined for this item.");
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.getShortcutUrl = function SDL$Client$Models$Base$ObjectWithEditor$getShortcutUrl(url)
{
	SDL.Client.Diagnostics.Assert.raiseError("Shortcut URL is undefined for this item.");
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.ObjectWithEditor.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ObjectWithEditor$pack()
{
	var display = this.getEditor();
	return !display || ((display == window) && SDL.Client.Event.EventRegister.isUnloading()) ? null : {"display": display};
});

SDL.Client.Models.Base.ObjectWithEditor.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ObjectWithEditor$unpack(data)
{
	if (data)
	{
		this.properties.display = data.display;
	}
});

// ------- end of SDL.Client.Models.MarshallableObject overrides
/*! @namespace {SDL.Client.Models.Base.TreeProvider} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.TreeProvider");

/*
	Base implementation of an object used for tree navigation
*/
SDL.Client.Models.Base.TreeProvider.$constructor = function SDL$Client$Models$Base$TreeProvider$constructor(id)
{
	this.addInterface("SDL.Client.Models.Base.ListProvider", [id]);
	var p = this.properties;
	p.trees = [];
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that is used for creating an {SDL.Client.Models.Base.Tree} object
	returned by {SDL.Client.Models.Base.TreeProvider:getTree}.
*/
SDL.Client.Models.Base.TreeProvider.prototype.getTreeType = function SDL$Client$Models$Base$TreeProvider$getTreeType(filter)
{
	return "SDL.Client.Models.Base.Tree";
};

SDL.Client.Models.Base.TreeProvider.prototype.getTree = function SDL$Client$Models$Base$TreeProvider$getTree(filter)
{
	filter = SDL.Client.Types.Object.clone(filter);

	var p = this.properties;

	for (var i = 0, len = p.trees.length; i < len; i++)
	{
		var tree = SDL.Client.Models.getFromRepository(p.trees[i]);
		if (tree.isFilterApplied(filter))
		{
			return tree;
		}
	}

	var treeType = this.getTreeType(filter);
	var id = this.getId();
	var model = this.getModelFactory();
	var treeId = model.getModelSpecificUri(id + "-" + SDL.Client.Models.getUniqueId(), model.getTreeType());
	p.trees.push(treeId);
	return SDL.Client.Models.createInRepository(treeId, treeType, treeId, id, filter);
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.TreeProvider.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$TreeProvider$pack()
{
	var p = this.properties;
	return {
		trees: p.trees
	};
});

SDL.Client.Models.Base.TreeProvider.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$TreeProvider$unpack(data)
{
	if (data && data.trees)
	{
		var p = this.properties;
		p.trees = SDL.Client.Types.Array.clone(data.trees);
	}
});

// ------- end of SDL.Client.Models.MarshallableObject overrides
/*! @namespace {SDL.Client.Models.Base.Tree} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.Tree");

SDL.Client.Models.Base.Tree.$constructor = function SDL$Client$Models$Base$Tree$constructor(id, parentId, filter)
{
	this.addInterface("SDL.Client.Models.Base.FilteredNavigationObject", [id, parentId, filter]);

	var p = this.properties;

	var item = SDL.Client.Models.getItem(parentId);
	if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.Base.Item"))
	{
		SDL.Client.Event.EventRegister.addEventHandler(item, "staticload", this.getDelegate(this.processItemUpdated));
	}
	
	p.lists = {};		// ListProvider id -> list id
	p.paths = {};		// child -> parent relationships
	p.searching = {};
	p.loadingTrees = {};
};

SDL.Client.Models.Base.Tree.prototype.tryGetListId = function SDL$Client$Models$Base$Tree$tryGetListId(item)
{
	if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		return this.properties.lists[item.getId()];
	}
};

SDL.Client.Models.Base.Tree.prototype.getList = function SDL$Client$Models$Base$Tree$getList(item)
{
	var listId = this.tryGetListById(item) || this.addList(item);
	return listId ? SDL.Client.Models.getItem(listId) : null;
};

SDL.Client.Models.Base.Tree.prototype.addList = function SDL$Client$Models$Base$Tree$addList(item, list)
{
	var p = this.properties;
	var itemId;

	if (SDL.Client.Type.isString(item))
	{
		itemId = item;
		item = SDL.Client.Models.getItem(itemId);
	}

	if (!list)
	{
		if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.Base.ListProvider"))
		{
			list = item.getList(this.getListFilterOptions());
		}
	}
	else if (SDL.Client.Type.isString(list))
	{
		list = SDL.Client.Models.getItem(list);
	}
	
	if (SDL.Client.Types.OO.implementsInterface(list, "SDL.Client.Models.Base.List"))
	{
		if (!itemId && SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
		{
			itemId = item.getId();
		}

		var listId = p.lists[itemId] = list.getId();

		SDL.Client.Event.EventRegister.addEventHandler(item, "delete", this.getDelegate(this.processItemDeleted));
		SDL.Client.Event.EventRegister.addEventHandler(list, "*", this.getDelegate(this.listEventHandler));
		return listId;
	}
	else
	{
		return null;
	}
};

SDL.Client.Models.Base.Tree.prototype.removeList = function SDL$Client$Models$Base$Tree$removeList(item)
{
	var itemId;
	if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	var lists = this.properties.lists;
	var list = SDL.Client.Models.getItem(lists[itemId]);
	if (list)
	{
		if (SDL.Client.Type.isString(item))
		{
			item = SDL.Client.Models.getItem(item);
		}
		SDL.Client.Event.EventRegister.removeEventHandler(item, "delete", this.getDelegate(this.processItemDeleted));
		SDL.Client.Event.EventRegister.removeEventHandler(list, "*", this.getDelegate(this.listEventHandler));

		delete lists[itemId];
	}
	return list;
};

SDL.Client.Models.Base.Tree.prototype.processItemUpdated = function SDL$Client$Models$Base$Tree$processItemUpdated(event)
{
	this.fireEvent("itemupdate", {itemId: event.target.getId()});
};

SDL.Client.Models.Base.Tree.prototype.listEventHandler = function SDL$Client$Models$Base$Tree$listEventHandler(event)
{
	switch (event.type)
	{
		case "load":
			this.processListLoaded(event);
			break;
		case "loadfailed":
			this.processListLoaded(event);
			break;
		case "unload":
			this.fireEvent("unload", {id: SDL.Client.Types.Object.find(this.properties.lists, event.target.getId())});
			break;
		case "dispose":
			this.removeList(event.target.getParentId());
			break;
		case "itemadd":
		case "itemupdate":
		case "itemremove":
			this.fireEvent(event.type, {id: SDL.Client.Types.Object.find(this.properties.lists, event.target.getId()), itemId: event.data.itemId});
			break;
	}
}

/*
	Returns an 'array of arrays' - hierarchical structure of the tree, built from the lists included in the tree
*/
SDL.Client.Models.Base.Tree.prototype.getItems = function SDL$Client$Models$Base$Tree$getItems(item, toIds, onlyValidCache)
{
	var p = this.properties;
	var itemId;
	if (!item)
	{
		itemId = p.parentId;
		item = SDL.Client.Models.getItem(p.parentId);
	}
	else if (SDL.Client.Type.isString(item))
	{
		itemId = item;
		item = SDL.Client.Models.getItem(itemId);
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	var listRootEntry = {item: item, id: itemId};

	if (item)
	{
		var list = this.getList(item);
		if (list)
		{
			listRootEntry.canHaveChildren = true;

			var items = list.getItems(onlyValidCache);
			if (items)
			{
				// list loaded
				listRootEntry.items = SDL.jQuery.map(items, function (item) { return SDL.Client.Types.Object.clone(item); });

				if (toIds && toIds.length)
				{
					for (var i = 0, len = toIds.length; i < len; i++)
					{
						var path = this.getPath(toIds[i], itemId);
						if (path && path.length > 1 && path[0] == itemId)
						{
							var parentList = listRootEntry.items;
							for (var j = 1, lenj = path.length - 1; j < lenj && parentList; j++)
							{
								var id = path[j];
								var child;
								for (var k = 0, lenk = parentList.length; k < lenk; k++)
								{
									if (parentList[k].id == id)
									{
										child = parentList[k];
										break;
									}
								}
								if (child)
								{
									if (child.canHaveChildren == undefined)
									{
										// child's list is not 'loaded'
										list = this.getList(id);
										if (list)
										{
											child.canHaveChildren = true;

											items = list.getItems(onlyValidCache);
											if (items)
											{
												child.items = SDL.jQuery.map(items, function (item) { return SDL.Client.Types.Object.clone(item); });
											}
										}
										else
										{
											child.canHaveChildren = false;
										}
									}
									parentList = child.items;
								}
								else
								{
									// the ancestor is not in the available structure -> cannot expand to the item
									break;
								}
							}
						}
					}
				}
			}
		}
		else
		{
			listRootEntry.canHaveChildren = false;
		}
	}
	return listRootEntry;
};

SDL.Client.Models.Base.Tree.prototype.isLoaded = function SDL$Client$Models$Base$Tree$isLoaded(item, toIds, checkCacheValidity)
{
	var p = this.properties;
	var itemId;
	if (!item)
	{
		itemId = p.parentId;
		item = SDL.Client.Models.getItem(p.parentId);
	}
	else if (SDL.Client.Type.isString(item))
	{
		itemId = item;
		item = SDL.Client.Models.getItem(itemId);
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	var list = this.getList(item);
	if (list)
	{
		var items = list.getItems(onlyValidCache);
		if (!items)
		{
			return false;
		}

		if (toIds && toIds.length)
		{
			for (var i = 0, len = toIds.length; i < len; i++)
			{
				var path = this.getPath(toIds[i], itemId);
				if (!path)
				{
					return false;
				}

				if (path && path.length > 1 && path[0] == itemId)
				{
					var parentList = items;
					for (var j = 1, lenj = path.length - 1; j < lenj && parentList; j++)
					{
						var id = path[j];
						var child;
						for (var k = 0, lenk = parentList.length; k < lenk; k++)
						{
							if (parentList[k].id == id)
							{
								child = parentList[k];
								break;
							}
						}

						parentList = null;

						if (child)
						{
							list = this.getList(id);
							if (list)
							{
								parentList = list.getItems(onlyValidCache);
								if (!parentList)
								{
									return false;
								}
							}
						}
					}
				}
			}
		}
	}
	return true;
};

SDL.Client.Models.Base.Tree.prototype.invalidateCache = function SDL$Client$Models$Base$Tree$invalidateCache()
{
	var lists = this.properties.lists;
	for (var id in lists)
	{
		var list = SDL.Client.Models.getItem(lists[id]);
		if (list)
		{
			list.invalidateCache();
		}
	}
};

SDL.Client.Models.Base.Tree.prototype.unload = function SDL$Client$Models$Base$Tree$unload(item)
{
	var itemId;
	if (!item)
	{
		itemId = p.parentId;
	}
	else if (SDL.Client.Type.isString(item))
	{
		itemId = item;
		item = SDL.Client.Models.getItem(itemId);
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	this._unload(item);
	this.fireEvent("unload", {id: itemId, deep: true});
};

SDL.Client.Models.Base.Tree.prototype._unload = function SDL$Client$Models$Base$Tree$_unload(item)
{
	var list = this.removeList(item);
	
	var paths = this.properties.paths;
	var children = [];

	// collect all known child nodes
	for (var id in paths)
	{
		if (paths[id] == item)
		{
			children.push(id);
		}
	}

	// remove child->parent information
	var i;
	var len = children.length;
	for (i = 0; i < len; i++)
	{
		var child = children[i];
		delete paths[child];
	}

	// unload the current list
	if (list)
	{
		list.unload();
	}
	
	//unload all cached sub nodes
	for (i = 0; i < len; i++)
	{
		this._unload(children[i]);
	}
};

SDL.Client.Models.Base.Tree.prototype.load = function SDL$Client$Models$Base$Tree$load(item, toIds, refresh)
{
	if (refresh || !this.isLoaded(item, toIds, true))
	{
		var p = this.properties;

		var itemId;
		if (!item)
		{
			itemId = p.parentId;
		}
		else if (SDL.Client.Type.isString(item))
		{
			itemId = item;
			item = SDL.Client.Models.getItem(itemId);
		}
		else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
		{
			itemId = item.getId();
		}

		var loadingTree = p.loadingTrees[itemId];

		if (toIds && toIds.length > 0)
		{
			var i, len;

			if (!loadingTree)
			{
				loadingTree = p.loadingTrees[itemId] = {refresh: refresh};
			}
			else if (!loadingTree.refresh && refresh)
			{
				loadingTree.refresh = true;
			}

			if (!SDL.jQuery.isEmptyObject(loadingTree.toIds))
			{
				var localToIds = [];
				for (i = 0, len = toIds.length; i < len; i++)
				{
					var toId = toIds[i];
					if (!(toId in loadingTree.toIds))
					{
						loadingTree.toIds[toId] = false;
						localToIds.push(toId);
					}
				}
				for (i = 0, len = localToIds.length; i < len; i++)
				{
					this.findItem(localToIds[i], refresh);
				}
			}
			else
			{
				loadingTree.toIds = {};
				len = toIds.length;

				for (i = 0; i < len; i++)
				{
					loadingTree.toIds[toIds[i]] = false;
				}
				for (i = 0; i < len; i++)
				{
					this.findItem(toIds[i], refresh);
				}
			}
		}
		else if (!loadingTree)
		{
			p.loadingTrees[itemId] = {refresh: refresh};
			this.loadLists(itemId);
		}
	}
};

SDL.Client.Models.Base.Tree.prototype.processFindItem = function SDL$Client$Models$Base$Tree$processFindItem(id)
{
	var loadingTrees = this.properties.loadingTrees;
	for (var itemId in loadingTrees)
	{
		var toIds = loadingTrees[itemId].toIds;
		if (toIds && toIds[id] === false)
		{
			toIds[id] = true;
			for (var i in toIds)
			{
				if (toIds[i] === false)
				{
					return;
				}
			}
			// when all items are found -> load all needed lists for the item
			this.loadLists(itemId);
		}
	}
};

SDL.Client.Models.Base.Tree.prototype.loadLists = function SDL$Client$Models$Base$Tree$loadLists(item)
{
	var itemId;
	if (SDL.Client.Type.isString(item))
	{
		itemId = item;
		item = SDL.Client.Models.getItem(itemId);
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	var loadingTree = this.properties.loadingTrees[itemId];
	var lists = loadingTree.lists;
	if (!lists)
	{
		lists = loadingTree.lists = {};
	}

	var list = this.getList(item);
	var listId = list.getId();

	if (loadingTree.refresh || !list.isLoaded(true))
	{
		lists[listId] = false;
		list.load(loadingTree.refresh);
	}

	var toIds = loadingTree.toIds;
	if (toIds)
	{
		for (var id in toIds)
		{
			var path = this.getPath(id, item);
			if (path && path.length > 1 && path[0] == itemId)
			{
				for (var j = 1, lenj = path.length - 1; j < lenj; j++)
				{
					list = this.getList(path[j]);
					listId = list.getId();
					if (!(listId in lists) && (loadingTree.refresh || !list.isLoaded(true)))
					{
						lists[listId] = false;
						list.load(loadingTree.refresh);
					}
				}
			}
		}
	}

	this.processTreeLoaded(itemId);	// see if everything is loaded
};

SDL.Client.Models.Base.Tree.prototype.processTreeLoaded = function SDL$Client$Models$Base$Tree$processTreeLoaded(item)
{
	var itemId;
	if (SDL.Client.Type.isString(item))
	{
		itemId = item;
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	var loadingTrees = this.properties.loadingTrees;
	var loadingTree = loadingTrees[itemId];
	var lists = loadingTree.lists;
	for (var list in lists)
	{
		if (!lists[list])
		{
			// not everything is loaded yet
			return;
		}
	}

	var toIds = loadingTree.toIds;
	for (var id in toIds)
	{
		if (!toIds[id])
		{
			// not all paths are resolved yet
			return;
		}
	}

	// all lists are loaded
	var toIds = SDL.jQuery.map(toIds, function(item, id) { return id; } );
	delete loadingTrees[itemId];
	this.fireEvent("load", {id: itemId, toIds: toIds});
};

SDL.Client.Models.Base.Tree.prototype.processListLoaded = function SDL$Client$Models$Base$Tree$processListLoaded(event)
{
	var id = event.target.getId();
	var loadingTrees = this.properties.loadingTrees;

	var fireEvent = true;
	var allLists = this.properties.lists;
	for (var item in loadingTrees)
	{
		if (allLists[item] == id)
		{
			fireEvent = false;
		}
	}
	if (fireEvent)
	{
		// if there is no subtree being loaded for this list -> fire the list's event, otherwise the subtree will fire its own event when loaded
		this.fireEvent("load", {id: SDL.Client.Types.Object.find(allLists, id)});
	}
	
	for (var item in loadingTrees)
	{
		var lists = loadingTrees[item].lists;
		if (lists && lists[id] === false)
		{
			lists[id] = true;
			this.processTreeLoaded(item);
		}
	}

};

SDL.Client.Models.Base.Tree.prototype.processItemDeleted = function SDL$Client$Models$Base$Tree$processItemDeleted(event)
{
	var item = event.target;
	if (item)
	{
		var list = this.removeList(item);
		var paths = this.properties.paths;
		var children = [];

		item = item.getId();
		// collect all known child nodes
		for (var id in paths)
		{
			if (paths[id] == item)
			{
				children.push(id);
			}
		}

		// remove child->parent information
		var i;
		var len = children.length;
		for (i = 0; i < len; i++)
		{
			var child = children[i];
			delete paths[child];
			var childItem = SDL.Client.Models.getItem(child);
			if (SDL.Client.Types.OO.implementsInterface(childItem, "SDL.Client.Models.LoadableObject"))
			{
				childItem._invalidateCachedState();
			}
		}
	}
};
SDL.Client.Models.Base.Tree.prototype.isSearchingItem = function SDL$Client$Models$Base$Tree$isSearchingItem(item)
{
	var itemId;
	if (SDL.Client.Type.isString(item))
	{
		itemId = item;
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	return this.properties.searching[itemId] || false;
};

SDL.Client.Models.Base.Tree.prototype.findItem = function SDL$Client$Models$Base$Tree$findItem(item, refresh)
{
	var itemId;
	if (SDL.Client.Type.isString(item))
	{
		itemId = item;
		item = SDL.Client.Models.getItem(itemId);
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	if (itemId && !this.isSearchingItem(itemId))
	{
		var p = this.properties;
		p.searching[itemId] = true;

		var path;
		if (!refresh && (path = this.getPath(item)) && path.length > 0 && (path[0] == p.parentId))	// no need to go to the server, the data is available on the client
		{
			delete p.searching[itemId];
			this.processFindItem(itemId);
			this.fireEvent("finditem", { id: itemId, path: path });
		}
		else
		{
			var self = this;
			this.executeFindItem(itemId, p.parentId, function SDL$Client$Models$Base$Tree$findItem$onSuccess(path)
			{
				delete p.searching[itemId];
				self.processFindItem(itemId);
				self.fireEvent("finditem", { id: itemId, path: path });
			},
			function SDL$Client$Models$Base$Tree$findItem$onError(error)
			{
				delete p.searching[itemId];
				p.paths[itemId] = null;
				this.registerError(error);
				self.processFindItem(itemId);
				self.fireEvent("finditemfailed", { id: itemId, error: error });
			});
		}
	}
};

SDL.Client.Models.Base.Tree.prototype.getPath = function SDL$Client$Models$Base$Tree$getPath(item, fromItem)
{
	var paths = this.properties.paths;

	var itemId;
	if (SDL.Client.Type.isString(item))
	{
		itemId = item;
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	var parentId = this.properties.parentId;
	var fromItemId;
	if (!fromItem)
	{
		fromItemId = parentId;
	}
	else if (SDL.Client.Type.isString(fromItem))
	{
		fromItemId = fromItem;
	}
	else if (SDL.Client.Types.OO.implementsInterface(fromItem, "SDL.Client.Models.IdentifiableObject"))
	{
		fromItemId = fromItem.getId();
	}

	var path = [itemId];
	while (itemId && itemId != fromItemId && itemId != parentId)
	{
		var modelItem = SDL.Client.Models.getItem(itemId);
		var parent = undefined;
		if (modelItem)
		{
			// TODO: get parent item from modelItem, need an interface for that
			//parent = modelItem.getParentItem();
		}

		if (parent !== null)
		{
			paths[item] = parent;
			path.push(parent);
		}

		itemId = parent;
	}
	return path.reverse();
};

SDL.Client.Models.Base.Tree.prototype.registerError = function SDL$Client$Models$Base$Tree$registerError(error)
{
	SDL.Client.MessageCenter.registerError(error);
};

SDL.Client.Models.Base.Tree.prototype.executeFindItem = function SDL$Client$Models$Base$Tree$executeFindItem(id, parentId, success, failure)
{
	throw Error("SDL.Client.Models.Base.Tree does not implement executeFindItem() method.");
};
// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.Tree.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Tree$pack()
{
	var p = this.properties;
	return {
				searching: p.searching,
				lists: p.lists,
				paths: p.paths,
				loadingTrees: p.loadingTrees
			};
});

SDL.Client.Models.Base.Tree.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Tree$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.searching = SDL.Client.Types.Object.clone(data.searching);
		p.paths = SDL.Client.Types.Object.clone(data.paths);
		for (var item in data.loadingTrees)
		{
			var treeData = data.loadingTrees[item];
			p.loadingTrees[item] =
			{
				toIds: SDL.Client.Types.Object.clone(treeData.toIds),
				lists: SDL.Client.Types.Object.clone(treeData.lists),
				refresh: treeData.refresh
			}
		}
		for (var item in data.lists)
		{
			this.addList(item, data.lists[item]);
		}
	}
});

SDL.Client.Models.Base.Tree.prototype.afterInitializeMarshalledObject = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Tree$afterInitializeMarshalledObject(object)
{
	var searching = this.properties.searching;
	this.properties.searching = {};
	for (var id in searching)
	{
		//the tree was searching for the item before marshalling -> make sure the operation is finished
		this.findItem(id);
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides
/*! @namespace {SDL.Client.Models.Base.VersionableItem} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.VersionableItem");

/*
	Base implementation of an item with versioning (can check-out, check-in and undo check-out).
*/
SDL.Client.Models.Base.VersionableItem.$constructor = function SDL$Client$Models$Base$VersionableItem$constructor(id)
{
	this.addInterface("SDL.Client.Models.Base.EditableItem", [id]);

	var p = this.properties;
	p.checkingOut;
	p.cancelingCheckOut;
	p.checkingIn;

	p.canCheckOut;
	p.canCheckIn;
	p.canCancelCheckOut;
};

SDL.Client.Models.Base.VersionableItem.prototype.invalidateInterfaceCachedState = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$VersionableItem$invalidateInterfaceCachedState()
{
	var p = this.properties;
	p.canCheckOut =
	p.canCheckIn =
	p.canCancelCheckOut = undefined;
});

SDL.Client.Models.Base.VersionableItem.prototype.canCheckOut = function SDL$Client$Models$Base$VersionableItem$canCheckOut()
{
	return this.properties.canCheckOut;
};

SDL.Client.Models.Base.VersionableItem.prototype.canCheckIn = function SDL$Client$Models$Base$VersionableItem$canCheckIn()
{
	return this.properties.canCheckIn;
};

SDL.Client.Models.Base.VersionableItem.prototype.canCancelCheckOut = function SDL$Client$Models$Base$VersionableItem$canCancelCheckOut()
{
	return this.properties.canCancelCheckOut;
};

SDL.Client.Models.Base.VersionableItem.prototype.save = function SDL$Client$Models$Base$VersionableItem$save(doneEditing)
{
	if (doneEditing && !this.isCheckingIn())
	{
		if (this.canSave())
		{
			this._setCheckingIn();
			return this.callBase("SDL.Client.Models.Base.EditableItem", "save");
		}
		else
		{
			return this.checkIn();
		}
	}
	else
	{
		return this.callBase("SDL.Client.Models.Base.EditableItem", "save");
	}
};

SDL.Client.Models.Base.VersionableItem.prototype.isCheckedOut = function SDL$Client$Models$Base$VersionableItem$isCheckedOut()
{
	return (this.isLoaded() || undefined) && !this.canCheckOut() && (this.canCheckIn() || this.canCancelCheckOut());
};

SDL.Client.Models.Base.VersionableItem.prototype.isCheckingOut = function SDL$Client$Models$Base$VersionableItem$isCheckingOut()
{
	return this.properties.checkingOut;
};

SDL.Client.Models.Base.VersionableItem.prototype._setCheckingOut = function SDL$Client$Models$Base$VersionableItem$_setCheckingOut()
{
	this.properties.checkingOut = true;
	this.fireEvent("checkingout");
};

SDL.Client.Models.Base.VersionableItem.prototype._setCheckedOut = function SDL$Client$Models$Base$VersionableItem$_setCheckedOut()
{
	this.properties.checkingOut = false;
	this.fireEvent("checkout");
};

SDL.Client.Models.Base.VersionableItem.prototype._setCheckOutFailed = function SDL$Client$Models$Base$VersionableItem$_setCheckOutFailed(error, webRequest)
{
	this.properties.checkingOut = false;
	this.fireEvent("checkoutfailed", {error: error, errorCode: webRequest ? webRequest.statusCode : null});
};

SDL.Client.Models.Base.VersionableItem.prototype.checkOut = function SDL$Client$Models$Base$VersionableItem$checkOut()
{
	if (!this.isCheckedOut())
	{
		if (!this.isCheckingOut())
		{
			this._setCheckingOut();
			this._setLoading();
			this._executeCheckOut();
		}
		return true;
	}
	else
	{
		return false;
	}
};

SDL.Client.Models.Base.VersionableItem.prototype._executeCheckOut = function SDL$Client$Models$Base$VersionableItem$_executeCheckOut()
{
	this._onLoad();	// to be overridden
};

SDL.Client.Models.Base.VersionableItem.prototype.isCancelingCheckOut = function SDL$Client$Models$Base$VersionableItem$isCancelingCheckOut()
{
	return this.properties.cancelingCheckOut;
};

SDL.Client.Models.Base.VersionableItem.prototype._setCancelingCheckOut = function SDL$Client$Models$Base$VersionableItem$_setCancelingCheckOut()
{
	this.properties.cancelingCheckOut = true;
	this.fireEvent("cancelingcheckout");
};

SDL.Client.Models.Base.VersionableItem.prototype._setCanceledCheckOut = function SDL$Client$Models$Base$VersionableItem$_setCanceledCheckOut()
{
	this.properties.cancelingCheckOut = false;
	this.fireEvent("cancelcheckout");
};

SDL.Client.Models.Base.VersionableItem.prototype._setCancelCheckOutFailed = function SDL$Client$Models$Base$VersionableItem$_setCancelCheckOutFailed(error, webRequest)
{
	this.properties.cancelingCheckOut = false;
	this.fireEvent("cancelcheckoutfailed", {error: error, errorCode: webRequest ? webRequest.statusCode : null});
};


SDL.Client.Models.Base.VersionableItem.prototype.cancelCheckOut = function SDL$Client$Models$Base$VersionableItem$cancelCheckOut()
{
	if (!this.isCheckingIn() && this.canCancelCheckOut() != false)
	{
		if (!this.isCancelingCheckOut())
		{
			this._setCancelingCheckOut();
			if (this.properties.cancelingCheckOut) {
			  this._setLoading();
			  this._executeCancelCheckOut();
			} else {
			  return false;
			}
		}
		return true;
	}
	else
	{
		return false;
	}
};

SDL.Client.Models.Base.VersionableItem.prototype._executeCancelCheckOut = function SDL$Client$Models$Base$VersionableItem$_executeCancelCheckOut()
{
	this._onLoad();	// to be overridden
};

SDL.Client.Models.Base.VersionableItem.prototype.isCheckingIn = function SDL$Client$Models$Base$VersionableItem$isCheckingIn()
{
	return this.properties.checkingIn;
};

SDL.Client.Models.Base.VersionableItem.prototype._setCheckingIn = function SDL$Client$Models$Base$VersionableItem$_setCheckingIn()
{
	this.properties.checkingIn = true;
	this.fireEvent("checkingin");
};

SDL.Client.Models.Base.VersionableItem.prototype._setCheckedIn = function SDL$Client$Models$Base$VersionableItem$_setCheckedIn()
{
	this.properties.checkingIn = false;
	this.fireEvent("checkin");
};

SDL.Client.Models.Base.VersionableItem.prototype._setCheckInFailed = function SDL$Client$Models$Base$VersionableItem$_setCheckInFailed(error, webRequest)
{
	this.properties.checkingIn = false;
	this.fireEvent("checkinfailed", {error: error, errorCode: webRequest ? webRequest.statusCode : null});
};


SDL.Client.Models.Base.VersionableItem.prototype.checkIn = function SDL$Client$Models$Base$VersionableItem$checkIn()
{
	if (!this.isCancelingCheckOut() && this.canCheckIn() != false)
	{
		if (!this.isCheckingIn())
		{
			this._setCheckingIn();
			this._setLoading();
			this._executeCheckIn();
		}
		return true;
	}
	else
	{
		return false;
	}
};

SDL.Client.Models.Base.VersionableItem.prototype._executeCheckIn = function SDL$Client$Models$Base$VersionableItem$_executeCheckIn()
{
	this._onLoad();	// to be overridden
};

SDL.Client.Models.Base.VersionableItem.prototype.afterSetLoaded = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$VersionableItem$afterSetLoaded()
{
	if (this.isCheckingOut())
	{
		this._setCheckedOut();
	}
	if (this.isCancelingCheckOut())
	{
		this._setCanceledCheckOut();
	}
	if (this.isCheckingIn())
	{
		this._setCheckedIn();
	}
});

SDL.Client.Models.Base.VersionableItem.prototype.afterLoadFailed = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$VersionableItem$afterLoadFailed(error, webRequest)
{
	if (this.isCheckingOut())
	{
		this._setCheckOutFailed(error, webRequest);
	}
	if (this.isCancelingCheckOut())
	{
		this._setCancelCheckOutFailed(error, webRequest);
	}
	if (this.isCheckingIn())
	{
		this._setCheckInFailed(error, webRequest);
	}
});

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.VersionableItem.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$VersionableItem$pack()
{
	var p = this.properties;
	return {
		checkingOut: p.checkingOut,
		cancelingCheckOut: p.cancelingCheckOut,
		checkingOut: p.checkingOut,
		canCheckOut: p.canCheckOut,
		canCheckIn: p.canCheckIn,
		canCancelCheckOut: p.canCancelCheckOut
	};
});

SDL.Client.Models.Base.VersionableItem.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$VersionableItem$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.checkingOut = data.checkingOut;
		p.cancelingCheckOut = data.cancelingCheckOut;
		p.checkingOut = data.checkingOut;
		p.canCheckOut = data.canCheckOut;
		p.canCheckIn = data.canCheckIn;
		p.canCancelCheckOut = data.canCancelCheckOut;
	}
});

SDL.Client.Models.Base.VersionableItem.prototype._initializeMarshalledObject = function SDL$Client$Models$Base$VersionableItem$_initializeMarshalledObject(object)
{
	var p = this.properties;
	if (p.checkingOut || p.cancelingCheckOut || p.checkingIn)
	{
		p.loading = false;	// this is to prevent SDL.LoadableObject to load data, checkOut() will load data too
	}

	if (this.callBase("SDL.Client.Models.Base.EditableItem", "_initializeMarshalledObject", [object]))
	{
		if (p.checkingOut)
		{
			p.checkingOut = false;
			this.checkOut();
		}
		else if (p.cancelingCheckOut)
		{
			p.cancelingCheckOut = false;
			this.cancelCheckOut();
		}
		else if (p.checkingIn)
		{
			p.checkingIn = false;
			this.checkIn();
		}
		return true;
	}
};

// ------- end of SDL.Client.Models.MarshallableObject overrides
/*! @namespace {SDL.Client.Models.Base.XmlBasedObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.XmlBasedObject");

/*
	Adds methods for managing object's xml data.
*/
SDL.Client.Models.Base.XmlBasedObject.$constructor = function SDL$Client$Models$Base$XmlBasedObject$constructor()
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	var p = this.properties;
	p.xml;
	p.xmlDocument;
};

/*
	Assigns an xml string to the object.
*/
SDL.Client.Models.Base.XmlBasedObject.prototype.setXml = function SDL$Client$Models$Base$XmlBasedObject$setXml(value)
{
	 var p = this.properties;
	 p.xml = value;
	 p.xmlDocument = undefined;
};

/*
	Gets an xml string assigned to the object.
*/
SDL.Client.Models.Base.XmlBasedObject.prototype.getXml = function SDL$Client$Models$Base$XmlBasedObject$getXml()
{
	var p = this.properties;
	if (p.xml === undefined && p.xmlDocument)
	{
		p.xml = SDL.Client.Xml.getOuterXml(p.xmlDocument) || null;
	}
	return p.xml;
};

/*
	Gets xml assigned to the object as an xml document.
*/
SDL.Client.Models.Base.XmlBasedObject.prototype.getXmlDocument = function SDL$Client$Models$Base$XmlBasedObject$getXmlDocument()
{
	var p = this.properties;
	if (!p.xmlDocument)
	{
		var xml = this.getXml();
		if (xml)
		{
			p.xmlDocument = SDL.Client.Xml.getNewXmlDocument(xml);
		}
	}
	return p.xmlDocument;
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.XmlBasedObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$XmlBasedObject$pack()
{
	var p = this.properties;
	return {
		xml: p.xml
	};
});

SDL.Client.Models.Base.XmlBasedObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$XmlBasedObject$unpack(data)
{
	var p = this.properties;
	if (data)
	{
		p.xml = data.xml;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides/*! @namespace {SDL.Client.Models.Base.ModelsBrowserList} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ModelsBrowserList");

/*
	Implements navigating through all registered navigatable domain models (models that expose a getSystemRoot() object).
	getItems() method returns the list of root folders, one root for each system.
*/
SDL.Client.Models.Base.ModelsBrowserList.$constructor = function SDL$Client$Models$Base$ModelsBrowserList$constructor(id, parentId)
{
	this.addInterface("SDL.Client.Models.Base.List", [id, parentId]);
	var p = this.properties;
	p.parentId = parentId;
	p.items;
};

SDL.Client.Models.Base.ModelsBrowserList.prototype.isLoaded = function SDL$Client$Models$Base$ModelsBrowserList$isLoaded()
{
	return true;
};

SDL.Client.Models.Base.ModelsBrowserList.prototype.isFilterApplied = function SDL$Client$Models$Base$ModelsBrowserList$isFilterApplied(filter)
{
	return true;
};

SDL.Client.Models.Base.ModelsBrowserList.prototype.getItems = function SDL$Client$Models$Base$ModelsBrowserList$getItems()
{
	var p = this.properties;
	if (!p.items)
	{
		var parentId = p.parentId;
		p.items = [];
		var factories = SDL.Client.Models.getModelFactories();
		for (var i = 0, len = factories.length; i < len; i++)
		{
			var factory = factories[i];
			if (SDL.Client.Type.isFunction(factory.getSystemRootId))
			{
				var id = factory.getSystemRootId();
				if (id && id != parentId)
				{
					p.items.push({id: id, title: factory.getSystemRootTitle()});
				}
			}
		}
	}
	return p.items;
};/*! @namespace {SDL.Client.Models.Base.ModelsBrowser} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ModelsBrowser");

/*
	Folder object for navigating through all registered models that have getSystemRootId() method.
*/
SDL.Client.Models.Base.ModelsBrowser.$constructor = function SDL$Client$Models$Base$ModelsBrowser$constructor(id)
{
	this.addInterface("SDL.Client.Models.Base.ListProvider", [id]);
};

SDL.Client.Models.Base.ModelsBrowser.prototype.getListType = function SDL$Client$Models$Base$ModelsBrowser$getListType(filter)
{
	return "SDL.Client.Models.Base.ModelsBrowserList";
};/*! @namespace {SDL.Client.Models.Base.Models} */
SDL.Client.Type.registerNamespace("SDL.Client.Models.Base");

(function()
{
	var model = SDL.Client.Models.Base.Model = new SDL.Client.Models.Base.ModelFactory();

	model.getSettings().prefix = "base:";

	model.getSystemRootId = function SDL$Client$Models$Base$Model$getSystemRootId()
	{
		return this.getModelSpecificUri("models-browser", SDL.Client.Models.Base.Model.getFolderType());
	};

	model.getSystemRootTitle = function SDL$Client$Models$Base$Model$getSystemRootTitle()
	{
		return this.properties.settings.prefix + "system";
	};

	SDL.Client.Models.registerModelFactory(
		model.getIdMatchRegExp(),
		model,
		[
			{
				id: model.getFolderType(),
				alias: "SDL_BASE_MODELSBROWSER",
				implementation: "SDL.Client.Models.Base.ModelsBrowser"
			}
		]
	)
})();/*! @namespace {SDL.Client.Models.URL.Document} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.URL.Document");

/*
* Represents a base for documents loaded from a URL.
*/
SDL.Client.Models.URL.Document.$constructor = function SDL$Client$Models$URL$Document$constructor(id)
{
	this.addInterface("SDL.Client.Models.Base.Item", [id]);

	var p = this.properties;
	p.content;
	p.contentUrl;
	p.mimeType;
};

SDL.Client.Models.URL.Document.prototype.invalidateInterfaceCachedState = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$URL$Document$invalidateInterfaceCachedState()
{
	this.properties.content = undefined;
});

SDL.Client.Models.URL.Document.prototype.getTitle = function SDL$Client$Models$URL$Document$getTitle()
{
	var m = this.getId().match(/([^\/\\]*)\/?$/);
	return m ? m[1] : null;
};

SDL.Client.Models.URL.Document.prototype.getContentUrl = function SDL$Client$Models$URL$Document$getContentUrl()
{
	var p = this.properties;
	if (p.contentUrl === undefined)
	{
		var id = this.getOriginalId() || "";
		if (/^\//.test(id))
		{
			p.contentUrl = SDL.Client.Types.Url.getAbsoluteUrl(id);
		}
		else if (/\:/.test(id))
		{
			p.contentUrl = id;
		}
		else
		{
			var s = this.getModelFactory().getSettings();
			p.contentUrl = SDL.Client.Types.Url.getAbsoluteUrl(SDL.Client.Types.Url.combinePath(s.root, id));
		}
	}
	return p.contentUrl;
};

SDL.Client.Models.URL.Document.prototype.getContent = function SDL$Client$Models$URL$Document$getContent()
{
	return this.properties.content;
};

SDL.Client.Models.URL.Document.prototype.getMimeType = function SDL$Client$Models$URL$Document$getMimeType()
{
	return this.properties.mimeType;
};

SDL.Client.Models.URL.Document.prototype.isLoaded = function SDL$Client$Models$URL$Document$isLoaded()
{
	return this.properties.content != undefined;
};

SDL.Client.Models.URL.Document.prototype._executeLoad = function SDL$Client$Models$URL$Document$_executeLoad(reload)
{
	SDL.Client.Net.getRequest(this.getContentUrl(), this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
};

SDL.Client.Models.URL.Document.prototype._processLoadResult = function SDL$Client$Models$URL$Document$_processLoadResult(result, webRequest)
{
	this.callBase("SDL.Client.Models.Base.Item", "_processLoadResult", [result, webRequest]);

	var p = this.properties;
	p.content = result;

	p.mimeType = webRequest ? webRequest.responseContentType : null;
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.URL.Document.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$URL$Document$pack()
{
	var p = this.properties;
	return {
		content: p.content,
		mimeType: p.mimeType
	};
});

SDL.Client.Models.URL.Document.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$URL$Document$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.content = data.content;
		p.mimeType = data.mimeType;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides/*! @namespace {SDL.Client.Models.URL.ModelFactory} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.URL.ModelFactory");

/*
	Implements a model factory used for managing documents loaded from a URL.
*/
SDL.Client.Models.URL.ModelFactory.$constructor = function SDL$Client$Models$URL$ModelFactory$constructor()
{
	this.addInterface("SDL.Client.Models.Base.ModelFactory");

	var s = this.properties.settings;
	s.prefix = "url:";
	s.root = "/";	// root URL is used to resolve relative URL's
}

SDL.Client.Models.URL.ModelFactory.prototype.getItemType = function SDL$Client$Models$URL$ModelFactory$getItemType(item)
{
	if (item)
	{
		return this.getDocumentType();
	}
};/*! @namespace {SDL.Client.Models.URL} */
SDL.Client.Type.registerNamespace("SDL.Client.Models.URL");

(function()
{
	var model = SDL.Client.Models.URL.Model = new SDL.Client.Models.URL.ModelFactory();

	SDL.Client.Models.registerModelFactory(
		model.getIdMatchRegExp(),
		model,
		[
			{
				id: model.getDocumentType(),
				alias: "SDL_URL_DOCUMENT",
				implementation: "SDL.Client.Models.URL.Document"
			}
		]);

	SDL.Client.Models.registerModelFactory("", model);	// matches all unrecognized id's
})();/*! @namespace {SDL.Client.Models.Base.Clipboard} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.Clipboard");

/**
 * Implements Clipboard.
 * @constructor
 */
SDL.Client.Models.Base.Clipboard.$constructor = function SDL$Client$Models$Base$Clipboard$constructor()
{
	if (!SDL.Client.Types.OO.implementsInterface(this, "SDL.Client.Models.Base.Clipboard"))
	{
		// called without 'new' keyword
		return SDL.Client.Models.getFromRepository("sdl-base-clipboard") ||
			SDL.Client.Models.createInRepository("sdl-base-clipboard", "SDL.Client.Models.Base.Clipboard");
	}
	else
	{
		// called with 'new' keyword
		this.addInterface("SDL.Client.Models.MarshallableObject");

		var clipboardData; 	// a simple type variable or an array of simple types
		var clipboardAction; // enum SDL.Client.Models.Base.Clipboard.PasteAction
		var itemTypes;

		this.setData = function SDL$Client$Models$Base$Clipboard$setData(data, action)
		{
			if (clipboardAction !== action || clipboardData !== data)
			{
				if (SDL.Client.Type.isArray(data))
				{
					clipboardData = SDL.Client.Types.Array.clone(data);
				}
				else
				{
					clipboardData = data;
				}
				clipboardAction = action;
				itemTypes = undefined;
				this.fireEvent("change");
			}
		};

		this.getData = function SDL$Client$Models$Base$Clipboard$getData()
		{
			return clipboardData;
		};

		this.getAction = function SDL$Client$Models$Base$Clipboard$getAction()
		{
			return clipboardAction;
		};

		this.getDataTypes = function SDL$Client$Models$Base$Clipboard$getDataTypes()
		{
			if (itemTypes === undefined && clipboardData)
			{
				if (SDL.Client.Type.isArray(clipboardData))
				{
					itemTypes = [];
					var itemTypesCache = {};
					for (var i = 0, len = clipboardData.length; i < len; i++)
					{
						var type = SDL.Client.Models.getItemType(clipboardData[i]) || "";

						if (!(type in itemTypesCache))
						{
							itemTypes.push(type);
							itemTypesCache[type] = true;
						}
					}
				}
				else
				{
					return [SDL.Client.Models.getItemType(clipboardData) || ""];
				}
			}
			return itemTypes;
		};

		this.clearData = function SDL$Client$Models$Base$Clipboard$clearData()
		{
			if (clipboardAction !== undefined || clipboardData !== undefined)
			{
				clipboardAction = clipboardData = itemTypes = undefined;
				this.fireEvent("change");
			}
		};

		// implement pack for marshalling
		this.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Clipboard$pack()
		{
			return { data: clipboardData, action: clipboardAction };
		});

		// implement unpack for marshalling
		this.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Clipboard$unpack(data)
		{
			clipboardAction = data.action;

			if (SDL.Client.Type.isArray(data.data))
			{
				clipboardData = SDL.Client.Types.Array.clone(data.data);
			}
			else
			{
				clipboardData = data.data;
			}
		});
	}
};

/**
 * Returns the singleton instance of Clipboard object.
 * @return {SDL.Client.Models.Base.Clipboard} The Clipboard Instance.
 */
SDL.Client.Models.Base.Clipboard.getInstance = function SDL$Client$Models$Base$Clipboard$getInstance()
{
	return SDL.Client.Models.Base.Clipboard();
};

/**
 * Sets the clipboard data title
 * @param {Object} data The clipboard data.
 * @param {String} action The clipboard action.
 */
SDL.Client.Models.Base.Clipboard.setData = function SDL$Client$Models$Base$Clipboard$setData(data, action)
{
	this.getInstance().setData(data, action);
};

/**
 * Gets the clipboard data
 * @returns {Object} data The clipboard data.
 */
SDL.Client.Models.Base.Clipboard.getData = function SDL$Client$Models$Base$Clipboard$getData()
{
	return this.getInstance().getData();
};

/**
 * Gets the array of the clipboard data item types
 * @returns {Array} The array of item types
 */
SDL.Client.Models.Base.Clipboard.getDataTypes = function SDL$Client$Models$Base$Clipboard$getDataTypes()
{
	return this.getInstance().getDataTypes();
};

/**
 * Gets the clipboard stored action
 * @returns {String} The clipboard action.
 */
SDL.Client.Models.Base.Clipboard.getAction = function SDL$Client$Models$Base$Clipboard$getAction()
{
	return this.getInstance().getAction();
};

/**
 * Clears the clipboard data.
 */
SDL.Client.Models.Base.Clipboard.clearData = function SDL$Client$Models$Base$Clipboard$clearData()
{
	this.getInstance().clearData();
};

SDL.Client.Models.Base.Clipboard.PasteAction = {
	COPY: 0,
	CUT: 1
};/*! @namespace {SDL.Client.Models.MessageCenter.MessageCenter} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.MessageCenter");

SDL.Client.Models.MessageCenter.MessageCenter.$constructor = function SDL$Client$Models$SDL$Client$Models$MessageCenter$MessageCenter$MessageCenter$constructor()
{
	this.addInterface("SDL.Client.Models.MarshallableObject");
	var p = this.properties;
	p.messages = {};
};

SDL.Client.Models.MessageCenter.MessageCenter.$execute = function SDL$Client$Models$SDL$Client$Models$MessageCenter$MessageCenter$MessageCenter$execute()
{
	return SDL.Client.Models.getFromRepository("sdl-message-center") ||
			SDL.Client.Models.createInRepository("sdl-message-center", "SDL.Client.Models.MessageCenter.MessageCenter");
};

SDL.Client.Models.MessageCenter.MessageCenter.prototype.createMessage = function SDL$Client$Models$MessageCenter$MessageCenter$createMessage(messageType, title, description, options)
{
	var implementation = SDL.Client.MessageCenter.MessageTypesRegistry[messageType];
	if (SDL.Client.Type.isString(implementation))
	{
		var resolved = SDL.Client.Type.resolveNamespace(implementation);
		var msg = new (resolved)(title, description, options);
		return msg;
	}
};

SDL.Client.Models.MessageCenter.MessageCenter.prototype.registerMessage = function SDL$Client$Models$MessageCenter$MessageCenter$registerMessage(msg)
{
	if (msg && SDL.Client.Types.OO.implementsInterface(msg, "SDL.Client.Models.MessageCenter.Message"))
	{
		this.properties.messages[msg.getId()] = msg;
		this.fireEvent("newmessage", { messageID: msg.getId() });
	}
};

SDL.Client.Models.MessageCenter.MessageCenter.prototype.getMessages = function SDL$Client$Models$MessageCenter$MessageCenter$getMessages()
{
	return this.properties.messages;
};

SDL.Client.Models.MessageCenter.MessageCenter.prototype.getActiveMessages = function SDL$Client$Models$MessageCenter$MessageCenter$getActiveMessages()
{
	var messages = this.properties.messages;
	var result = [];
	for (var i in messages)
	{
		var msg = messages[i];
		if (msg.isActive())
		{
			result.push(msg);
		}
	}
	return result;
};

SDL.Client.Models.MessageCenter.MessageCenter.prototype.getMessageByID = function SDL$Client$Models$MessageCenter$MessageCenter$getMessageByID(id)
{
	if (SDL.Client.Type.isString(id))
	{
		return this.properties.messages[id];
	}
};

SDL.Client.Models.MessageCenter.MessageCenter.prototype.executeAction = function SDL$Client$Models$MessageCenter$MessageCenter$executeAction(messageID, action, params)
{
	var msg = this.getMessageByID(messageID);
	if (msg)
	{
		if (SDL.Client.Type.isFunction(msg[action]))
		{
			msg[action](params);
		}
		this.fireEvent(action, { messageID: messageID });
	}
};

// ------- marshallableObject methods implementations/overrides
SDL.Client.Models.MessageCenter.MessageCenter.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$MessageCenter$pack()
{
	var p = this.properties;
	return {
			messages: p.messages
		};
});

SDL.Client.Models.MessageCenter.MessageCenter.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$MessageCenter$unpack(data)
{
	if (data && data.messages)
	{
		var msgs = data.messages;
		var p = this.properties;
		for (var id in msgs)
		{
			if (SDL.Client.Types.OO.implementsInterface(msgs[id], "SDL.Client.Models.MarshallableObject"))
			{
				p.messages[id] = SDL.Client.Types.OO.importObject(msgs[id]);
			}
		}
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides

SDL.Client.MessageCenter.getInstance = function SDL$Client$Models$MessageCenter$MessageCenter$getInstance()
{
	return SDL.Client.Models.MessageCenter.MessageCenter();
};/*! @namespace {SDL.Client.Models.MessageCenter.Message} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.Message");

SDL.Client.Models.MessageCenter.Message.$constructor = function SDL$Client$Models$MessageCenter$Message$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	var p = this.properties;

	p.id;
	p.messageType;
	p.title = title;
	p.description = description;
	p.active = true;

	p.actions = [];
	p.options = SDL.Client.Types.Object.clone(options) || {};

	p.date = new Date();
	p.maxAge;	// don't archive the message by default
	p.expireTimeout;
};

SDL.Client.Models.MessageCenter.Message.prototype.$initialize = function SDL$Client$Models$MessageCenter$Message$initialize()
{
	var p = this.properties;

	p.id = SDL.Client.Models.getUniqueId();

	this.populateActions();

	var maxAge = p.maxAge;
	if (SDL.Client.Type.isNumber(maxAge))
	{
		p.expireTimeout = setTimeout(this.getDelegate(this.expire), maxAge > 1000 ? maxAge : 1000);	// keep it active for a minimum of 1 second
	}
};

SDL.Client.Models.MessageCenter.Message.prototype.getId = function SDL$Client$Models$MessageCenter$Message$getId()
{
	return this.properties.id;
};

SDL.Client.Models.MessageCenter.Message.prototype.getMessageType = function SDL$Client$Models$MessageCenter$Message$getMessageType()
{
	return this.properties.messageType;
};

SDL.Client.Models.MessageCenter.Message.prototype.getTitle = function SDL$Client$Models$MessageCenter$Message$getTitle()
{
	return this.properties.title;
};

SDL.Client.Models.MessageCenter.Message.prototype.getDescription = function SDL$Client$Models$MessageCenter$Message$getDescription()
{
	return this.properties.description;
};

SDL.Client.Models.MessageCenter.Message.prototype.getCreationDate = function SDL$Client$Models$MessageCenter$Message$getCreationDate()
{
	return this.properties.date;
};

SDL.Client.Models.MessageCenter.Message.prototype.isActive = function SDL$Client$Models$MessageCenter$Message$isActive()
{
	return this.properties.active;
};

SDL.Client.Models.MessageCenter.Message.prototype.getTargetWindow = function SDL$Client$Models$MessageCenter$Message$getTargetWindow()
{
	return this.properties.options.localToWindow;
};

SDL.Client.Models.MessageCenter.Message.prototype.getModalForWindow = function SDL$Client$Models$MessageCenter$Message$getModalForWindow()
{
	return this.properties.options.modalForWindow;
};

SDL.Client.Models.MessageCenter.Message.prototype.expire = function SDL$Client$Models$MessageCenter$Message$expire()
{
	var p = this.properties;
	p.timeoutObj = null;
	SDL.Client.MessageCenter.executeAction(p.id, "archive");
};

SDL.Client.Models.MessageCenter.Message.prototype.archive = function SDL$Client$Models$MessageCenter$Message$archive()
{
	var p = this.properties;
	if (this.isActive())
	{
		p.active = false;
		p.options.targetWindow = undefined;
		if (p.timeoutObj)
		{
			clearTimeout(p.timeoutObj);
			p.timeoutObj = null;
		}
		this.fireEvent("archive");
	}
};

SDL.Client.Models.MessageCenter.Message.prototype.getActions = function SDL$Client$Models$MessageCenter$Message$getActions()
{
	return this.properties.actions;
};

SDL.Client.Models.MessageCenter.Message.prototype.addAction = function SDL$Client$Models$MessageCenter$Message$addAction(action, name, options, position)
{
	SDL.Client.Types.Array.insert(this.properties.actions, {
			action: action,
			name: name,
			options: SDL.Client.Types.Object.clone(options)
		}, position);
};

SDL.Client.Models.MessageCenter.Message.prototype.populateActions = function SDL$Client$Models$MessageCenter$Message$populateActions()
{
	// Add needed actions in derived class
};

SDL.Client.Models.MessageCenter.Message.prototype.clearActions = function SDL$Client$Models$MessageCenter$Message$clearActions()
{
	this.properties.actions = [];
};

SDL.Client.Models.MessageCenter.Message.prototype.setOption = function SDL$Client$Models$MessageCenter$Message$setOption(name, value)
{
	if (name && (value == null || SDL.Client.Type.isString(value) || SDL.Client.Type.isNumber(value) || SDL.Client.Type.isBoolean(value)))
	{
		this.properties.options[name] = value;
	}
};

SDL.Client.Models.MessageCenter.Message.prototype.getOption = function SDL$Client$Models$MessageCenter$Message$getOption(name)
{
	return this.properties.options[name];
};

//------- SDL.Client.Models.MarshallableObject methods implementations/overrides
SDL.Client.Models.MessageCenter.Message.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$Message$pack()
{
	var p = this.properties;
	return {
		id: p.id,
		title: p.title, 
		description: p.description,
		active: p.inactive,
		actions: p.actions,
		maxAge: p.maxAge,
		date: p.date.getTime(),
		options: p.options
	};
});

SDL.Client.Models.MessageCenter.Message.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$Message$unpack(data)
{
	var p = this.properties;
	if (data)
	{
		p.id = data.id;
		p.title = data.title;
		p.description = data.description;
		p.active = data.active;
		p.maxAge = data.maxAge;
		p.date = new Date(data.date);
		p.options = SDL.Client.Types.Object.clone(data.options);

		var actions = data.actions;
		for (var i = 0, len = actions.length; i < len; i++)
		{
			var action = actions[i];
			p.actions[i] =
			{
				action: action.action,
				description: action.description,
				options: SDL.Client.Types.Object.clone(data.options)
			};
		}
	}
});

SDL.Client.Models.MessageCenter.Message.prototype.afterInitializeMarshalledObject = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$Message$afterInitializeMarshalledObject(object)
{
	var p = this.properties;
	if (p.active && SDL.Client.Type.isNumber(p.maxAge))
	{
		var date = new Date();

		p.maxAge = p.maxAge - (date.getTime() - p.date.getTime());
		p.date = date;
		p.expireTimeout = setTimeout(this.getDelegate(this.expire), p.maxAge > 1000 ? p.maxAge : 1000);
	}
});
//------- end of SDL.Client.Models.MarshallableObject overrides/*! @namespace {SDL.Client.Models.MessageCenter.NotificationMessage} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.NotificationMessage");

SDL.Client.Models.MessageCenter.NotificationMessage.$constructor = function SDL$Client$Models$MessageCenter$NotificationMessage$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MessageCenter.Message", [title, description, options]);
	this.properties.messageType = SDL.Client.MessageCenter.MessageType.NOTIFICATION;

	this.properties.maxAge = 3000;	// archive the message by default in 3 seconds
};

SDL.Client.MessageCenter.MessageTypesRegistry[SDL.Client.MessageCenter.MessageType.NOTIFICATION] = "SDL.Client.Models.MessageCenter.NotificationMessage";/*! @namespace {SDL.Client.Models.MessageCenter.WarningMessage} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.WarningMessage");

SDL.Client.Models.MessageCenter.WarningMessage.$constructor = function SDL$Client$Models$MessageCenter$WarningMessage$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MessageCenter.Message", [title, description, options]);
	this.properties.messageType = SDL.Client.MessageCenter.MessageType.WARNING;

	this.properties.maxAge = 10000;	// archive the message by default in 10 seconds
};

SDL.Client.MessageCenter.MessageTypesRegistry[SDL.Client.MessageCenter.MessageType.WARNING] = "SDL.Client.Models.MessageCenter.WarningMessage";/*! @namespace {SDL.Client.Models.MessageCenter.ErrorMessage} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.ErrorMessage");

SDL.Client.Models.MessageCenter.ErrorMessage.$constructor = function SDL$Client$Models$MessageCenter$ErrorMessage$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MessageCenter.Message", [title, description, options]);
	this.properties.messageType = SDL.Client.MessageCenter.MessageType.ERROR;

	this.properties.maxAge = 60000;	// archive the message by default in 1 minute
};

SDL.Client.Models.MessageCenter.ErrorMessage.prototype.getDetails = function SDL$Client$Models$MessageCenter$ErrorMessage$getDetails()
{
	return this.properties.options.details;
};

SDL.Client.MessageCenter.MessageTypesRegistry[SDL.Client.MessageCenter.MessageType.ERROR] = "SDL.Client.Models.MessageCenter.ErrorMessage";/*! @namespace {SDL.Client.Models.MessageCenter.QuestionMessage} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.QuestionMessage");

SDL.Client.Models.MessageCenter.QuestionMessage.$constructor = function SDL$Client$Models$MessageCenter$QuestionMessage$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MessageCenter.Message", [title, description, options]);
	this.properties.messageType = SDL.Client.MessageCenter.MessageType.QUESTION;
};

SDL.Client.Models.MessageCenter.QuestionMessage.prototype.populateActions = function SDL$Client$Models$MessageCenter$QuestionMessage$populateActions()
{
	this.callBase("SDL.Client.Models.MessageCenter.Message", "populateActions");
	
	var actionNames = this.properties.options.actionNames || {};

	this.addAction("confirm", actionNames["confirm"] || "Yes");
	this.addAction("cancel", actionNames["cancel"] || "No");
};

SDL.Client.Models.MessageCenter.QuestionMessage.prototype.confirm = function SDL$Client$Models$MessageCenter$QuestionMessage$confirm()
{
	if (this.isActive())
	{
		this.fireEvent("confirm");
		SDL.Client.MessageCenter.executeAction(this.getId(), "archive");
	}
};

SDL.Client.Models.MessageCenter.QuestionMessage.prototype.cancel = function SDL$Client$Models$MessageCenter$QuestionMessage$cancel()
{
	if (this.isActive())
	{
		this.fireEvent("cancel");
		SDL.Client.MessageCenter.executeAction(this.getId(), "archive");
	}
};

SDL.Client.MessageCenter.MessageTypesRegistry[SDL.Client.MessageCenter.MessageType.QUESTION] = "SDL.Client.Models.MessageCenter.QuestionMessage";/*! @namespace {SDL.Client.Models.MessageCenter.GoalMessage} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.GoalMessage");

SDL.Client.Models.MessageCenter.GoalMessage.$constructor = function SDL$Client$Models$MessageCenter$GoalMessage$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MessageCenter.Message", [title, description, options]);
	this.properties.messageType = SDL.Client.MessageCenter.MessageType.GOAL;

	this.properties.maxAge = 3000;	// archive the message by default in 3 seconds
};

SDL.Client.MessageCenter.MessageTypesRegistry[SDL.Client.MessageCenter.MessageType.GOAL] = "SDL.Client.Models.MessageCenter.GoalMessage";/*! @namespace {SDL.Client.Models.MessageCenter.ProgressMessage} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.ProgressMessage");

SDL.Client.Models.MessageCenter.ProgressMessage.$constructor = function SDL$Client$Models$MessageCenter$ProgressMessage$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MessageCenter.Message", [title, description, options]);
	this.properties.messageType = SDL.Client.MessageCenter.MessageType.PROGRESS;

	var p = this.properties;
	p.operationStopped;
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.setTitle = function SDL$Client$Models$MessageCenter$ProgressMessage$setTitle(title)
{
	var p = this.properties;
	if (title != p.title)
	{
		this.properties.title = title;
		this.fireEvent("updatetitle", { title: title });
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.populateActions = function SDL$Client$Models$MessageCenter$ProgressMessage$populateActions()
{
	this.callBase("SDL.Client.Models.MessageCenter.Message", "populateActions");
	
	var options = this.properties.options;
	if (options.canCancel)
	{
		var actionNames = options.actionNames || {};
		this.addAction("cancel", actionNames["cancel"] || "Cancel");
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.setContinuousIterationObject = function SDL$Client$Models$MessageCenter$ProgressMessage$setContinuousIterationObject(id)
{
    var $evt = SDL.Client.Event.EventRegister;
	var item = SDL.Client.Models.getItem(id);
	if (item && SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.Base.ContinuousIterationObject"))
	{
		this.properties.options.continuousObjectId = id;

		$evt.addEventHandler(item, "update", this.getDelegate(this._onUpdate));
		$evt.addEventHandler(item, "error", this.getDelegate(this._onError));
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.collectCounts = function SDL$Client$Models$MessageCenter$ProgressMessage$collectCounts(item)
{
	var options = this.properties.options;
	if (options.continuousObjectId)
	{
		item = item || SDL.Client.Models.getItem(id);
		options.itemsCount = item.getItemsCount() || 0;
		options.itemsDoneCount = item.getItemsDoneCount() || 0;
		options.itemsFailedCount = item.getErrorsCount() || 0;
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.getItems = function SDL$Client$Models$MessageCenter$ProgressMessage$getItems()
{
	return this.properties.options.items;
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.getItemsCount = function SDL$Client$Models$MessageCenter$ProgressMessage$getItemsCount()
{
	var options = this.properties.options;
	if (options.itemsCount != null)
	{
		return options.itemsCount;
	}
	else if (options.continuousObjectId)
	{
		this.collectCounts();
		return options.itemsCount;
	}
	else if (options.items)
	{
		return options.items.length;
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.getItemsDone = function SDL$Client$Models$MessageCenter$ProgressMessage$getItemsDone()
{
	return this.properties.options.itemsDone;
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.getItemsDoneCount = function SDL$Client$Models$MessageCenter$ProgressMessage$getItemsDoneCount()
{
	var options = this.properties.options;
	if (options.itemsDoneCount != null)
	{
		return options.itemsDoneCount;
	}
	else if (options.continuousObjectId)
	{
		this.collectCounts();
		return options.itemsDoneCount;
	}
	else if (options.itemsDone)
	{
		return options.itemsDone.length;
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.getItemsFailed = function SDL$Client$Models$MessageCenter$ProgressMessage$getItemsFailed()
{
	return this.properties.options.itemsFailed;
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.getItemsFailedCount = function SDL$Client$Models$MessageCenter$ProgressMessage$getItemsFailedCount()
{
	var options = this.properties.options;
	if (options.itemsFailedCount != null)
	{
		return options.itemsFailedCount;
	}
	else if (options.continuousObjectId)
	{
		this.collectCounts();
		return options.itemsFailedCount;
	}
	else if (options.itemsFailed)
	{
		return options.itemsFailed.length;
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.archive = function SDL$Client$Models$MessageCenter$ProgressMessage$archive()
{
    var $evt = SDL.Client.Event.EventRegister;
	this.callBase("SDL.Client.Models.MessageCenter.Message", "archive");

	var id = this.properties.options.continuousObjectId;
	if (id)
	{
		var obj = SDL.Client.Models.getItem(id);
		if (obj)
		{
			$evt.removeEventHandler(obj, "update", this.getDelegate(this._onUpdate));
			$evt.removeEventHandler(obj, "error", this.getDelegate(this._onError));
		}
		delete p.processObjectId;
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.finish = function SDL$Client$Models$MessageCenter$ProgressMessage$finish(error)
{
	if (this.isActive())
	{
		this.fireEvent(success ? "success" : "fail");
		SDL.Client.MessageCenter.executeAction(this.getId(), "archive");

		if (!error)
		{
			var options = this.properties.options;
			SDL.Client.MessageCenter.registerGoal(options.successMessageName || "", options.successMessageDescription || "",
				{
					localToWindow: options.localToWindow,
					actionNames: options.successActionNames
				});
		}
		else
		{
			// error is passed
		}
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.cancel = function SDL$Client$Models$MessageCenter$ProgressMessage$cancel()
{
	var p = this.properties;
	var options = p.options;
	if (options.canCancel && this.isActive())
	{
		options.canCancel = false;

		if (!p.operationStopped)
		{
			this.fireEvent("cancel");
			if (options.continuousObjectId)
			{
				var item = SDL.Client.Models.getItem(options.continuousObjectId);
				if (item && item.isActive())
				{
					item.stop();
					p.operationStopped = true;
					return;
				}
			}
		}

		this.canceled();
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.canceled = function SDL$Client$Models$MessageCenter$ProgressMessage$canceled()
{
	if (this.isActive())
	{
		var p = this.properties;
		if (!p.operationStopped)
		{
			this.fireEvent("cancel");
		}

		SDL.Client.MessageCenter.executeAction(this.getId(), "archive");

		var options = p.options;

		SDL.Client.MessageCenter.registerGoal(options.cancelMessageName || "", options.cancelMessageDescription || "",
			{
				localToWindow: options.localToWindow,
				actionNames: options.cancelActionNames
			});
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype._onUpdate = function SDL$Client$Models$MessageCenter$ProgressMessage$_onUpdate(event)
{
	var item = event.target;
	if (item)
	{
		var options = this.properties.options;
		options.itemsCount = options.itemsDoneCount = options.itemsFailedCount = null;

		if (item.isActive())
		{
			this.fireEvent("update");
		}
		else
		{
			this.collectCounts(item);
			if (options.itemsDoneCount != options.itemsCount)
			{
				this.canceled();
			}
			else
			{
				SDL.Client.MessageCenter.executeAction(this.getId(), "finish", item.getErrorDetails());
			}
		}
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype._onError = function ProgressMessage$_onError(event)
{
	SDL.Client.MessageCenter.executeAction(this.getId(), "finish", event.data.error);
};

//------- SDL.Client.Models.MarshallableObject methods implementations/overrides
SDL.Client.Models.MessageCenter.ProgressMessage.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$ProgressMessage$pack()
{
	var p = this.properties;
	return {
		operationStopped: p.operationStopped
	};
});

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$ProgressMessage$unpack(data)
{
	var p = this.properties;
	if (data)
	{
		p.operationStopped = data.operationStopped;
	}
});

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.afterInitializeMarshalledObject = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$ProgressMessage$afterInitializeMarshalledObject(object)
{
	var p = this.properties;
	if (p.options)
	{
		p.options.item = SDL.Client.Types.Object.clone(p.options.item);
		p.options.itemsDone = SDL.Client.Types.Object.clone(p.options.itemsDone);
		p.options.itemsFailed = SDL.Client.Types.Object.clone(p.options.itemsFailed);
		p.options.actionNames = SDL.Client.Types.Object.clone(p.options.actionNames);
		p.options.successActionNames = SDL.Client.Types.Object.clone(p.options.successActionNames);
		p.options.cancelActionNames = SDL.Client.Types.Object.clone(p.options.cancelActionNames);
	}
});
//------- end of SDL.Client.Models.MarshallableObject overrides

SDL.Client.MessageCenter.MessageTypesRegistry[SDL.Client.MessageCenter.MessageType.PROGRESS] = "SDL.Client.Models.MessageCenter.ProgressMessage";/*! @namespace {SDL.Client.Models.Navigator} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Navigator");

SDL.Client.Models.Navigator.$constructor = function SDL$Client$Models$Navigator$constructor()
{
	this.addInterface("SDL.Client.Types.DisposableObject");
};

SDL.Client.Models.Navigator.prototype.$initialize = function SDL$Client$Models$Navigator$constructor()
{
	var navigators = (SDL.Client.Models.getFromRepository("models-navigator-registry") ||
		SDL.Client.Models.createInRepository("models-navigator-registry", "SDL.Client.Models.MarshallableArray"));

	navigators.getArray().push(this);
};

SDL.Client.Models.Navigator.prototype.navigateTo = function SDL$Client$Models$Navigator$navigateTo(item, exploring, fromWindow)
{ };

SDL.Client.Models.Navigator.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Navigator$disposeInterface()
{
	var reg = SDL.Client.Models.getFromRepository("models-navigator-registry");
	if (reg)
	{
		var navs = reg.getArray();
		SDL.Client.Types.Array.removeAt(navs, SDL.jQuery.inArray(this, navs));
	}
});

// static method
SDL.Client.Models.Navigator.getNavigator = function SDL$Client$Models$Navigator$getNavigator()
{
	var reg = SDL.Client.Models.getFromRepository("models-navigator-registry");
	if (reg)
	{
		return reg.getArray()[0];
	}
};
