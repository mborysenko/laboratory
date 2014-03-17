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
            var Tooltip = (function (_super) {
                __extends(Tooltip, _super);
                function Tooltip(element, options, jQuery) {
                    _super.call(this, element, options, jQuery);
                    this.mouse = {
                        x: 0,
                        y: 0,
                        moving: false,
                        movementTimer: 0
                    };
                    this.shown = false;
                }
                Tooltip.prototype.$initialize = function () {
                    var p = this.properties;
                    this.$ = p.jQuery || SDL.jQuery || SDL.jQuery;
                    var $element = this.$element = this.$(p.element);

                    var settings = this.settings = this.$.extend({
                        trackMouse: false,
                        relativeTo: "element",
                        position: "bottom",
                        offsetX: 0,
                        offsetY: 20,
                        fitToScreen: true,
                        delay: 500,
                        showWhenCursorStationary: false,
                        showIfNoOverflow: true,
                        content: null
                    }, p.options);

                    // set the content, either from the settings or from the 'tooltip' attribute
                    if (settings.content !== null) {
                        $element.attr("tooltip", settings.content);
                    }

                    $element.mouseenter(this.getDelegate(this.onMouseEnter)).mouseleave(this.getDelegate(this.onMouseLeave)).mousemove(this.getDelegate(this.onMouseMove));

                    this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");
                };

                Tooltip.prototype.update = function (options) {
                    this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

                    this.settings = this.$.extend(this.settings, this.properties.options);

                    // set the content, either from the settings or from the 'tooltip' attribute
                    if (this.settings.content !== null) {
                        this.$element.attr("tooltip", this.settings.content);
                    }

                    this.fireEvent("update");
                };

                /**
                Show the tooltip either immediately, or after a short delay depending on the settings
                */
                Tooltip.prototype.showTooltip = function () {
                    var _this = this;
                    if (this.settings.delay) {
                        Tooltip.tooltipTimer = setTimeout(function () {
                            return _this.doShowTooltip();
                        }, this.settings.delay);
                    } else {
                        this.doShowTooltip();
                    }
                };

                /**
                Removes the tooltip from the DOM
                */
                Tooltip.prototype.hideTooltip = function () {
                    if (this.shown) {
                        Tooltip.shownTooltip = null;
                        this.shown = false;
                        this.fireEvent("hide");
                        this.fireEvent("propertychange", { property: "shown", value: false });
                        this.$(".sdl-tooltip").remove();
                    }
                };

                /**
                Handles mouseenter events
                */
                Tooltip.prototype.onMouseEnter = function (e) {
                    this.trackMouse(e);
                    clearTimeout(Tooltip.tooltipTimer);

                    if (this.settings.showIfNoOverflow) {
                        this.showTooltip();
                    } else {
                        var overflowElement;
                        var overflowSelector = this.$element.attr("tooltipoverflow");

                        if (overflowSelector) {
                            overflowElement = this.$element.find(overflowSelector)[0];
                        } else {
                            overflowElement = this.$element[0];
                        }

                        if (overflowElement.offsetWidth < overflowElement.scrollWidth || overflowElement.offsetHeight < overflowElement.scrollHeight) {
                            this.showTooltip();
                        }
                    }
                };

                /**
                Handles mouseleave events
                */
                Tooltip.prototype.onMouseLeave = function () {
                    clearTimeout(Tooltip.tooltipTimer);
                    if (!this.getDisposed()) {
                        this.hideTooltip();
                        this.$element.parent().trigger("mouseenter");
                    }
                };

                /**
                Track the mouse movements so that we can reposition the tooltips precisely
                */
                Tooltip.prototype.onMouseMove = function (e) {
                    var _this = this;
                    if (this.mouse.movementTimer) {
                        clearTimeout(this.mouse.movementTimer);
                    }

                    this.mouse.moving = true;
                    this.trackMouse(e);

                    if (this.settings.trackMouse) {
                        // from https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
                        var windowScrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
                        var windowScrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

                        this.$(".sdl-tooltip").css("left", (this.mouse.x + this.settings.offsetX - windowScrollX) + "px").css("top", (this.mouse.y + this.settings.offsetY - windowScrollY) + "px");
                    }

                    this.mouse.movementTimer = setTimeout(function () {
                        _this.mouse.moving = false;
                    }, 100);
                };

                /**
                Show the tooltip
                */
                Tooltip.prototype.doShowTooltip = function () {
                    var $element = this.$element;
                    var settings = this.settings;
                    var x = 0, y = 0;
                    var content = $element.attr("tooltip");
                    if (content == null) {
                        content = $element.text().replace("\n", "<br/>");
                    }

                    // from https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
                    var windowScrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
                    var windowScrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

                    switch (settings.relativeTo) {
                        case "element":
                            x = $element.position().left + parseInt($element.css("margin-left")) + settings.offsetX - windowScrollX;
                            y = $element.position().top + parseInt($element.css("margin-top")) + $element.outerHeight() + settings.offsetY - windowScrollY;
                            break;
                        case "mouse":
                            x = this.mouse.x + settings.offsetX - windowScrollX;
                            y = this.mouse.y + settings.offsetY - windowScrollY;
                            break;
                        case "page":
                            x = settings.offsetX - windowScrollX;
                            y = settings.offsetY - windowScrollY;
                            break;
                    }

                    if (Tooltip.shownTooltip) {
                        Tooltip.shownTooltip.hideTooltip();
                    }

                    $element.append('<div class="sdl-tooltip" style="position: fixed; left: ' + x + 'px; top: ' + y + 'px">' + content + '</div>');

                    if (settings.fitToScreen) {
                        var $tooltip = this.$(".sdl-tooltip");
                        var position = $tooltip.position();
                        var $window = this.$(window);
                        if (typeof position !== "undefined" && position !== null) {
                            if ($tooltip.outerHeight() + position.top > $window.height()) {
                                $tooltip.css("top", ($window.height() - $tooltip.outerHeight() - document.body.scrollTop) + "px");
                            }

                            if ($tooltip.outerWidth() + position.left > $window.width()) {
                                $tooltip.css("left", ($window.width() - $tooltip.outerWidth() - document.body.scrollLeft) + "px");
                            }
                        }
                    }

                    Tooltip.shownTooltip = this;
                    this.shown = true;
                    this.fireEvent("show");
                    this.fireEvent("propertychange", { property: "shown", value: true });
                };

                /**
                Function to track the mouse so that we can precisely position the tooltip relative to the cursor after a short delay
                */
                Tooltip.prototype.trackMouse = function (e) {
                    this.mouse.x = e.pageX;
                    this.mouse.y = e.pageY;
                };
                Tooltip.tooltipTimer = 0;
                Tooltip.shownTooltip = null;
                return Tooltip;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.Tooltip = Tooltip;

            Tooltip.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Tooltip$disposeInterface() {
                if (this.mouse.movementTimer) {
                    clearTimeout(this.mouse.movementTimer);
                }
                if (this.$element) {
                    this.$element.off("mouseenter", this.getDelegate(this.onMouseEnter)).off("mouseleave", this.getDelegate(this.onMouseLeave)).off("mousemove", this.getDelegate(this.onMouseMove));
                    this.hideTooltip();
                    this.$ = this.$element = null;
                }
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Tooltip", Tooltip);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=Tooltip.js.map
