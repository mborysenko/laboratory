/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Utils/Dom.d.ts" />
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
            var ScrollView = (function (_super) {
                __extends(ScrollView, _super);
                function ScrollView(element, options) {
                    _super.call(this, element, options || {});
                    this.secondaryScrollBars = {};
                    this.childCreated = false;
                    this.scrollBarChildBottom = 0;
                    this.scrollBarChildRight = 0;
                    this.scrollButtonSize = 18;
                }
                ScrollView.prototype.$initialize = function () {
                    this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

                    if (!SDL.jQuery.browser.macintosh && !SDL.jQuery.browser.mobile) {
                        var p = this.properties;
                        var $element = this.$element = SDL.jQuery(p.element);

                        var options = p.options = SDL.jQuery.extend({
                            overflowX: "auto",
                            overflowY: "auto",
                            overlay: false
                        }, p.options);

                        var scrollTop = p.element.scrollTop;
                        var scrollLeft = p.element.scrollLeft;
                        var isBody = $element.is("body");
                        var parent;
                        if (isBody) {
                            parent = $element.parent()[0];
                            scrollTop = scrollTop || parent.scrollTop || 0; // documentElement rather than body is scrolled in FF and IE
                            scrollLeft = scrollLeft || parent.scrollLeft || 0; // documentElement rather than body is scrolled in FF and IE
                        }

                        var $scrollChild = ($element[0].nodeType == 9) ? $element.children("body").attr("data-sdl-scrollview-child", "true") : $element.children("[data-sdl-scrollview-child=true]");

                        var scrollChild = $scrollChild[0];
                        if (!scrollChild) {
                            $scrollChild = $element.wrapInner("<div data-sdl-scrollview-child='true'></div>").children();
                            scrollChild = $scrollChild[0];
                            this.childCreated = true;
                        } else {
                            this.initChildStyleRight = scrollChild.style.right;
                            this.initChildStyleBottom = scrollChild.style.bottom;
                        }
                        this.$scrollChild = $scrollChild;

                        if (!options.overflowX || options.overflowX != "hidden") {
                            $element.addClass("sdl-scrollview-X-scroll");
                        }

                        if (!options.overflowY || options.overflowY != "hidden") {
                            $element.addClass("sdl-scrollview-Y-scroll");
                        }

                        if (options.style && options.style == "dark" && !$element.hasClass("sdl-scrollview-style-dark")) {
                            $element.addClass("sdl-scrollview-style-dark");
                            this.styleApplied = true;
                        }

                        options.overlay = (options.overlay + "") == "true";
                        if (options.overlay) {
                            $element.addClass("sdl-scrollview-overlay");
                            this.overlayApplied = true;
                        }

                        if (SDL.jQuery.browser.msie) {
                            this.scrollButtonSize = 32;
                        }

                        $element.addClass("sdl-scrollview");

                        scrollChild.scrollTop = scrollTop;
                        scrollChild.scrollLeft = scrollLeft;
                        p.element.scrollTop = p.element.scrollLeft = 0;
                        if (isBody) {
                            parent.scrollTop = parent.scrollLeft = 0;
                            SDL.jQuery($element[0].ownerDocument).scroll(this.cancelScroll);
                        }
                        $element.scroll(this.cancelScroll);

                        this.recalculate();

                        // could use ResizeTrigger to detect resize of the element but
                        // there's no event to detect when the size of elements contents have changed -> using interval
                        this.monitoringInterval = window.setInterval(this.getDelegate(this.recalculate), 150);

                        this.onScrollChild();
                        $scrollChild.scroll(this.getDelegate(this.onScrollChild));
                    }
                };

                ScrollView.prototype.update = function (options) {
                    if (options && !SDL.jQuery.browser.macintosh && !SDL.jQuery.browser.mobile) {
                        this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

                        var $element = this.$element;

                        options = this.properties.options;
                        if (options.overflowX) {
                            if (options.overflowX == "hidden") {
                                $element.removeClass("sdl-scrollview-X-scroll");
                            } else {
                                $element.addClass("sdl-scrollview-X-scroll");
                            }
                        }

                        if (options.overflowY) {
                            if (options.overflowY == "hidden") {
                                $element.removeClass("sdl-scrollview-Y-scroll");
                            } else {
                                $element.addClass("sdl-scrollview-Y-scroll");
                            }
                        }

                        if (options.style) {
                            if (options.style == "dark") {
                                if (!this.$element.hasClass("sdl-scrollview-style-dark")) {
                                    $element.addClass("sdl-scrollview-style-dark");
                                    this.styleApplied = true;
                                }
                            } else {
                                $element.removeClass("sdl-scrollview-style-dark");
                                this.styleApplied = false;
                            }
                        }

                        options.overlay = (options.overlay + "") == "true";
                        if (options.overlay) {
                            if (!this.$element.hasClass("sdl-scrollview-overlay")) {
                                $element.addClass("sdl-scrollview-overlay");
                                this.overlayApplied = true;
                            }
                        } else {
                            $element.removeClass("sdl-scrollview-overlay");
                            this.overlayApplied = false;
                        }

                        this.recalculate();
                    }
                };

                ScrollView.prototype.getSecondaryScrollBar = function (direction) {
                    var scrollBar = this.secondaryScrollBars["$" + direction];
                    if (!scrollBar) {
                        scrollBar = this.secondaryScrollBars["$" + direction] = SDL.jQuery("<div class='sdl-scrollview-" + direction + "-scroll-wrapper'><div></div><div></div><div></div><div><div></div></div></div>").appendTo(this.$element).children(":last-child");

                        /*
                        <div>						<!--	sdl-scrollview-[X|Y]-scroll-wrapper		-->
                        <div></div>				<!--	sdl-scrollview-scroll-[up|left]			-->
                        <div></div>				<!--	sdl-scrollview-scroll-[down|right]		-->
                        <div></div>				<!--	sdl-scrollview-scroll-handle			-->
                        <div>					<!--	sdl-scrollview-secondary-scroll			-->
                        <div></div>			<!--	sdl-scrollview-secondary-scroll-content	-->
                        </div>
                        </div>
                        */
                        scrollBar.scroll(this.getDelegate(direction == "X" ? this.onSecondaryScrollX : this.onSecondaryScrollY)).mousemove(this.getDelegate(direction == "X" ? this.onScrollWrapperMouseMoveX : this.onScrollWrapperMouseMoveY)).mousedown(this.getDelegate(direction == "X" ? this.onScrollWrapperMouseDownX : this.onScrollWrapperMouseDownY)).mouseup(this.getDelegate(direction == "X" ? this.onScrollWrapperMouseUpX : this.onScrollWrapperMouseUpY)).mouseleave(this.getDelegate(direction == "X" ? this.onScrollWrapperMouseLeaveX : this.onScrollWrapperMouseLeaveY));

                        if (this.secondaryScrollBars.$X && this.secondaryScrollBars.$Y) {
                            this.$corner = SDL.jQuery("<div class='sdl-scrollview-corner'></div>").appendTo(this.$element);
                        }

                        return scrollBar;
                    } else {
                        return scrollBar;
                    }
                };

                ScrollView.prototype.updateScrollBars = function () {
                    var scrollChild = this.$scrollChild[0];
                    if (scrollChild.offsetHeight && scrollChild.offsetWidth) {
                        var overlay = this.$element.hasClass("sdl-scrollview-overlay");
                        var changed;

                        var scrollBarSizeX = this.scrollXEnabled ? (scrollChild.offsetHeight - this.scrollContentYClientHeight) : 0;
                        var scrollBarChildBottom = (overlay || !scrollBarSizeX || this.scrollXHidden) ? -scrollBarSizeX : (15 - scrollBarSizeX);
                        if (this.scrollBarChildBottom != scrollBarChildBottom) {
                            this.scrollBarChildBottom = scrollBarChildBottom;
                            scrollChild.style.bottom = scrollBarChildBottom + "px";
                            changed = true;
                        }

                        var scrollBarSizeY = this.scrollYEnabled ? (scrollChild.offsetWidth - this.scrollContentXClientWidth) : 0;
                        var scrollBarChildRight = (overlay || !scrollBarSizeY || this.scrollYHidden) ? -scrollBarSizeY : (15 - scrollBarSizeY);
                        if (this.scrollBarChildRight != scrollBarChildRight) {
                            this.scrollBarChildRight = scrollBarChildRight;
                            scrollChild.style.right = scrollBarChildRight + "px";
                            changed = true;
                        }

                        if (changed) {
                            var newScrollBarSizeX = this.scrollXEnabled ? (scrollChild.offsetHeight - scrollChild.clientHeight) : 0;
                            if (newScrollBarSizeX < scrollBarSizeX) {
                                this.scrollBarChildBottom = (overlay || !newScrollBarSizeX || this.scrollXHidden) ? -newScrollBarSizeX : (15 - newScrollBarSizeX);
                            }

                            var newScrollBarSizeY = this.scrollYEnabled ? (scrollChild.offsetWidth - scrollChild.clientWidth) : 0;
                            if (newScrollBarSizeY < scrollBarSizeY) {
                                this.scrollBarChildRight = (overlay || !newScrollBarSizeY || this.scrollYHidden) ? -newScrollBarSizeY : (15 - newScrollBarSizeY);
                            }
                        }
                    }
                };

                ScrollView.prototype.recalculate = function () {
                    var scrollChild = this.$scrollChild[0];
                    if (scrollChild.offsetHeight && scrollChild.offsetWidth) {
                        this.scrollXEnabled = this.$element.hasClass("sdl-scrollview-X-scroll");
                        this.scrollYEnabled = this.$element.hasClass("sdl-scrollview-Y-scroll");

                        var scrollBar;
                        var secondaryContent;
                        var scrollHandle;
                        var xUpdate = false;
                        var yUpdate = false;

                        if (this.scrollXEnabled) {
                            scrollBar = this.getSecondaryScrollBar("X")[0];

                            if (scrollBar.scrollLeft == 0 && this.scrollBarHandleXLeftPosition != this.scrollButtonSize) {
                                this.scrollBarHandleXLeftPosition = this.scrollButtonSize;
                                scrollBar.previousSibling.style.left = this.scrollButtonSize + "px";
                            }

                            secondaryContent = scrollBar.firstChild;

                            if (this.scrollContentXWidth != scrollChild.scrollWidth || this.scrollContentXClientWidth != scrollChild.clientWidth || scrollBar.offsetWidth != this.scrollBarXWidth) {
                                xUpdate = true;
                                this.scrollBarXWidth = scrollBar.offsetWidth;
                                this.scrollContentXWidth = scrollChild.scrollWidth;
                                this.scrollContentXClientWidth = scrollChild.clientWidth;

                                if (this.scrollContentXClientWidth >= (scrollChild.scrollWidth - 1)) {
                                    if (!this.scrollXHidden) {
                                        this.scrollXHidden = true;
                                        this.$element.addClass("sdl-scrollview-X-scroll-hidden");
                                    }
                                } else {
                                    if (this.scrollXHidden) {
                                        this.scrollXHidden = false;
                                        this.$element.removeClass("sdl-scrollview-X-scroll-hidden");
                                    }

                                    this.secondaryToMainRatioX = this.scrollBarXWidth / this.scrollContentXClientWidth;
                                    var contentWidth = Math.round(scrollChild.scrollWidth * this.secondaryToMainRatioX);
                                    if (secondaryContent.offsetWidth != contentWidth) {
                                        secondaryContent.style.width = contentWidth + "px";
                                    }

                                    this.scrollHandleLeftPositionCoefficientX = (this.scrollBarXWidth - this.scrollButtonSize * 2) / contentWidth;
                                    var handleWidth = Math.round(this.scrollHandleLeftPositionCoefficientX * this.scrollBarXWidth);
                                    var handleSpaceCorrectionX;
                                    if (handleWidth < 10) {
                                        handleSpaceCorrectionX = 10 - handleWidth;
                                        handleWidth = 10;
                                        this.scrollHandleLeftPositionCoefficientX -= (handleSpaceCorrectionX / contentWidth);
                                    } else {
                                        handleSpaceCorrectionX = 0;
                                    }

                                    scrollHandle = scrollBar.previousSibling;
                                    if (scrollHandle.offsetWidth != handleWidth) {
                                        this.scrollBarHandleXSize = handleWidth;
                                        scrollHandle.style.width = handleWidth + "px";
                                    }
                                }
                            }
                        } else if (this.scrollYEnabled) {
                            this.scrollContentXWidth = undefined;
                            this.scrollContentXClientWidth = scrollChild.clientWidth;
                        }

                        if (this.scrollYEnabled) {
                            scrollBar = this.getSecondaryScrollBar("Y")[0];
                            secondaryContent = scrollBar.firstChild;

                            if (scrollBar.scrollTop == 0 && this.scrollBarHandleYTopPosition != this.scrollButtonSize) {
                                this.scrollBarHandleYTopPosition = this.scrollButtonSize;
                                scrollBar.previousSibling.style.top = this.scrollButtonSize + "px";
                            }

                            if (this.scrollContentYHeight != scrollChild.scrollHeight || this.scrollContentYClientHeight != scrollChild.clientHeight || scrollBar.offsetHeight != this.scrollBarYHeight) {
                                yUpdate = true;
                                this.scrollBarYHeight = scrollBar.offsetHeight;
                                this.scrollContentYHeight = scrollChild.scrollHeight;
                                this.scrollContentYClientHeight = scrollChild.clientHeight;

                                if (this.scrollContentYClientHeight >= (scrollChild.scrollHeight - 1)) {
                                    if (!this.scrollYHidden) {
                                        this.scrollYHidden = true;
                                        this.$element.addClass("sdl-scrollview-Y-scroll-hidden");
                                    }
                                } else {
                                    if (this.scrollYHidden) {
                                        this.scrollYHidden = false;
                                        this.$element.removeClass("sdl-scrollview-Y-scroll-hidden");
                                    }

                                    this.secondaryToMainRatioY = this.scrollBarYHeight / this.scrollContentYClientHeight;
                                    var contentHeight = Math.round(scrollChild.scrollHeight * this.secondaryToMainRatioY);
                                    if (secondaryContent.offsetHeight != contentHeight) {
                                        secondaryContent.style.height = contentHeight + "px";
                                    }

                                    this.scrollHandleTopPositionCoefficientY = (this.scrollBarYHeight - this.scrollButtonSize * 2) / contentHeight;
                                    var handleHeight = Math.round(this.scrollHandleTopPositionCoefficientY * this.scrollBarYHeight);
                                    var handleSpaceCorrectionY;
                                    if (handleHeight < 10) {
                                        handleSpaceCorrectionY = 10 - handleHeight;
                                        handleHeight = 10;
                                        this.scrollHandleTopPositionCoefficientY -= (handleSpaceCorrectionY / contentHeight);
                                    } else {
                                        handleSpaceCorrectionY = 0;
                                    }

                                    scrollHandle = scrollBar.previousSibling;
                                    if (scrollHandle.offsetHeight != handleHeight) {
                                        this.scrollBarHandleYSize = handleHeight;
                                        scrollHandle.style.height = handleHeight + "px";
                                    }
                                }
                            }
                        } else if (this.scrollXEnabled) {
                            this.scrollContentYHeight = undefined;
                            this.scrollContentYClientHeight = scrollChild.clientHeight;
                        }

                        this.updateScrollBars();

                        if (xUpdate || yUpdate) {
                            this.onScrollChild();
                            if (xUpdate) {
                                this.onSecondaryScrollX();
                            }
                            if (yUpdate) {
                                this.onSecondaryScrollY();
                            }
                        }
                    }
                };

                ScrollView.prototype.cancelScroll = function (e) {
                    var element = e.target;
                    if (element.nodeType == 9) {
                        var html = element.documentElement;
                        html.scrollLeft = html.scrollTop = 0;

                        element = element.body;
                    }
                    element.scrollLeft = element.scrollTop = 0;
                };

                ScrollView.prototype.onScrollChild = function () {
                    var scrollChild = this.$scrollChild[0];
                    var $scrollBar;

                    this.scrollChildLastScrollLeftPosition = scrollChild.scrollLeft;
                    if (this.scrollXEnabled) {
                        $scrollBar = this.getSecondaryScrollBar("X");
                        var scrollBarScrollLeftPosition = $scrollBar.scrollLeft();
                        if (!scrollBarScrollLeftPosition || this.scrollBarLastScrollLeftPosition == scrollBarScrollLeftPosition) {
                            var newSecondatryScrollLeft = Math.round(scrollChild.scrollLeft * this.secondaryToMainRatioX);
                            if (scrollBarScrollLeftPosition != newSecondatryScrollLeft) {
                                $scrollBar.scrollLeft(newSecondatryScrollLeft);
                            }
                        }
                    }

                    this.scrollChildLastScrollTopPosition = scrollChild.scrollTop;
                    if (this.scrollYEnabled) {
                        $scrollBar = this.getSecondaryScrollBar("Y");
                        var scrollBarScrollTopPosition = $scrollBar.scrollTop();
                        if (!scrollBarScrollTopPosition || this.scrollBarLastScrollTopPosition == scrollBarScrollTopPosition) {
                            var newSecondatryScrollTop = Math.round(scrollChild.scrollTop * this.secondaryToMainRatioY);
                            if (scrollBarScrollTopPosition != newSecondatryScrollTop) {
                                $scrollBar.scrollTop(newSecondatryScrollTop);
                            }
                        }
                    }
                };

                ScrollView.prototype.onSecondaryScrollX = function () {
                    var scrollBar = this.getSecondaryScrollBar("X")[0];
                    this.scrollBarLastScrollLeftPosition = scrollBar.scrollLeft;
                    if (this.scrollXEnabled) {
                        var childScrollLeftPosition = this.$scrollChild.scrollLeft();

                        if (!childScrollLeftPosition || this.scrollChildLastScrollLeftPosition == childScrollLeftPosition) {
                            // updating scroll handle position
                            this.scrollBarHandleXLeftPosition = scrollBar.scrollLeft * this.scrollHandleLeftPositionCoefficientX + this.scrollButtonSize;
                            scrollBar.previousSibling.style.left = this.scrollBarHandleXLeftPosition + "px";

                            var newScrollLeft = Math.round(scrollBar.scrollLeft / this.secondaryToMainRatioX);
                            if (childScrollLeftPosition != newScrollLeft) {
                                this.$scrollChild.scrollLeft(newScrollLeft);
                            }
                        }
                    }
                };

                ScrollView.prototype.onSecondaryScrollY = function () {
                    var scrollBar = this.getSecondaryScrollBar("Y")[0];
                    this.scrollBarLastScrollTopPosition = scrollBar.scrollTop;

                    if (this.scrollYEnabled) {
                        var childScrollTopPosition = this.$scrollChild.scrollTop();
                        if (!childScrollTopPosition || this.scrollChildLastScrollTopPosition == childScrollTopPosition) {
                            // updating scroll handle position
                            this.scrollBarHandleYTopPosition = scrollBar.scrollTop * this.scrollHandleTopPositionCoefficientY + this.scrollButtonSize;
                            scrollBar.previousSibling.style.top = this.scrollBarHandleYTopPosition + "px";

                            var newScrollTop = Math.round(scrollBar.scrollTop / this.secondaryToMainRatioY);
                            if (childScrollTopPosition != newScrollTop) {
                                this.$scrollChild.scrollTop(newScrollTop);
                            }
                        }
                    }
                };

                ScrollView.prototype.onScrollWrapperMouseMoveX = function (e) {
                    var left = e.offsetX || e.originalEvent.layerX || 0;
                    var scrollBarWrapper = this.getSecondaryScrollBar("X").parent();

                    if (left < this.scrollButtonSize) {
                        scrollBarWrapper.addClass("hover-left").removeClass("hover-right hover-handle");
                    } else if (left > this.scrollBarXWidth - this.scrollButtonSize) {
                        scrollBarWrapper.addClass("hover-right").removeClass("hover-left hover-handle");
                    } else if (left > this.scrollBarHandleXLeftPosition && left < this.scrollBarHandleXLeftPosition + this.scrollBarHandleXSize) {
                        scrollBarWrapper.addClass("hover-handle").removeClass("hover-left hover-right");
                    } else {
                        scrollBarWrapper.removeClass("hover-left hover-right hover-handle");
                    }

                    if (SDL.jQuery.browser.msie) {
                        scrollBarWrapper.removeClass("pressed-left pressed-right pressed-handle");
                    }
                };

                ScrollView.prototype.onScrollWrapperMouseLeaveX = function (e) {
                    this.getSecondaryScrollBar("X").parent().removeClass("hover-left hover-right hover-handle pressed-left pressed-right pressed-handle");
                };

                ScrollView.prototype.onScrollWrapperMouseDownX = function (e) {
                    var left = e.offsetX || e.originalEvent.layerX || 0;
                    var scrollBarWrapper = this.getSecondaryScrollBar("X").parent();

                    if (left < this.scrollButtonSize) {
                        scrollBarWrapper.addClass("pressed-left");
                    } else if (left > this.scrollBarXWidth - this.scrollButtonSize) {
                        scrollBarWrapper.addClass("pressed-right");
                    } else if (left > this.scrollBarHandleXLeftPosition && left < this.scrollBarHandleXLeftPosition + this.scrollBarHandleXSize) {
                        scrollBarWrapper.addClass("pressed-handle");
                    }
                };

                ScrollView.prototype.onScrollWrapperMouseUpX = function (e) {
                    this.getSecondaryScrollBar("X").parent().removeClass("pressed-left pressed-right pressed-handle");
                };

                ScrollView.prototype.onScrollWrapperMouseMoveY = function (e) {
                    var top = e.offsetY || e.originalEvent.layerY || 0;
                    var scrollBarWrapper = this.getSecondaryScrollBar("Y").parent();

                    if (top < this.scrollButtonSize) {
                        scrollBarWrapper.addClass("hover-up").removeClass("hover-down hover-handle");
                    } else if (top > this.scrollBarYHeight - this.scrollButtonSize) {
                        scrollBarWrapper.addClass("hover-down").removeClass("hover-up hover-handle");
                    } else if (top > this.scrollBarHandleYTopPosition && top < this.scrollBarHandleYTopPosition + this.scrollBarHandleYSize) {
                        scrollBarWrapper.addClass("hover-handle").removeClass("hover-up hover-down");
                    } else {
                        scrollBarWrapper.removeClass("hover-up hover-down hover-handle");
                    }

                    if (SDL.jQuery.browser.msie) {
                        scrollBarWrapper.removeClass("pressed-up pressed-down pressed-handle");
                    }
                };

                ScrollView.prototype.onScrollWrapperMouseLeaveY = function (e) {
                    this.getSecondaryScrollBar("Y").parent().removeClass("hover-up hover-down hover-handle pressed-up pressed-down pressed-handle");
                };

                ScrollView.prototype.onScrollWrapperMouseDownY = function (e) {
                    var top = e.offsetY || e.originalEvent.layerY || 0;
                    var scrollBarWrapper = this.getSecondaryScrollBar("Y").parent();

                    if (top < this.scrollButtonSize) {
                        scrollBarWrapper.addClass("pressed-up");
                    } else if (top > this.scrollBarYHeight - this.scrollButtonSize) {
                        scrollBarWrapper.addClass("pressed-down");
                    } else if (top > this.scrollBarHandleYTopPosition && top < this.scrollBarHandleYTopPosition + this.scrollBarHandleYSize) {
                        scrollBarWrapper.addClass("pressed-handle");
                    }
                };

                ScrollView.prototype.onScrollWrapperMouseUpY = function (e) {
                    this.getSecondaryScrollBar("Y").parent().removeClass("pressed-up pressed-down pressed-handle");
                };

                ScrollView.prototype.cleanUp = function () {
                    if (!SDL.jQuery.browser.macintosh && !SDL.jQuery.browser.mobile) {
                        window.clearInterval(this.monitoringInterval);

                        var $element = this.$element;
                        var isBody = $element.is("body");
                        var scrollChild = this.$scrollChild[0];
                        var scrollTop = scrollChild.scrollTop;
                        var scrollLeft = scrollChild.scrollLeft;

                        // remove event handlers
                        this.$scrollChild.off("scroll", this.removeDelegate(this.onScrollChild));
                        if (isBody) {
                            SDL.jQuery($element[0].ownerDocument).off("scroll", this.cancelScroll);
                        }
                        $element.off("scroll", this.cancelScroll);

                        // remove child elements
                        if (this.secondaryScrollBars.$X) {
                            this.secondaryScrollBars.$X.off("scroll", this.removeDelegate(this.onSecondaryScrollX)).off("mousemove", this.removeDelegate(this.onScrollWrapperMouseMoveX)).off("mousedown", this.removeDelegate(this.onScrollWrapperMouseDownX)).off("mouseup", this.removeDelegate(this.onScrollWrapperMouseUpX)).off("mouseleave", this.removeDelegate(this.onScrollWrapperMouseLeaveX)).parent().remove();
                            this.secondaryScrollBars.$X = null;
                        }

                        if (this.secondaryScrollBars.$Y) {
                            this.secondaryScrollBars.$Y.off("scroll", this.removeDelegate(this.onSecondaryScrollY)).off("mousemove", this.removeDelegate(this.onScrollWrapperMouseMoveY)).off("mousedown", this.removeDelegate(this.onScrollWrapperMouseDownY)).off("mouseup", this.removeDelegate(this.onScrollWrapperMouseUpY)).off("mouseleave", this.removeDelegate(this.onScrollWrapperMouseLeaveY)).parent().remove();
                            this.secondaryScrollBars.$Y = null;
                        }

                        if (this.$corner) {
                            this.$corner.remove();
                        }

                        if (this.childCreated) {
                            this.$element.unwrapInner();
                        } else {
                            scrollChild.style.bottom = this.initChildStyleBottom;
                            scrollChild.style.right = this.initChildStyleRight;
                        }

                        // restore styles
                        $element.removeClass("sdl-scrollview sdl-scrollview-X-scroll sdl-scrollview-X-scroll-hidden sdl-scrollview-Y-scroll sdl-scrollview-Y-scroll-hidden sdl-scrollview");

                        if (this.styleApplied) {
                            $element.removeClass("sdl-scrollview-style-dark");
                        }

                        if (this.overlayApplied) {
                            $element.removeClass("sdl-scrollview-overlay");
                        }

                        // keep scroll position
                        var $scrollElement = isBody ? $element.parent().addBack() : $element;
                        if (scrollTop) {
                            $scrollElement.scrollTop(scrollTop);
                        }

                        if (scrollLeft) {
                            $scrollElement.scrollLeft(scrollLeft);
                        }

                        this.$element = this.$scrollChild = this.$corner = null;
                    }
                };
                return ScrollView;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.ScrollView = ScrollView;

            ScrollView.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function disposeInterface() {
                this.cleanUp();
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.ScrollView", ScrollView);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
