var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Knockout) {
                /// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
                /// <reference path="../Libraries/knockout/knockout.d.ts" />
                (function (BindingHandlers) {
                    var ControlKnockoutBindingHandler = (function () {
                        function ControlKnockoutBindingHandler() {
                        }
                        ControlKnockoutBindingHandler.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var value = ko.utils.unwrapObservable(valueAccessor()) || "";
                            if (value) {
                                ko.utils.domNodeDisposal.addDisposeCallback(element, ControlKnockoutBindingHandler.elementDisposalCallback);
                                SDL.jQuery(element).data("control-create", true);

                                var type = (SDL.Client.Type.isString(value) ? value : (value.type || ""));
                                if (type) {
                                    SDL.Client.Resources.ResourceManager.load(type, function () {
                                        ControlKnockoutBindingHandler.initControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                    });
                                } else {
                                    ControlKnockoutBindingHandler.initControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                }
                                return value.controlsDescendantBindings ? { controlsDescendantBindings: true } : undefined;
                            }
                        };

                        ControlKnockoutBindingHandler.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var value = ko.utils.unwrapObservable(valueAccessor()) || "";
                            if (value) {
                                var $e = SDL.jQuery(element);
                                var handler = $e.data("control-handler");

                                if (handler !== null) {
                                    if (!handler) {
                                        $e.data("control-update", true);
                                    } else if (handler.update) {
                                        handler.update(element, ControlKnockoutBindingHandler.getDataValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
                                    } else {
                                        $e.data("control-handler", null);
                                    }
                                }
                            }
                        };

                        ControlKnockoutBindingHandler.initControlBinding = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var $e = SDL.jQuery(element);
                            if ($e.data("control-create")) {
                                var value = ko.toJS(valueAccessor()) || "";
                                var type = value.type || "" + value;
                                var handlerName = value.handler;
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
                                    var dataValueAccessor = ControlKnockoutBindingHandler.getDataValueAccessor(valueAccessor);
                                    if (handler.init) {
                                        handler.init(element, dataValueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                    }
                                    $e.data("control-handler", handler);
                                    if ($e.data("control-update")) {
                                        $e.data("control-update", null);
                                        if (handler.update) {
                                            handler.update(element, dataValueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                        }
                                    }
                                } else {
                                    $e.data("control-handler", null);
                                    if (type) {
                                        // no handler is found, just create the control
                                        SDL.UI.Core.Renderers.ControlRenderer.renderControl(type, element, value.data, function (control) {
                                            return ControlKnockoutBindingHandler.addControlDisposalCallback(element, control);
                                        });
                                    }
                                }
                            }
                        };

                        ControlKnockoutBindingHandler.getDataValueAccessor = function (valueAccessor) {
                            return function () {
                                return valueAccessor().data;
                            };
                        };

                        ControlKnockoutBindingHandler.elementDisposalCallback = function (element) {
                            SDL.jQuery(element).removeData();
                        };

                        ControlKnockoutBindingHandler.addControlDisposalCallback = function (element, control) {
                            ko.utils.domNodeDisposal.addDisposeCallback(element, function (element) {
                                SDL.UI.Core.Renderers.ControlRenderer.disposeControl(control);
                            });
                        };
                        return ControlKnockoutBindingHandler;
                    })();
                    ;

                    (ko.bindingHandlers).control = (new ControlKnockoutBindingHandler());
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
//@ sourceMappingURL=ControlKnockoutBindingHandler.js.map
