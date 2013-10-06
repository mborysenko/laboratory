var SDL;
(function (SDL) {
    (function (Client) {
        (function (ApplicationHost) {
            /// <reference path="ApplicationHost.ts" />
            (function (ApplicationManifestReceiver) {
                function registerApplication(applicationEntries) {
                    ApplicationHost.ApplicationHost.registerApplication(applicationEntries);
                }
                ApplicationManifestReceiver.registerApplication = registerApplication;
            })(ApplicationHost.ApplicationManifestReceiver || (ApplicationHost.ApplicationManifestReceiver = {}));
            var ApplicationManifestReceiver = ApplicationHost.ApplicationManifestReceiver;
        })(Client.ApplicationHost || (Client.ApplicationHost = {}));
        var ApplicationHost = Client.ApplicationHost;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=ApplicationManifestReceiver.js.map
