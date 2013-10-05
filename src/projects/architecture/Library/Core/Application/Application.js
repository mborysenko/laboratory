var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="..\Libraries\jQuery\SDL.jQuery.ts" />
        /// <reference path="..\Xml\Xml.d.ts" />
        /// <reference path="..\ConfigurationManager\ConfigurationManager.ts" />
        /// <reference path="..\CrossDomainMessaging\CrossDomainMessaging.ts" />
        /// <reference path="..\Event\EventRegister.d.ts" />
        /// <reference path="ApplicationHost.ts" />
        /// <reference path="ApplicationFacade.ts" />
        (function (Application) {
            Application.defaultApplicationEntryPointId;
            Application.defaultApplicationSuiteId;
            Application.isHosted;
            Application.applicationSuiteId;
            Application.isReloading;
            Application.defaultApplicationHostUrl;
            Application.trustedApplicationHostDomains;
            Application.trustedApplications;
            Application.trustedApplicationDomains;
            Application.ApplicationHost;
            Application.useHostedLibraryResources;

            var initialized = false;
            var initCallbacks;

            function initialize(callback) {
                if (!initialized) {
                    if (!Application.isReloading) {
                        if (callback) {
                            if (initCallbacks) {
                                initCallbacks.push(callback);
                            } else {
                                initCallbacks = [callback];
                            }
                        }

                        if (initialized === false) {
                            initialized = undefined;
                            initializeApplication();
                        }
                    }
                } else if (callback) {
                    callback();
                }
            }
            Application.initialize = initialize;
            ;

            function exposeApplicationFacade() {
                if (!Application.isHosted) {
                    throw Error("Cannot expose Application facade: application is not hosted.");
                }
                Application.ApplicationHost.exposeApplicationFacade(Client.Application.defaultApplicationEntryPointId);
            }
            Application.exposeApplicationFacade = exposeApplicationFacade;
            ;

            function exposeApplicationFacadeUnsecure() {
                if (!Application.isHosted) {
                    throw Error("Cannot expose Application facade: application is not hosted.");
                }
                Application.ApplicationHost.exposeApplicationFacadeUnsecure(Client.Application.defaultApplicationEntryPointId);
            }
            Application.exposeApplicationFacadeUnsecure = exposeApplicationFacadeUnsecure;
            ;

            function initializeApplication() {
                var callbacks = function () {
                    if (initCallbacks) {
                        SDL.jQuery.each(initCallbacks, function (i, callback) {
                            callback();
                        });
                        initCallbacks = null;
                    }
                };

                var hostingElement = Client.Xml.selectSingleNode(Client.Configuration.ConfigurationManager.configuration, "//configuration/hosting");

                if (!hostingElement) {
                    Client.Application.isHosted = false;
                    Client.Application.useHostedLibraryResources = false;
                    initialized = true;
                    callbacks();
                } else {
                    Client.Application.defaultApplicationEntryPointId = Client.Xml.getInnerText(hostingElement, "defaultApplicationEntryPointId");
                    Client.Application.defaultApplicationSuiteId = Client.Xml.getInnerText(hostingElement, "defaultApplicationSuiteId");

                    var hosted = (window.top != window);

                    if (hosted) {
                        var useHostedLibraryResources = !Client.Xml.selectSingleNode(hostingElement, "useHostedLibraryResources[.='false' or .='0']");

                        Application.trustedApplicationHostDomains = SDL.jQuery.map(Client.Xml.selectNodes(hostingElement, "restrictions/trustedApplicationHostDomains/domain"), function (node) {
                            return Client.Types.Url.getAbsoluteUrl(Client.Xml.getInnerText(node));
                        });

                        Application.trustedApplications = SDL.jQuery.map(Client.Xml.selectNodes(hostingElement, "restrictions/trustedApplications/applicationId"), function (node) {
                            return Client.Xml.getInnerText(node);
                        });

                        Application.trustedApplicationDomains = SDL.jQuery.map(Client.Xml.selectNodes(hostingElement, "restrictions/trustedApplicationDomains/domain"), function (node) {
                            return Client.Types.Url.getAbsoluteUrl(Client.Xml.getInnerText(node));
                        });

                        Client.CrossDomainMessaging.addTrustedDomain("*");

                        // notify the host the app is loaded, and see if the library version can be served by the host
                        var interval;
                        if (window.console) {
                            var intervalCount = 0;
                            interval = window.setInterval(function () {
                                intervalCount++;
                                console.log("NO REPLY FROM HOST AFTER " + intervalCount + " SECOND(S).");
                                if (intervalCount > 60) {
                                    window.clearInterval(interval);
                                    interval = null;
                                }
                            }, 1000);
                        }

                        var host = new Application.ApplicationHostProxyClass();
                        host.applicationEntryPointLoaded(Client.Configuration.ConfigurationManager.coreVersion, function (data) {
                            if (interval) {
                                window.clearInterval(interval);
                                interval = null;
                            }

                            Client.Application.applicationSuiteId = data.applicationSuiteId;

                            var applicationHostDomain = (arguments.callee.caller).sourceDomain;
                            host.isTrusted = Client.Types.Url.isSameDomain(window.location.href, applicationHostDomain) || (SDL.jQuery.inArray(applicationHostDomain, Application.trustedApplicationHostDomains, 0, Client.Types.Url.isSameDomain) != -1);

                            Client.CrossDomainMessaging.clearTrustedDomains();
                            Client.CrossDomainMessaging.addTrustedDomain(applicationHostDomain);
                            Client.CrossDomainMessaging.addAllowedHandlerBase(Application.ApplicationFacadeStub);

                            Client.Application.ApplicationHost = host;
                            Client.Application.isHosted = true;

                            if (data) {
                                if (data.libraryVersionSupported) {
                                    Client.Application.useHostedLibraryResources = useHostedLibraryResources;
                                }

                                if (data.culture) {
                                    Client.Localization.setCulture(data.culture);
                                }
                            }

                            Client.Event.EventRegister.addEventHandler(Application.ApplicationHost, "culturechange", function (e) {
                                Client.Localization.setCulture(e.data.culture);
                            });

                            initialized = true;
                            callbacks();
                        });

                        Client.Event.EventRegister.addEventHandler(window, "unload", function (e) {
                            host.applicationEntryPointUnloaded();
                        });
                    } else {
                        Application.defaultApplicationHostUrl = Client.Xml.getInnerText(hostingElement, "defaultApplicationHostUrl");
                        ;

                        if (Application.defaultApplicationHostUrl) {
                            initCallbacks = null;
                            Client.Application.isReloading = true;
                            window.location.replace(Application.defaultApplicationHostUrl + (Application.defaultApplicationSuiteId ? ("#app=" + encodeURIComponent(Application.defaultApplicationSuiteId) + (Application.defaultApplicationEntryPointId ? "&entry=" + encodeURIComponent(Client.Application.defaultApplicationEntryPointId) + "&url=" + encodeURIComponent(location.href) : "")) : ""));
                        } else {
                            Client.Application.isHosted = false;
                            Client.Application.useHostedLibraryResources = false;
                            initialized = true;
                            callbacks();
                        }
                    }
                }
            }
            ;
        })(Client.Application || (Client.Application = {}));
        var Application = Client.Application;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=Application.js.map
