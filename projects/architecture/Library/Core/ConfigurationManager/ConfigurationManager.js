var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
        /// <reference path="../Net/Ajax.d.ts" />
        /// <reference path="../Xml/Xml.d.ts" />
        /// <reference path="../Types/Types.d.ts" />
        /// <reference path="../Types/Url.d.ts" />
        (function (Configuration) {
            ;

            var ConfigurationManagerClass = (function () {
                function ConfigurationManagerClass() {
                    this.loadingCounter = 0;
                    this.confFiles = [];
                    this.initialized = false;
                }
                ConfigurationManagerClass.prototype.init = function (settingsUrl, callback) {
                    var _this = this;
                    if (SDL.Client.Type.isString(settingsUrl)) {
                        Configuration.settingsFile = settingsUrl;
                    } else {
                        if (!callback) {
                            callback = settingsUrl;
                        }

                        if (!Configuration.settingsFile) {
                            Configuration.settingsFile = "/configuration.xml";
                        }
                    }

                    if (Configuration.settingsFile.charAt(0) != "/") {
                        Configuration.settingsFile = Client.Types.Url.combinePath(window.location.pathname, Configuration.settingsFile);
                    }

                    if (!this.initialized) {
                        if (callback) {
                            if (this.initCallbacks) {
                                this.initCallbacks.push(callback);
                            } else {
                                this.initCallbacks = [callback];
                            }
                        }

                        this.confFiles.push(Configuration.settingsFile);

                        if (Configuration.settingsVersion) {
                            Configuration.settingsFile = Client.Types.Url.combinePath(Configuration.settingsFile, "?" + Configuration.settingsVersion);
                        }

                        this.loadingCounter = 1;

                        Client.Net.getRequest(Configuration.settingsFile, function (result) {
                            return _this.processConfigurationFile(result, Configuration.settingsFile);
                        }, null);
                    } else if (callback) {
                        callback();
                    }
                };

                ConfigurationManagerClass.prototype.processConfigurationFile = function (xmlString, baseUrl, parentElement) {
                    var _this = this;
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

                    if (this.coreVersion == null) {
                        this.coreVersion = Client.Xml.getInnerText(data, "//configuration/appSettings/setting[@name='coreVersion']/@value");
                    }

                    var includeNodes = Client.Xml.selectNodes(data, "//configuration/include[not(configuration)]");

                    if (parentElement) {
                        parentElement.appendChild(data);
                    }

                    this.loadingCounter += includeNodes.length;

                    SDL.jQuery.each(includeNodes, function (i, node) {
                        var url = node.getAttribute("src");
                        var resolvedUrl;
                        var version;

                        if (url.indexOf("~/") != 0) {
                            url = Client.Types.Url.combinePath(baseUrl, url);
                        }

                        if (url.indexOf("~/") == 0) {
                            resolvedUrl = Client.Types.Url.combinePath(_this.corePath, url.slice(2));
                            version = _this.coreVersion;
                        } else {
                            resolvedUrl = url;
                        }

                        if (_this.confFiles.indexOf(resolvedUrl) != -1) {
                            // file is already included, skip it here
                            _this.loadingCounter--;
                            return;
                        }

                        _this.confFiles.push(resolvedUrl);

                        if (!version) {
                            var appVersionNodes = Client.Xml.selectNodes(node, "ancestor::configuration/appSettings/setting[@name='version']/@value");
                            version = appVersionNodes.length ? appVersionNodes[appVersionNodes.length - 1].nodeValue : "";
                        }

                        var modification = node.getAttribute("modification");
                        version = (version && modification) ? (version + "." + modification) : (version || modification);

                        if (version) {
                            resolvedUrl = Client.Types.Url.combinePath(resolvedUrl, "?" + version);
                        }

                        Client.Net.getRequest(resolvedUrl, function (result) {
                            return _this.processConfigurationFile(result, url, node);
                        }, null);
                    });

                    if (baseUrl) {
                        data.setAttribute("baseUrl", baseUrl);
                    }

                    this.loadingCounter--;

                    if (this.loadingCounter == 0) {
                        this.initialized = true;
                        this.callbacks();
                    }
                };

                ConfigurationManagerClass.prototype.toString = function () {
                    return Client.Xml.getOuterXml(this.configuration, null);
                };

                ConfigurationManagerClass.prototype.getAppSetting = function (name) {
                    return Client.Xml.getInnerText(this.configuration, "//configuration/appSettings/setting[@name='" + name + "']/@value");
                };

                ConfigurationManagerClass.prototype.callbacks = function () {
                    if (this.initCallbacks) {
                        SDL.jQuery.each(this.initCallbacks, function (i, callback) {
                            callback();
                        });
                        this.initCallbacks = null;
                    }
                };
                return ConfigurationManagerClass;
            })();
            ;

            Configuration.ConfigurationManager = new ConfigurationManagerClass();
        })(Client.Configuration || (Client.Configuration = {}));
        var Configuration = Client.Configuration;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=ConfigurationManager.js.map
