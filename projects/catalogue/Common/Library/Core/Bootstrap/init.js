var SDL;
(function (SDL) {
    /// <reference path="../Application/Application.ts" />
    /// <reference path="../ConfigurationManager/ConfigurationManager.ts" />
    /// <reference path="../Localization/Localization.ts" />
    /// <reference path="../Resources/ResourceManager.ts" />
    (function (Client) {
        var Appl = Client.Application;
        var Conf = Client.Configuration;
        var cm = Conf.ConfigurationManager;
        var pageConfigurationElement;
        var corePackageKey;

        cm.initialize(initApplication, function () {
            pageConfigurationElement:
            Element;
            var pageNodes = Client.Xml.selectNodes(cm.configuration, "//configuration/pages/page[@url!='*']");
            var path = window.location.pathname.toLowerCase();

            for (var i = 0, len = pageNodes.length; i < len; i++) {
                var _pageNode = pageNodes[i];
                if (_pageNode.getAttribute("url").toLowerCase() == path) {
                    pageConfigurationElement = _pageNode;
                    break;
                }
            }
            if (!pageConfigurationElement) {
                pageConfigurationElement = Client.Xml.selectSingleNode(cm.configuration, "//configuration/pages/page[@url='*']");
                if (!pageConfigurationElement) {
                    throw Error("Unable to find configuration for page \"" + path + "\"");
                }
            }

            if (cm.coreVersion) {
                Appl.libraryVersion = cm.coreVersion;
            }

            var hostingElement = Client.Xml.selectSingleNode(Conf.ConfigurationManager.configuration, "//configuration/hosting");
            if (hostingElement) {
                Appl.defaultApplicationHostUrl = Client.Xml.getInnerText(hostingElement, "defaultApplicationHostUrl");
                Appl.defaultApplicationEntryPointId = Client.Xml.getInnerText(hostingElement, "defaultApplicationEntryPointId");
                Appl.defaultApplicationSuiteId = Client.Xml.getInnerText(hostingElement, "defaultApplicationSuiteId");
                Appl.useHostedLibraryResources = !Client.Xml.selectSingleNode(hostingElement, "useHostedLibraryResources[.='false' or .='0']");

                var map = function (nodes, handler) {
                    var result = [];
                    for (var i = 0, len = nodes.length; i < len; i++) {
                        result.push(handler ? handler(Client.Xml.getInnerText(nodes[i])) : Client.Xml.getInnerText(nodes[i]));
                    }
                    return result;
                };

                Appl.trustedApplicationHostDomains = map(Client.Xml.selectNodes(hostingElement, "restrictions/trustedApplicationHostDomains/domain"), function (domain) {
                    return Client.Types.Url.getAbsoluteUrl(domain);
                });

                Appl.trustedApplications = map(Client.Xml.selectNodes(hostingElement, "restrictions/trustedApplications/applicationId"));

                Appl.trustedApplicationDomains = map(Client.Xml.selectNodes(hostingElement, "restrictions/trustedApplicationDomains/domain"), function (domain) {
                    return Client.Types.Url.getAbsoluteUrl(domain);
                });
            }

            // Appl.initialize(), when completed, will unblock ConfigurationManager, allow it to load library configuration resources
            Appl.initialize(function () {
                var packagesToLoad = [];
                if (!SDL.Client.Resources) {
                    SDL.Client.Resources = {};
                }

                var packages = Client.Resources.preloadPackages || (Client.Resources.preloadPackages = {});
                var corePackageUrl = "~/Library/Core/Packages/SDL.Client.Core.js";
                corePackageKey = corePackageUrl.toLowerCase();
                if (!packages[corePackageKey]) {
                    packagesToLoad.push(packages[corePackageKey] = { packageName: "SDL.Client.Core", url: "~/Library/Core/Packages/SDL.Client.Core.js", version: Appl.libraryVersion });
                }

                if (cm.getAppSetting("debug") != "true") {
                    var preloadPackages = Client.Xml.selectNodes(pageConfigurationElement, "preloadPackages/package[@url]");
                    if (preloadPackages.length) {
                        var baseUrlNodes = Client.Xml.selectNodes(pageConfigurationElement, "ancestor::configuration/@baseUrl");
                        var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

                        var appVersionNodes = Client.Xml.selectNodes(pageConfigurationElement, "ancestor::configuration/appSettings/setting[@name='version']/@value");
                        var appVersion = appVersionNodes.length ? appVersionNodes[appVersionNodes.length - 1].nodeValue : "";

                        for (var i = 0, len = preloadPackages.length; i < len; i++) {
                            var packageElement = preloadPackages[i];
                            var url = packageElement.getAttribute("url");
                            if (url.indexOf("~/") != 0) {
                                url = Client.Types.Url.combinePath(baseUrl, url);
                            }
                            var key = url.toLowerCase();

                            if (!packages[key]) {
                                var version = url.indexOf("~/") == 0 ? Appl.libraryVersion : appVersion;
                                var modification = packageElement.getAttribute("modification") || "";

                                packagesToLoad.push(packages[key] = {
                                    packageName: packageElement.getAttribute("name"),
                                    url: url,
                                    version: (version && modification) ? (version + "." + modification) : (version || modification)
                                });
                            }
                        }
                    }
                }

                for (var i = 0, len = packagesToLoad.length; i < len; i++) {
                    (function (pckg) {
                        if (Appl.isHosted && Appl.useHostedLibraryResources && pckg.url.indexOf("~/") == 0) {
                            Appl.ApplicationHost.getCommonLibraryResource({ url: pckg.url, version: pckg.version }, Appl.libraryVersion, function (data) {
                                pckg.isShared = true;
                                pckg.data = data;
                                packageLoaded();
                            }, function (error) {
                                pckg.error = error;
                                throw Error(error);
                            });
                        } else {
                            var xhr = new XMLHttpRequest();
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4) {
                                    var statusCode = xhr.status;
                                    if (statusCode < 200 || statusCode >= 300) {
                                        var error;
                                        try  {
                                            error = xhr.statusText;
                                        } catch (err) {
                                        }

                                        pckg.error = error;
                                        throw Error(error || xhr.responseText);
                                    }

                                    pckg.data = xhr.responseText;
                                    initApplication();
                                }
                            };

                            xhr.open("GET", (pckg.url.indexOf("~/") == 0 ? Client.Types.Url.combinePath(cm.corePath, pckg.url.slice(2)) : pckg.url) + (pckg.version ? "?" + pckg.version : ""), true);
                            xhr.send();
                        }
                    })(packagesToLoad[i]);
                }
            });
        });

        function packageLoaded() {
            initApplication();
        }

        function initApplication() {
            if (cm.isInitialized && SDL.Client.Resources && Client.Resources.preloadPackages) {
                var corePackage = Client.Resources.preloadPackages[corePackageKey];
                var finalizeInitialization = corePackage && corePackage.data != null;
                if (finalizeInitialization) {
                    var globalEval = eval;
                    var corePackageUrl = Appl.isHosted && Appl.useHostedLibraryResources && corePackage.url.indexOf("~/") == 0 ? Client.Types.Url.combinePath(Client.Application.applicationHostCorePath, corePackage.url.slice(2)) : Client.Types.Url.getAbsoluteUrl(corePackage.url.indexOf("~/") == 0 ? Client.Types.Url.combinePath(cm.corePath, corePackage.url.slice(2)) : corePackage.url);
                    Client.Resources.executingPackageUrl = corePackageUrl;
                    globalEval(corePackage.data + "\n//@ sourceURL=" + corePackageUrl);
                    Client.Resources.executingPackageUrl = null;
                }

                var rm = Client.Resources.ResourceManager;
                if (rm) {
                    for (var key in Client.Resources.preloadPackages) {
                        var pckg = Client.Resources.preloadPackages[key];
                        if (pckg && pckg.data != null) {
                            switch (pckg.packageName) {
                                case "SDL.Client.Init":
                                case "SDL.Client.Core":
                                    rm.registerPackageRendered(pckg.packageName, pckg.url, pckg.data);
                                    break;
                                default:
                                    rm.storeFileData(pckg.url, pckg.data, pckg.isShared);
                                    break;
                            }
                            Client.Resources.preloadPackages[key] = null;
                        }
                    }
                }

                if (finalizeInitialization) {
                    rm.registerPackageRendered("SDL.Client.Init");

                    Client.Localization.setCulture((Appl.isHosted && Appl.ApplicationHost.culture) || cm.getAppSetting("culture") || "en");
                    rm.readConfiguration();

                    window.document.title = pageConfigurationElement.getAttribute("title") || "";

                    var resource = pageConfigurationElement.getAttribute("resource");
                    if (resource) {
                        rm.load(resource, function () {
                            Client.Application.setApplicationReady();
                        });
                    } else {
                        Client.Application.setApplicationReady();
                    }
                }
            }
        }
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=init.js.map
