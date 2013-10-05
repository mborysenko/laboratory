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
                    JsFileHandler.prototype._supports = function (ext) {
                        return (ext == "js");
                    };

                    JsFileHandler.prototype._render = function (url, file) {
                        file.type = "text/javascript";
                        if (file.context) {
                            (function () {
                                var url, file;
                                eval(arguments[0]);
                            }).apply(file.context, [file.data]);
                        } else {
                            SDL.jQuery.globalEval(file.data);
                        }
                    };
                    return JsFileHandler;
                })(Resources.FileResourceHandler);
                Resources.FileResourceHandler.registeredResourceHandlers.push(new JsFileHandler());
            })(Resources.FileHandlers || (Resources.FileHandlers = {}));
            var FileHandlers = Resources.FileHandlers;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=JsFileHandler.js.map
