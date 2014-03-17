/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../Renderers/ControlRenderer.ts" />
/// <reference path="Base.ts" />
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Controls) {
                function createJQueryPlugin(jQuery, control, name, methods) {
                    jQuery.fn[name] = function SDL$UI$Core$ControlBase$widget(options) {
                        var instances = [];
                        var jQueryObject = this;

                        jQueryObject.each(function () {
                            var element = this;
                            var attrName = SDL.UI.Core.Controls.getInstanceAttributeName(control);
                            var instance = element[attrName];
                            if (!instance || (instance.getDisposed && instance.getDisposed())) {
                                // create a control instance
                                instance = element[attrName] = new control(element, options, jQuery);
                                instance.render();
                            } else if (options && instance.update) {
                                // Call update on the existing instance
                                instance.update(options);
                            }
                            instances.push(instance);
                        });

                        jQueryObject = jQueryObject.pushStack(instances);

                        if (methods) {
                            jQuery.each(methods, function (i, methodDefinition) {
                                if (methodDefinition && methodDefinition.method && methodDefinition.method != "dispose") {
                                    jQueryObject[methodDefinition.method] = function () {
                                        var implementation = methodDefinition.implementation || methodDefinition.method;
                                        for (var i = 0, len = this.length; i < len; i++) {
                                            var instance = jQueryObject[i];
                                            var result = instance[implementation].apply(instance, arguments);
                                            if (methodDefinition.returnsValue) {
                                                return result;
                                            }
                                        }
                                        return jQueryObject;
                                    };
                                }
                            });
                        }

                        jQueryObject["dispose"] = function () {
                            for (var i = 0, len = this.length; i < len; i++) {
                                SDL.UI.Core.Renderers.ControlRenderer.disposeControl(jQueryObject[i]);
                            }
                            return jQueryObject.end();
                        };

                        return jQueryObject;
                    };
                }
                Controls.createJQueryPlugin = createJQueryPlugin;
            })(Core.Controls || (Core.Controls = {}));
            var Controls = Core.Controls;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=jQuery.js.map
