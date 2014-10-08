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
                    return Resources.FileResourceHandler.getTemplateResource(templateId);
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
                    var config = Client.Configuration.ConfigurationManager.configuration;

                    Resources.FileResourceHandler.corePath = Client.Configuration.ConfigurationManager.corePath;
                    Resources.FileResourceHandler.enablePackaging = Client.Configuration.ConfigurationManager.getAppSetting("debug") != "true";

                    if (Client.Configuration.ConfigurationManager.isApplicationHost) {
                        SDL.jQuery.each(Client.Configuration.ConfigurationManager.configurationFiles, function (url, file) {
                            if (file.url.indexOf("~/") == 0) {
                                Resources.FileResourceHandler.storeFileData(file.url, file.data);
                            }
                        });
                    }
                    Client.Configuration.ConfigurationManager.configurationFiles = null;

                    // traversing xml rather than using xpath, for performance optimization
                    var extensions = {};
                    var dependencies = {};
                    var packageResourcesToRegister = [];

                    var processConfigurationElement = function (configuration, baseUrl, version, locales) {
                        baseUrl = configuration.getAttribute("baseUrl") || baseUrl;

                        var childNode = configuration.firstChild;
                        while (childNode) {
                            if (childNode.nodeType == 1 && !childNode.namespaceURI) {
                                switch (Client.Xml.getLocalName(childNode)) {
                                    case "appSettings":
                                        version = getVersionSetting(childNode);
                                        break;
                                    case "locales":
                                        locales = getSupportedLocales(childNode);
                                        break;
                                }
                            }
                            childNode = childNode.nextSibling;
                        }

                        childNode = configuration.firstChild;
                        while (childNode) {
                            if (childNode.nodeType == 1 && !childNode.namespaceURI) {
                                switch (Client.Xml.getLocalName(childNode)) {
                                    case "appSettings":
                                        break;
                                    case "resourceGroups":
                                        processResourceGroupsElement(childNode, baseUrl, version, locales);
                                        break;
                                    case "extensions":
                                        processExtensionsElement(childNode);
                                        break;
                                    case "packages":
                                        processPackagesElement(childNode, baseUrl, version);
                                        break;
                                    case "configuration":
                                        processConfigurationElement(childNode, baseUrl, version, locales);
                                        break;
                                    case "include":
                                        processIncludedConfiguration(childNode, baseUrl, version, locales);
                                        break;
                                }
                            }
                            childNode = childNode.nextSibling;
                        }
                    };

                    var processIncludedConfiguration = function (node, baseUrl, appVersion, locales) {
                        var childNode = node.firstChild;
                        while (childNode) {
                            if (childNode.nodeType == 1 && !childNode.namespaceURI) {
                                switch (Client.Xml.getLocalName(childNode)) {
                                    case "configuration":
                                        processConfigurationElement(childNode, baseUrl, appVersion, locales);
                                        break;
                                    case "include":
                                        processIncludedConfiguration(childNode, baseUrl, appVersion, locales);
                                        break;
                                }
                            }
                            childNode = childNode.nextSibling;
                        }
                    };

                    var getVersionSetting = function (settings) {
                        var childNode = settings.firstChild;
                        while (childNode) {
                            if (childNode.nodeType == 1 && Client.Xml.getLocalName(childNode) == "setting" && childNode.getAttribute("name") == "version" && !childNode.namespaceURI) {
                                return childNode.getAttribute("value");
                            }
                            childNode = childNode.nextSibling;
                        }
                    };

                    var getSupportedLocales = function (settings) {
                        var childNode = settings.firstChild;
                        var locales = {};
                        while (childNode) {
                            if (childNode.nodeType == 1 && !childNode.namespaceURI && Client.Xml.getLocalName(childNode) == "locale") {
                                locales[Client.Xml.getInnerText(childNode).trim().toLowerCase()] = true;
                            }
                            childNode = childNode.nextSibling;
                        }
                        return locales;
                    };

                    var processResourceGroupsElement = function (resourceGroups, baseUrl, appVersion, locales) {
                        var resourceGroup = resourceGroups.firstChild;
                        while (resourceGroup) {
                            if (resourceGroup.nodeType == 1 && Client.Xml.getLocalName(resourceGroup) == "resourceGroup" && !resourceGroup.namespaceURI) {
                                processResourceGroupElement(resourceGroup, baseUrl, appVersion, locales);
                            }
                            resourceGroup = resourceGroup.nextSibling;
                        }
                    };

                    var processResourceGroupElement = function (resourceGroupElement, baseUrl, appVersion, locales) {
                        var name = resourceGroupElement.getAttribute("name");
                        var resourceGroup = {
                            name: name, files: [],
                            dependencies: dependencies[name] || (dependencies[name] = []),
                            extensions: extensions[name] || (extensions[name] = []) };
                        var childNode = resourceGroupElement.firstChild;
                        while (childNode) {
                            if (childNode.nodeType == 1 && !childNode.namespaceURI) {
                                switch (Client.Xml.getLocalName(childNode)) {
                                    case "files":
                                        processResourceGroupFilesElement(childNode, resourceGroup, baseUrl, appVersion, locales);
                                        break;
                                    case "dependencies":
                                        processResourceGroupDependenciesElement(childNode, resourceGroup);
                                        break;
                                }
                            }
                            childNode = childNode.nextSibling;
                        }
                        _this.newResourceGroup(resourceGroup);
                    };

                    var processResourceGroupFilesElement = function (resourceGroupFilesElement, resourceGroup, baseUrl, appVersion, locales) {
                        var fileElement = resourceGroupFilesElement.firstChild;
                        while (fileElement) {
                            if (fileElement.nodeType == 1 && Client.Xml.getLocalName(fileElement) == "file" && !fileElement.namespaceURI) {
                                var modification = fileElement.getAttribute("modification");
                                var url = fileElement.getAttribute("name");
                                var type = fileElement.getAttribute("type");
                                var file = {
                                    url: url.indexOf("~/") == 0 ? url : Client.Types.Url.combinePath(baseUrl, url),
                                    version: (appVersion && modification) ? (appVersion + "." + modification) : (appVersion || modification),
                                    locales: locales,
                                    fileType: type
                                };
                                resourceGroup.files.push(file);
                            }
                            fileElement = fileElement.nextSibling;
                        }
                    };

                    var processResourceGroupDependenciesElement = function (resourceGroupDependenciesElement, resourceGroup) {
                        var dependencyElement = resourceGroupDependenciesElement.firstChild;
                        while (dependencyElement) {
                            if (dependencyElement.nodeType == 1 && Client.Xml.getLocalName(dependencyElement) == "dependency" && !dependencyElement.namespaceURI) {
                                resourceGroup.dependencies.push(dependencyElement.getAttribute("name"));
                            }
                            dependencyElement = dependencyElement.nextSibling;
                        }
                    };

                    var processExtensionsElement = function (extensions) {
                        var resourceExtension = extensions.firstChild;
                        while (resourceExtension) {
                            if (resourceExtension.nodeType == 1 && Client.Xml.getLocalName(resourceExtension) == "resourceExtension" && !resourceExtension.namespaceURI) {
                                processResourceExtensionElement(resourceExtension);
                            }
                            resourceExtension = resourceExtension.nextSibling;
                        }
                    };

                    var processResourceExtensionElement = function (resourceExtension) {
                        var forResource = resourceExtension.getAttribute("for");
                        var extension = resourceExtension.firstChild;
                        while (extension) {
                            if (extension.nodeType == 1 && !extension.namespaceURI) {
                                switch (Client.Xml.getLocalName(extension)) {
                                    case "insert":
                                        var extensionName = extension.getAttribute("name");
                                        switch (extension.getAttribute("position")) {
                                            case "before":
                                                if (!dependencies[forResource]) {
                                                    dependencies[forResource] = [extensionName];
                                                } else {
                                                    dependencies[forResource].push(extensionName);
                                                }
                                                break;

                                            default:
                                                if (!extensions[forResource]) {
                                                    extensions[forResource] = [extensionName];
                                                } else {
                                                    extensions[forResource].push(extensionName);
                                                }
                                                break;
                                        }
                                        break;
                                }
                            }
                            extension = extension.nextSibling;
                        }
                    };

                    var processPackagesElement = function (packages, baseUrl, appVersion) {
                        var packageElement = packages.firstChild;
                        while (packageElement) {
                            if (packageElement.nodeType == 1 && Client.Xml.getLocalName(packageElement) == "package" && !packageElement.namespaceURI) {
                                processPackageElement(packageElement, baseUrl, appVersion);
                            }
                            packageElement = packageElement.nextSibling;
                        }
                    };

                    var processPackageElement = function (packageElement, baseUrl, appVersion) {
                        var url = packageElement.getAttribute("src");
                        var modification = packageElement.getAttribute("modification");

                        var resourcesPackage = {
                            name: packageElement.getAttribute("name"),
                            url: url.indexOf("~/") == 0 ? url : Client.Types.Url.combinePath(baseUrl, url),
                            version: (appVersion && modification) ? (appVersion + "." + modification) : (appVersion || modification),
                            resourceGroups: [] };

                        var packageResourceGroupsElement = packageElement.firstChild;
                        while (packageResourceGroupsElement) {
                            if (packageResourceGroupsElement.nodeType == 1 && Client.Xml.getLocalName(packageResourceGroupsElement) == "resourceGroups" && !packageResourceGroupsElement.namespaceURI) {
                                processPackageResourceGroupsElement(packageResourceGroupsElement, resourcesPackage);
                            }
                            packageResourceGroupsElement = packageResourceGroupsElement.nextSibling;
                        }
                        packageResourcesToRegister.push(resourcesPackage);
                    };

                    var processPackageResourceGroupsElement = function (resourceGroupsElement, resourcesPackage) {
                        var packageResourceGroup = resourceGroupsElement.firstChild;
                        while (packageResourceGroup) {
                            if (packageResourceGroup.nodeType == 1 && Client.Xml.getLocalName(packageResourceGroup) == "resourceGroup" && !packageResourceGroup.namespaceURI) {
                                resourcesPackage.resourceGroups.push({ name: packageResourceGroup.getAttribute("name"), files: [] });
                            }
                            packageResourceGroup = packageResourceGroup.nextSibling;
                        }
                    };

                    processConfigurationElement(config, "", "", null);

                    for (var i = 0, len = packageResourcesToRegister.length; i < len; i++) {
                        var packageResource = packageResourcesToRegister[i];
                        var resourceGroups = packageResource.resourceGroups;
                        for (var j = 0, lenj = resourceGroups.length; j < lenj; j++) {
                            var resourceGroup = resourceGroups[j];
                            var resources = this.registeredResources[resourceGroup.name];
                            if (resources) {
                                for (var k = 0, lenk = resources.files.length; k < lenk; k++) {
                                    var fileDefinition = resources.files[k];
                                    var url = fileDefinition.url;
                                    if (url.indexOf("{CULTURE}") == -1) {
                                        resourceGroup.files.push(fileDefinition);
                                    } else {
                                        if (!resourceGroup.cultureFiles) {
                                            resourceGroup.cultureFiles = [];
                                        }
                                        resourceGroup.cultureFiles.push(fileDefinition);
                                    }
                                }
                            } else {
                                throw Error("Unknown resource group name '" + resourceGroup.name + "' encountered in package '" + packageResource.name + "'.");
                            }
                        }

                        Resources.FileResourceHandler.registerPackage(packageResource);
                    }
                };

                ResourceManagerClass.prototype.storeFileData = function (url, data, isShared) {
                    Resources.FileResourceHandler.storeFileData(url, data, isShared);
                };

                ResourceManagerClass.prototype.registerPackageRendered = function (packageName, url, data) {
                    Resources.FileResourceHandler.registerPackageRendered(packageName, url, data);
                };

                ResourceManagerClass.prototype._resolve = function (resourceGroupName, resources, callstack) {
                    var _this = this;
                    if (!resources) {
                        resources = [];
                    }

                    if (!callstack) {
                        callstack = [];
                    }

                    if (resources.indexOf(resourceGroupName) == -1) {
                        var resourceSettings = this.registeredResources[resourceGroupName];
                        if (!resourceSettings) {
                            throw Error("Resource group with name '" + resourceGroupName + "' does not exist");
                        }

                        if (callstack.indexOf(resourceGroupName) != -1) {
                            throw Error("Circular dependency detected: '" + callstack.join(" -> ") + " -> " + resourceGroupName);
                        }

                        if (resourceSettings.dependencies && resourceSettings.dependencies.length) {
                            callstack = callstack.concat(resourceGroupName);
                            SDL.jQuery.each((this.mode & 1 /* REVERSE */) ? resourceSettings.dependencies.reverse() : resourceSettings.dependencies, function (index, value) {
                                return _this._resolve(value, resources, callstack);
                            });
                        }

                        if (resources.indexOf(resourceGroupName) == -1) {
                            resources.push(resourceGroupName);

                            if (resourceSettings.extensions && resourceSettings.extensions.length) {
                                SDL.jQuery.each((this.mode & 1 /* REVERSE */) ? resourceSettings.extensions.reverse() : resourceSettings.extensions, function (index, value) {
                                    return _this._resolve(value, resources);
                                });
                            }
                        }
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
                                        Resources.FileResourceHandler.renderWhenLoaded(file, renderNextFile, errorcallback ? function (file) {
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
                                        return Resources.FileResourceHandler.loadIfNotRendered(value, null, errorcallback ? function (file) {
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
