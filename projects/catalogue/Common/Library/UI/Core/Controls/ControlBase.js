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
            /// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/ObjectWithEvents.d.ts" />
            /// <reference path="../Renderers/ControlRenderer.ts" />
            /// <reference path="Base.ts" />
            (function (Controls) {
                eval(SDL.Client.Types.OO.enableCustomInheritance);
                var ControlBase = (function (_super) {
                    __extends(ControlBase, _super);
                    function ControlBase(element, options, jQuery, callback, errorcallback) {
                        _super.call(this);
                        var p = this.properties;
                        p.element = element;
                        p.options = options;
                        p.jQuery = jQuery;
                        p.callback = callback;
                        p.errorcallback = errorcallback;
                    }
                    ControlBase.prototype.update = function (options) {
                        this.properties.options = options;
                        // will be overwritten in deriving class
                    };

                    ControlBase.prototype.$initialize = function () {
                        var controlType = SDL.Client.Type.resolveNamespace(this.getTypeName());
                        this.properties.element[Controls.getInstanceAttributeName(controlType)] = this;
                        Core.Renderers.ControlRenderer.onControlCreated(this);
                        this.render();
                    };

                    ControlBase.prototype.render = function () {
                        this.setRendered();
                        // override in subclasses
                    };

                    ControlBase.prototype.setRendered = function () {
                        var p = this.properties;
                        p.errorcallback = null;
                        if (p.callback) {
                            p.callback();
                            p.callback = null;
                        }
                    };

                    ControlBase.prototype.getElement = function () {
                        return this.properties.element;
                    };

                    ControlBase.prototype.getJQuery = function () {
                        return this.properties.jQuery;
                    };

                    ControlBase.prototype.dispose = function () {
                        this.callBase("SDL.Client.Types.ObjectWithEvents", "dispose");
                        Core.Renderers.ControlRenderer.onControlDisposed(this);
                    };
                    return ControlBase;
                })(SDL.Client.Types.ObjectWithEvents);
                Controls.ControlBase = ControlBase;

                ControlBase.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Core$Controls$ControlBase$disposeInterface() {
                });

                SDL.Client.Types.OO.createInterface("SDL.UI.Core.Controls.ControlBase", ControlBase);
            })(Core.Controls || (Core.Controls = {}));
            var Controls = Core.Controls;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=ControlBase.js.map
