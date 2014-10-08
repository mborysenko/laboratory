/// <reference path="../../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../../Libraries/Globalize/SDL.Globalize.ts" />
/// <reference path="../FileResourceHandler.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (Client) {
        (function (Resources) {
            (function (FileHandlers) {
                var ResjsonFileHandler = (function (_super) {
                    __extends(ResjsonFileHandler, _super);
                    function ResjsonFileHandler() {
                        _super.apply(this, arguments);
                    }
                    ResjsonFileHandler.prototype._supports = function (ext) {
                        return (ext == "resjson");
                    };

                    ResjsonFileHandler.prototype._render = function (file) {
                        var cultureMatch = file.url.match(/([^\.]*).resjson$/i);
                        if (cultureMatch) {
                            SDL.Globalize.addCultureInfo(cultureMatch[1] || "default", {
                                messages: JSON.parse(file.data)
                            });
                        }
                    };
                    return ResjsonFileHandler;
                })(Resources.FileResourceHandler);
                FileHandlers.ResjsonFileHandler = ResjsonFileHandler;
                Resources.FileResourceHandler.registeredResourceHandlers.push(new ResjsonFileHandler());
            })(Resources.FileHandlers || (Resources.FileHandlers = {}));
            var FileHandlers = Resources.FileHandlers;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=ResjsonFileHandler.js.map
