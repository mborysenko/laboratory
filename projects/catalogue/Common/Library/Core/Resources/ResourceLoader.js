var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="..\Application\Application.ts" />
        /// <reference path="..\Net\Ajax.d.ts" />
        /// <reference path="Resources.d.ts" />
        (function (Resources) {
            var ResourceLoader = (function () {
                function ResourceLoader() {
                }
                ResourceLoader.load = function (file, corePath, sync, onSuccess, onFailure) {
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

                        return Client.Net.callWebMethod(url, "", "GET", null, sync, function (data) {
                            onSuccess(data, false);
                        }, onFailure);
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
