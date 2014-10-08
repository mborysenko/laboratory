/// <reference path="../../../SDL.Client.UI.Core/Views/ViewBase.d.ts" />
/// <reference path="../../../SDL.Client.UI.Core.Knockout/ViewModels/ViewModelBase.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Views) {
            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var ErrorPage = (function (_super) {
                __extends(ErrorPage, _super);
                function ErrorPage() {
                    _super.apply(this, arguments);
                }
                ErrorPage.prototype.getRenderOptions = function () {
                    var model = this._viewModel = new SDL.UI.Core.Knockout.ViewModels.ViewModelBase();
                    model.title = this.properties.settings.title || null;
                    model.description = this.properties.settings.description || null;
                    model.details = this.properties.settings.details || null;

                    model.detailsShown = ko.observable(false);
                    model.showDetails = function () {
                        model.detailsShown(true);
                    };
                    model.hideDetails = function () {
                        model.detailsShown(false);
                    };

                    return model;
                };
                return ErrorPage;
            })(SDL.UI.Core.Views.ViewBase);
            Views.ErrorPage = ErrorPage;

            ErrorPage.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function disposeInterface() {
                if (this._viewModel) {
                    this._viewModel.dispose();
                    this._viewModel = null;
                }
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Views.ErrorPage", ErrorPage);
        })(UI.Views || (UI.Views = {}));
        var Views = UI.Views;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=ErrorPage.js.map
