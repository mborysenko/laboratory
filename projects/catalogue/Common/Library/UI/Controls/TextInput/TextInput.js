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
            var TextInput = (function (_super) {
                __extends(TextInput, _super);
                function TextInput() {
                    _super.apply(this, arguments);
                }
                TextInput.prototype.$initialize = function () {
                    this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

                    var p = this.properties;
                    var $elem = this._$elem = SDL.jQuery(p.element);
                    var opts = p.options = SDL.jQuery.extend({}, p.options);

                    var type = $elem.prop("type");
                    if (type == "text" || type == "email" || type == "url" || type == "password") {
                        $elem.addClass("sdl-textinput");

                        opts.invalid = opts.invalid != undefined ? opts.invalid.toString() == "true" : false;
                        this._updateInvalidState();
                    }
                };

                TextInput.prototype.setInvalid = function (value) {
                    var oldValue = this.properties.options.invalid;
                    this.properties.options.invalid = value = value != undefined ? value.toString() == "true" : false;
                    if (oldValue != value) {
                        this._updateInvalidState();
                        this.fireEvent("propertychange", { property: "invalid", value: value });
                    }
                };

                TextInput.prototype.isInvalid = function () {
                    return this.properties.options.invalid;
                };

                TextInput.prototype.update = function (options) {
                    if (options) {
                        var p = this.properties;
                        var prevOptions = SDL.jQuery.extend({}, p.options);

                        this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

                        if (options.invalid != undefined) {
                            options.invalid = options.invalid.toString() == "true";
                            if (prevOptions.invalid !== options.invalid) {
                                this._updateInvalidState();
                                this.fireEvent("propertychange", { property: "invalid", value: options.invalid });
                            }
                        }
                    }
                };

                TextInput.prototype._updateInvalidState = function () {
                    if (this.properties.options.invalid) {
                        this._$elem.addClass("invalid");
                    } else {
                        this._$elem.removeClass("invalid");
                    }
                };
                return TextInput;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.TextInput = TextInput;

            TextInput.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$TextInput$disposeInterface() {
                this._$elem.removeClass("sdl-textinput invalid");
                this._$elem = undefined;
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.TextInput", TextInput);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
