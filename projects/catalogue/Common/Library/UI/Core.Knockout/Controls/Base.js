/// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/Base.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.ts" />
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Knockout) {
                (function (Controls) {
                    function createKnockoutBinding(control, name) {
                        ko.bindingHandlers[name] = new KnockoutBindingHandler(control, name);
                    }
                    Controls.createKnockoutBinding = createKnockoutBinding;

                    var KnockoutBindingHandler = (function () {
                        function KnockoutBindingHandler(control, name) {
                            this.control = control;
                            this.name = name;

                            // knockout calls init and update without KnockoutBindingHandler's context
                            this.init = this.init.bind(this);
                            this.update = this.update.bind(this);
                        }
                        KnockoutBindingHandler.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            // everything is done in update
                        };

                        KnockoutBindingHandler.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                            var _this = this;
                            var values = valueAccessor();
                            var attrName = Core.Controls.getInstanceAttributeName(this.control);
                            var instance = element[attrName];

                            var controlEvents;
                            var events = ko.unwrap(allBindings.get("controlEvents"));
                            if (events) {
                                controlEvents = events[this.name];
                            }

                            if (!instance || (instance.getDisposed && instance.getDisposed())) {
                                if (instance) {
                                    // instance is there -> it's disposed -> release references to event handlers
                                    instance[KnockoutBindingHandler.eventHandlersAttributeName] = null;
                                }

                                // create a control instance
                                element[attrName] = instance = new this.control(element, Knockout.Utils.unwrapRecursive(values));
                                instance.render();
                                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                                    if (instance.getDisposed && !instance.getDisposed()) {
                                        // not disposed yet -> remove handlers and dispose
                                        _this.removeEventHandlers(instance);
                                        Core.Renderers.ControlRenderer.disposeControl(instance);
                                    } else {
                                        // already disposed -> release references to event handlers
                                        instance[KnockoutBindingHandler.eventHandlersAttributeName] = null;
                                    }
                                });

                                this.addEventHandlers(instance, controlEvents, values, bindingContext['$data']);
                            } else {
                                this.removeEventHandlers(instance);
                                this.addEventHandlers(instance, controlEvents, values, bindingContext['$data']);

                                if (instance.update) {
                                    // Call update on the existing instance
                                    instance.update(Knockout.Utils.unwrapRecursive(values));
                                }
                            }
                        };

                        KnockoutBindingHandler.prototype.addEventHandlers = function (instance, controlEvents, values, viewModel) {
                            if (instance.addEventListener) {
                                var events = instance[KnockoutBindingHandler.eventHandlersAttributeName] = {};
                                var propertyChangeHandler = (values ? function (e) {
                                    var propertyChain = (e.data.property + "").split(".");
                                    var setting = values;

                                    for (var i = 0; setting && i < propertyChain.length; i++) {
                                        setting = ko.unwrap(setting);
                                        if (setting) {
                                            setting = setting[propertyChain[i]];
                                        }
                                    }

                                    if (ko.isWriteableObservable(setting)) {
                                        setting(e.data.value);
                                    } else if (propertyChain.length > 1 && ko.isWriteableObservable(values[e.data.property])) {
                                        values[e.data.property](e.data.value);
                                    }
                                } : null);

                                if (controlEvents) {
                                    SDL.jQuery.each(controlEvents, function (eventName, eventHandler) {
                                        if (SDL.Client.Type.isFunction(eventHandler)) {
                                            if (eventName == "propertychange" && propertyChangeHandler) {
                                                instance.addEventListener(eventName, events[eventName] = function (e) {
                                                    propertyChangeHandler(e);
                                                    eventHandler.apply(viewModel, [viewModel, e, instance]);
                                                });
                                            } else {
                                                instance.addEventListener(eventName, events[eventName] = function (e) {
                                                    eventHandler.apply(viewModel, [viewModel, e, instance]);
                                                });
                                            }
                                        }
                                    });
                                }

                                if (propertyChangeHandler && !events["propertychange"]) {
                                    instance.addEventListener("propertychange", events["propertychange"] = propertyChangeHandler);
                                }
                            }
                        };

                        KnockoutBindingHandler.prototype.removeEventHandlers = function (instance) {
                            if (instance[KnockoutBindingHandler.eventHandlersAttributeName]) {
                                SDL.jQuery.each(instance[KnockoutBindingHandler.eventHandlersAttributeName], function (event, handler) {
                                    instance.removeEventListener(event, handler);
                                });
                                instance[KnockoutBindingHandler.eventHandlersAttributeName] = null;
                            }
                        };
                        KnockoutBindingHandler.eventHandlersAttributeName = "data-__knockout_binding_events__";
                        return KnockoutBindingHandler;
                    })();
                })(Knockout.Controls || (Knockout.Controls = {}));
                var Controls = Knockout.Controls;
            })(Core.Knockout || (Core.Knockout = {}));
            var Knockout = Core.Knockout;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=Base.js.map
