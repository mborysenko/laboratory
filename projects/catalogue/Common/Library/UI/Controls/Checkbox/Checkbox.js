/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Controls) {
            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var Checkbox = (function (_super) {
                __extends(Checkbox, _super);
                function Checkbox() {
                    _super.apply(this, arguments);
                }
                Checkbox.prototype.$initialize = function () {
                    this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

                    var $elem = this._$elem = SDL.jQuery(this.properties.element);
                    var input = this._input = SDL.jQuery("input[type='checkbox']", $elem).get(0);
                    if (input) {
                        $elem.addClass("sdl-checkbox");
                        this._$img = SDL.jQuery("<span class='sdl-checkbox-img'></span>").insertAfter(input);
                    }
                };

                Checkbox.prototype.getInputElement = function () {
                    return this._input;
                };
                return Checkbox;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.Checkbox = Checkbox;

            Checkbox.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Checkbox$disposeInterface() {
                SDL.jQuery(this._$elem).removeClass("sdl-checkbox");

                if (this._$img) {
                    this._$img.remove();
                }

                this._$elem = undefined;
                this._$img = undefined;
                this._input = undefined;
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Checkbox", Checkbox);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
