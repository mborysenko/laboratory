var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="Resources.d.ts" />
        /// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
        /// <reference path="../Localization/Localization.ts" />
        /// <reference path="../Application/Application.ts" />
        /// <reference path="../Net/Ajax.d.ts" />
        /// <reference path="../Types/Array.d.ts" />
        /// <reference path="../ConfigurationManager/ConfigurationManager.ts" />
        /// <reference path="ResourceLoader.ts" />
        (function (Resources) {
            var FileResourceHandler = (function () {
                function FileResourceHandler() {
                }
                FileResourceHandler.prototype._supports = function (url) {
                    return false;
                };
                FileResourceHandler.prototype._render = function (file) {
                };
                FileResourceHandler.prototype.supports = function (url) {
                    var m = url.match(/\.([^\.\/\?\#]+)(\?|\#|$)/);
                    var ext = m ? m[1].toLowerCase() : "";
                    return this._supports(ext);
                };

                FileResourceHandler.prototype.render = function (url) {
                    var file = FileResourceHandler.fileResources[url.toLowerCase()];

                    if (!file || (!file.rendering && !file.rendered)) {
                        if (!file || !file.loaded) {
                            throw Error("Cannot render file '" + url + "': file not loaded.");
                        } else {
                            file.rendering = true;
                            if (file.data) {
                                this._render(file);
                            }
                            file.rendered = true;
                            delete file.rendering;
                            if (!Client.Configuration.ConfigurationManager.isApplicationHost || file.url.indexOf("~/") != 0) {
                                delete file.data;
                            }
                        }
                    }
                };

                FileResourceHandler.loadIfNotRendered = function (file, callback, errorcallback, sync) {
                    if (file && file.url) {
                        var key = file.url.toLowerCase();
                        var fileResource = FileResourceHandler.fileResources[key];
                        if (fileResource && fileResource.rendered) {
                            if (callback) {
                                callback(fileResource);
                            }
                            return;
                        }
                    }
                    FileResourceHandler.load(file, callback, errorcallback, sync);
                };

                FileResourceHandler.load = function (file, callback, errorcallback, sync) {
                    if (file && file.url) {
                        var key = file.url.toLowerCase();
                        var fileResource = FileResourceHandler.fileResources[key];

                        if (!fileResource) {
                            fileResource = FileResourceHandler.fileResources[key] = SDL.jQuery.extend({}, file);
                            if (Client.Resources.preloadPackages) {
                                var pckg = Client.Resources.preloadPackages[key];
                                if (pckg) {
                                    if (pckg.error) {
                                        fileResource.error = pckg.error;
                                        delete Client.Resources.preloadPackages[key];
                                    } else {
                                        fileResource.loading = true;
                                        FileResourceHandler.callbacks[key] = SDL.jQuery.Callbacks("once");
                                        FileResourceHandler.errorcallbacks[key] = SDL.jQuery.Callbacks("once");
                                    }
                                }
                            }
                        }

                        if (fileResource.error) {
                            if (errorcallback)
                                errorcallback(fileResource);
                        } else if (fileResource.loaded) {
                            if (callback)
                                callback(fileResource);
                        } else if (fileResource.loading) {
                            if (callback) {
                                // Handle same file being requested multiple times - add another callback to the list
                                FileResourceHandler.callbacks[key].add(function () {
                                    callback(fileResource);
                                });
                            }
                            if (errorcallback) {
                                // Handle same file being requested multiple times - add another callback to the list
                                FileResourceHandler.errorcallbacks[key].add(function (error) {
                                    errorcallback(fileResource);
                                });
                            } else {
                                FileResourceHandler.errorcallbacks[key].add(function (error) {
                                    throw Error(error);
                                });
                            }
                        } else {
                            fileResource.loading = true;
                            FileResourceHandler.callbacks[key] = SDL.jQuery.Callbacks("once");
                            FileResourceHandler.errorcallbacks[key] = SDL.jQuery.Callbacks("once");

                            if (file.url.indexOf("{CULTURE}") != -1) {
                                FileResourceHandler.cultureResources[key] = fileResource;

                                var culture = Client.Localization.getCulture();
                                var filesToLoadCount = 1;
                                var _loadFileCallback = function (cultureFile) {
                                    if (cultureFile && !cultureFile.loaded && cultureFile.error) {
                                        cultureFile.loaded = true;
                                        cultureFile.rendered = true;
                                        if (window.console)
                                            window.console.log(cultureFile.error);
                                    }

                                    if (!--filesToLoadCount) {
                                        delete fileResource.loading;

                                        if (culture == Client.Localization.getCulture()) {
                                            fileResource.loaded = true;
                                            var errorcallbacks = FileResourceHandler.errorcallbacks[key];
                                            if (errorcallbacks) {
                                                errorcallbacks.empty();
                                                delete FileResourceHandler.errorcallbacks[key];
                                            }

                                            if (callback)
                                                callback(fileResource);

                                            // The call will execute all other components callbacks that requested same file after it started loading
                                            var callbacks = FileResourceHandler.callbacks[key];
                                            if (callbacks) {
                                                callbacks.fire();
                                                callbacks.empty();
                                                delete FileResourceHandler.callbacks[key];
                                            }
                                        } else {
                                            // call load() on the same file resource again, now that culture has changed, to load the required culture files
                                            FileResourceHandler.load(file, callback, errorcallback, sync);
                                        }
                                    }
                                };

                                if (culture && culture != "en") {
                                    var dashIndex = culture.indexOf("-");
                                    if (dashIndex > 0) {
                                        var lang = culture.slice(0, dashIndex);
                                        if (lang != "en") {
                                            // load the neutral culture file
                                            filesToLoadCount++;
                                            FileResourceHandler.load(SDL.jQuery.extend({}, file, { url: file.url.replace(/\{CULTURE\}/g, lang), context: SDL }), _loadFileCallback, _loadFileCallback, sync);
                                        }
                                    }

                                    // load the culture file
                                    FileResourceHandler.load(SDL.jQuery.extend({}, file, { url: file.url.replace(/\{CULTURE\}/g, culture), context: SDL }), _loadFileCallback, _loadFileCallback, sync);
                                } else {
                                    _loadFileCallback();
                                }
                            } else if (FileResourceHandler.enablePackaging && fileResource.parentPackages) {
                                if (callback) {
                                    FileResourceHandler.callbacks[key].add(function () {
                                        callback(fileResource);
                                    });
                                }
                                if (errorcallback) {
                                    FileResourceHandler.errorcallbacks[key].add(function (packageResource) {
                                        fileResource.error = packageResource.error;
                                        errorcallback(fileResource);
                                    });
                                }

                                FileResourceHandler.loadPackage(FileResourceHandler.getPreferedPackage(fileResource.parentPackages), null, null, sync);
                            } else {
                                Resources.ResourceLoader.load(file, FileResourceHandler.corePath, sync, function (data, isShared) {
                                    fileResource.data = data;
                                    fileResource.isShared = isShared;
                                    fileResource.loaded = true;
                                    delete fileResource.loading;

                                    var errorcallbacks = FileResourceHandler.errorcallbacks[key];
                                    if (errorcallbacks) {
                                        errorcallbacks.empty();
                                        delete FileResourceHandler.errorcallbacks[key];
                                    }

                                    if (callback)
                                        callback(fileResource);

                                    // The call will execute all other components callbacks that requested same file after it started loading
                                    var callbacks = FileResourceHandler.callbacks[key];
                                    if (callbacks) {
                                        callbacks.fire();
                                        callbacks.empty();
                                        delete FileResourceHandler.callbacks[key];
                                    }
                                }, function (error) {
                                    fileResource.error = file.url + ": " + error;
                                    if (errorcallback) {
                                        var callbacks = FileResourceHandler.callbacks[key];
                                        if (callbacks) {
                                            callbacks.empty();
                                            delete FileResourceHandler.callbacks[key];
                                        }

                                        // This call will execute errorcallback of the first component that requested this file
                                        errorcallback(fileResource);

                                        // The call will execute errorcallbacks for all other components that requested same file after it started loading
                                        var errorcallbacks = FileResourceHandler.errorcallbacks[key];
                                        if (errorcallbacks) {
                                            errorcallbacks.fire();
                                            errorcallbacks.empty();
                                            delete FileResourceHandler.errorcallbacks[key];
                                        }
                                    } else {
                                        throw Error(file.url + ": " + error);
                                    }
                                });
                            }
                        }
                    } else if (callback)
                        callback(null);
                };
                FileResourceHandler.renderWhenLoaded = function (file, callback, errorcallback, sync) {
                    if (file) {
                        var key = file.url.toLowerCase();
                        var fileResource = FileResourceHandler.fileResources[key];

                        if (fileResource && fileResource.rendered) {
                            if (callback) {
                                callback(fileResource);
                            }
                        } else if (!fileResource || !fileResource.loaded) {
                            FileResourceHandler.load(file, function (file) {
                                return FileResourceHandler.renderWhenLoaded(file, callback, errorcallback);
                            }, errorcallback, sync);
                        } else {
                            if (file.url.indexOf("{CULTURE}") != -1) {
                                var culture = Client.Localization.getCulture();
                                var filesToRenderCount = 1;
                                var _renderFileCallback = function (cultureFile) {
                                    if (cultureFile && !cultureFile.rendered && cultureFile.error) {
                                        cultureFile.loaded = true;
                                        cultureFile.rendered = true;
                                    }

                                    if (!--filesToRenderCount) {
                                        if (culture == Client.Localization.getCulture()) {
                                            fileResource.rendered = true;
                                            if (callback) {
                                                callback(fileResource);
                                            }
                                        } else {
                                            FileResourceHandler.renderWhenLoaded(file, callback, errorcallback, sync);
                                        }
                                    }
                                };
                                if (culture && culture != "en") {
                                    var dashIndex = culture.indexOf("-");
                                    if (dashIndex > 0) {
                                        var lang = culture.slice(0, dashIndex);
                                        if (lang != "en") {
                                            // render the neutral culture file
                                            filesToRenderCount++;
                                            FileResourceHandler.renderWhenLoaded(SDL.jQuery.extend({}, file, { url: file.url.replace(/\{CULTURE\}/g, lang), context: SDL }), _renderFileCallback, _renderFileCallback, sync);
                                        }
                                    }
                                    FileResourceHandler.renderWhenLoaded(SDL.jQuery.extend({}, file, { url: file.url.replace(/\{CULTURE\}/g, culture), context: SDL }), _renderFileCallback, _renderFileCallback, sync);
                                } else {
                                    _renderFileCallback();
                                }
                            } else {
                                for (var i = 0; i < FileResourceHandler.registeredResourceHandlers.length; i++) {
                                    var handler = FileResourceHandler.registeredResourceHandlers[i];
                                    if (handler.supports(file.url)) {
                                        if (errorcallback) {
                                            try  {
                                                handler.render(file.url);
                                            } catch (err) {
                                                fileResource.error = "Error executing '" + fileResource.url + "': " + err.message;
                                                errorcallback(fileResource);
                                                return;
                                            }
                                        } else {
                                            handler.render(file.url);
                                        }

                                        if (callback) {
                                            callback(fileResource);
                                            return;
                                        }
                                    }
                                }

                                throw Error("There is no handler registered for file '" + file.url + "'.");
                            }
                        }
                    } else if (callback) {
                        callback(null);
                    }
                };

                FileResourceHandler.getTemplateResource = function (templateId) {
                    return FileResourceHandler.templates[templateId];
                };

                FileResourceHandler.registerPackage = function (resourcesPackage) {
                    if (resourcesPackage) {
                        var registeredPackage = FileResourceHandler.packages[resourcesPackage.name];
                        if (resourcesPackage.resourceGroups) {
                            var packageSetToRender = registeredPackage && registeredPackage.rendered && !registeredPackage.resourceGroups;
                            if (!registeredPackage || packageSetToRender) {
                                FileResourceHandler.packages[resourcesPackage.name] = resourcesPackage;

                                var resourceFiles = FileResourceHandler.fileResources;

                                SDL.jQuery.each(resourcesPackage.resourceGroups, function (index, resourceGroup) {
                                    return SDL.jQuery.each(resourceGroup.files, function (index, url) {
                                        var key = url.toLowerCase();
                                        var file = resourceFiles[key] || (resourceFiles[key] = { url: url });
                                        if (!file.parentPackages) {
                                            file.parentPackages = [resourcesPackage];
                                        } else {
                                            file.parentPackages.push(resourcesPackage);
                                        }
                                    });
                                });

                                if (packageSetToRender) {
                                    FileResourceHandler.setRenderedPackage(resourcesPackage);
                                }
                            }
                        } else if (!registeredPackage) {
                            FileResourceHandler.packages[resourcesPackage.name] = resourcesPackage;
                        }
                    }
                };

                FileResourceHandler.storeFileData = function (url, data, isShared) {
                    var key = url.toLowerCase();
                    var fileResource = FileResourceHandler.fileResources[key];
                    if (!fileResource) {
                        fileResource = FileResourceHandler.fileResources[key] = { url: url };
                    }

                    if (!fileResource.loaded || !fileResource.data) {
                        fileResource.isShared = isShared;
                        fileResource.data = data;
                        fileResource.loaded = true;
                        delete fileResource.loading;

                        var errorcallbacks = FileResourceHandler.errorcallbacks[key];
                        if (errorcallbacks) {
                            errorcallbacks.empty();
                            delete FileResourceHandler.errorcallbacks[key];
                        }

                        var callbacks = FileResourceHandler.callbacks[key];
                        if (callbacks) {
                            callbacks.fire();
                            callbacks.empty();
                            delete FileResourceHandler.callbacks[key];
                        }
                    }
                    return fileResource;
                };

                FileResourceHandler.registerPackageRendered = function (packageName, url, data) {
                    var packageFile;
                    if (url) {
                        if (data) {
                            packageFile = FileResourceHandler.storeFileData(url, data);
                        } else {
                            var key = url.toLowerCase();
                            packageFile = FileResourceHandler.fileResources[key];
                            if (!packageFile) {
                                packageFile = FileResourceHandler.fileResources[key] = { url: url };
                            }
                        }

                        packageFile.rendered = true;
                    }

                    var registeredPackage = FileResourceHandler.packages[packageName];
                    if (!registeredPackage) {
                        FileResourceHandler.registerPackage({ name: packageName, url: url, rendered: true });
                    } else if (registeredPackage.resourceGroups) {
                        FileResourceHandler.setRenderedPackage(registeredPackage);
                    }
                };

                FileResourceHandler.getPreferedPackage = function (packages) {
                    var len = packages && packages.length;
                    if (!len) {
                        return null;
                    } else if (len == 1) {
                        return packages[0];
                    } else {
                        var parentPackage;
                        var parentPackageUrl;

                        for (var i = 0, len = packages.length; i < len; i++) {
                            var newPackage = packages[i];
                            var newPackageUrl = newPackage.url;
                            var key = newPackageUrl.toLowerCase();
                            var newPackageFileResource = FileResourceHandler.fileResources[key];

                            if ((newPackageFileResource && (newPackageFileResource.loading || newPackageFileResource.loaded)) || (Client.Resources.preloadPackages && Client.Resources.preloadPackages[key] && !Client.Resources.preloadPackages[key].error)) {
                                return newPackage;
                            }

                            var useNewPackage = null;

                            if (!parentPackage) {
                                useNewPackage = true;
                            } else {
                                var parentPackageUrlCommon = (parentPackageUrl.indexOf("~/") == 0);
                                var newPackageUrlCommon = (newPackageUrl.indexOf("~/") == 0);
                                if (parentPackageUrlCommon != newPackageUrlCommon) {
                                    if (newPackageUrlCommon) {
                                        useNewPackage = true;
                                    } else {
                                        useNewPackage = false;
                                    }
                                } else if (newPackageUrlCommon && Client.Application.isHosted && Client.Application.useHostedLibraryResources) {
                                    // rendered or not locally (next check) is not relevant if loading via host
                                } else if (newPackage.rendered) {
                                    if (!parentPackage.rendered) {
                                        useNewPackage = true;
                                    } else {
                                        var oldUrl = parentPackageUrl;
                                        var newUrl = newPackageUrl;

                                        if (parentPackageUrlCommon) {
                                            oldUrl = Client.Types.Url.combinePath(FileResourceHandler.corePath, oldUrl.slice(2));
                                        }
                                        oldUrl = Client.Types.Url.combinePath(window.location.href, oldUrl);

                                        if (newPackageUrlCommon) {
                                            newUrl = Client.Types.Url.combinePath(FileResourceHandler.corePath, newUrl.slice(2));
                                        }
                                        newUrl = Client.Types.Url.combinePath(window.location.href, newUrl);

                                        var scripts = SDL.jQuery("script[src]");
                                        var oldUrlFound = false;
                                        var newUrlFound = false;

                                        for (var i = 0, len = scripts.length; i < len && (!oldUrlFound || !newUrlFound); i++) {
                                            var src = (scripts[i]).src;
                                            var index = src.indexOf("?");
                                            if (index != -1) {
                                                src = src.slice(0, index);
                                            }

                                            if (src == oldUrl) {
                                                oldUrlFound = true;
                                            } else if (src == newUrl) {
                                                newUrlFound = true;
                                            }
                                        }

                                        if (newUrlFound != oldUrlFound) {
                                            useNewPackage = newUrlFound;
                                        }
                                    }
                                }

                                if (useNewPackage == null && newPackage.resourceGroups) {
                                    //take the package with most resource groups for better reuse
                                    useNewPackage = !parentPackage.resourceGroups || (newPackage.resourceGroups.length > parentPackage.resourceGroups.length);
                                }
                            }

                            if (useNewPackage) {
                                parentPackage = newPackage;
                                parentPackageUrl = newPackageUrl;
                            }
                        }
                        return parentPackage;
                    }
                };

                FileResourceHandler.loadPackage = function (resourcesPackage, callback, errorcallback, sync) {
                    var key = resourcesPackage.url.toLowerCase();
                    var file = FileResourceHandler.fileResources[key];

                    if (!file || !file.loaded) {
                        FileResourceHandler.load(resourcesPackage, function (file) {
                            return FileResourceHandler.processPackageFileLoaded(resourcesPackage, file);
                        }, errorcallback, sync);
                    } else if (!resourcesPackage.unpacked) {
                        FileResourceHandler.processPackageFileLoaded(resourcesPackage, file);
                    } else if (callback) {
                        callback();
                    }
                };

                FileResourceHandler.processPackageFileLoaded = function (resourcesPackage, file) {
                    if (file && file.loaded && resourcesPackage && !resourcesPackage.unpacked) {
                        resourcesPackage.unpacked = true;

                        var data = file.data;

                        if (!Client.Configuration.ConfigurationManager.isApplicationHost || file.url.indexOf("~/") != 0) {
                            delete file.data;
                        }

                        var start;
                        var sizes;
                        var contentMatches;

                        var m = data && data.match(/^\/\*(\d+(?:,\d+)*)\*\//);
                        if (m) {
                            start = m[0].length;
                            sizes = m[1].split(",");
                        } else {
                            if (data.indexOf("/*SDL-PACKAGE*/") == 0) {
                                // this is self-extracting package
                                contentMatches = data.match(/\/\*FILE-BEGIN\*\/.*?\/\*FILE-END\*\//g);
                            } else {
                                start = 0;
                                sizes = [data.length];
                            }
                        }

                        var fileResources = FileResourceHandler.fileResources;
                        var allRendered = true;
                        var calls = [];
                        var fileNumber = -1;

                        SDL.jQuery.each(resourcesPackage.resourceGroups, function (index, resourceGroup) {
                            return SDL.jQuery.each(resourceGroup.files, function (index, url) {
                                ++fileNumber;
                                var key = url.toLowerCase();
                                var resourceFile = fileResources[key] || (fileResources[key] = { url: url });
                                var size = sizes && sizes[fileNumber] || 0;

                                resourceFile.loaded = true;
                                delete resourceFile.loading;

                                if (!resourceFile.rendered) {
                                    if (file.rendered) {
                                        resourceFile.rendered = true;
                                    } else {
                                        allRendered = false;
                                    }
                                }

                                if (!resourceFile.rendered || Client.Configuration.ConfigurationManager.isApplicationHost) {
                                    if (sizes) {
                                        resourceFile.data = data.substr(start, size);
                                    } else {
                                        resourceFile.data = JSON.parse((contentMatches[fileNumber] || "").slice(14, -12));
                                    }

                                    if (file.isShared) {
                                        resourceFile.isShared = true;
                                    }
                                }

                                start += Number(size);

                                var callbacks = FileResourceHandler.callbacks[key];
                                if (callbacks) {
                                    calls.push(callbacks);
                                    delete FileResourceHandler.callbacks[key];
                                }

                                var errorcallbacks = FileResourceHandler.errorcallbacks[key];
                                if (errorcallbacks) {
                                    errorcallbacks.empty();
                                    delete FileResourceHandler.errorcallbacks[key];
                                }
                            });
                        });

                        if (allRendered) {
                            resourcesPackage.rendered = file.rendered = true;
                        }

                        for (var j = 0, lenj = calls.length; j < lenj; j++) {
                            calls[j].fire();
                            calls[j].empty();
                        }
                    }
                };

                FileResourceHandler.setRenderedPackage = function (resourcesPackage) {
                    if (resourcesPackage && !resourcesPackage.rendered) {
                        resourcesPackage.rendered = true;

                        var fileResources = FileResourceHandler.fileResources;
                        var key = resourcesPackage.url.toLowerCase();
                        var resourceFile = fileResources[key] || (fileResources[key] = { url: resourcesPackage.url });
                        resourceFile.rendered = true;
                        if (resourceFile.data && (!Client.Configuration.ConfigurationManager.isApplicationHost || resourceFile.url.indexOf("~/") != 0)) {
                            delete resourceFile.data;
                        }

                        SDL.jQuery.each(resourcesPackage.resourceGroups, function (index, resourceGroup) {
                            return SDL.jQuery.each(resourceGroup.files, function (index, url) {
                                var key = url.toLowerCase();
                                var resourceFile = fileResources[key] || (fileResources[key] = { url: url });
                                resourceFile.rendered = true;
                                if (resourceFile.data && (!Client.Configuration.ConfigurationManager.isApplicationHost || resourceFile.url.indexOf("~/") != 0)) {
                                    delete resourceFile.data;
                                }
                            });
                        });
                    }
                };

                FileResourceHandler.updateCultureResources = function (callback) {
                    var culturesToRender = 1;
                    var cultureRenderedCallback = function () {
                        if (!--culturesToRender && callback) {
                            callback();
                        }
                    };

                    SDL.jQuery.each(FileResourceHandler.cultureResources, function (key, resource) {
                        var toRender = resource.rendered;
                        var toLoad = toRender || resource.loaded || resource.loading;

                        resource.loaded = false;
                        resource.rendered = false;

                        if (toLoad) {
                            FileResourceHandler.load({ url: resource.url, version: resource.version });
                        }

                        if (toRender) {
                            culturesToRender++;
                            FileResourceHandler.renderWhenLoaded({ url: resource.url, version: resource.version }, cultureRenderedCallback);
                        }
                    });

                    cultureRenderedCallback();
                };
                FileResourceHandler.registeredResourceHandlers = [];

                FileResourceHandler.templates = {};

                FileResourceHandler.fileResources = {};

                FileResourceHandler.packages = {};

                FileResourceHandler.cultureResources = {};

                FileResourceHandler.callbacks = {};
                FileResourceHandler.errorcallbacks = {};
                return FileResourceHandler;
            })();
            Resources.FileResourceHandler = FileResourceHandler;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=FileResourceHandler.js.map
