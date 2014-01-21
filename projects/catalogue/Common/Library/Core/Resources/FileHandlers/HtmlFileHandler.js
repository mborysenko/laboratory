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
                var HtmlFileHandler = (function (_super) {
                    __extends(HtmlFileHandler, _super);
                    function HtmlFileHandler() {
                        _super.apply(this, arguments);
                    }
                    HtmlFileHandler.prototype._supports = function (ext) {
                        return (ext == "htm" || ext == "html");
                    };

                    HtmlFileHandler.prototype._render = function (file) {
                        var templ = SDL.jQuery(file.data);
                        file.type = templ.attr("type");
                        file.template = templ.html();
                        Resources.FileResourceHandler.templates[templ.attr("id")] = file;
                    };
                    return HtmlFileHandler;
                })(Resources.FileResourceHandler);
                Resources.FileResourceHandler.registeredResourceHandlers.push(new HtmlFileHandler());
            })(Resources.FileHandlers || (Resources.FileHandlers = {}));
            var FileHandlers = Resources.FileHandlers;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=HtmlFileHandler.js.map
