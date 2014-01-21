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
            /// <reference path="../../Libraries/jQuery/SDL.jQuery.ts" />
            /// <reference path="../FileResourceHandler.ts" />
            (function (FileHandlers) {
                var JsFileHandler = (function (_super) {
                    __extends(JsFileHandler, _super);
                    function JsFileHandler() {
                        _super.apply(this, arguments);
                    }
                    JsFileHandler.prototype.addSourceUrl = function (file) {
                        return file.data + "\n//@ sourceURL=" + ((file.url.indexOf("~/") == 0) ? Client.Types.Url.combinePath(file.isShared ? Client.Application.applicationHostCorePath : Client.Types.Url.getAbsoluteUrl(Client.Configuration.ConfigurationManager.corePath), file.url.slice(2)) : Client.Types.Url.getAbsoluteUrl(file.url));
                    };

                    JsFileHandler.prototype._supports = function (ext) {
                        return (ext == "js");
                    };

                    JsFileHandler.prototype._render = function (file) {
                        file.type = "text/javascript";
                        if (file.context) {
                            (function () {
                                SDL.jQuery.globalEval(arguments[0]);
                            }).apply(file.context, [this.addSourceUrl(file)]);
                        } else {
                            SDL.jQuery.globalEval(this.addSourceUrl(file));
                        }
                    };
                    return JsFileHandler;
                })(Resources.FileResourceHandler);
                FileHandlers.JsFileHandler = JsFileHandler;
                Resources.FileResourceHandler.registeredResourceHandlers.push(new JsFileHandler());
            })(Resources.FileHandlers || (Resources.FileHandlers = {}));
            var FileHandlers = Resources.FileHandlers;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=JsFileHandler.js.map
