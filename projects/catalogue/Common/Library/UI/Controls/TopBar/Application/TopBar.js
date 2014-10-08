/// <reference path="../../../SDL.Client.Core/Application/Application.d.ts" />
/// <reference path="../../../SDL.Client.Core/Application/ApplicationHost.d.ts" />
/// <reference path="../../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../TopBar.ts" />
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
            (function (Application) {
                var topBar;

                eval(SDL.Client.Types.OO.enableCustomInheritance);
                var TopBarClass = (function (_super) {
                    __extends(TopBarClass, _super);
                    function TopBarClass() {
                        _super.apply(this, arguments);
                    }
                    TopBarClass.prototype.$initialize = function () {
                        var _this = this;
                        this.callBase("SDL.Client.Types.ObjectWithEvents", "$initialize");
                        if (SDL.Client.Application.isHosted && SDL.Client.Application.ApplicationHost.isSupported("showTopBar")) {
                            SDL.Client.Application.ApplicationHost.addEventListener("topbarevent", this.getDelegate(function (e) {
                                _this.fireEvent(e.data.type, e.data.data);
                            }));
                            SDL.Client.Application.ApplicationHost.showTopBar();
                        } else {
                            topBar = null;
                            var topBarElement = document.createElement("div");
                            document.body.appendChild(topBarElement);

                            SDL.Client.Resources.ResourceManager.load("SDL.UI.Controls.TopBar", function () {
                                var options;
                                if (_this.optionsToApply) {
                                    options = _this.optionsToApply;
                                    _this.optionsToApply = null;
                                }

                                SDL.UI.Core.Renderers.ControlRenderer.renderControl("SDL.UI.Controls.TopBar", topBarElement, options, function (control) {
                                    topBar = control;
                                    SDL.Client.Event.EventRegister.addEventHandler(window, "unload", function () {
                                        topBar.dispose();
                                    });
                                    SDL.Client.Event.EventRegister.addEventHandler(topBar, "*", _this.getDelegate(function (e) {
                                        _this.fireEvent(e.type, e.data);
                                    }));

                                    if (_this.optionsToApply) {
                                        topBar.update(_this.optionsToApply);
                                        _this.optionsToApply = null;
                                    }
                                });
                            });
                        }
                    };

                    TopBarClass.prototype.setOptions = function (options) {
                        if (topBar === undefined) {
                            SDL.Client.Application.ApplicationHost.setTopBarOptions(options);
                        } else if (topBar) {
                            topBar.update(options);
                        } else {
                            this.optionsToApply = options;
                        }
                    };
                    return TopBarClass;
                })(SDL.Client.Types.ObjectWithEvents);
                Application.TopBarClass = TopBarClass;

                SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Application.TopBarClass", TopBarClass);

                // using [new SDL.UI.Controls.Application["TopBarClass"]()] instead of [new TopBarClass()]
                // because [new TopBarClass()] would refer to the closure, not the interface defined in the line above
                Application.TopBar = new SDL.UI.Controls.Application["TopBarClass"]();
            })(Controls.Application || (Controls.Application = {}));
            var Application = Controls.Application;
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=TopBar.js.map
