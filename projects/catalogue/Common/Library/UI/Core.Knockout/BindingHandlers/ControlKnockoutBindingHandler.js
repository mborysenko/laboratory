/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.ts" />
/// <reference path="../Controls/Base.ts" />
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
                            var value = ko.unwrap(valueAccessor());
                            if (value) {
                                var handlers = {};
                                SDL.jQuery(element).data("control-handlers", handlers);
                                ko.utils.domNodeDisposal.addDisposeCallback(element, ControlKnockoutBindingHandler.elementDisposalCallback);

                                if (SDL.Client.Type.isArray(value)) {
                                    SDL.jQuery.each(value, function (index, value) {
                                        value = ko.unwrap(value);
                                        handlers[ko.unwrap(value.type) || ("" + (value || ko.unwrap(value.handler) || ""))] = undefined;
                                        ControlKnockoutBindingHandler.addControlBinding(element, function () {
                                            return value;
                                        }, allBindingsAccessor, viewModel, bindingContext);
                                    });
                                } else {
                                    handlers[ko.unwrap(value.type) || ("" + (value || ko.unwrap(value.handler) || ""))] = undefined;
                                    ControlKnockoutBindingHandler.addControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                }
                                return value.controlsDescendantBindings ? { controlsDescendantBindings: true } : undefined;
                            }
                        };

                        ControlKnockoutBindingHandler.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var $e = SDL.jQuery(element);
                            var handlers = $e.data("control-handlers");
                            var value = ko.unwrap(valueAccessor()) || "";
                            var typeValues;

                            if (value) {
                                typeValues = {};
                                if (SDL.Client.Type.isArray(value)) {
                                    SDL.jQuery.each(value, function (index, value) {
                                        value = ko.unwrap(value);
                                        typeValues[ko.unwrap(value.type) || ("" + (value || ko.unwrap(value.handler) || ""))] = value;
                                    });
                                } else {
                                    typeValues[ko.unwrap(value.type) || ("" + (value || ko.unwrap(value.handler) || ""))] = value;
                                }
                            }

                            if (handlers) {
                                SDL.jQuery.each(handlers, function (type, handler) {
                                    if (!typeValues || !typeValues[type]) {
                                        // control has been removed -> dispose
                                        delete handlers[type];
                                        if (handler && handler.disposeForElement) {
                                            handler.disposeForElement(element);
                                        }
                                    }
                                });
                            }

                            if (typeValues) {
                                if (!handlers) {
                                    // controls have been added
                                    SDL.jQuery(element).data("control-handlers", handlers = {});
                                    ko.utils.domNodeDisposal.addDisposeCallback(element, ControlKnockoutBindingHandler.elementDisposalCallback);
                                }

                                SDL.jQuery.each(typeValues, function (type, value) {
                                    if (!handlers || handlers[type] === undefined) {
                                        // control has just been added -> create
                                        handlers[type] = undefined;
                                        ControlKnockoutBindingHandler.addControlBinding(element, function () {
                                            return value;
                                        }, allBindingsAccessor, viewModel, bindingContext);
                                    }

                                    ControlKnockoutBindingHandler.updateControlBinding(element, function () {
                                        return value;
                                    }, allBindingsAccessor, viewModel, bindingContext);
                                });
                            } else {
                                SDL.jQuery(element).removeData("control-handlers");
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
                                var value = ko.unwrap(valueAccessor());
                                var handlerName = ko.unwrap(value.handler);
                                var type = ko.unwrap(value.type) || ("" + (value || handlerName || ""));

                                if (type in handlers) {
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
                                    } else if (type) {
                                        // otherwise use the type to find the ko binding
                                        handler = ko.bindingHandlers[type];

                                        if (!handler) {
                                            // create a binding handler for the given type
                                            var control;
                                            try  {
                                                control = SDL.Client.Type.resolveNamespace(type);
                                            } catch (err) {
                                                throw Error("Unable to resolve type '" + type + "': " + err.message);
                                            }

                                            if (control && !(control.init || control.update)) {
                                                handler = new Knockout.Controls.KnockoutBindingHandler(control, type);
                                            }
                                        }
                                    }

                                    handlers[type] = handler || null;
                                    if (handler) {
                                        var dataValueAccessor = ControlKnockoutBindingHandler.getDataValueAccessor(value);
                                        var allBindingsWithEventsAccessor = ControlKnockoutBindingHandler.getAllBindingsWithEventsAccessor(allBindingsAccessor, type, value);

                                        if (handler.init) {
                                            handler.init(element, dataValueAccessor, allBindingsWithEventsAccessor, viewModel, bindingContext);
                                        }

                                        if ($e.data("control-update") && handler.update) {
                                            handler.update(element, dataValueAccessor, allBindingsWithEventsAccessor, viewModel, bindingContext);
                                        }
                                    }
                                }
                            }
                        };

                        ControlKnockoutBindingHandler.updateControlBinding = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var $e = SDL.jQuery(element);
                            var handlers = $e.data("control-handlers");
                            if (handlers) {
                                var value = ko.unwrap(valueAccessor());
                                if (value) {
                                    var type = ko.unwrap(value.type) || ("" + (value || ko.unwrap(value.handler) || ""));
                                    var handler = handlers[type];

                                    if (handler !== null) {
                                        if (!handler) {
                                            $e.data("control-update", true);
                                            Knockout.Utils.unwrapRecursive(value.data); // this is to make sure observables are evaluated, otherwise ko will not notify us when they change
                                        } else if (handler.update) {
                                            handler.update(element, ControlKnockoutBindingHandler.getDataValueAccessor(value), ControlKnockoutBindingHandler.getAllBindingsWithEventsAccessor(allBindingsAccessor, type, value), viewModel, bindingContext);
                                        } else {
                                            handlers[type] = null;
                                        }
                                    }
                                }
                            }
                        };

                        ControlKnockoutBindingHandler.getDataValueAccessor = function (value) {
                            return function () {
                                return value.data;
                            };
                        };

                        ControlKnockoutBindingHandler.getAllBindingsWithEventsAccessor = function (allBindingsAccessor, control, value) {
                            if (value.events) {
                                var allBindings;
                                var controlEvents;

                                var allBindingsWithEventsAccessor = (function () {
                                    if (!allBindings) {
                                        allBindings = SDL.jQuery.extend({}, allBindingsAccessor()); // cloning not to change the original value
                                        allBindings.controlEvents = allBindingsWithEventsAccessor.get("controlEvents");
                                    }
                                    return allBindings;
                                });

                                allBindingsWithEventsAccessor.get = function (name) {
                                    if (name == "controlEvents") {
                                        if (!controlEvents) {
                                            var result = allBindingsAccessor.get(name);
                                            controlEvents = result ? SDL.jQuery.extend({}, ko.unwrap(result)) : {};

                                            if (!controlEvents[control]) {
                                                controlEvents[control] = value.events;
                                            } else {
                                                controlEvents[control] = SDL.jQuery.extend(controlEvents[control], value.events);
                                            }
                                        }

                                        return controlEvents;
                                    } else {
                                        return allBindingsAccessor.get(name);
                                    }
                                };

                                allBindingsWithEventsAccessor.has = function (name) {
                                    return name == "controlEvents" || allBindingsAccessor.has(name);
                                };

                                return allBindingsWithEventsAccessor;
                            } else {
                                return allBindingsAccessor;
                            }
                        };

                        ControlKnockoutBindingHandler.elementDisposalCallback = function (element) {
                            SDL.jQuery(element).removeData();
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
