/// <reference path="../../SDL.Client.UI.Core/Controls/FocusableControlBase.d.ts" />
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
            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var Dialog = (function (_super) {
                __extends(Dialog, _super);
                function Dialog(element, options) {
                    _super.call(this, element, options || {});
                }
                Dialog.prototype.$initialize = function () {
                    this.callBase("SDL.UI.Core.Controls.FocusableControlBase", "$initialize");

                    var p = this.properties;
                    var $element = this.$element = SDL.jQuery(p.element);

                    $element.addClass("sdl-dialog");

                    if (p.options.title) {
                        this.createHeaderBar();
                    }

                    if (p.options.actions && p.options.actions.length || p.options.actionFlag) {
                        this.createActionBar();
                    }

                    if (p.options.visible != null && p.options.visible.toString() == "false") {
                        this.hide();
                    } else {
                        this.show();
                    }
                };

                Dialog.prototype.update = function (options) {
                    this.callBase("SDL.UI.Core.Controls.FocusableControlBase", "update", [options]);

                    var p = this.properties;

                    if (p.options.visible != null && p.options.visible.toString() == "false") {
                        if ((!p.options.actions || !p.options.actions.length) && !p.options.actionFlag) {
                            this.removeActionBar();
                        }
                        this.hide();
                    } else if (p.options.visible || this.isVisible) {
                        if (p.options.title) {
                            this.createHeaderBar();
                        } else {
                            this.removeHeaderBar();
                        }

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

                Dialog.prototype.show = function () {
                    var _this = this;
                    if (this.isVisible != true) {
                        this.isVisible = true;

                        SDL.UI.Core.Css.ZIndexManager.setNextZIndex(this.properties.element, true);
                        Dialog.shownDialogs.push(this);

                        Dialog.updateScreen();

                        setTimeout(function () {
                            _this.$element.removeClass("sdl-dialog-hidden").keydown(_this.getDelegate(_this.onKeyDown));
                            _this.position();
                            SDL.jQuery(window).on("resize", _this.getDelegate(_this.position));
                            _this.startCaptureFocus();
                            _this.fireEvent("propertychange", { property: "visible", value: true });
                            _this.fireEvent("show");
                        });
                    }
                };

                Dialog.prototype.hide = function () {
                    if (this.isVisible != false) {
                        this.isVisible = false;
                        this.$element.addClass("sdl-dialog-hidden");
                        this.onHide();
                        this.fireEvent("propertychange", { property: "visible", value: false });
                        this.fireEvent("hide");
                    }
                };

                Dialog.prototype.createHeaderBar = function () {
                    var options = this.properties.options;
                    if (!this.$header) {
                        this.$header = SDL.jQuery("<div class='sdl-dialog-header'><label></label><button>&times;</button></div>").prependTo(this.$element);
                        this.$header.children("button").button().click(this.getDelegate(this.executeCloseAction));
                    }
                    this.$header.children(":first-child").text(options.title || "");
                };

                Dialog.prototype.removeHeaderBar = function () {
                    if (this.$header) {
                        this.$header.children("button").button().off("click", this.getDelegate(this.executeCloseAction)).dispose();

                        this.$header.remove();
                        this.$header = null;
                    }
                };

                Dialog.prototype.position = function () {
                    var body = document.body;
                    var element = this.properties.element;

                    element.style.left = ((body.clientWidth - element.offsetWidth) >> 1) + "px"; // >> 1 is division by 2
                    element.style.top = ((body.clientHeight - element.offsetHeight) >> 1) + "px";
                };

                Dialog.prototype.onHide = function () {
                    SDL.jQuery(window).off("resize", this.getDelegate(this.position));
                    this.stopCaptureFocus();
                    this.$element.off("keydown", this.getDelegate(this.onKeyDown));

                    SDL.UI.Core.Css.ZIndexManager.releaseZIndex(this.properties.element);

                    var index = Dialog.shownDialogs.indexOf(this);
                    if (index != -1) {
                        Dialog.shownDialogs.splice(index, 1);
                    }

                    Dialog.updateScreen();
                };

                Dialog.prototype.handleFocusOut = function () {
                    if (Dialog.getTopmostDialog() == this) {
                        this.$element.focus();
                    }
                };

                Dialog.prototype.getActionsFlag = function () {
                    return this.$actionbar ? this.$actionbar.actionBar().getActionFlag() : null;
                };

                Dialog.prototype.onKeyDown = function (e) {
                    if (e.which == 27 /* ESCAPE */) {
                        e.stopPropagation();
                        this.executeCloseAction();
                    }
                };

                Dialog.prototype.executeCloseAction = function () {
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

                Dialog.prototype.createActionBar = function () {
                    var options = this.properties.options;
                    this.$actionbar = SDL.jQuery("<div class='sdl-dialog-actionbar'></div>").actionBar({ actions: options.actions, actionFlag: options.actionFlag }).on("action", this.getDelegate(this.onActionBarAction)).on("actionflagchange", this.getDelegate(this.onActionBarActionFlagChange)).end().appendTo(this.$element);
                };

                Dialog.prototype.onActionBarAction = function (e) {
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

                Dialog.prototype.onActionBarActionFlagChange = function (e) {
                    this.fireEvent("actionflagchange", { actionsFlag: e.originalEvent.data.actionFlag });
                    this.fireEvent("propertychange", { property: "actionFlag.selected", value: e.originalEvent.data.actionFlag });
                };

                Dialog.prototype.removeActionBar = function () {
                    if (this.$actionbar) {
                        this.$actionbar.actionBar().off("action", this.removeDelegate(this.onActionBarAction)).off("actionflagchange", this.removeDelegate(this.onActionBarActionFlagChange)).dispose().remove();
                        this.$actionbar = null;
                    }
                };

                Dialog.updateScreen = function () {
                    if (Dialog.shownDialogs.length) {
                        if (!Dialog.$screen) {
                            Dialog.$screen = SDL.jQuery("<div class='sdl-dialog-screen'></div>");
                        }

                        var topmostDialogElement = Dialog.getTopmostDialog().getElement();
                        var screen = Dialog.$screen[0];

                        SDL.UI.Core.Css.ZIndexManager.insertZIndexBefore(screen, topmostDialogElement);
                        if (screen.parentElement != topmostDialogElement.parentElement) {
                            topmostDialogElement.parentElement.insertBefore(screen, topmostDialogElement.parentElement.firstChild);
                        }

                        try  {
                            topmostDialogElement.focus();
                        } catch (err) {
                        }
                    } else if (Dialog.$screen) {
                        SDL.UI.Core.Css.ZIndexManager.releaseZIndex(Dialog.$screen[0]);
                        Dialog.$screen.remove();
                        Dialog.$screen = null;
                    }
                };

                Dialog.getTopmostDialog = function () {
                    var topmostDialog;
                    var topmostDialogElement;
                    if (Dialog.shownDialogs.length) {
                        var newZIndex = -1;
                        for (var i = Dialog.shownDialogs.length - 1; i >= 0; i--) {
                            var dialogElement = Dialog.shownDialogs[i].getElement();
                            var zIndex = SDL.UI.Core.Css.ZIndexManager.getZIndex(dialogElement);
                            if (zIndex > newZIndex) {
                                topmostDialog = Dialog.shownDialogs[i];
                                topmostDialogElement = dialogElement;
                                newZIndex = zIndex;
                            }
                        }
                    }
                    return topmostDialog;
                };

                Dialog.prototype.cleanUp = function () {
                    var $element = this.$element;

                    this.onHide();
                    this.removeHeaderBar();
                    this.removeActionBar();
                    $element.removeClass("sdl-dialog sdl-dialog-hidden");

                    this.$element = null;
                };
                Dialog.shownDialogs = [];
                return Dialog;
            })(SDL.UI.Core.Controls.FocusableControlBase);
            Controls.Dialog = Dialog;

            Dialog.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Dialog$disposeInterface() {
                this.cleanUp();
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Dialog", Dialog);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
