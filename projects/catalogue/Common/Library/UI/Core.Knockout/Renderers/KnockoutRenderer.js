/// <reference path="../../SDL.Client.UI.Core/Renderers/ViewRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../../SDL.Client.Core/Event/EventRegister.d.ts" />
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Knockout) {
                (function (Renderers) {
                    var KnockoutRenderer = (function () {
                        function KnockoutRenderer() {
                        }
                        KnockoutRenderer.prototype.render = function (templateContent, target, options, callback) {
                            if (templateContent && target) {
                                var $target = SDL.jQuery(target);
                                $target.html(templateContent);
                                ko.applyBindingsToDescendants(options, target);
                            }

                            if (callback) {
                                callback();
                            }
                        };
                        return KnockoutRenderer;
                    })();
                    ;

                    SDL.Client.Event.EventRegister.addEventHandler(SDL.Client.Event.EventRegister, "beforedispose", function () {
                        ko.cleanNode(document.body);
                    });

                    SDL.UI.Core.Renderers.ViewRenderer.registerTemplateRenderer("text/html+knockout", new KnockoutRenderer());
                })(Knockout.Renderers || (Knockout.Renderers = {}));
                var Renderers = Knockout.Renderers;
            })(Core.Knockout || (Core.Knockout = {}));
            var Knockout = Core.Knockout;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=KnockoutRenderer.js.map
