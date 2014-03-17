/// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Diagnostics/Assert.d.ts" />
/// <reference path="../Event/Event.d.ts" />
/// <reference path="DisposableObject.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
if (SDL.jQuery.inArray("data", SDL.jQuery.event.props) == -1) {
    SDL.jQuery.event.props.push("data"); // ObjectWithEvents will be passing additional data in 'data' property
}

var SDL;
(function (SDL) {
    (function (Client) {
        (function (Types) {
            ;

            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var ObjectWithEvents = (function (_super) {
                __extends(ObjectWithEvents, _super);
                function ObjectWithEvents() {
                    _super.call(this);
                    var p = this.properties;
                    p.handlers = {};
                    p.timeouts = {};
                }
                ObjectWithEvents.prototype.addEventListener = function (event, handler) {
                    var handlers = this.properties.handlers;
                    if (handlers) {
                        var e = handlers[event];
                        if (!e) {
                            e = handlers[event] = [];
                        }
                        e.push({ fnc: handler });
                    }
                };

                ObjectWithEvents.prototype.removeEventListener = function (event, handler) {
                    var handlers = this.properties.handlers;
                    if (handlers) {
                        var e = handlers[event];
                        if (e) {
                            var l = e.length;
                            for (var i = 0; i < l; i++) {
                                if (e[i].fnc == handler) {
                                    if (l == 1) {
                                        delete handlers[event];
                                    } else {
                                        for (var j = i + 1; j < l; j++) {
                                            e[j - 1] = e[j];
                                        }
                                        e.pop();
                                    }
                                    return;
                                }
                            }
                        }
                    }
                };

                ObjectWithEvents.prototype.fireGroupedEvent = function (event, eventData, delay) {
                    var properties = this.properties;
                    if (event in properties.timeouts) {
                        clearTimeout(properties.timeouts[event]);
                    }
                    if (delay >= 0) {
                        var self = this;
                        properties.timeouts[event] = setTimeout(function () {
                            delete properties.timeouts[event];
                            self.fireEvent(event, eventData);
                        }, delay);
                    } else {
                        delete properties.timeouts[event];
                        this.fireEvent(event, eventData);
                    }
                };

                ObjectWithEvents.prototype.fireEvent = function (eventType, eventData) {
                    if (this.properties.handlers) {
                        var eventObj;
                        if (SDL.Client.Type.isObject(eventType)) {
                            eventObj = eventType;
                            eventObj.target = this;
                            eventType = eventObj.type;
                            SDL.Client.Diagnostics.Assert.isString(eventType);
                        } else {
                            eventObj = new SDL.Client.Event.Event(eventType, this, eventData);
                        }

                        var result = this._processHandlers(eventObj, eventType);
                        if (result !== false) {
                            result = this._processHandlers(eventObj, "*");
                        }

                        if (result === false) {
                            eventObj.defaultPrevented = true;
                        }

                        return eventObj;
                    }
                };

                ObjectWithEvents.prototype._processHandlers = function (eventObj, handlersCollectionName) {
                    var handlers = this.properties.handlers && this.properties.handlers[handlersCollectionName];
                    if (handlers) {
                        // handlers can be added/removed while handling an event
                        // thus have to recheck them if at least one handler has been executed
                        var needPostprocess;
                        var processedHandlers = [];

                        do {
                            needPostprocess = false;

                            for (var i = 0; handlers && (i < handlers.length); i++) {
                                var handler = handlers[i];
                                if (processedHandlers.indexOf(handler) == -1) {
                                    needPostprocess = true;
                                    processedHandlers.push(handler);

                                    if (handler.fnc.call(this, eventObj) === false) {
                                        return false;
                                    }

                                    handlers = this.properties.handlers && this.properties.handlers[handlersCollectionName];
                                }
                            }
                        } while(needPostprocess);
                    }
                };

                ObjectWithEvents.prototype._setDisposing = function () {
                    this.fireEvent("beforedispose");
                    this.callBase("SDL.Client.Types.DisposableObject", "_setDisposing");
                    this.fireEvent("dispose");
                };
                return ObjectWithEvents;
            })(SDL.Client.Types.DisposableObject);
            Types.ObjectWithEvents = ObjectWithEvents;
            ;

            SDL.Client.Types.OO.createInterface("SDL.Client.Types.ObjectWithEvents", ObjectWithEvents);
        })(Client.Types || (Client.Types = {}));
        var Types = Client.Types;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=ObjectWithEvents.js.map
