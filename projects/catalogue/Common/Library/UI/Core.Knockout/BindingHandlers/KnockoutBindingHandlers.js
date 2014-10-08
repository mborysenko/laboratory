var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Knockout) {
                (function (BindingHandlers) {
                    var knockoutObservableSettings = {};
                    function enableKnockoutObservableSettings(type) {
                        knockoutObservableSettings[type] = true;
                    }
                    BindingHandlers.enableKnockoutObservableSettings = enableKnockoutObservableSettings;

                    function areKnockoutObservableSettingsEnabled(type) {
                        return knockoutObservableSettings[type] || false;
                    }
                    BindingHandlers.areKnockoutObservableSettingsEnabled = areKnockoutObservableSettingsEnabled;
                })(Knockout.BindingHandlers || (Knockout.BindingHandlers = {}));
                var BindingHandlers = Knockout.BindingHandlers;
            })(Core.Knockout || (Core.Knockout = {}));
            var Knockout = Core.Knockout;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=KnockoutBindingHandlers.js.map
