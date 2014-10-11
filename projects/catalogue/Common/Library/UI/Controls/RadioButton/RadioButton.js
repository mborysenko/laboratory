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
            var RadioButton = (function (_super) {
                __extends(RadioButton, _super);
                function RadioButton() {
                    _super.apply(this, arguments);
                }
                RadioButton.prototype.$initialize = function () {
                    this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

                    var $elem = this._$elem = SDL.jQuery(this.properties.element);
                    var input = this._input = SDL.jQuery("input[type='radio']", $elem).get(0);
                    if (input) {
                        $elem.addClass("sdl-radiobutton");
                        this._$img = SDL.jQuery("<span class='sdl-radiobutton-img'></span>").insertAfter(input);
                    }
                };

                RadioButton.prototype.getInputElement = function () {
                    return this._input;
                };
                return RadioButton;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.RadioButton = RadioButton;

            RadioButton.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$RadioButton$disposeInterface() {
                SDL.jQuery(this._$elem).removeClass("sdl-radiobutton");

                if (this._$img) {
                    this._$img.remove();
                }

                this._$elem = undefined;
                this._$img = undefined;
                this._input = undefined;
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.RadioButton", RadioButton);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
