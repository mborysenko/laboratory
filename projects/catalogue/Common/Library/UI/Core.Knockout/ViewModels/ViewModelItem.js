/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Models/Models.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/DisposableObject.d.ts" />
/// <reference path="../../SDL.Client.Core/Event/EventRegister.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Knockout) {
                (function (ViewModels) {
                    
                    ;

                    ;

                    eval(SDL.Client.Types.OO.enableCustomInheritance);
                    var ViewModelItem = (function (_super) {
                        __extends(ViewModelItem, _super);
                        function ViewModelItem(item, properties, methods) {
                            _super.call(this);

                            var p = this.properties;

                            p.item = SDL.Client.Type.isString(item) ? SDL.Client.Models.getItem(item) : item;
                            p.properties = properties || {}; // i.e. {title: {getter: "getTitle", setter: "setTitle", events: ["load", "change"]}, content: {events: ["load", "change"]}}
                            p.methods = methods || {}; // i.e. {load: {method: "load"}, reload: {method: "load", args: [true]}}
                            p.observables = {};
                        }
                        ViewModelItem.prototype.$initialize = function () {
                            var p = this.properties;

                            this._createProperties();
                            this._createMethods();
                            SDL.Client.Event.EventRegister.addEventHandler(p.item, "*", this.getDelegate(this._onEvent));
                        };

                        ViewModelItem.prototype._createProperties = function () {
                            var p = this.properties;
                            if (p.properties) {
                                for (var property in p.properties) {
                                    var propOptions = (p.properties[property] || {});

                                    var getter = propOptions.getter;
                                    if (getter) {
                                        this._checkMethod(getter);
                                    }

                                    var setter = propOptions.setter;
                                    if (setter) {
                                        this._checkMethod(setter);
                                    }

                                    if (!setter || !getter) {
                                        var upProperty = property.charAt(0).toUpperCase() + property.slice(1);
                                        if (!getter) {
                                            getter = "get" + upProperty;
                                            if (!p.item[getter]) {
                                                getter = "is" + upProperty;
                                            }

                                            if (!p.item[getter]) {
                                                SDL.Client.Diagnostics.Assert.raiseError("Unable to determine a getter for property '" + property + "' of item " + ((p.item).getId ? ("'" + (p.item).getId() + "'") : ((p.item).getTypeName ? (p.item).getTypeName() : "")) + ".");
                                            }
                                        }

                                        if (!setter) {
                                            var s = "set" + upProperty;
                                            if (p.item[s]) {
                                                setter = s;
                                            }
                                        }
                                    }

                                    this._createEventObservables(propOptions.events);

                                    var options = { read: this._createPropertyReader(propOptions.events, getter) };
                                    if (setter) {
                                        options.write = this._createPropertyWriter(setter);
                                    }

                                    this[property] = ko.computed(options);
                                }
                            }
                        };

                        ViewModelItem.prototype._createPropertyReader = function (events, getter) {
                            var p = this.properties;
                            return function () {
                                if (events) {
                                    for (var i = 0, len = events.length; i < len; i++) {
                                        p.observables[events[i]](); // access an observable, to get this reader triggered when that observable changes
                                    }
                                }
                                return p.item[getter]();
                            };
                        };

                        ViewModelItem.prototype._createPropertyWriter = function (setter) {
                            var p = this.properties;
                            return function (value) {
                                p.item[setter](value);
                            };
                        };

                        ViewModelItem.prototype._createEventObservables = function (events) {
                            if (events) {
                                var observables = this.properties.observables;
                                for (var i = 0, len = events.length; i < len; i++) {
                                    var event = events[i];
                                    if (!observables[event]) {
                                        observables[event] = ko.observable(0);
                                    }
                                }
                            }
                        };

                        ViewModelItem.prototype._createMethods = function () {
                            var methods = this.properties.methods;
                            if (methods) {
                                for (var method in methods) {
                                    this[method] = this._createMethod(method, methods[method]);
                                }
                            }
                        };

                        ViewModelItem.prototype._createMethod = function (methodName, methodEntry) {
                            var p = this.properties;
                            var method = methodEntry.method || methodName;
                            if (SDL.Client.Type.isFunction(method)) {
                                if (methodEntry.args) {
                                    return function () {
                                        method.apply(this, methodEntry.args);
                                    };
                                } else {
                                    return method;
                                }
                            } else {
                                this._checkMethod(method);

                                return function () {
                                    return p.item[method].apply(p.item, methodEntry.args || arguments);
                                };
                            }
                        };

                        ViewModelItem.prototype._checkMethod = function (methodName) {
                            var item = this.properties.item;
                            if (!item[methodName]) {
                                SDL.Client.Diagnostics.Assert.raiseError("Method '" + methodName + "' is not defined on item " + (item.getId ? ("'" + item.getId() + "'") : (item.getTypeName ? item.getTypeName() : "")) + ".");
                            }
                        };

                        ViewModelItem.prototype._onEvent = function (evt) {
                            var p = this.properties;

                            var event = evt.type;

                            if (event == "marshal") {
                                p.item = evt.target.getMarshalObject();
                            }

                            if (event in p.observables) {
                                p.observables[event](p.observables[event]() + 1); // trigger a change in ko.observable, for dependent properties to get an update
                            }
                        };
                        return ViewModelItem;
                    })(SDL.Client.Types.DisposableObject);
                    ViewModels.ViewModelItem = ViewModelItem;

                    ViewModelItem.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Core$ViewModels$Knockout$ViewModelItem$disposeInterface() {
                        var p = this.properties;
                        SDL.Client.Event.EventRegister.removeEventHandler(p.item, "*", this.getDelegate(this._onEvent));
                        p.item = null;

                        for (var property in p.properties) {
                            this[property].dispose();
                            this[property] = null;
                        }

                        for (var event in p.observables) {
                            p.observables[event] = null;
                        }
                    });

                    SDL.Client.Types.OO.createInterface("SDL.UI.Core.Knockout.ViewModels.ViewModelItem", ViewModelItem);
                })(Knockout.ViewModels || (Knockout.ViewModels = {}));
                var ViewModels = Knockout.ViewModels;
            })(Core.Knockout || (Core.Knockout = {}));
            var Knockout = Core.Knockout;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=ViewModelItem.js.map
