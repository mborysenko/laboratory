var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="..\Application\Application.ts" />
        /// <reference path="..\Net/Ajax.d.ts" />
        /// <reference path="..\CrossDomainMessaging\CrossDomainMessaging.ts" />
        (function (Resources) {
            var CommonResourcesLoader = (function () {
                function CommonResourcesLoader() {
                }
                CommonResourcesLoader.load = function (file, corePath, sync, onSuccess, onFailure) {
                    var isCommonResource = (file.url.indexOf("~/") == 0);

                    if (isCommonResource && !sync && Client.Application.isHosted && Client.Application.useHostedLibraryResources && Client.Application.ApplicationHost.isTrusted) {
                        Client.Application.ApplicationHost.getCommonLibraryResource(file, Client.Configuration.ConfigurationManager.coreVersion, onSuccess, onFailure);
                    } else {
                        var url = file.url;
                        if (isCommonResource) {
                            url = Client.Types.Url.combinePath(corePath, url.slice(2));
                        }

                        if (file.version) {
                            url = Client.Types.Url.combinePath(url, "?" + file.version);
                        }

                        return Client.Net.callWebMethod(url, "", "GET", null, sync, onSuccess, onFailure);
                    }
                };
                return CommonResourcesLoader;
            })();
            Resources.CommonResourcesLoader = CommonResourcesLoader;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=CommonResourcesLoader.js.map
