// http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (UI) {
        /// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
        (function (Controls) {
            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var ResizeTrigger = (function (_super) {
                __extends(ResizeTrigger, _super);
                function ResizeTrigger(element, options) {
                    _super.call(this, element, options);
                }
                ResizeTrigger.prototype.$initialize = function () {
                    this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

                    this.scrollTriggers = SDL.jQuery("<div class='sdl-resizetrigger-triggers'><div><div></div></div><div></div></div>").appendTo(this.properties.element)[0];

                    this.prevWidth = this.properties.element.offsetWidth;
                    this.prevHeight = this.properties.element.offsetHeight;
                    this.resetTriggers();

                    this.executeAfterDelay = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || (function (fn) {
                        return window.setTimeout(fn, 20);
                    })).bind(window);
                    this.cancelExecuteAfterDelay = (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout).bind(window);

                    this.scrollTriggers.addEventListener("scroll", this.getDelegate(this.onScroll), true);
                };

                ResizeTrigger.prototype.resetTriggers = function () {
                    if (!this.resettingTriggers) {
                        this.resettingTriggers = true;

                        // when element is increased in size -> scroll position in 'expand' element will become 0
                        // as the contained 'expandChild' element (initialliy 1 px larger) will fit into the dimentions of 'expand' element
                        // -> it will trigger scroll event
                        var expand = this.scrollTriggers.firstElementChild;
                        var expandChild = expand.firstElementChild;

                        expandChild.style.width = expand.offsetWidth + 1 + 'px';
                        expandChild.style.height = expand.offsetHeight + 1 + 'px';
                        expand.scrollLeft = expand.scrollWidth; // initialize to > 0
                        expand.scrollTop = expand.scrollHeight; // initialize to > 0

                        // when element is reduced in size, scroll position will be reduced -> will trigger scroll event
                        var contract = this.scrollTriggers.lastElementChild;
                        contract.scrollLeft = contract.scrollWidth; // initialize to maximum
                        contract.scrollTop = contract.scrollHeight; // initialize to maximum

                        this.resettingTriggers = false;
                    }
                };

                ResizeTrigger.prototype.onScroll = function (e) {
                    if (!this.resettingTriggers) {
                        if (this.afterScrollExecuteRequest) {
                            this.cancelExecuteAfterDelay(this.afterScrollExecuteRequest);
                        }

                        this.afterScrollExecuteRequest = this.executeAfterDelay(this.getDelegate(this.onAfterScroll));
                    }
                };

                ResizeTrigger.prototype.onAfterScroll = function () {
                    this.afterScrollExecuteRequest = null;
                    this.resetTriggers();
                    if (this.isSizeChanged()) {
                        this.prevWidth = this.properties.element.offsetWidth;
                        this.prevHeight = this.properties.element.offsetHeight;
                        this.fireEvent("resize");
                    }
                };

                ResizeTrigger.prototype.isSizeChanged = function () {
                    return this.properties.element.offsetWidth != this.prevWidth || this.properties.element.offsetHeight != this.prevHeight;
                };

                ResizeTrigger.prototype.cleanUp = function () {
                    if (this.scrollTriggers) {
                        this.scrollTriggers.removeEventListener("scroll", this.removeDelegate(this.onScroll), true);
                        if (this.afterScrollExecuteRequest) {
                            this.cancelExecuteAfterDelay(this.afterScrollExecuteRequest);
                        }
                        SDL.jQuery(this.scrollTriggers).remove();
                        this.scrollTriggers = null;
                    }
                };
                return ResizeTrigger;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.ResizeTrigger = ResizeTrigger;

            ResizeTrigger.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$ResizeTrigger$disposeInterface() {
                this.cleanUp();
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.ResizeTrigger", ResizeTrigger);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=ResizeTrigger.js.map
