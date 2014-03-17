/// <reference path="Resources.d.ts" />
/// <reference path="FileResourceHandler.ts" />
/// <reference path="../ConfigurationManager/ConfigurationManager.ts" />
/// <reference path="../Xml/Xml.ts" />
var SDL;
(function (SDL) {
    (function (Client) {
        (function (Resources) {
            SDL.jQuery.ajaxSetup({
                // Enable caching of AJAX responses
                cache: true
            });

            (function (ResourceManagerMode) {
                ResourceManagerMode[ResourceManagerMode["NORMAL"] = 0] = "NORMAL";
                ResourceManagerMode[ResourceManagerMode["REVERSE"] = 1] = "REVERSE";
                ResourceManagerMode[ResourceManagerMode["SYNCHRONOUS"] = 2] = "SYNCHRONOUS";
            })(Resources.ResourceManagerMode || (Resources.ResourceManagerMode = {}));
            var ResourceManagerMode = Resources.ResourceManagerMode;

            var ResourceManagerClass = (function () {
                function ResourceManagerClass() {
                    this.mode = 0 /* NORMAL */;
                    // Collection of all registered resource groups
                    this.registeredResources = {};
                    this.callbacks = {};
                }
                ResourceManagerClass.prototype.setMode = function (mode) {
                    this.mode = mode;
                };

                ResourceManagerClass.prototype.newResourceGroup = function (options) {
                    if (!this.registeredResources[options.name]) {
                        this.registeredResources[options.name] = options;
                    } else {
                        throw Error("Resource group with name '" + options.name + "' is already registered.");
                    }
                };

                ResourceManagerClass.prototype.getTemplateResource = function (templateId) {
                    return SDL.Client.Resources.FileResourceHandler.getTemplateResource(templateId);
                };

                ResourceManagerClass.prototype.resolveResources = function (resourceGroupName) {
                    var _this = this;
                    return SDL.jQuery.map(this._resolve(resourceGroupName), function (name) {
                        var resource = _this.registeredResources[name];
                        if (resource.files && resource.files.length) {
                            return {
                                name: resource.name,
                                files: SDL.jQuery.map(resource.files, function (file) {
                                    return file.url;
                                })
                            };
                        }
                    });
                };

                ResourceManagerClass.prototype.load = function (resourceGroupName, callback, errorcallback) {
                    this._render(resourceGroupName, callback, errorcallback);
                };

                ResourceManagerClass.prototype.readConfiguration = function () {
                    var _this = this;
                    var config = SDL.Client.Configuration.ConfigurationManager.configuration;

                    SDL.Client.Resources.FileResourceHandler.corePath = SDL.Client.Configuration.ConfigurationManager.corePath;
                    SDL.Client.Resources.FileResourceHandler.enablePackaging = SDL.Client.Configuration.ConfigurationManager.getAppSetting("debug") != "true";

                    if (SDL.Client.Configuration.ConfigurationManager.isApplicationHost) {
                        SDL.jQuery.each(SDL.Client.Configuration.ConfigurationManager.configurationFiles, function (url, file) {
                            if (file.url.indexOf("~/") == 0) {
                                SDL.Client.Resources.FileResourceHandler.storeFileData(file.url, file.data);
                            }
                        });
                    }
                    SDL.Client.Configuration.ConfigurationManager.configurationFiles = null;

                    SDL.jQuery.each(SDL.Client.Xml.selectNodes(config, "//resourceGroups[parent::configuration and resourceGroup]"), function (index, resourceGroupsElement) {
                        var appVersionNodes = SDL.Client.Xml.selectNodes(resourceGroupsElement, "ancestor::configuration/appSettings/setting[@name='version']/@value");
                        var appVersion = appVersionNodes.length ? appVersionNodes[appVersionNodes.length - 1].nodeValue : "";

                        var baseUrlNodes = SDL.Client.Xml.selectNodes(resourceGroupsElement, "ancestor::configuration/@baseUrl");
                        var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

                        SDL.jQuery.each(SDL.Client.Xml.selectNodes(resourceGroupsElement, "resourceGroup"), function (index, resourceGroupElement) {
                            var name = resourceGroupElement.getAttribute("name");
                            var resourceGroup = { name: name, files: [], dependencies: [], extensions: [] };

                            SDL.jQuery.each(SDL.Client.Xml.selectNodes(resourceGroupElement, "files/file[@name]"), function (index, fileElement) {
                                var modification = fileElement.getAttribute("modification");
                                var url = fileElement.getAttribute("name");
                                var file = {
                                    url: url.indexOf("~/") == 0 ? url : SDL.Client.Types.Url.combinePath(baseUrl, url),
                                    version: (appVersion && modification) ? (appVersion + "." + modification) : (appVersion || modification)
                                };
                                resourceGroup.files.push(file);
                            });

                            SDL.jQuery.each(SDL.Client.Xml.selectNodes(resourceGroupElement, "dependencies/dependency/@name"), function (index, dependency) {
                                resourceGroup.dependencies.push(dependency.value);
                            });

                            SDL.jQuery.each(SDL.Client.Xml.selectNodes(config, "//configuration/extensions/resourceExtension[@for = \"" + name + "\"]/insert[@position = 'before']/@name"), function (index, dependency) {
                                resourceGroup.dependencies.push(dependency.value);
                            });

                            SDL.jQuery.each(SDL.Client.Xml.selectNodes(config, "//configuration/extensions/resourceExtension[@for = \"" + name + "\"]/insert[not(@position) or @position = 'after']/@name"), function (index, extension) {
                                resourceGroup.extensions.push(extension.value);
                            });

                            _this.newResourceGroup(resourceGroup);
                        });
                    });

                    SDL.jQuery.each(SDL.Client.Xml.selectNodes(config, "//packages[parent::configuration and package]"), function (index, packagesNode) {
                        var appVersionNodes = SDL.Client.Xml.selectNodes(packagesNode, "ancestor::configuration/appSettings/setting[@name='version']/@value");
                        var appVersion = appVersionNodes.length ? appVersionNodes[appVersionNodes.length - 1].nodeValue : "";

                        var baseUrlNodes = SDL.Client.Xml.selectNodes(packagesNode, "ancestor::configuration/@baseUrl");
                        var baseUrl = baseUrlNodes.length ? baseUrlNodes[baseUrlNodes.length - 1].nodeValue : "";

                        SDL.jQuery.each(SDL.Client.Xml.selectNodes(packagesNode, "package"), function (index, packageElement) {
                            var url = packageElement.getAttribute("src");
                            var modification = packageElement.getAttribute("modification");

                            var resourcesPackage = {
                                name: packageElement.getAttribute("name"),
                                url: url.indexOf("~/") == 0 ? url : SDL.Client.Types.Url.combinePath(baseUrl, url),
                                version: (appVersion && modification) ? (appVersion + "." + modification) : (appVersion || modification),
                                resourceGroups: [] };

                            SDL.jQuery.each(SDL.Client.Xml.selectNodes(packageElement, ".//resourceGroups/resourceGroup"), function (index, groupElement) {
                                var groupName = groupElement.getAttribute("name");
                                var files = [];
                                resourcesPackage.resourceGroups.push({ name: groupName, files: files });
                                SDL.jQuery.each(_this.registeredResources[groupName].files, function (index, file) {
                                    if (file.url.indexOf("{CULTURE}") == -1) {
                                        files.push(file.url);
                                    }
                                });
                            });
                            SDL.Client.Resources.FileResourceHandler.registerPackage(resourcesPackage);
                        });
                    });
                };

                ResourceManagerClass.prototype.storeFileData = function (url, data, isShared) {
                    SDL.Client.Resources.FileResourceHandler.storeFileData(url, data, isShared);
                };

                ResourceManagerClass.prototype.registerPackageRendered = function (packageName, url, data) {
                    SDL.Client.Resources.FileResourceHandler.registerPackageRendered(packageName, url, data);
                };

                ResourceManagerClass.prototype._resolve = function (resourceGroupName, resources) {
                    var _this = this;
                    if (!resources) {
                        resources = [];
                    }

                    var resourceSettings = this.registeredResources[resourceGroupName];
                    if (!resourceSettings) {
                        throw Error("Resource group with name '" + resourceGroupName + "' does not exist");
                    }

                    if (resourceSettings.dependencies && resourceSettings.dependencies.length) {
                        SDL.jQuery.each((this.mode & 1 /* REVERSE */) ? resourceSettings.dependencies.reverse() : resourceSettings.dependencies, function (index, value) {
                            return _this._resolve(value, resources);
                        });
                    }

                    if (resources.indexOf(resourceGroupName) == -1) {
                        resources.push(resourceGroupName);
                    }

                    if (resourceSettings.extensions && resourceSettings.extensions.length) {
                        SDL.jQuery.each((this.mode & 1 /* REVERSE */) ? resourceSettings.extensions.reverse() : resourceSettings.extensions, function (index, value) {
                            return _this._resolve(value, resources);
                        });
                    }

                    return resources;
                };

                ResourceManagerClass.prototype._render = function (resourceGroupName, callback, errorcallback, callstack) {
                    var _this = this;
                    var resourceSettings = this.registeredResources[resourceGroupName];
                    if (!resourceSettings) {
                        var error = "Resource group with name '" + resourceGroupName + "' does not exist";
                        if (errorcallback) {
                            errorcallback(error);
                            return;
                        } else {
                            throw Error(error);
                        }
                    } else if (resourceSettings.rendered) {
                        if (callback) {
                            callback();
                        }
                    } else {
                        if (resourceSettings.loading) {
                            if (callstack) {
                                var index = SDL.jQuery.inArray(resourceGroupName, callstack);
                                if (index != -1) {
                                    index++;
                                    for (var len = callstack.length; index < len; index++) {
                                        if (this.registeredResources[callstack[index]].rendered) {
                                            if (callback) {
                                                callback();
                                            }
                                            return;
                                        }
                                    }

                                    var error = "Circular dependency detected: " + callstack.join(" -> ") + " -> " + resourceGroupName;
                                    if (errorcallback) {
                                        errorcallback(error);
                                    } else {
                                        throw Error(error);
                                    }
                                    return;
                                }
                            }

                            // loading -> wait for an event
                            if (callback)
                                this.callbacks[resourceGroupName].add(callback);
                        } else {
                            var extensions = resourceSettings.extensions;
                            if (extensions) {
                                var extensionsCount = extensions.length;
                                if (extensionsCount) {
                                    var _callback = callback;
                                    callback = function () {
                                        var extensionInCallstack = -1;

                                        var onExtensionLoaded;

                                        if (_callback) {
                                            if (callstack) {
                                                for (var i = 0; i < extensionsCount; i++) {
                                                    if (SDL.jQuery.inArray(extensions[i], callstack) != -1) {
                                                        extensionInCallstack = i;
                                                        break;
                                                    }
                                                }
                                            }

                                            if (extensionInCallstack != -1) {
                                                // an extension in the callstack is waiting for a callback from the current group -> execute callback to prevent deadlocks
                                                // (could be smarter and call the callback only if other extensions are dependent on the extension in the callstack)
                                                _callback();
                                                errorcallback = null;
                                            } else {
                                                var renderedExtensions = 0;
                                                onExtensionLoaded = function () {
                                                    if (++renderedExtensions == extensionsCount) {
                                                        _callback();
                                                    }
                                                };
                                            }
                                        }

                                        var ownCallstack = callstack ? callstack.concat([resourceGroupName]) : [resourceGroupName];

                                        for (var i = 0; i < extensionsCount; i++) {
                                            if (extensionInCallstack != i) {
                                                _this._render(extensions[i], onExtensionLoaded, errorcallback, ownCallstack);
                                            }
                                        }
                                    };
                                }
                            }

                            resourceSettings.loading = true;

                            this.callbacks[resourceGroupName] = SDL.jQuery.Callbacks("once");

                            var renderCallbackHandler = function () {
                                resourceSettings.rendered = true;
                                resourceSettings.loading = false;
                                if (callback)
                                    callback();
                                _this.callbacks[resourceGroupName].fire();
                                _this.callbacks[resourceGroupName].empty();
                                delete _this.callbacks[resourceGroupName];
                            };

                            var dependenciesCount = resourceSettings.dependencies ? resourceSettings.dependencies.length : 0;
                            var filesCount = resourceSettings.files ? resourceSettings.files.length : 0;

                            if (dependenciesCount || filesCount) {
                                var renderedDependenciesCount = 0;
                                var nextFileToLoad = 0;

                                var renderNextFile = function () {
                                    if (nextFileToLoad < filesCount) {
                                        var file = resourceSettings.files[nextFileToLoad];
                                        nextFileToLoad++;
                                        SDL.Client.Resources.FileResourceHandler.renderWhenLoaded(file, renderNextFile, errorcallback ? function (file) {
                                            return errorcallback(file && file.error);
                                        } : null, (_this.mode & 2 /* SYNCHRONOUS */) != 0);
                                    } else {
                                        renderCallbackHandler();
                                    }
                                };

                                var dependencyCallbackHandler = function () {
                                    if (++renderedDependenciesCount == dependenciesCount) {
                                        renderNextFile();
                                    }
                                };

                                if (filesCount) {
                                    // Start loading this resource group's files
                                    SDL.jQuery.each(resourceSettings.files, function (index, value) {
                                        return SDL.Client.Resources.FileResourceHandler.loadIfNotRendered(value, null, errorcallback ? function (file) {
                                            return errorcallback(file && file.error);
                                        } : null, (_this.mode & 2 /* SYNCHRONOUS */) != 0);
                                    });
                                }

                                if (dependenciesCount) {
                                    // add the resource group to the dependency callstack to be able to detect circular references
                                    var ownCallstack = callstack ? callstack.concat([resourceGroupName]) : [resourceGroupName];

                                    SDL.jQuery.each((this.mode & 1 /* REVERSE */) ? resourceSettings.dependencies.reverse() : resourceSettings.dependencies, function (index, value) {
                                        return _this._render(value, dependencyCallbackHandler, errorcallback, ownCallstack);
                                    });
                                } else {
                                    renderNextFile();
                                }
                            } else {
                                renderCallbackHandler();
                            }
                        }
                    }
                };
                return ResourceManagerClass;
            })();

            Resources.ResourceManager = new ResourceManagerClass();
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=ResourceManager.js.map
