/// <reference path="../../../SDL.Client.Core/Application/Application.d.ts" />
/// <reference path="../../../SDL.Client.UI.Core.Knockout/ViewModels/ViewModelBase.d.ts" />
/// <reference path="../../../SDL.Client.UI.Controls/TopBar/Application/TopBar.d.ts" />
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
            (function (Knockout) {
                (function (Application) {
                    (function (ViewModels) {
                        ;

                        eval(SDL.Client.Types.OO.enableCustomInheritance);
                        var TopBar = (function (_super) {
                            __extends(TopBar, _super);
                            function TopBar(ribbonTabs, selectedRibbonTabId, buttons) {
                                _super.call(this);

                                this.ribbonTabs = ko.observableArray(ribbonTabs || []);
                                this.selectedRibbonTabId = ko.isObservable(this.selectedRibbonTabId) ? selectedRibbonTabId : ko.observable(selectedRibbonTabId);
                                this.buttons = buttons;
                            }
                            TopBar.prototype.$initialize = function () {
                                SDL.Client.Event.EventRegister.addEventHandler(SDL.UI.Controls.Application.TopBar, "*", this.getDelegate(this.onTopBarEvent));
                                this.computedOptions = ko.computed(this.getDelegate(this.pushTopBarOptions));
                            };

                            TopBar.prototype.pushTopBarOptions = function () {
                                var topBarOptions = {
                                    ribbonTabs: SDL.UI.Core.Knockout.Utils.unwrapRecursive(this.ribbonTabs),
                                    selectedRibbonTabId: this.selectedRibbonTabId(),
                                    buttons: SDL.UI.Core.Knockout.Utils.unwrapRecursive(this.buttons)
                                };
                                SDL.UI.Controls.Application.TopBar.setOptions(topBarOptions);
                                return topBarOptions;
                            };

                            TopBar.prototype.onTopBarEvent = function (e) {
                                switch (e.type) {
                                    case "ribbonselectionchange":
                                        this.selectedRibbonTabId(e.data.id);
                                        break;
                                    case "clickbutton":
                                        if (e.data.button == "close" && this.onCloseClick) {
                                            this.onCloseClick();
                                        }
                                        break;
                                    case "showbutton":
                                        var buttonOptions = this.buttons[e.data.button];
                                        if (buttonOptions) {
                                            if (e.data.button == "close") {
                                                if (ko.isObservable(this.buttons.close)) {
                                                    this.buttons.close(true);
                                                }
                                            } else if (ko.isObservable(buttonOptions.hidden)) {
                                                buttonOptions.hidden(false);
                                            }
                                        }
                                        break;
                                    case "hidebutton":
                                        var buttonOptions = this.buttons[e.data.button];
                                        if (buttonOptions) {
                                            if (e.data.button == "close") {
                                                if (ko.isObservable(this.buttons.close)) {
                                                    this.buttons.close(false);
                                                }
                                            } else if (ko.isObservable(buttonOptions.hidden)) {
                                                buttonOptions.hidden(true);
                                            }
                                        }
                                        break;
                                    case "selectbutton":
                                        var buttonOptions = this.buttons[e.data.button];
                                        if (buttonOptions && ko.isObservable(buttonOptions.selected)) {
                                            buttonOptions.selected(true);
                                        }
                                        break;
                                    case "unselectbutton":
                                        var buttonOptions = this.buttons[e.data.button];
                                        if (buttonOptions && ko.isObservable(buttonOptions.selected)) {
                                            buttonOptions.selected(false);
                                        }
                                        break;
                                    case "positionbutton":
                                        var buttonOptions = this.buttons[e.data.button];
                                        if (buttonOptions) {
                                            if (ko.isObservable(buttonOptions.position.left)) {
                                                buttonOptions.position.left(e.data.position.left);
                                            }
                                            if (ko.isObservable(buttonOptions.position.right)) {
                                                buttonOptions.position.right(e.data.position.right);
                                            }
                                        }
                                        break;
                                }
                            };
                            return TopBar;
                        })(SDL.UI.Core.Knockout.ViewModels.ViewModelBase);
                        ViewModels.TopBar = TopBar;

                        TopBar.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function disposeInterface() {
                            var _this = this;

                            if (_this.computedOptions) {
                                _this.computedOptions.dispose();
                                _this.computedOptions = null;
                            }
                        });

                        SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Knockout.Application.ViewModels.TopBar", TopBar);
                    })(Application.ViewModels || (Application.ViewModels = {}));
                    var ViewModels = Application.ViewModels;
                })(Knockout.Application || (Knockout.Application = {}));
                var Application = Knockout.Application;
            })(Controls.Knockout || (Controls.Knockout = {}));
            var Knockout = Controls.Knockout;
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
