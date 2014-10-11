﻿/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
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
            (function (MessageType) {
                MessageType[MessageType["INFO"] = "info"] = "INFO";
                MessageType[MessageType["QUESTION"] = "question"] = "QUESTION";
                MessageType[MessageType["WARNING"] = "warning"] = "WARNING";
                MessageType[MessageType["ERROR"] = "error"] = "ERROR";
                MessageType[MessageType["PROGRESS"] = "progress"] = "PROGRESS";
                MessageType[MessageType["GOAL"] = "goal"] = "GOAL";
            })(Controls.MessageType || (Controls.MessageType = {}));
            var MessageType = Controls.MessageType;

            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var Message = (function (_super) {
                __extends(Message, _super);
                function Message(element, options) {
                    _super.call(this, element, options || {});
                }
                Message.prototype.$initialize = function () {
                    this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

                    var p = this.properties;
                    var $element = this.$element = SDL.jQuery(p.element);
                    p.options = SDL.jQuery.extend({}, p.options);

                    if (p.options.title) {
                        this.$title = SDL.jQuery("<div class='sdl-message-title'></div>").prependTo($element).text(p.options.title);
                    }

                    if (p.options.type) {
                        $element.addClass("sdl-message-" + p.options.type);
                    }

                    $element.addClass("sdl-message");
                };

                Message.prototype.update = function (options) {
                    var p = this.properties;
                    var prevOptions = p.options;
                    options = SDL.jQuery.extend({}, options);

                    this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

                    if (p.options.title != prevOptions.title) {
                        if (p.options.title) {
                            if (!this.$title) {
                                this.$title = SDL.jQuery("<div class='sdl-message-title'></div>").prependTo(this.$element);
                            }
                            this.$title.text(p.options.title);
                        } else if (this.$title) {
                            this.$title.remove();
                            this.$title = null;
                        }
                    }

                    if (p.options.type != prevOptions.type) {
                        if (prevOptions.type) {
                            this.$element.removeClass("sdl-message-" + prevOptions.type);
                        }

                        if (p.options.type) {
                            this.$element.addClass("sdl-message-" + p.options.type);
                        }
                    }
                };

                Message.prototype.cleanUp = function () {
                    var $element = this.$element;
                    var options = this.properties.options;

                    this.$element.removeClass("sdl-message sdl-message-info sdl-message-question sdl-message-warning sdl-message-error sdl-message-progress sdl-message-goal");

                    if (this.$title) {
                        this.$title.remove();
                        this.$title = null;
                    }

                    this.$element = null;
                };
                return Message;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.Message = Message;

            Message.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Message$disposeInterface() {
                this.cleanUp();
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Message", Message);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=Message.js.map
