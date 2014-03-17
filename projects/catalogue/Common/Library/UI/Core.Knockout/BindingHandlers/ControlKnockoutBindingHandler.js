/// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.ts" />
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Knockout) {
                (function (BindingHandlers) {
                    var ControlKnockoutBindingHandler = (function () {
                        function ControlKnockoutBindingHandler() {
                        }
                        ControlKnockoutBindingHandler.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var value = ko.unwrap(valueAccessor()) || "";
                            if (value) {
                                SDL.jQuery(element).data("control-handlers", {});
                                ko.utils.domNodeDisposal.addDisposeCallback(element, ControlKnockoutBindingHandler.elementDisposalCallback);

                                if (SDL.Client.Type.isArray(value)) {
                                    SDL.jQuery.each(value, function (index, value) {
                                        ControlKnockoutBindingHandler.addControlBinding(element, function () {
                                            return value;
                                        }, allBindingsAccessor, viewModel, bindingContext);
                                    });
                                } else {
                                    ControlKnockoutBindingHandler.addControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                }
                                return value.controlsDescendantBindings ? { controlsDescendantBindings: true } : undefined;
                            }
                        };

                        ControlKnockoutBindingHandler.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            // TODO: implement dynamically adding/removing controls:
                            //		- if controls are added -> they must be loaded and initialized
                            //		- if controls are removed -> they must be disposed
                            var value = ko.unwrap(valueAccessor()) || "";
                            if (value) {
                                if (SDL.Client.Type.isArray(value)) {
                                    SDL.jQuery.each(value, function (index, value) {
                                        ControlKnockoutBindingHandler.updateControlBinding(element, function () {
                                            return value;
                                        }, allBindingsAccessor, viewModel, bindingContext);
                                    });
                                } else {
                                    ControlKnockoutBindingHandler.updateControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                }
                            }
                        };

                        ControlKnockoutBindingHandler.addControlBinding = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var value = ko.unwrap(valueAccessor()) || "";
                            if (value) {
                                var type = ko.unwrap(value.type) || "" + value;
                                if (type) {
                                    SDL.Client.Resources.ResourceManager.load(type, function () {
                                        ControlKnockoutBindingHandler.initControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                    });
                                } else {
                                    ControlKnockoutBindingHandler.initControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                }
                            }
                        };

                        ControlKnockoutBindingHandler.initControlBinding = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var $e = SDL.jQuery(element);
                            var handlers = $e.data("control-handlers");
                            if (handlers) {
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

                                handlers[type] = handler || null;
                                if (handler) {
                                    var dataValueAccessor = ControlKnockoutBindingHandler.getDataValueAccessor(valueAccessor);
                                    if (handler.init) {
                                        handler.init(element, dataValueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                    }

                                    if ($e.data("control-update") && handler.update) {
                                        handler.update(element, dataValueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                    }
                                } else if (type) {
                                    // no handler is found, just create the control
                                    SDL.UI.Core.Renderers.ControlRenderer.renderControl(type, element, SDL.UI.Core.Knockout.Utils.unwrapRecursive(value.data), function (control) {
                                        return ControlKnockoutBindingHandler.addControlDisposalCallback(element, control);
                                    });
                                }
                            }
                        };

                        ControlKnockoutBindingHandler.updateControlBinding = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var $e = SDL.jQuery(element);
                            var handlers = $e.data("control-handlers");
                            if (handlers) {
                                var value = ko.unwrap(valueAccessor()) || "";
                                if (value) {
                                    var type = ko.unwrap(value.type) || "" + value;
                                    var handler = handlers[type];

                                    if (handler !== null) {
                                        if (!handler) {
                                            $e.data("control-update", true);
                                            SDL.UI.Core.Knockout.Utils.unwrapRecursive(value.data); // this is to make sure observables are evaluated, otherwise ko will not notify us when they change
                                        } else if (handler.update) {
                                            handler.update(element, ControlKnockoutBindingHandler.getDataValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
                                        } else {
                                            $e.data("control-handlers")[type] = null;
                                        }
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

                    ko.bindingHandlers.control = (new ControlKnockoutBindingHandler());
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
//# sourceMappingURL=ControlKnockoutBindingHandler.js.map
