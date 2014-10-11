/// <reference path="../Localization/Localization.ts" />
/// <reference path="../Event/EventRegister.d.ts" />
/// <reference path="../Application/Application.ts" />
var SDL;
(function (SDL) {
    (function (Client) {
        (function (Application) {
            Application.addInitializeCallback(function () {
                if (Application.isHosted && Client.Configuration.ConfigurationManager.getAppSetting("synchronizeCultureWithApplicationHost") !== "false") {
                    Client.Event.EventRegister.addEventHandler(Application.ApplicationHost, "culturechange", function () {
                        Client.Localization.setCulture(Application.ApplicationHost.culture);
                    });
                    Client.Event.EventRegister.addEventHandler(Client.Localization, "culturechange", function (e) {
                        if (Application.ApplicationHost.culture != e.data.culture) {
                            Application.ApplicationHost.setCulture(e.data.culture);
                        }
                    });
                    Client.Localization.setCulture(Application.ApplicationHost.culture);
                }
            });
        })(Client.Application || (Client.Application = {}));
        var Application = Client.Application;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=ApplicationLocalization.js.map
