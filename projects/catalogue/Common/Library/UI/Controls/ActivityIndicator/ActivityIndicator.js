﻿/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
/// <reference path="../../SDL.Client.Core/ConfigurationManager/ConfigurationManager.d.ts" />
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
            (function (ActivityIndicatorScreen) {
                ActivityIndicatorScreen[ActivityIndicatorScreen["BRIGHT"] = "bright"] = "BRIGHT";
                ActivityIndicatorScreen[ActivityIndicatorScreen["DARK"] = "dark"] = "DARK";
                ActivityIndicatorScreen[ActivityIndicatorScreen["NONE"] = "none"] = "NONE";
            })(Controls.ActivityIndicatorScreen || (Controls.ActivityIndicatorScreen = {}));
            var ActivityIndicatorScreen = Controls.ActivityIndicatorScreen;

            (function (ActivityIndicatorSize) {
                ActivityIndicatorSize[ActivityIndicatorSize["LARGE"] = "large"] = "LARGE";
                ActivityIndicatorSize[ActivityIndicatorSize["MEDIUM"] = "medium"] = "MEDIUM";
                ActivityIndicatorSize[ActivityIndicatorSize["SMALL"] = "small"] = "SMALL";
            })(Controls.ActivityIndicatorSize || (Controls.ActivityIndicatorSize = {}));
            var ActivityIndicatorSize = Controls.ActivityIndicatorSize;

            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var ActivityIndicator = (function (_super) {
                __extends(ActivityIndicator, _super);
                function ActivityIndicator(element, options) {
                    _super.call(this, element, options || {});
                }
                ActivityIndicator.prototype.$initialize = function () {
                    var _this = this;
                    this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

                    var p = this.properties;
                    var $element = this.$element = SDL.jQuery(p.element);

                    /*
                    <[contro-element] class="sdl-activityindicator">
                    <div class='sdl-activityindicator-child'>
                    <div></div>		<!-- text -->
                    <div></div>		<!-- rotated circle -->
                    </div>
                    </[control-element]>
                    */
                    this.screenClass = (p.options.screen == ActivityIndicatorScreen.NONE) ? "" : "sdl-activityindicator-child-screen-" + (p.options.screen || ActivityIndicatorScreen.BRIGHT);

                    this.sizeClass = (!p.options.size || p.options.size == ActivityIndicatorSize.LARGE) ? "sdl-activityindicator-child-size-large" : "sdl-activityindicator-child-size-" + p.options.size;

                    $element.addClass("sdl-activityindicator" + (p.options.legacyMode || (p.options.legacyMode !== false && SDL.Client.Configuration && SDL.Client.Configuration.ConfigurationManager && SDL.Client.Configuration.ConfigurationManager.getAppSetting("activityIndicatorLegacyMode") == "true") ? "-legacy" : ""));
                    this.$childElement = SDL.jQuery("<div class='sdl-activityindicator-child" + (this.screenClass ? " " + this.screenClass : "") + (this.sizeClass ? " " + this.sizeClass : "") + "'><div></div><div><svg><circle cx='10' cy='10' r='8'/><path d='M10,2 A8,8 0 0,1 18,10'/><path d='M17.996,9.8 A8,8 0 0,1 10,18'/></svg></div></div>").appendTo($element);
                    this.$childElement.children(":first").text((p.options.text || "").trim());
                    if (p.element.style.animation == undefined && p.element.style.webkitAnimation == undefined) {
                        // IE9 does not support animation -> use javascript
                        var position = 0;
                        var step = 12;
                        var rotateElementStyle = this.$childElement.children(":last")[0].style;

                        var scheduleRotation = function () {
                            _this.rotateTimeout = window.setTimeout(rotate, p.options.legacyMode ? 33 : 17);
                        };

                        var rotate = function () {
                            position += step;
                            if (position >= 360) {
                                position -= 360;
                            }
                            rotateElementStyle.msTransform = "rotate(" + position + "deg)";
                            scheduleRotation();
                        };

                        scheduleRotation();
                    }
                };

                ActivityIndicator.prototype.update = function (options) {
                    if (options) {
                        var p = this.properties;
                        var prevOptionsText = p.options.text;
                        var prevOptionsScreen = p.options.screen;
                        var prevOptionsSize = p.options.size;
                        var prevOptionsLegacy = p.options.legacyMode;

                        this.callBase("SDL.UI.Core.Controls.ControlBase", "update", arguments);

                        var changedProperties = [];

                        if (prevOptionsText != options.text) {
                            changedProperties.push("text");
                            this.$childElement.children(":first").text((options.text || "").trim());
                        }

                        if (prevOptionsScreen != options.screen) {
                            changedProperties.push("screen");

                            if (this.screenClass) {
                                this.$childElement.removeClass(this.screenClass);
                            }

                            this.screenClass = (p.options.screen == ActivityIndicatorScreen.NONE) ? "" : "sdl-activityindicator-child-screen-" + (p.options.screen || ActivityIndicatorScreen.BRIGHT);

                            if (this.screenClass) {
                                this.$childElement.addClass(this.screenClass);
                            }
                        }

                        if (prevOptionsSize != options.size) {
                            changedProperties.push("size");

                            if (this.sizeClass) {
                                this.$childElement.removeClass(this.sizeClass);
                            }

                            this.sizeClass = (!p.options.size || p.options.size == ActivityIndicatorSize.LARGE) ? "sdl-activityindicator-child-size-large" : "sdl-activityindicator-child-size-" + p.options.size;

                            if (this.sizeClass) {
                                this.$childElement.addClass(this.sizeClass);
                            }
                        }

                        if (prevOptionsLegacy != options.legacyMode) {
                            changedProperties.push("legacy");
                            var app = SDL.Client.Application;
                            var isLegacy = options.legacyMode || (options.legacyMode !== false && SDL.Client.Configuration.ConfigurationManager.getAppSetting("activityIndicatorLegacyMode") == "true");

                            this.$element.removeClass("sdl-activityindicator" + (isLegacy ? "" : "-legacy")).addClass("sdl-activityindicator" + (isLegacy ? "-legacy" : ""));
                        }

                        for (var i = 0, len = changedProperties.length; i < len; i++) {
                            this.fireEvent("propertychange", { property: changedProperties[i], value: options[changedProperties[i]] });
                        }
                    }
                };
                return ActivityIndicator;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.ActivityIndicator = ActivityIndicator;

            ActivityIndicator.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$ActivityIndicator$disposeInterface() {
                if (this.rotateTimeout) {
                    window.clearTimeout(this.rotateTimeout);
                    this.rotateTimeout = null;
                }
                if (this.$childElement) {
                    this.$childElement.remove();
                    this.$childElement = null;
                }
                if (this.$element) {
                    this.$element.removeClass("sdl-activityindicator sdl-activityindicator-legacy");
                    this.$element = null;
                }
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.ActivityIndicator", ActivityIndicator);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=ActivityIndicator.js.map
