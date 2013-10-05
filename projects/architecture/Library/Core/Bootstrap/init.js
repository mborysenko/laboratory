var SDL;
(function (SDL) {
    /// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
    /// <reference path="../ConfigurationManager/ConfigurationManager.ts" />
    /// <reference path="../Resources/ResourceManager.ts" />
    /// <reference path="../Event/EventRegister.d.ts" />
    (function (Client) {
        Client.Resources.ResourceManager.registerPackageRendered("SDL.Client.Init");
        var cm = Client.Configuration.ConfigurationManager;
        cm.init(function () {
            Client.Localization.setCulture(cm.getAppSetting("culture") || "en");

            Client.Resources.ResourceManager.readConfiguration();
            Client.Application.initialize(function () {
                if (!Client.Application.isReloading) {
                    var pageNode;
                    var pageNodes = Client.Xml.selectNodes(cm.configuration, "//configuration/pages/page[@url!='*']");
                    var path = window.location.pathname.toLowerCase();

                    for (var i = 0, len = pageNodes.length; i < len; i++) {
                        var _pageNode = pageNodes[i];
                        if (_pageNode.getAttribute("url").toLowerCase() == path) {
                            pageNode = _pageNode;
                            break;
                        }
                    }
                    if (!pageNode) {
                        pageNode = Client.Xml.selectSingleNode(cm.configuration, "//configuration/pages/page[@url='*']");
                    }

                    if (pageNode) {
                        window.document.title = pageNode.getAttribute("title");

                        var resource = pageNode.getAttribute("resource");
                        if (resource) {
                            Client.Resources.ResourceManager.load(resource);
                        }

                        return;
                    }
                    SDL.Client.Diagnostics.Assert.raiseError("Unable to find configuration for page \"" + path + "\"");
                }
            });
        });
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=init.js.map
