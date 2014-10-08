/// <reference path="ControlBase.ts" />
/// <reference path="../Event/Constants.d.ts" />
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
                var FocusableControlBase = (function (_super) {
                    __extends(FocusableControlBase, _super);
                    function FocusableControlBase() {
                        _super.apply(this, arguments);
                    }
                    FocusableControlBase.prototype.$initialize = function () {
                        this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

                        this.properties.$element = SDL.jQuery(this.properties.element);
                    };

                    FocusableControlBase.prototype.handleFocusOut = function () {
                        // override this method in the deriving class
                    };

                    FocusableControlBase.prototype.startCaptureFocus = function (triggerOnResize, triggerOnScroll) {
                        if (typeof triggerOnResize === "undefined") { triggerOnResize = false; }
                        var p = this.properties;
                        if (!p.capturingFocus) {
                            p.capturingFocus = true;

                            p.initialTabIndex = p.$element.attr("tabIndex") || null;
                            if (!p.initialTabIndex) {
                                p.$element.attr("tabIndex", "0"); // make element 'focusable'
                            }

                            window.addEventListener("mousedown", this.getDelegate(this.onMouseDown), true);
                            SDL.jQuery(window).on("focusin", this.getDelegate(this.onWindowFocusIn)); // detect when focus leaves an element in the window
                            SDL.jQuery(window).on("focusout", this.getDelegate(this.onWindowFocusOut)); // detect when focus goes to an element in the window
                        }

                        if (triggerOnResize && !p.handlingResize) {
                            p.handlingResize = true;
                            window.addEventListener("resize", this.getDelegate(this.onResize));
                        }

                        if (triggerOnScroll && !p.handlingScrollElement) {
                            p.handlingScrollElement = triggerOnScroll;
                            window.addEventListener("scroll", this.getDelegate(this.onScroll), true);
                        }

                        p.isPausedCaptureFocus = false;

                        this.stopWindowFocusOut();
                        this.checkFocusedElement(function () {
                            return p.$element.focus();
                        });
                    };

                    FocusableControlBase.prototype.stopCaptureFocus = function () {
                        var p = this.properties;
                        if (p.capturingFocus) {
                            p.capturingFocus = false;
                            window.removeEventListener("mousedown", this.getDelegate(this.onMouseDown), true);

                            if (p.handlingResize) {
                                p.handlingResize = false;
                                window.removeEventListener("resize", this.getDelegate(this.onResize));
                            }

                            if (p.handlingScrollElement) {
                                p.handlingScrollElement = null;
                                window.removeEventListener("scroll", this.getDelegate(this.onScroll), true);
                            }

                            this.cancelCheckFocusedElementAfterDelay();

                            p.isWindowFocusOut = false;
                            SDL.jQuery(window).off("focusin", this.getDelegate(this.onWindowFocusIn));
                            SDL.jQuery(window).off("focusout", this.getDelegate(this.onWindowFocusOut));

                            this.cancelCheckFocusedElementAfterDelay();

                            if (p.initialTabIndex) {
                                p.$element.attr("tabIndex", p.initialTabIndex);
                            } else {
                                p.$element.removeAttr("tabIndex");
                            }
                        }
                    };

                    FocusableControlBase.prototype.pauseCaptureFocus = function () {
                        this.properties.isPausedCaptureFocus = true;
                    };

                    FocusableControlBase.prototype.checkFocusedElement = function (focusOutHandler) {
                        var p = this.properties;

                        this.cancelCheckFocusedElementAfterDelay();

                        if (p.capturingFocus && !p.isPausedCaptureFocus) {
                            if (p.element.contains(document.activeElement)) {
                                // focus is inside the element
                                if (p.isWindowFocusOut) {
                                    // when focus goes into an iframe, there's no event triggered when the iframe loses the focus (Chrome and FF)
                                    // -> monitor it with timeout
                                    this.checkFocusedElementAfterDelay(500);
                                }
                            } else if (p.isWindowFocusOut && (!document.activeElement || document.activeElement == document.body)) {
                                // focus is not in the window
                                // focus will not be fired if click in an iframe inside the window
                                // -> monitor it with timeout
                                this.checkFocusedElementAfterDelay(500);
                            } else {
                                focusOutHandler ? focusOutHandler() : this.handleFocusOut();
                            }
                        }
                    };

                    FocusableControlBase.prototype.onMouseDown = function (e) {
                        if (!this.properties.element.contains(e.target)) {
                            this.handleFocusOut();
                        }
                    };

                    FocusableControlBase.prototype.onWindowFocusOut = function (e) {
                        var p = this.properties;
                        if (p.capturingFocus && !p.isPausedCaptureFocus) {
                            p.isWindowFocusOut = true;

                            if (!e || !e.relatedTarget) {
                                this.checkFocusedElementAfterDelay();
                            } else if (!p.element.contains(e.relatedTarget)) {
                                this.handleFocusOut();
                            } else {
                                // focusin will not be fired if click in an iframe inside the window
                                // -> monitor it with timeout
                                this.checkFocusedElementAfterDelay(500);
                            }
                        }
                    };

                    FocusableControlBase.prototype.onWindowFocusIn = function () {
                        this.stopWindowFocusOut();
                        this.checkFocusedElementAfterDelay();
                    };

                    FocusableControlBase.prototype.stopWindowFocusOut = function () {
                        this.properties.isWindowFocusOut = false;
                    };

                    FocusableControlBase.prototype.checkFocusedElementAfterDelay = function (delay) {
                        var p = this.properties;
                        if (p.capturingFocus && !p.isPausedCaptureFocus) {
                            if (!p.checkFocusedElementTimeout) {
                                p.checkFocusedElementTimeout = window.setTimeout(this.checkFocusedElement.bind(this), delay);
                            } else if (!delay) {
                                window.clearTimeout(p.checkFocusedElementTimeout);
                                p.checkFocusedElementTimeout = window.setTimeout(this.checkFocusedElement.bind(this), delay);
                            }
                        }
                    };

                    FocusableControlBase.prototype.cancelCheckFocusedElementAfterDelay = function () {
                        var p = this.properties;
                        if (p.checkFocusedElementTimeout) {
                            window.clearTimeout(p.checkFocusedElementTimeout);
                            p.checkFocusedElementTimeout = null;
                        }
                    };

                    FocusableControlBase.prototype.onScroll = function (e) {
                        var p = this.properties;
                        if (!p.isPausedCaptureFocus && (e.target == p.handlingScrollElement || e.target.contains(p.handlingScrollElement))) {
                            // trigger focusout if scrolling is not inside the element
                            this.handleFocusOut();
                        }
                    };

                    FocusableControlBase.prototype.onResize = function (e) {
                        if (!this.properties.isPausedCaptureFocus) {
                            this.handleFocusOut();
                        }
                    };
                    return FocusableControlBase;
                })(Controls.ControlBase);
                Controls.FocusableControlBase = FocusableControlBase;

                FocusableControlBase.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$FocusableControlBase$disposeInterface() {
                    this.stopCaptureFocus();
                });

                SDL.Client.Types.OO.createInterface("SDL.UI.Core.Controls.FocusableControlBase", FocusableControlBase);
            })(Core.Controls || (Core.Controls = {}));
            var Controls = Core.Controls;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=FocusableControlBase.js.map
