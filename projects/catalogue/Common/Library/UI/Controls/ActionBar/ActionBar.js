﻿/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
/// <reference path="../Button/Button.jQuery.ts" />
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
            var ActionBar = (function (_super) {
                __extends(ActionBar, _super);
                function ActionBar(element, options) {
                    _super.call(this, element, options || {});
                }
                ActionBar.prototype.$initialize = function () {
                    this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

                    var p = this.properties;
                    var $element = this.$element = SDL.jQuery(p.element);
                    p.options = SDL.jQuery.extend({}, p.options);

                    if (p.options.actions && p.options.actions.length || p.options.actionFlag) {
                        if (p.options.actionFlag) {
                            this.createActionsFlagCheckbox();
                        }

                        if (p.options.actions) {
                            var $lastInsertedElement;
                            var isCancelAdded = false;
                            for (var i = p.options.actions.length - 1; i >= 0; i--) {
                                var actionOptions = p.options.actions[i];
                                if (!isCancelAdded && actionOptions.action == "cancel") {
                                    isCancelAdded = true;
                                    var $insertElement = this.insertActionButton(actionOptions, null, p.options.actions.length > 2);
                                    if (!$lastInsertedElement) {
                                        $lastInsertedElement = $insertElement;
                                    }
                                } else {
                                    $lastInsertedElement = this.insertActionButton(actionOptions, $lastInsertedElement);
                                }
                            }
                        }
                    }

                    $element.addClass("sdl-actionbar");
                };

                ActionBar.prototype.update = function (options) {
                    var p = this.properties;
                    var prevOptions = p.options;
                    options = SDL.jQuery.extend({}, options);

                    this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

                    if ((!p.options.actions || !p.options.actions.length) && !p.options.actionFlag) {
                        this.removeActionButtons();
                    } else {
                        var $actions;

                        // we'll try to keep the existing buttons
                        var $lastInsertedElement;
                        var $prevButton;
                        var $lastCancelButton;
                        var $cancelSeparator;

                        var $buttons = this.$element.children("button");

                        if ($buttons.length) {
                            var $lastButton = $prevButton = $buttons.last();
                            if ($lastButton.length && $lastButton.data("action").action == "cancel") {
                                $lastCancelButton = $lastInsertedElement = $lastButton;
                                $prevButton = $lastButton.prev();
                                if (!$prevButton.is("button")) {
                                    if ($prevButton.is("div")) {
                                        $lastInsertedElement = $cancelSeparator = $prevButton;
                                        $prevButton = $cancelSeparator.prev("button");
                                    } else {
                                        $prevButton = null;
                                    }
                                }
                            }
                        }

                        if (p.options.actionFlag) {
                            if (!this.$actionFlagCheckbox) {
                                this.createActionsFlagCheckbox();
                            } else {
                                if (p.options.actionFlag.selected != null) {
                                    var checked = p.options.actionFlag.selected && p.options.actionFlag.selected.toString() != "false";
                                    if (this.$actionFlagCheckbox[0].checked != checked) {
                                        this.$actionFlagCheckbox[0].checked = checked;
                                    }
                                }

                                if (p.options.actionFlag.label != null) {
                                    var span = this.$actionFlagCheckbox.next("span");
                                    if (span.text() != p.options.actionFlag.label) {
                                        span.text(p.options.actionFlag.label);
                                    }
                                }
                            }
                        } else {
                            this.removeActionsFlagCheckbox();
                        }

                        if (p.options.actions) {
                            var isCancelAdded = false;
                            for (var i = p.options.actions.length - 1; i >= 0; i--) {
                                var actionOptions = p.options.actions[i];
                                if (!isCancelAdded && actionOptions.action == "cancel") {
                                    isCancelAdded = true;
                                    var $insertElement;

                                    if ($lastCancelButton) {
                                        this.updateButtonData($lastCancelButton, actionOptions);
                                        $insertElement = (!$cancelSeparator && p.options.actions.length > 2) ? this.insertSeparator($lastCancelButton) : $lastCancelButton;

                                        if (!$lastInsertedElement || $lastInsertedElement == $lastCancelButton) {
                                            $lastInsertedElement = $insertElement;
                                        }
                                    } else {
                                        $insertElement = this.insertActionButton(actionOptions, null, p.options.actions.length > 2);
                                        if (!$lastInsertedElement) {
                                            $lastInsertedElement = $insertElement;
                                        }
                                    }
                                } else if ($prevButton && $prevButton.length) {
                                    this.updateButtonData($prevButton, actionOptions);
                                    $lastInsertedElement = $prevButton;
                                    $prevButton = $prevButton.prev("button");
                                } else {
                                    $lastInsertedElement = this.insertActionButton(actionOptions, $lastInsertedElement);
                                }
                            }
                        }

                        if ($lastCancelButton && !isCancelAdded) {
                            this.removeActionButton($lastCancelButton);
                        }

                        if ($cancelSeparator && (!isCancelAdded || p.options.actions.length <= 2)) {
                            $cancelSeparator.remove();
                        }

                        if ($prevButton) {
                            this.removeActionButton($prevButton.prevAll("button").addBack());
                        }
                    }
                };

                ActionBar.prototype.getActionFlag = function () {
                    return this.$actionFlagCheckbox ? (this.$actionFlagCheckbox[0].checked) : null;
                };

                ActionBar.prototype.createActionsFlagCheckbox = function () {
                    if (!this.$actionFlagCheckbox) {
                        var actionFlagData = this.properties.options.actionFlag;

                        var $actionsFlagLabel = SDL.jQuery("<label></label>").prependTo(this.$element);
                        var $actionsFlagText = SDL.jQuery("<span></span>").appendTo($actionsFlagLabel).text(actionFlagData.label || "");
                        this.$actionFlagCheckbox = SDL.jQuery("<input type='checkbox' />").attr("checked", actionFlagData.selected && actionFlagData.selected.toString() != "false").click(this.getDelegate(this.onActionFlagClick)).prependTo($actionsFlagLabel);
                    }
                };

                ActionBar.prototype.removeActionsFlagCheckbox = function () {
                    if (this.$actionFlagCheckbox) {
                        this.$actionFlagCheckbox.off("click", this.removeDelegate(this.onActionFlagClick)).parent().remove();
                        this.$actionFlagCheckbox = null;
                    }
                };

                ActionBar.prototype.onActionFlagClick = function (e) {
                    if (this.$actionFlagCheckbox) {
                        this.fireEvent("actionflagchange", { actionFlag: this.$actionFlagCheckbox[0].checked });
                        this.fireEvent("propertychange", { property: "actionFlag.selected", value: this.$actionFlagCheckbox[0].checked });
                    }
                };

                ActionBar.prototype.onActionClick = function (e) {
                    if (this.properties.options.actions) {
                        var button = e.target;
                        var action = SDL.jQuery(button.getElement()).data("action");
                        if (action) {
                            if (SDL.Client.Type.isFunction(action.handler)) {
                                action.handler();
                            }
                            this.fireEvent("action", {
                                action: action.action,
                                actionFlag: this.getActionFlag()
                            });
                        }
                    }
                };

                ActionBar.prototype.insertActionButton = function (actionOptions, $insertBefore, insertSeparator) {
                    if (typeof insertSeparator === "undefined") { insertSeparator = false; }
                    var $button = SDL.jQuery("<button></button>");

                    if ($insertBefore) {
                        $button.insertBefore($insertBefore);
                    } else {
                        this.$element.append($button);
                    }

                    this.addButtonData($button, actionOptions);
                    $button.button({
                        disabled: actionOptions.disabled,
                        iconClass: actionOptions.iconClass,
                        purpose: actionOptions.purpose
                    }).click(this.getDelegate(this.onActionClick));

                    return insertSeparator ? this.insertSeparator($button) : $button;
                };

                ActionBar.prototype.insertSeparator = function ($button) {
                    return SDL.jQuery("<div></div>").insertBefore($button);
                };

                ActionBar.prototype.addButtonData = function ($button, actionOptions) {
                    $button.data("action", { handler: actionOptions.handler, action: actionOptions.action }).text(actionOptions.title);
                };

                ActionBar.prototype.updateButtonData = function ($button, actionOptions) {
                    var data = $button.data("action");
                    data.handler = actionOptions.handler;
                    data.action = actionOptions.action;
                    data.disabled = actionOptions.disabled;
                    data.iconClass = SDL.jQuery.extend({}, actionOptions.iconClass);
                    if ($button.text() != actionOptions.title) {
                        $button.text(actionOptions.title);
                    }

                    $button.button({
                        disabled: actionOptions.disabled,
                        iconClass: actionOptions.iconClass,
                        purpose: actionOptions.purpose
                    });
                };

                ActionBar.prototype.removeActionButtons = function () {
                    this.removeActionsFlagCheckbox();
                    this.removeActionButton(this.$element.children("button"));
                    this.$element.empty();
                };

                ActionBar.prototype.removeActionButton = function ($button) {
                    $button.button().off("click", this.getDelegate(this.onActionClick)).dispose().removeData().remove();
                };

                ActionBar.prototype.cleanUp = function () {
                    var $element = this.$element;
                    var options = this.properties.options;

                    this.$element.removeClass("sdl-actionbar");

                    this.removeActionButtons();

                    this.$element = null;
                };
                return ActionBar;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.ActionBar = ActionBar;

            ActionBar.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$ActionBar$disposeInterface() {
                this.cleanUp();
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.ActionBar", ActionBar);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=ActionBar.js.map
