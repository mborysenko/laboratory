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
