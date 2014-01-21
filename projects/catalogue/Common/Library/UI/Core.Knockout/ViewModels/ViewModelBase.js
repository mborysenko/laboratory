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
                /// <reference path="..\..\SDL.Client.Core\Types\Types.d.ts" />
                /// <reference path="..\..\SDL.Client.Core\Types\DisposableObject.d.ts" />
                /// <reference path="..\..\SDL.Client.Core\Libraries\Globalize\SDL.Globalize.d.ts" />
                /// <reference path="..\..\SDL.Client.Core\Event\EventRegister.d.ts" />
                /// <reference path="..\Libraries\knockout\knockout.d.ts" />
                (function (ViewModels) {
                    eval(SDL.Client.Types.OO.enableCustomInheritance);

                    var culture = ko.observable(SDL.Globalize.culture().name);
                    SDL.Client.Event.EventRegister.addEventHandler(SDL.Globalize, "culturechange", function (e) {
                        culture(e.data.culture);
                    });

                    var ViewModelBase = (function (_super) {
                        __extends(ViewModelBase, _super);
                        function ViewModelBase() {
                            _super.apply(this, arguments);
                            this.culture = culture;
                        }
                        ViewModelBase.prototype.localize = function (resource, parameters) {
                            culture();
                            return SDL.Globalize.localize(resource, parameters);
                        };

                        ViewModelBase.prototype.format = function (value, format) {
                            return SDL.Globalize.format(value, format);
                        };
                        return ViewModelBase;
                    })(SDL.Client.Types.DisposableObject);
                    ViewModels.ViewModelBase = ViewModelBase;
                    SDL.Client.Types.OO.createInterface("SDL.UI.Core.Knockout.ViewModels.ViewModelBase", ViewModelBase);
                })(Knockout.ViewModels || (Knockout.ViewModels = {}));
                var ViewModels = Knockout.ViewModels;
            })(Core.Knockout || (Core.Knockout = {}));
            var Knockout = Core.Knockout;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=ViewModelBase.js.map
