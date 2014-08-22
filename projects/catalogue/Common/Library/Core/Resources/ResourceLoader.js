/// <reference path="../ApplicationHost/ApplicationHost.ts" />
/// <reference path="../Application/Application.ts" />
/// <reference path="../Net/Ajax.d.ts" />
/// <reference path="Resources.d.ts" />
var SDL;
(function (SDL) {
    (function (Client) {
        (function (Resources) {
            var ResourceLoader = (function () {
                function ResourceLoader() {
                }
                ResourceLoader.load = function (file, corePath, sync, onSuccess, onFailure, caller) {
                    var isCommonResource = (file.url.indexOf("~/") == 0);

                    if (isCommonResource && !sync && Client.Application.isHosted && Client.Application.useHostedLibraryResources) {
                        Client.Application.ApplicationHost.getCommonLibraryResource({ url: file.url, version: file.version }, Client.Application.libraryVersion, function (data) {
                            onSuccess(data, true);
                        }, onFailure);
                    } else {
                        var url = file.url;
                        if (isCommonResource) {
                            url = Client.Types.Url.combinePath(corePath, url.slice(2));
                        }

                        if (file.version) {
                            url = Client.Types.Url.combinePath(url, "?" + file.version);
                        }

                        return Client.Net.callWebMethod(url, "", "GET", null, sync, function (data, request) {
                            if (isCommonResource && (Client.Application.isHosted || (Client.ApplicationHost && Client.ApplicationHost.ApplicationHost))) {
                                if (ResourceLoader.cdnCacheResponseHeaderName === undefined) {
                                    ResourceLoader.cdnCacheResponseHeaderName = Client.Configuration.ConfigurationManager.getAppSetting("cdnCacheResponseHeaderName") || null;
                                }

                                var eventObject = {
                                    type: "Application Host API",
                                    data: url,
                                    resourceLocation: caller ? "shared" : "local",
                                    cdnCacheResponseHeader: ResourceLoader.cdnCacheResponseHeaderName ? request.xmlHttp && request.xmlHttp.getResponseHeader(ResourceLoader.cdnCacheResponseHeaderName) : ""
                                };

                                if (Client.Application.isHosted) {
                                    Client.Application.ApplicationHost.triggerAnalyticsEvent("library-resource-load", eventObject);
                                } else {
                                    Client.ApplicationHost.ApplicationHost.triggerAnalyticsEvent("library-resource-load", eventObject, caller);
                                }
                            }
                            onSuccess(data, false);
                        }, function (error) {
                            if (isCommonResource) {
                                var eventObject = {
                                    type: "Application Host API",
                                    data: url,
                                    resourceLocation: caller ? "shared" : "local",
                                    error: error
                                };

                                if (Client.Application.isHosted) {
                                    Client.Application.ApplicationHost.triggerAnalyticsEvent("library-resource-load-fail", eventObject);
                                } else if (Client.ApplicationHost && Client.ApplicationHost.ApplicationHost) {
                                    Client.ApplicationHost.ApplicationHost.triggerAnalyticsEvent("library-resource-load-fail", eventObject, caller);
                                }
                            }
                            onFailure(error);
                        });
                    }
                };
                return ResourceLoader;
            })();
            Resources.ResourceLoader = ResourceLoader;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=ResourceLoader.js.map
