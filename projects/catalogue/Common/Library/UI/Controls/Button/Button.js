/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
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
            (function (ButtonPurpose) {
                ButtonPurpose[ButtonPurpose["GENERAL"] = "general"] = "GENERAL";
                ButtonPurpose[ButtonPurpose["CONFIRM"] = "confirm"] = "CONFIRM";
                ButtonPurpose[ButtonPurpose["CRITICAL"] = "critical"] = "CRITICAL";
                ButtonPurpose[ButtonPurpose["PROCEED"] = "proceed"] = "PROCEED";
                ButtonPurpose[ButtonPurpose["TOGGLE"] = "toggle"] = "TOGGLE";
                ButtonPurpose[ButtonPurpose["TOGGLE_IRREVERSIBLE"] = "toggle_irreversible"] = "TOGGLE_IRREVERSIBLE";
            })(Controls.ButtonPurpose || (Controls.ButtonPurpose = {}));
            var ButtonPurpose = Controls.ButtonPurpose;

            (function (ButtonStyle) {
                ButtonStyle[ButtonStyle["DEFAULT"] = "default"] = "DEFAULT";
                ButtonStyle[ButtonStyle["ICON"] = "icon"] = "ICON";
                ButtonStyle[ButtonStyle["ICON_ROUND"] = "round"] = "ICON_ROUND";
            })(Controls.ButtonStyle || (Controls.ButtonStyle = {}));
            var ButtonStyle = Controls.ButtonStyle;

            (function (ButtonToggleState) {
                ButtonToggleState[ButtonToggleState["OFF"] = "off"] = "OFF";
                ButtonToggleState[ButtonToggleState["ON"] = "on"] = "ON";
            })(Controls.ButtonToggleState || (Controls.ButtonToggleState = {}));
            var ButtonToggleState = Controls.ButtonToggleState;

            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var Button = (function (_super) {
                __extends(Button, _super);
                function Button(element, options) {
                    _super.call(this, element, options || {});
                }
                Button.prototype.$initialize = function () {
                    this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

                    var p = this.properties;
                    var $element = this.$element = SDL.jQuery(p.element);

                    p.options = SDL.jQuery.extend({ purpose: ButtonPurpose.GENERAL, style: ButtonStyle.DEFAULT }, p.options);

                    this.initialTabIndex = $element.attr("tabIndex");
                    this.tabIndex = this.initialTabIndex || "0";
                    if (p.options.disabled != null) {
                        p.options.disabled = p.options.disabled.toString() == "true";
                    } else {
                        p.options.disabled = this.isDisabled();
                    }

                    this.updateDisabledState();
                    this.updateIconMarkup();

                    $element.on("mousedown", this.getDelegate(this.onMouseDown)).on("mouseup", this.getDelegate(this.onMouseUp)).on("mouseleave", this.getDelegate(this.onMouseLeave)).on("keydown", this.getDelegate(this.onKeyDown)).on("keyup", this.getDelegate(this.onKeyUp)).on("blur", this.getDelegate(this.onMouseLeave)).addClass(this.getPurposeClassName(p.options.purpose)).addClass("sdl-button-style-" + (p.options.style || ButtonStyle.DEFAULT));

                    this.setStateStyle();
                };

                Button.prototype.update = function (options) {
                    if (options) {
                        var p = this.properties;
                        var prevOptions = SDL.jQuery.extend({}, p.options, { disabled: this.isDisabled() });

                        this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

                        options = p.options = SDL.jQuery.extend(true, {}, prevOptions, p.options);

                        var changedProperties = [];

                        if (prevOptions.purpose != options.purpose) {
                            this.$element.removeClass(this.getPurposeClassName(prevOptions.purpose)).addClass(this.getPurposeClassName(options.purpose));
                            changedProperties.push("purpose");
                        }

                        if (prevOptions.style != options.style) {
                            this.$element.removeClass("sdl-button-style-" + prevOptions.style).addClass("sdl-button-style-" + options.style);
                            changedProperties.push("style");
                        }

                        if (options.iconClass && (options.iconClass.dark || options.iconClass.light)) {
                            if (prevOptions.iconClass) {
                                var changed = false;
                                if (prevOptions.iconClass.dark != options.iconClass.dark) {
                                    if (this.$icon) {
                                        this.$icon.removeClass(options.iconClass.dark);
                                        changed = true;
                                    }
                                }

                                if (prevOptions.iconClass.light != options.iconClass.light) {
                                    if (this.$icon) {
                                        this.$icon.removeClass(options.iconClass.light);
                                        changed = true;
                                    }
                                }

                                if (changed) {
                                    changedProperties.push("iconClass");
                                }
                            } else {
                                changedProperties.push("iconClass");
                            }
                        }

                        if (options.disabled != null) {
                            options.disabled = options.disabled.toString() == "true";
                            if (prevOptions.disabled == null || prevOptions.disabled != options.disabled) {
                                this.updateDisabledState();
                                changedProperties.push("disabled");
                            }
                        }

                        this.updateIconMarkup();
                        this.setStateStyle();

                        for (var i = 0, len = changedProperties.length; i < len; i++) {
                            this.fireEvent("propertychange", { property: changedProperties[i], value: options[changedProperties[i]] });
                        }
                    }
                };

                Button.prototype.isOn = function () {
                    var options = this.properties.options;
                    if (options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE) {
                        return options.state == ButtonToggleState.ON;
                    }
                };

                Button.prototype.isOff = function () {
                    var options = this.properties.options;
                    if (options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE) {
                        return options.state != ButtonToggleState.ON;
                    }
                };

                Button.prototype.toggleOn = function () {
                    var options = this.properties.options;
                    if (options.state != ButtonToggleState.ON) {
                        options.state = ButtonToggleState.ON;
                        if (options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE) {
                            this.setStateStyle();
                            this.fireEvent("propertychange", { property: "state", value: ButtonToggleState.ON });
                            this.fireEvent("click");
                        }
                    }
                };

                Button.prototype.toggleOff = function () {
                    var options = this.properties.options;
                    if (options.state == ButtonToggleState.ON) {
                        options.state = ButtonToggleState.OFF;
                        if (options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE) {
                            this.setStateStyle();
                            this.fireEvent("propertychange", { property: "state", value: ButtonToggleState.OFF });
                            this.fireEvent("click");
                        }
                    }
                };

                Button.prototype.disable = function () {
                    if (!this.isDisabled()) {
                        this.properties.options.disabled = true;
                        this.updateDisabledState();
                        this.setStateStyle();
                        this.fireEvent("propertychange", { property: "disabled", value: true });
                    }
                };

                Button.prototype.enable = function () {
                    if (this.isDisabled()) {
                        this.properties.options.disabled = false;
                        this.updateDisabledState();
                        this.setStateStyle();
                        this.fireEvent("propertychange", { property: "disabled", value: false });
                    }
                };

                Button.prototype.isDisabled = function () {
                    return !!this.$element.attr("disabled");
                };

                Button.prototype.updateDisabledState = function () {
                    var p = this.properties;
                    if (p.options.disabled) {
                        this.tabIndex = this.$element.attr("tabIndex") || "0";
                        this.$element.attr("disabled", "true").removeAttr("tabIndex");
                    } else {
                        this.$element.removeAttr("disabled").attr("tabIndex", this.tabIndex);
                    }
                };

                Button.prototype.onMouseDown = function (e) {
                    if (e.which == 1) {
                        this.onDown();
                    }
                };

                Button.prototype.onMouseUp = function (e) {
                    if (e.which == 1) {
                        this.onUp();
                    }
                };

                Button.prototype.onMouseLeave = function (e) {
                    if (this.pressed) {
                        this.pressed = false;
                        this.setStateStyle();
                    }
                };

                Button.prototype.onKeyDown = function (e) {
                    if (e.which == SDL.UI.Core.Event.Constants.Keys.SPACE || e.which == SDL.UI.Core.Event.Constants.Keys.ENTER) {
                        this.onDown();
                    }
                };

                Button.prototype.onKeyUp = function (e) {
                    if (e.which == SDL.UI.Core.Event.Constants.Keys.SPACE || e.which == SDL.UI.Core.Event.Constants.Keys.ENTER) {
                        this.onUp();
                    }
                };

                Button.prototype.onDown = function () {
                    if (!this.pressed && !this.isDisabled()) {
                        this.pressed = true;
                        this.setStateStyle();
                    }
                };

                Button.prototype.onUp = function () {
                    if (this.pressed && !this.isDisabled()) {
                        var options = this.properties.options;

                        this.pressed = false;

                        if (options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE) {
                            if (options.state != ButtonToggleState.ON) {
                                this.toggleOn();
                            } else {
                                if (options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE) {
                                    this.setStateStyle();
                                } else {
                                    this.toggleOff();
                                }
                            }
                        } else {
                            this.setStateStyle();
                            this.fireEvent("click");
                        }
                    }
                };

                Button.prototype.setStateStyle = function () {
                    var options = this.properties.options;

                    if (this.pressed) {
                        this.$element.addClass("sdl-button-pressed");
                    } else {
                        this.$element.removeClass("sdl-button-pressed");
                    }

                    if (options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE) {
                        if (options.state == ButtonToggleState.ON) {
                            this.$element.removeClass("sdl-button-toggle-off").addClass("sdl-button-toggle-on");
                        } else {
                            this.$element.removeClass("sdl-button-toggle-on").addClass("sdl-button-toggle-off");
                        }
                    } else {
                        this.$element.removeClass("sdl-button-toggle-on").removeClass("sdl-button-toggle-off");
                    }

                    if (this.$icon && options.iconClass) {
                        if (this.isDisabled() || (!this.pressed && (!options.purpose || options.purpose == ButtonPurpose.GENERAL || ((options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE) && options.state != ButtonToggleState.ON)))) {
                            if (options.iconClass.light) {
                                this.$icon.removeClass(options.iconClass.light);
                            }
                            if (options.iconClass.dark) {
                                this.$icon.addClass(options.iconClass.dark);
                            }
                        } else {
                            if (options.iconClass.dark) {
                                this.$icon.removeClass(options.iconClass.dark);
                            }
                            if (options.iconClass.light) {
                                this.$icon.addClass(options.iconClass.light);
                            }
                        }
                    }
                };

                Button.prototype.updateIconMarkup = function () {
                    var options = this.properties.options;
                    if ((options.style == ButtonStyle.ICON || options.style == ButtonStyle.ICON_ROUND) || (options.iconClass && (options.iconClass.dark || options.iconClass.light))) {
                        if (!this.$icon) {
                            this.$icon = SDL.jQuery("<span>&nbsp;</span>");
                            this.$icon.prependTo(this.$element);
                            this.$icon.addClass("sdl-button-image");
                        }
                    } else {
                        this.removeIconMarkup();
                    }
                };

                Button.prototype.removeIconMarkup = function () {
                    if (this.$icon) {
                        this.$icon.remove();
                        this.$icon = null;
                    }
                };

                Button.prototype.getPurposeClassName = function (purpose) {
                    return "sdl-button-purpose-" + (purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE ? ButtonPurpose.TOGGLE : (purpose || ButtonPurpose.GENERAL));
                };
                return Button;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.Button = Button;

            Button.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Button$disposeInterface() {
                var $element = this.$element;
                var options = this.properties.options;

                $element.off("mousedown", this.getDelegate(this.onMouseDown)).off("mouseup", this.getDelegate(this.onMouseUp)).off("mouseleave", this.getDelegate(this.onMouseLeave)).off("keydown", this.getDelegate(this.onKeyDown)).off("keyup", this.getDelegate(this.onKeyUp)).off("blur", this.getDelegate(this.onMouseLeave)).removeClass("sdl-button-pressed").removeClass(this.getPurposeClassName(options.purpose)).removeClass("sdl-button-style-" + (options.style || ButtonStyle.DEFAULT)).removeClass("sdl-button-toggle-on").removeClass("sdl-button-toggle-off");

                if (!this.initialTabIndex) {
                    $element.removeAttr("tabIndex");
                } else {
                    $element.attr("tabIndex", this.initialTabIndex);
                }

                this.removeIconMarkup();

                this.$element = null;
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Button", Button);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=Button.js.map
