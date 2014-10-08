/// <reference path="../Application/Application.ts" />
/// <reference path="../Types/Url2.ts" />
/// <reference path="../Xml/Xml.Base.ts" />
var SDL;
(function (SDL) {
    (function (Client) {
        (function (Configuration) {
            ;

            var ConfigurationManagerClass = (function () {
                function ConfigurationManagerClass() {
                    this.configurationFiles = {};
                    this.isInitialized = false;
                    this.nonCoreInitialized = false;
                    this.loadingCounter = 0;
                    this.coreConfigurationToLoad = [];
                    this.cachedAppSettings = {};
                }
                ConfigurationManagerClass.prototype.initialize = function (callback, nonCoreInitCallback) {
                    var _this = this;
                    if (nonCoreInitCallback) {
                        if (this.nonCoreInitialized) {
                            nonCoreInitCallback();
                        } else if (this.nonCoreInitCallbacks) {
                            this.nonCoreInitCallbacks.push(nonCoreInitCallback);
                        } else {
                            this.nonCoreInitCallbacks = [nonCoreInitCallback];
                        }
                    }

                    if (!this.isInitialized) {
                        if (callback) {
                            if (this.initCallbacks) {
                                this.initCallbacks.push(callback);
                            } else {
                                this.initCallbacks = [callback];
                            }
                        }

                        if (this.isInitialized === false) {
                            this.isInitialized = undefined;

                            if (!Client.Application.isInitialized) {
                                this.coreConfigurationToLoad = [];
                                Client.Application.addInitializeCallback(function () {
                                    return _this.loadPostponedCoreConfiguration();
                                });
                            }

                            if (!Configuration.settingsFile) {
                                Configuration.settingsFile = "/configuration.xml";
                            }

                            if (Configuration.settingsFile.charAt(0) != "/") {
                                Configuration.settingsFile = Client.Types.Url.combinePath(window.location.pathname, Configuration.settingsFile); // making sure the path starts with "/"
                            }

                            this.configurationFiles[Configuration.settingsFile.toLowerCase()] = { url: Configuration.settingsFile };

                            this.loadingCounter = 1;

                            if (Configuration.settings) {
                                this.processConfigurationFile(Configuration.settings, Configuration.settingsFile);
                            } else {
                                xhr(Configuration.settingsVersion ? Client.Types.Url.combinePath(Configuration.settingsFile, "?" + Configuration.settingsVersion) : Configuration.settingsFile, function (result) {
                                    return _this.processConfigurationFile(result, Configuration.settingsFile);
                                });
                            }
                        }
                    } else if (callback) {
                        callback();
                    }
                };

                ConfigurationManagerClass.prototype.getAppSetting = function (name) {
                    var value = this.cachedAppSettings[name];
                    if (value === undefined) {
                        if (Client.Application.isHosted && Client.Application.sharedSettings) {
                            value = Client.Application.sharedSettings[name];
                        }

                        if (value === undefined) {
                            var settingNode = Client.Xml.selectSingleNode(this.configuration, "//configuration/appSettings/setting[@name='" + name + "' and @value]");
                            if (settingNode) {
                                value = settingNode.getAttribute("value");
                                if (value && value.indexOf("~") == 0 && settingNode.getAttribute("type") == "url") {
                                    value = Client.Types.Url.getAbsoluteUrl(Client.Types.Url.combinePath(this.corePath, value.slice(2)));
                                }
                            } else {
                                value = null;
                            }
                        }
                        this.cachedAppSettings[name] = value;
                    }
                    return value;
                };

                ConfigurationManagerClass.prototype.getCurrentPageConfigurationNode = function () {
                    if (!this.currentPageConfigurationNode) {
                        var pageNodes = SDL.Client.Xml.selectNodes(this.configuration, "//configuration/pages/page[@url]");
                        if (pageNodes) {
                            var path = window.location.pathname;

                            for (var i = 0, len = pageNodes.length; i < len; i++) {
                                var pageNode = pageNodes[i];
                                var url = pageNode.getAttribute("url");
                                if (!SDL.Client.Types.Url.isAbsoluteUrl(url)) {
                                    var baseUrl = pageNode.parentNode.getAttribute("baseUrl");
                                    if (baseUrl) {
                                        url = SDL.Client.Types.Url.combinePath(baseUrl, url);
                                    }

                                    if (!SDL.Client.Types.Url.isAbsoluteUrl(url)) {
                                        var baseUrlNodes = Client.Xml.selectNodes(pageNode, "ancestor::configuration/@baseUrl");
                                        if (baseUrlNodes.length) {
                                            url = SDL.Client.Types.Url.combinePath(baseUrlNodes[baseUrlNodes.length - 1].value, url);
                                        }
                                    }
                                }

                                // create a regular expression to process '*' as <anything>.
                                // if need '*', then use '\*'.
                                // if need \<anything>, use %5C for '\' => %5C*
                                var regExp = new RegExp("^" + url.replace(/([\(\)\{\}\[\]\^\$\?\:\.\|\+]|\\(?!\*))/g, "\\$1").replace(/\*/g, ".*").replace(/\\\.\*/g, "\\*") + "$", "i");

                                if (regExp.test(path)) {
                                    return this.currentPageConfigurationNode = pageNode;
                                }
                            }
                        }
                    }
                    return this.currentPageConfigurationNode;
                };

                ConfigurationManagerClass.prototype.getCurrentPageExtensionConfigurationNodes = function () {
                    if (!this.currentPageExtensionConfigurationNodes) {
                        var extensionNodes = this.currentPageExtensionConfigurationNodes = [];
                        var pageNodes = SDL.Client.Xml.selectNodes(this.configuration, "//configuration/extensions/pages/page[@url]");
                        if (pageNodes.length) {
                            var path = window.location.pathname;

                            for (var i = 0, len = pageNodes.length; i < len; i++) {
                                var pageNode = pageNodes[i];
                                var url = pageNode.getAttribute("url");
                                if (!SDL.Client.Types.Url.isAbsoluteUrl(url)) {
                                    var baseUrl = pageNode.parentNode.getAttribute("baseUrl");
                                    if (baseUrl) {
                                        url = SDL.Client.Types.Url.combinePath(baseUrl, url);
                                    }

                                    if (!SDL.Client.Types.Url.isAbsoluteUrl(url)) {
                                        var baseUrlNodes = Client.Xml.selectNodes(pageNode, "ancestor::configuration/@baseUrl");
                                        if (baseUrlNodes.length) {
                                            url = SDL.Client.Types.Url.combinePath(baseUrlNodes[baseUrlNodes.length - 1].value, url);
                                        }
                                    }
                                }

                                // create a regular expression to process '*' as <anything>.
                                // if need '*', then use '\*'.
                                // if need \<anything>, use %5C for '\' => %5C*
                                var regExp = new RegExp("^" + url.replace(/([\(\)\{\}\[\]\^\$\?\:\.\|\+]|\\(?!\*))/g, "\\$1").replace(/\*/g, ".*").replace(/\\\.\*/g, "\\*") + "$", "i");

                                if (regExp.test(path)) {
                                    extensionNodes.push(pageNode);
                                }
                            }
                        }
                    }
                    return this.currentPageExtensionConfigurationNodes;
                };

                ConfigurationManagerClass.prototype.callbacks = function () {
                    if (this.initCallbacks) {
                        for (var i = 0, len = this.initCallbacks.length; i < len; i++) {
                            this.initCallbacks[i]();
                        }
                        this.initCallbacks = null;
                    }
                };

                ConfigurationManagerClass.prototype.nonCoreCallbacks = function () {
                    if (this.nonCoreInitCallbacks) {
                        for (var i = 0, len = this.nonCoreInitCallbacks.length; i < len; i++) {
                            this.nonCoreInitCallbacks[i]();
                        }
                        this.nonCoreInitCallbacks = null;
                    }
                };

                ConfigurationManagerClass.prototype.processConfigurationFile = function (xmlString, baseUrl, parentElement) {
                    /*
                    ConfigurationManager.corePath is set to a configured value when the corresponding 'corePath' setting is found in a configuration file.
                    ConfigurationManager.corePath is used to resolve urls that start with ~/. ~/ makes sense only if 'corePath' has already been set.
                    processConfigurationFile(...) method is called when a configuration file is loaded.
                    Therefore this is an impossible situation that the url of a loaded file starts with ~/ while ConfigurationManager.corePath is undefined.
                    */
                    this.configurationFiles[(baseUrl.indexOf("~/") == 0 ? Client.Types.Url.combinePath(this.corePath, baseUrl.slice(2)) : baseUrl).toLowerCase()].data = xmlString;

                    var document = Client.Xml.getNewXmlDocument(xmlString);
                    if (Client.Xml.hasParseError(document)) {
                        throw Error("Invalid xml loaded: " + baseUrl + "\n" + Client.Xml.getParseError(document));
                    }

                    var data = document.documentElement;

                    if (!this.configuration) {
                        this.configuration = data;
                    }

                    if (!this.corePath) {
                        var corePath = Client.Xml.getInnerText(data, "//configuration/appSettings/setting[@name='corePath']/@value");
                        if (corePath != null) {
                            if (!corePath) {
                                corePath = "/";
                            } else if (corePath.slice(-1) != "/") {
                                corePath += "/";
                            }
                            this.corePath = Client.Types.Url.combinePath(baseUrl, corePath);
                        }
                    }

                    var urlSettings = Client.Xml.selectNodes(data, "//configuration/appSettings/setting[@type='url']/@value");
                    for (var i = 0, len = urlSettings.length; i < len; i++) {
                        var urlSetting = urlSettings[i];
                        if (urlSetting.value.indexOf("~") != 0 && !Client.Types.Url.isAbsoluteUrl(urlSetting.value)) {
                            urlSetting.value = Client.Types.Url.getAbsoluteUrl(Client.Types.Url.combinePath(baseUrl, urlSetting.value));
                        }
                    }

                    if (this.coreVersion == null) {
                        this.coreVersion = Client.Xml.getInnerText(data, "//configuration/appSettings/setting[@name='coreVersion']/@value");
                    }

                    if (this.version == null) {
                        this.version = Client.Xml.getInnerText(data, "//configuration/appSettings/setting[@name='version']/@value");
                    }

                    var includeNodes = Client.Xml.selectNodes(data, "//configuration/include[not(configuration)]");

                    if (parentElement) {
                        parentElement.appendChild(data);
                    }

                    var len = includeNodes.length;
                    this.loadingCounter += len;

                    if (baseUrl) {
                        data.setAttribute("baseUrl", baseUrl);
                    }

                    for (var i = 0; i < len; i++) {
                        this.loadIncludedConfigurationFile(includeNodes[i], baseUrl);
                    }
                    ;

                    this.loadingCounter--;

                    if (!this.nonCoreInitialized && this.loadingCounter == (this.coreConfigurationToLoad ? this.coreConfigurationToLoad.length : 0)) {
                        this.nonCoreInitialized = true;
                        this.isApplicationHost = !!Client.Xml.selectSingleNode(this.configuration, "//configuration/applicationHost");
                        this.nonCoreCallbacks();
                    }

                    if (!this.loadingCounter) {
                        this.isInitialized = true;
                        this.callbacks();
                    }
                };

                ConfigurationManagerClass.prototype.loadPostponedCoreConfiguration = function () {
                    if (this.coreConfigurationToLoad) {
                        var libraryConfigurationToLoad = this.coreConfigurationToLoad;
                        this.coreConfigurationToLoad = null;
                        for (var i = 0, len = libraryConfigurationToLoad.length; i < len; i++) {
                            this.loadCoreConfigurationFile(null, libraryConfigurationToLoad[i]);
                        }
                    }
                };

                ConfigurationManagerClass.prototype.loadCoreConfigurationFile = function (url, node) {
                    if (!url) {
                        url = node.getAttribute("src");
                    }

                    this.loadConfigurationFile(url, Client.Types.Url.combinePath(this.corePath, url.slice(2)), node);
                };

                ConfigurationManagerClass.prototype.loadIncludedConfigurationFile = function (node, baseUrl) {
                    var url = node.getAttribute("src");

                    if (url.indexOf("~/") == 0) {
                        if (this.coreConfigurationToLoad) {
                            this.coreConfigurationToLoad.push(node);
                        } else {
                            this.loadCoreConfigurationFile(url, node);
                        }
                    } else {
                        url = Client.Types.Url.combinePath(baseUrl, url);
                        if (url.indexOf("~/") == 0) {
                            this.loadCoreConfigurationFile(url, node);
                        } else {
                            this.loadConfigurationFile(url, url, node);
                        }
                    }
                };

                ConfigurationManagerClass.prototype.loadConfigurationFile = function (url, resolvedUrl, node) {
                    var _this = this;
                    if (this.configurationFiles[resolvedUrl.toLowerCase()]) {
                        // file is already included, skip it here
                        this.loadingCounter--;
                        return;
                    }

                    this.configurationFiles[resolvedUrl.toLowerCase()] = { url: url };

                    var version;
                    var appVersionNodes = Client.Xml.selectNodes(node, "ancestor::configuration/appSettings/setting[@name='version' and @value]");

                    if (appVersionNodes.length) {
                        var appVersionNode = appVersionNodes[appVersionNodes.length - 1];
                        if (url.indexOf("~/") == 0) {
                            version = Client.Xml.getInnerText(appVersionNode, "../../appSettings/setting[@name='coreVersion']/@value");
                        }
                        if (!version) {
                            version = appVersionNode.getAttribute("value");
                        }
                    }

                    var modification = node.getAttribute("modification");
                    version = (version && modification) ? (version + "." + modification) : (version || modification);

                    if (Client.Application.isHosted && Client.Application.useHostedLibraryResources && url.indexOf("~/") == 0) {
                        Client.Application.ApplicationHost.getCommonLibraryResource({ url: url, version: version }, Client.Application.libraryVersion, function (result) {
                            return _this.processConfigurationFile(result, url, node);
                        });
                    } else {
                        xhr(version ? Client.Types.Url.combinePath(resolvedUrl, "?" + version) : resolvedUrl, function (result) {
                            return _this.processConfigurationFile(result, url, node);
                        });
                    }
                };
                return ConfigurationManagerClass;
            })();
            ;

            function xhr(url, callback) {
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

                            throw Error(error || xhr.responseText);
                        }

                        callback(xhr.responseText);
                    }
                };
                xhr.open("GET", url, true);
                xhr.send();
            }

            Configuration.ConfigurationManager = new ConfigurationManagerClass();
        })(Client.Configuration || (Client.Configuration = {}));
        var Configuration = Client.Configuration;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=ConfigurationManager.js.map
