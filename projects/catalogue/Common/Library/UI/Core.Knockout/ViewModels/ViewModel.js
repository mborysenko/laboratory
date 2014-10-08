/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Models/Models.d.ts" />
/// <reference path="ViewModelBase.ts" />
/// <reference path="ViewModelItem.ts" />
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
            (function (Knockout) {
                (function (ViewModels) {
                    eval(SDL.Client.Types.OO.enableCustomInheritance);
                    var ViewModel = (function (_super) {
                        __extends(ViewModel, _super);
                        function ViewModel(item, view) {
                            _super.call(this, view);
                            this.item = item;
                        }
                        return ViewModel;
                    })(ViewModels.ViewModelBase);
                    ViewModels.ViewModel = ViewModel;

                    ViewModel.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Core$ViewModels$Knockout$ViewModel$disposeInterface() {
                        if (this.item) {
                            //(<ViewModelItem>this.item).dispose();	// the responsibility to dispose the view model item is on the one who has created it
                            this.item = undefined;
                        }
                    });

                    SDL.Client.Types.OO.createInterface("SDL.UI.Core.Knockout.ViewModels.ViewModel", ViewModel);
                })(Knockout.ViewModels || (Knockout.ViewModels = {}));
                var ViewModels = Knockout.ViewModels;
            })(Core.Knockout || (Core.Knockout = {}));
            var Knockout = Core.Knockout;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=ViewModel.js.map
