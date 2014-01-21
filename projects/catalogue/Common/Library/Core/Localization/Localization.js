var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    /// <reference path="../Types/Types.d.ts" />
    /// <reference path="../Types/ObjectWithEvents.ts" />
    (function (Client) {
        eval(Client.Types.OO.enableCustomInheritance);
        var LocalizationClass = (function (_super) {
            __extends(LocalizationClass, _super);
            function LocalizationClass() {
                _super.apply(this, arguments);
            }
            LocalizationClass.prototype.setCulture = function (value) {
                if (this._culture != value) {
                    this._culture = value;
                    this.fireEvent("culturechange", { culture: value });
                }
            };

            LocalizationClass.prototype.getCulture = function () {
                return this._culture;
            };
            return LocalizationClass;
        })(Client.Types.ObjectWithEvents);
        Client.LocalizationClass = LocalizationClass;
        SDL.Client.Types.OO.createInterface("SDL.Client.LocalizationClass", LocalizationClass);
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));

var SDL;
(function (SDL) {
    (function (Client) {
        // has to be in a separate module definition, otherwise creating an instance of the interface fails
        Client.Localization = new Client.LocalizationClass();
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=Localization.js.map
