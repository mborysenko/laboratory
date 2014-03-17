/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/ConfigurationManager/ConfigurationManager.d.ts" />
/// <reference path="../../SDL.Client.Core/Resources/ResourceManager.d.ts" />
/// <reference path="../../SDL.Client.Core/Event/EventRegister.d.ts" />
/// <reference path="../Renderers/ViewRenderer.ts" />
/// <reference path="../Renderers/ControlRenderer.ts" />
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            var cm = SDL.Client.Configuration.ConfigurationManager;
            var rm = SDL.Client.Resources.ResourceManager;

            var pageNode = cm.getCurrentPageConfigurationNode();
            if (pageNode) {
                var view = pageNode.getAttribute("view");
                if (view) {
                    rm.load("SDL.UI.Core.Renderers.ViewRenderer", function () {
                        var target = document.getElementById("main-view-target") || document.body;
                        SDL.UI.Core.Renderers.ViewRenderer.renderView(view, target, null, function (view) {
                            SDL.Client.Event.EventRegister.addEventHandler(SDL.Client.Event.EventRegister, "beforedispose", function () {
                                SDL.UI.Core.Renderers.ViewRenderer.disposeView(view);
                            });
                        });

                        SDL.Client.Event.EventRegister.addEventListener("dispose", function () {
                            var undisposed = [];
                            SDL.jQuery.each(SDL.UI.Core.Renderers.ViewRenderer.getCreatedViewCounts(), function (i, value) {
                                if (value != 0) {
                                    undisposed.push(i + " (" + value + ")");
                                }
                            });

                            if (SDL.UI.Core.Renderers.ControlRenderer != null) {
                                SDL.jQuery.each(SDL.UI.Core.Renderers.ControlRenderer.getCreatedControlCounts(), function (i, value) {
                                    if (value != 0) {
                                        undisposed.push(i + " (" + value + ")");
                                    }
                                });
                            }

                            if (undisposed.length) {
                                alert("Some views/controls have been left undisposed:\n" + undisposed.join("\n"));
                            }
                        });
                    });
                    rm.load(view); // this is to start loading view's resources while ViewRenderer is being loaded
                }
            }
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=init.js.map
