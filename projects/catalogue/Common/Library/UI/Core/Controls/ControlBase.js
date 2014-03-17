/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/ObjectWithEvents.d.ts" />
/// <reference path="../Renderers/ControlRenderer.ts" />
/// <reference path="Base.ts" />
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
            (function (Controls) {
                eval(SDL.Client.Types.OO.enableCustomInheritance);
                var ControlBase = (function (_super) {
                    __extends(ControlBase, _super);
                    function ControlBase(element, options, jQuery) {
                        _super.call(this);
                        var p = this.properties;
                        p.element = element;
                        p.options = options;
                        p.jQuery = jQuery;
                    }
                    ControlBase.prototype.update = function (options) {
                        this.properties.options = options;
                        // will be overwritten in deriving class
                    };

                    ControlBase.prototype.$initialize = function () {
                        var controlType = SDL.Client.Type.resolveNamespace(this.getTypeName());
                        this.properties.element[SDL.UI.Core.Controls.getInstanceAttributeName(controlType)] = this;
                        SDL.UI.Core.Renderers.ControlRenderer.onControlCreated(this);
                    };

                    ControlBase.prototype.render = function (callback, errorcallback) {
                        this.setRendered(callback);
                        // override in subclasses
                    };

                    ControlBase.prototype.setRendered = function (callback) {
                        if (callback) {
                            callback();
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
                        SDL.UI.Core.Renderers.ControlRenderer.onControlDisposed(this);
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
