var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Knockout) {
                /// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
                /// <reference path="../../SDL.Client.UI.Core/Controls/Base.d.ts" />
                /// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
                /// <reference path="../Libraries/knockout/knockout.d.ts" />
                (function (Controls) {
                    function createKnockoutBinding(control, name, events) {
                        ko.bindingHandlers[name] = new KnockoutBindingHandler(control, name, events);
                    }
                    Controls.createKnockoutBinding = createKnockoutBinding;

                    var KnockoutBindingHandler = (function () {
                        function KnockoutBindingHandler(control, name, events) {
                            this.control = control;
                            this.events = events;
                            this.name = name;
                        }
                        KnockoutBindingHandler.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                        };

                        KnockoutBindingHandler.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var values = valueAccessor();
                            var attrName = UI.Core.Controls.getInstanceAttributeName(this.control);
                            var instance = element[attrName];
                            if (!instance || instance.getDisposed()) {
                                // create a control instance
                                element[attrName] = instance = new this.control(element, ko.toJS(values), ko.utils.unwrapObservable(allBindingsAccessor().jQuery));
                                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                                    return UI.Core.Renderers.ControlRenderer.disposeControl(instance);
                                });

                                this.addEventHandlers(instance, values);
                            } else {
                                this.removeEventHandlers(instance);
                                this.addEventHandlers(instance, values);

                                if (instance.update) {
                                    // Call update on the existing instance
                                    instance.update(ko.toJS(values));
                                }
                            }
                        };

                        KnockoutBindingHandler.prototype.addEventHandlers = function (instance, values) {
                            var events = instance[KnockoutBindingHandler.eventHandlersAttributeName] = {};
                            instance.addEventListener("propertychange", events["propertychange"] = function (e) {
                                if (values && ko.isObservable(values[e.data.property])) {
                                    values[e.data.property](e.data.value);
                                }
                            });

                            if (this.events) {
                                SDL.jQuery.each(this.events, function (i, event) {
                                    if (values && SDL.Client.Type.isFunction(values[event.event])) {
                                        var eventName = event.originalEvent || event.event;
                                        if (eventName != "propertychange") {
                                            instance.addEventListener(eventName, events[eventName] = function (e) {
                                                values[event.event](e.data);
                                            });
                                        }
                                    }
                                });
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
//@ sourceMappingURL=Base.js.map
