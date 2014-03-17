/// <reference path="../../SDL.Client.UI.Core/Renderers/ViewRenderer.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Views/ViewBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/Base.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.ts" />
/// <reference path="KnockoutBindingHandlers.ts" />
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Knockout) {
                (function (BindingHandlers) {
                    var ViewKnockoutBindingHandler = (function () {
                        function ViewKnockoutBindingHandler() {
                        }
                        ViewKnockoutBindingHandler.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var value = ko.unwrap(valueAccessor()) || "";
                            if (value) {
                                ko.utils.domNodeDisposal.addDisposeCallback(element, ViewKnockoutBindingHandler.elementDisposalCallback);
                                SDL.jQuery(element).data("view-create", true);

                                var type = (SDL.Client.Type.isString(value) ? value : (value.type || ""));
                                if (type) {
                                    SDL.Client.Resources.ResourceManager.load(type, function () {
                                        ViewKnockoutBindingHandler.initViewBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                    });
                                } else {
                                    ViewKnockoutBindingHandler.initViewBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                }
                                return value.controlsDescendantBindings == false ? undefined : { controlsDescendantBindings: true };
                            }
                            return { controlsDescendantBindings: true };
                        };

                        ViewKnockoutBindingHandler.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var value = ko.unwrap(valueAccessor()) || "";
                            if (value) {
                                var $e = SDL.jQuery(element);
                                var handler = $e.data("view-handler");

                                if (handler !== null) {
                                    if (!handler) {
                                        $e.data("view-update", true);
                                        SDL.UI.Core.Knockout.Utils.unwrapRecursive(value.data); // this is to make sure observables are evaluated, otherwise ko will not notify us when they change
                                    } else if (handler.update) {
                                        handler.update(element, ViewKnockoutBindingHandler.getDataValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
                                    } else {
                                        $e.data("view-handler", null);
                                    }
                                }
                            }
                        };

                        ViewKnockoutBindingHandler.initViewBinding = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var $e = SDL.jQuery(element);
                            if ($e.data("view-create")) {
                                var value = ko.unwrap(valueAccessor()) || "";
                                var type = ko.unwrap(value.type) || "" + value;
                                var handlerName = ko.unwrap(value.handler);
                                var handler;

                                if (handlerName) {
                                    // if handle name is provided, first try to find a registered ko binding with the name
                                    handler = ko.bindingHandlers[handlerName];
                                    if (!handler) {
                                        try  {
                                            handler = SDL.Client.Type.resolveNamespace(handlerName);
                                        } catch (err) {
                                            throw Error("Unable to resolve handler '" + handlerName + "': " + err.message);
                                        }

                                        if (!handler) {
                                            throw Error("Unable to resolve handler '" + handlerName + "'.");
                                        }
                                    }
                                } else {
                                    // otherwise use the type to find the ko binding
                                    handler = ko.bindingHandlers[type];
                                }

                                if (handler) {
                                    var dataValueAccessor = ViewKnockoutBindingHandler.getDataValueAccessor(valueAccessor);
                                    if (handler.init) {
                                        handler.init(element, dataValueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                    }
                                    $e.data("view-handler", handler);
                                    if ($e.data("view-update")) {
                                        $e.data("view-update", null);
                                        if (handler.update) {
                                            handler.update(element, dataValueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                        }
                                    }
                                } else {
                                    $e.data("view-handler", null);
                                    if (type) {
                                        // no handler is found, just create the view
                                        SDL.UI.Core.Renderers.ViewRenderer.renderView(type, element, SDL.UI.Core.Knockout.BindingHandlers.areKnockoutObservableSettingsEnabled(type) ? value.data : SDL.UI.Core.Knockout.Utils.unwrapRecursive(value.data), ViewKnockoutBindingHandler.addViewDisposalCallback);
                                    }
                                }
                            }
                        };

                        ViewKnockoutBindingHandler.getDataValueAccessor = function (valueAccessor) {
                            return function () {
                                return valueAccessor().data;
                            };
                        };

                        ViewKnockoutBindingHandler.elementDisposalCallback = function (element) {
                            SDL.jQuery(element).removeData();
                        };

                        ViewKnockoutBindingHandler.addViewDisposalCallback = function (view) {
                            ko.utils.domNodeDisposal.addDisposeCallback(view.getElement(), function (element) {
                                SDL.UI.Core.Renderers.ViewRenderer.disposeView(view);
                            });
                        };
                        return ViewKnockoutBindingHandler;
                    })();
                    ;

                    ko.bindingHandlers.view = (new ViewKnockoutBindingHandler());
                })(Knockout.BindingHandlers || (Knockout.BindingHandlers = {}));
                var BindingHandlers = Knockout.BindingHandlers;
            })(Core.Knockout || (Core.Knockout = {}));
            var Knockout = Core.Knockout;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
;
//# sourceMappingURL=ViewKnockoutBindingHandler.js.map
