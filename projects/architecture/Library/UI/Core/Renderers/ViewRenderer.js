var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            /// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/Array.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/OO.d.ts" />
            /// <reference path="../../SDL.Client.Core/Diagnostics/Assert.d.ts" />
            /// <reference path="../../SDL.Client.Core/Resources/ResourceManager.d.ts" />
            (function (Renderers) {
                ;

                var ViewRenderer = (function () {
                    function ViewRenderer() {
                    }
                    ViewRenderer.registerTemplateRenderer = function (type, renderer) {
                        ViewRenderer.templateRenderers[type] = renderer;
                    };

                    ViewRenderer.getTemplateRenderer = function (type) {
                        return ViewRenderer.templateRenderers[type];
                    };

                    ViewRenderer.renderView = function (type, element, settings, callback, errorcallback) {
                        if (element) {
                            SDL.jQuery(element).data("view-create", true);
                        }

                        SDL.Client.Resources.ResourceManager.load(type, function () {
                            if (!element || SDL.jQuery(element).data("view-create")) {
                                var ctor = ViewRenderer.types[type];
                                if (!ctor) {
                                    ctor = ViewRenderer.types[type] = ViewRenderer.getTypeConstructor(type);
                                }

                                if (!element) {
                                    if (ctor.createElement) {
                                        element = ctor.createElement(document, settings);
                                    } else {
                                        element = document.createElement("div");
                                    }
                                }

                                // Instantiate the view
                                var view = new ctor(element, settings);
                                if (!SDL.Client.Types.OO.implementsInterface(view, "SDL.UI.Core.Views.ViewBase")) {
                                    SDL.Client.Diagnostics.Assert.raiseError("'" + type + "' must implement SDL.UI.Core.Views.ViewBase interface.");
                                }

                                // Render the view
                                view.render(!callback ? null : function () {
                                    callback(view);
                                });
                            }
                        }, errorcallback);
                    };

                    ViewRenderer.onViewCreated = function (view) {
                        var type = view.getTypeName();
                        if (ViewRenderer.createdViews[type]) {
                            ViewRenderer.createdViews[type].push(view);
                        } else {
                            ViewRenderer.createdViews[type] = [view];
                        }
                    };

                    ViewRenderer.disposeView = function (view) {
                        SDL.jQuery(view.getElement()).removeData();
                        view.dispose();
                    };

                    ViewRenderer.onViewDisposed = function (view) {
                        var type = view.getTypeName();
                        if (ViewRenderer.createdViews[type]) {
                            SDL.Client.Types.Array.removeAt(ViewRenderer.createdViews[type], ViewRenderer.createdViews[type].indexOf(view));
                        }
                    };

                    ViewRenderer.getCreatedViewCounts = function () {
                        var createdViews = {};
                        SDL.jQuery.each(ViewRenderer.createdViews, function (type, views) {
                            createdViews[type] = views.length;
                        });
                        return createdViews;
                    };

                    ViewRenderer.getTypeConstructor = function (type) {
                        SDL.Client.Diagnostics.Assert.isString(type, "View type name is expected.");

                        var ctor;
                        try  {
                            ctor = SDL.Client.Type.resolveNamespace(type);
                        } catch (err) {
                            SDL.Client.Diagnostics.Assert.raiseError("Unable to evaluate \"" + type + "\": " + err.description);
                        }
                        SDL.Client.Diagnostics.Assert.isFunction(ctor, "Unable to evaluate \"" + type + "\".");
                        return ctor;
                    };
                    ViewRenderer.templateRenderers = {};
                    ViewRenderer.types = {};
                    ViewRenderer.createdViews = {};
                    return ViewRenderer;
                })();
                Renderers.ViewRenderer = ViewRenderer;
                ;
            })(Core.Renderers || (Core.Renderers = {}));
            var Renderers = Core.Renderers;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
;
//@ sourceMappingURL=ViewRenderer.js.map
