/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Knockout) {
                (function (Utils) {
                    function unwrapRecursive(value, maxDepth) {
                        if (typeof maxDepth === "undefined") { maxDepth = 5; }
                        return _unwrapRecursive(value, maxDepth = 5, []);
                    }
                    Utils.unwrapRecursive = unwrapRecursive;

                    function _unwrapRecursive(value, maxDepth, mappedValues) {
                        var result;
                        value = ko.unwrap(value);

                        if (maxDepth <= 0 || !value || SDL.jQuery.isWindow(value) || Client.Type.isDate(value) || Client.Type.isNode(value) || Client.Type.isFunction(value)) {
                            result = value;
                        } else {
                            for (var i = 0; i < mappedValues.length; i++) {
                                if (mappedValues[i].value == value) {
                                    result = mappedValues[i].value;
                                    break;
                                }
                            }

                            if (!result) {
                                if (Client.Type.isArray(value)) {
                                    result = [];
                                } else if (typeof value == 'object') {
                                    if ((value instanceof Boolean) || (value instanceof Number) || (value instanceof String)) {
                                        result = new value.constructor(value); // recreate if instance of Boolean, String or Number
                                    } else {
                                        result = {};
                                    }
                                }

                                if (result) {
                                    mappedValues.push({ value: value, result: result });

                                    var changed = false;
                                    for (var p in value) {
                                        var k = (p == null ? "" : p);
                                        var unwrapped = result[k] = _unwrapRecursive(value[k], maxDepth - 1, mappedValues);
                                        changed = changed || (unwrapped != value[k]);
                                    }

                                    if (!changed) {
                                        result = value;
                                    }
                                } else if (Client.Type.isFunction(value.valueOf)) {
                                    result = value.valueOf();
                                } else {
                                    result = value;
                                }
                            }
                        }
                        return result;
                    }
                })(Knockout.Utils || (Knockout.Utils = {}));
                var Utils = Knockout.Utils;
            })(Core.Knockout || (Core.Knockout = {}));
            var Knockout = Core.Knockout;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=knockout.js.map
