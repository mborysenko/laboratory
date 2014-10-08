/// <reference path="../../SDL.Client.UI.Core/Controls/FocusableControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Utils/Dom.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Css/ZIndexManager.d.ts" />
/// <reference path="../ActionBar/ActionBar.jQuery.ts" />
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
            (function (CalloutPosition) {
                CalloutPosition[CalloutPosition["ABOVE"] = "above"] = "ABOVE";
                CalloutPosition[CalloutPosition["BELOW"] = "below"] = "BELOW";
                CalloutPosition[CalloutPosition["LEFT"] = "left"] = "LEFT";
                CalloutPosition[CalloutPosition["RIGHT"] = "right"] = "RIGHT";
            })(Controls.CalloutPosition || (Controls.CalloutPosition = {}));
            var CalloutPosition = Controls.CalloutPosition;

            (function (CalloutPurpose) {
                CalloutPurpose[CalloutPurpose["GENERAL"] = "general"] = "GENERAL";
                CalloutPurpose[CalloutPurpose["MENU"] = "menu"] = "MENU";
            })(Controls.CalloutPurpose || (Controls.CalloutPurpose = {}));
            var CalloutPurpose = Controls.CalloutPurpose;

            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var Callout = (function (_super) {
                __extends(Callout, _super);
                function Callout(element, options) {
                    _super.call(this, element, options || {});
                }
                Callout.prototype.$initialize = function () {
                    this.callBase("SDL.UI.Core.Controls.FocusableControlBase", "$initialize");

                    var p = this.properties;
                    var $element = this.$element = SDL.jQuery(p.element);

                    p.options = SDL.jQuery.extend({}, p.options);

                    $element.addClass("sdl-callout");
                    if (p.options.purpose && p.options.purpose != CalloutPurpose.GENERAL) {
                        $element.addClass("sdl-callout-" + p.options.purpose);
                    }

                    if (p.options.visible != null && p.options.visible.toString() == "false") {
                        if ((!p.options.actions || !p.options.actions.length) && !p.options.actionFlag) {
                            this.removeActionBar();
                        }
                        this.hide();
                    } else {
                        if (p.options.actions && p.options.actions.length || p.options.actionFlag) {
                            this.createActionBar();
                        }
                        this.show();
                    }
                };

                Callout.prototype.update = function (options) {
                    var p = this.properties;
                    var prevOptions = p.options;
                    options = SDL.jQuery.extend({}, options);

                    this.callBase("SDL.UI.Core.Controls.FocusableControlBase", "update", [options]);

                    if (p.options.purpose != prevOptions.purpose) {
                        if (prevOptions.purpose && prevOptions.purpose != CalloutPurpose.GENERAL) {
                            this.$element.removeClass("sdl-callout-" + prevOptions.purpose);
                        }

                        if (p.options.purpose && p.options.purpose != CalloutPurpose.GENERAL) {
                            this.$element.addClass("sdl-callout-" + p.options.purpose);
                        }
                    }

                    if (p.options.visible != null && p.options.visible.toString() == "false") {
                        this.hide();
                    } else if (p.options.visible || this.isVisible) {
                        if ((!p.options.actions || !p.options.actions.length) && !p.options.actionFlag) {
                            this.removeActionBar();
                        } else if (this.$actionbar) {
                            this.$actionbar.actionBar({ actions: p.options.actions, actionFlag: p.options.actionFlag });
                        } else {
                            this.createActionBar();
                        }
                        this.show();
                    }
                };

                Callout.prototype.show = function () {
                    var _this = this;
                    if (this.isVisible != true) {
                        this.isVisible = true;

                        this.showTimeout = setTimeout(function () {
                            _this.showTimeout = null;
                            if (_this.isVisible) {
                                _this.$element.removeClass("sdl-callout-hidden").keydown(_this.getDelegate(_this.onKeyDown));

                                _this._setLocation();
                                _this.initCaptureFocus();

                                _this.fireEvent("propertychange", { property: "visible", value: true });
                                _this.fireEvent("show");
                            }
                        });

                        SDL.UI.Core.Css.ZIndexManager.setNextZIndex(this.properties.element, this.properties.options.bringToFront);
                    } else if (this.showTimeout) {
                        // element is about to be shown -> do nothing at this moment
                    } else {
                        this.pauseCaptureFocus(); // pause capturing in case focusout is triggered because of mouse events between now and the code below
                        setTimeout(function () {
                            if (_this.isVisible) {
                                _this._setLocation();
                                _this.initCaptureFocus();
                            }
                        });
                        SDL.UI.Core.Css.ZIndexManager.setNextZIndex(this.properties.element, this.properties.options.bringToFront);
                    }
                };

                Callout.prototype.hide = function () {
                    if (this.isVisible != false) {
                        this.isVisible = false;
                        this.onHide();
                        this.$element.addClass("sdl-callout-hidden");
                        this.fireEvent("propertychange", { property: "visible", value: false });
                        this.fireEvent("hide");
                    }
                };

                Callout.prototype.setLocation = function (location) {
                    if (location) {
                        if (location.x != null) {
                            this.properties.options.targetCoordinates = location;
                        } else if (location.xLeft != null) {
                            this.properties.options.targetBox = location;
                        }

                        this._setLocation();
                    } else {
                        console.warn("Callout.setLocation(): location object is not defined");
                    }
                };

                Callout.prototype.getActionsFlag = function () {
                    return this.$actionbar ? this.$actionbar.actionBar().getActionFlag() : null;
                };

                Callout.prototype.handleFocusOut = function () {
                    this.executeCloseAction();
                };

                Callout.prototype._setLocation = function () {
                    if (this.isVisible) {
                        var p = this.properties;
                        var options = p.options;

                        var container = (document.documentElement || document.body.parentNode || document.body);
                        var targetElement = options.targetElement || container;

                        var targetPosition = SDL.jQuery(targetElement).offset();

                        // from https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
                        var windowScrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : container.scrollLeft;
                        var windowScrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : container.scrollTop;

                        var posLeft;
                        var posAbove;
                        var posRight;
                        var posBelow;

                        var targetOffsetWidth = targetElement.offsetWidth;
                        var targetOffsetHeight = targetElement.offsetHeight;

                        if (options.targetCoordinates) {
                            posLeft = posRight = targetPosition.left + (options.targetCoordinates.x < 0 ? targetOffsetWidth : 0) + (options.targetCoordinates.x || 0) - windowScrollX;
                            posAbove = posBelow = targetPosition.top + (options.targetCoordinates.y < 0 ? targetOffsetHeight : 0) + (options.targetCoordinates.y || 0) - windowScrollY;
                        } else if (options.targetBox) {
                            posLeft = targetPosition.left + (options.targetBox.xLeft < 0 ? targetOffsetWidth : 0) + (options.targetBox.xLeft || 0) - windowScrollX;
                            posAbove = targetPosition.top + (options.targetBox.yAbove < 0 ? targetOffsetHeight : 0) + (options.targetBox.yAbove || 0) - windowScrollY;
                            posRight = targetPosition.left + (options.targetBox.xRight < 0 ? targetOffsetWidth : 0) + (options.targetBox.xRight || 0) - windowScrollX;
                            posBelow = targetPosition.top + (options.targetBox.yBelow < 0 ? targetOffsetHeight : 0) + (options.targetBox.yBelow || 0) - windowScrollY;
                        } else {
                            posLeft = targetPosition.left - windowScrollX;
                            posAbove = targetPosition.top - windowScrollY;
                            posRight = targetPosition.left + targetOffsetWidth - windowScrollX;
                            posBelow = targetPosition.top + targetOffsetHeight - windowScrollY;
                        }

                        // ensure the location is in screen
                        posLeft = Math.max(0, Math.min(container.clientWidth, posLeft));
                        posAbove = Math.max(0, Math.min(container.clientHeight, posAbove));
                        posRight = Math.max(0, Math.min(container.clientWidth, posRight));
                        posBelow = Math.max(0, Math.min(container.clientHeight, posBelow));

                        // calculate available space for showing the callout
                        var calloutWidth = p.element.offsetWidth;
                        var calloutHeight = p.element.offsetHeight;
                        var pointerSize = 9;
                        var pointerHalfWidth = 7;
                        var pointerMinDistanceFromEdge = 20 + pointerHalfWidth;
                        var preferedPositions = options.preferredPosition && (SDL.Client.Type.isArray(options.preferredPosition)) ? (options.preferredPosition.length ? options.preferredPosition : [CalloutPosition.BELOW]) : [options.preferredPosition || CalloutPosition.BELOW];

                        var position;

                        for (var i = 0; !position && i < preferedPositions.length; i++) {
                            switch (preferedPositions[i]) {
                                case CalloutPosition.ABOVE:
                                    if (calloutHeight + pointerSize <= posAbove && posRight >= pointerMinDistanceFromEdge && posLeft <= container.clientWidth) {
                                        position = CalloutPosition.ABOVE;
                                    }
                                    break;
                                case CalloutPosition.BELOW:
                                    if (calloutHeight + pointerSize <= container.clientHeight - posBelow && posRight >= pointerMinDistanceFromEdge && posLeft <= container.clientWidth) {
                                        position = CalloutPosition.BELOW;
                                    }
                                    break;
                                case CalloutPosition.LEFT:
                                    if (calloutWidth + pointerSize <= posLeft && posAbove >= pointerMinDistanceFromEdge && posBelow <= container.clientHeight) {
                                        position = CalloutPosition.LEFT;
                                    }
                                    break;
                                case CalloutPosition.RIGHT:
                                    if (calloutWidth + pointerSize <= container.clientWidth - posRight && posAbove >= pointerMinDistanceFromEdge && posBelow <= container.clientHeight) {
                                        position = CalloutPosition.RIGHT;
                                    }
                                    break;
                            }
                        }

                        if (!position) {
                            var diffVertical;
                            if (posAbove < container.clientHeight - posBelow) {
                                diffVertical = (container.clientHeight - posBelow) - (calloutHeight + pointerSize);
                                if (diffVertical >= 0) {
                                    position = CalloutPosition.BELOW; // there's enough space below
                                }
                            } else {
                                diffVertical = posAbove - (calloutHeight + pointerSize);
                                if (diffVertical >= 0) {
                                    position = CalloutPosition.ABOVE; // there's enough space above
                                }
                            }

                            var diffHorizontal;
                            if (posLeft < container.clientWidth - posRight) {
                                diffHorizontal = (container.clientWidth - posRight) - (calloutWidth + pointerSize);
                                if (diffHorizontal >= 0 && diffVertical < diffHorizontal) {
                                    position = CalloutPosition.RIGHT; // there's enough space to the right
                                }
                            } else {
                                diffHorizontal = posLeft - (calloutWidth + pointerSize);
                                if (diffHorizontal >= 0 && diffVertical < diffHorizontal) {
                                    position = CalloutPosition.LEFT; // there's enough space to the left
                                }
                            }

                            if (!position) {
                                switch (preferedPositions[0]) {
                                    case CalloutPosition.ABOVE:
                                        posAbove = calloutHeight + pointerSize;
                                        position = CalloutPosition.ABOVE;
                                        break;
                                    case CalloutPosition.BELOW:
                                        posBelow = container.clientHeight - (calloutHeight + pointerSize);
                                        position = CalloutPosition.BELOW;
                                        break;
                                    case CalloutPosition.LEFT:
                                        posLeft = calloutWidth + pointerSize;
                                        position = CalloutPosition.LEFT;
                                        break;
                                    case CalloutPosition.RIGHT:
                                        posRight = container.clientWidth - (calloutWidth + pointerSize);
                                        position = CalloutPosition.RIGHT;
                                        break;
                                }
                            }
                        }

                        // ok, figured out the position, calculate the exact location now
                        if (!this.pointer) {
                            this.pointer = SDL.jQuery("<div></div>").appendTo(this.$element)[0];
                        }
                        this.pointer.className = "sdl-callout-pointer-" + position;

                        var x;
                        var y;
                        var xPointer;
                        var yPointer;

                        switch (position) {
                            case CalloutPosition.ABOVE:
                            case CalloutPosition.BELOW:
                                x = (posRight + posLeft - calloutWidth) >> 1; // [>> 1] is division by 2
                                x = Math.max(0, Math.min(container.clientWidth - calloutWidth, x));
                                xPointer = ((posRight + posLeft) >> 1) - pointerHalfWidth;
                                xPointer = Math.max(pointerMinDistanceFromEdge - pointerHalfWidth, Math.min(container.clientWidth - pointerMinDistanceFromEdge - pointerHalfWidth, xPointer));
                                break;
                            case CalloutPosition.LEFT:
                            case CalloutPosition.RIGHT:
                                y = (posBelow + posAbove - calloutHeight) >> 1; // [>> 1] is division by 2
                                y = Math.max(0, Math.min(container.clientHeight - calloutHeight, y));
                                yPointer = ((posBelow + posAbove) >> 1) - pointerHalfWidth;
                                yPointer = Math.max(pointerMinDistanceFromEdge - pointerHalfWidth, Math.min(container.clientHeight - pointerMinDistanceFromEdge - pointerHalfWidth, yPointer));
                                break;
                        }

                        switch (position) {
                            case CalloutPosition.ABOVE:
                                y = Math.max(0, posAbove - (calloutHeight + pointerSize));
                                yPointer = y + calloutHeight - 1;
                                break;
                            case CalloutPosition.BELOW:
                                y = posBelow + pointerSize;
                                y = Math.max(pointerSize, Math.min(container.clientHeight - calloutHeight, y));
                                yPointer = y - pointerSize + 1;
                                break;
                            case CalloutPosition.LEFT:
                                x = Math.max(0, posLeft - (calloutWidth + pointerSize));
                                xPointer = x + calloutWidth - 1;
                                break;
                            case CalloutPosition.RIGHT:
                                x = posRight + pointerSize;
                                x = Math.max(pointerSize, Math.min(container.clientWidth - calloutWidth, x));
                                xPointer = x - pointerSize + 1;
                                break;
                        }

                        p.element.style.left = x + "px";
                        p.element.style.top = y + "px";
                        this.pointer.style.left = xPointer + "px";
                        this.pointer.style.top = yPointer + "px";
                    }
                };

                Callout.prototype.initCaptureFocus = function () {
                    var hideOnBlur = this.properties.options.hideOnBlur;
                    if (hideOnBlur == null || hideOnBlur.toString() != "false") {
                        this.startCaptureFocus(true, this.properties.options.targetElement || document.body);
                    } else {
                        this.stopCaptureFocus();
                    }
                };

                Callout.prototype.createActionBar = function () {
                    var options = this.properties.options;
                    this.$actionbar = SDL.jQuery("<div class='sdl-callout-actionbar'></div>").actionBar({ actions: options.actions, actionFlag: options.actionFlag }).on("action", this.getDelegate(this.onActionBarAction)).on("actionflagchange", this.getDelegate(this.onActionBarActionFlagChange)).end().appendTo(this.$element);
                };

                Callout.prototype.onActionBarAction = function (e) {
                    this.fireEvent("action", {
                        action: e.originalEvent.data.action,
                        actionFlag: e.originalEvent.data.actionFlag
                    });

                    switch (e.originalEvent.data.action) {
                        case "close":
                        case "cancel":
                            this.hide();
                            break;
                    }
                };

                Callout.prototype.onActionBarActionFlagChange = function (e) {
                    this.fireEvent("actionflagchange", { actionsFlag: e.originalEvent.data.actionFlag });
                    this.fireEvent("propertychange", { property: "actionFlag.selected", value: e.originalEvent.data.actionFlag });
                };

                Callout.prototype.removeActionBar = function () {
                    if (this.$actionbar) {
                        this.$actionbar.actionBar().off("action", this.removeDelegate(this.onActionBarAction)).off("actionflagchange", this.removeDelegate(this.onActionBarActionFlagChange)).dispose().remove();
                        this.$actionbar = null;
                    }
                };

                Callout.prototype.onKeyDown = function (e) {
                    if (e.which == SDL.UI.Core.Event.Constants.Keys.ESCAPE) {
                        e.stopPropagation();
                        this.executeCloseAction();
                    }
                };

                Callout.prototype.executeCloseAction = function () {
                    var closeAction;
                    var options = this.properties.options;
                    if (options.actions) {
                        for (var i = options.actions.length - 1; !closeAction && i >= 0; i--) {
                            switch (options.actions[i].action) {
                                case "close":
                                case "cancel":
                                    closeAction = options.actions[i];
                                    break;
                            }
                        }
                    }

                    if (closeAction) {
                        if (SDL.Client.Type.isFunction(closeAction.handler)) {
                            closeAction.handler();
                        }

                        this.fireEvent("action", {
                            action: closeAction.action,
                            actionFlag: this.getActionsFlag()
                        });
                    } else {
                        this.fireEvent("action", {
                            action: "close",
                            actionFlag: this.getActionsFlag()
                        });
                    }

                    this.hide();
                };

                Callout.prototype.onHide = function () {
                    this.stopCaptureFocus();
                    this.$element.off("keydown", this.getDelegate(this.onKeyDown));
                    SDL.UI.Core.Css.ZIndexManager.releaseZIndex(this.properties.element);
                };

                Callout.prototype.cleanUp = function () {
                    this.onHide();
                    this.removeActionBar();

                    this.$element.removeClass("sdl-callout sdl-callout-hidden sdl-callout-general sdl-callout-menu");

                    if (this.pointer) {
                        this.properties.element.removeChild(this.pointer);
                        this.pointer = null;
                    }

                    this.$element = null;
                };
                return Callout;
            })(SDL.UI.Core.Controls.FocusableControlBase);
            Controls.Callout = Callout;

            Callout.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Callout$disposeInterface() {
                this.cleanUp();
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Callout", Callout);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=Callout.js.map
