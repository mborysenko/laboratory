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
                var CssFileHandler = (function (_super) {
                    __extends(CssFileHandler, _super);
                    function CssFileHandler() {
                        _super.apply(this, arguments);
                    }
                    CssFileHandler.updatePaths = function (data, url, addHost) {
                        if (typeof addHost === "undefined") { addHost = false; }
                        if (data) {
                            var path;
                            if (url && url.indexOf("~/") == 0) {
                                url = Client.Types.Url.combinePath(Resources.FileResourceHandler.corePath, url.slice(2));
                            }

                            return data.replace(/\{(PATH|ROOT)\}(\/?)/g, function (substring, token, next) {
                                switch (token) {
                                    case "PATH":
                                        if (!path) {
                                            if (url) {
                                                var lastSlashPos = url.lastIndexOf("/");
                                                path = (lastSlashPos != -1) ? url.slice(0, lastSlashPos + 1) : (url + "/");
                                            } else {
                                                path = "/";
                                            }
                                        }
                                        return addHost ? Client.Types.Url.combinePath(window.location.href, path) : path;
                                    case "ROOT":
                                        return addHost ? Client.Types.Url.combinePath(window.location.href, Resources.FileResourceHandler.corePath) : Resources.FileResourceHandler.corePath;
                                }
                            });
                        }
                        return data;
                    };

                    CssFileHandler.supports = function (url) {
                        return (/\.css(\?|\#|$)/i).test(url);
                    };

                    CssFileHandler.prototype._supports = function (ext) {
                        return (ext == "css");
                    };

                    CssFileHandler.prototype._render = function (url, file) {
                        file.type = "text/css";
                        var $styles;

                        if (SDL.jQuery.browser.msie && ($styles = SDL.jQuery("link[type='text/css'], style")).length > 30) {
                            // IE has a problem with dealing with more than 31 css/text links + style-tags...
                            // if the number of styles exceed 31 in total,
                            // we will gather the rest of the style sheets in one embedded <style> element
                            var $lastStyle = $styles.last();
                            if ($lastStyle.is("style")) {
                                $lastStyle.text($lastStyle.text() + "\n\n/* APPENDED: (" + file.url + ") */\n\n" + CssFileHandler.updatePaths(file.data, file.url));
                            } else {
                                // this is unlikely that the last style is linked as long as we add embedded styles
                                // still, if for whatever reason it happens, load the linked style synchronously and replace the <link>
                                // with an embedded <style>
                                // 1. remove the linked style
                                var url = $lastStyle.remove().attr("href");

                                // 2. load its contents
                                SDL.Client.Net.callWebMethod(url, "", "GET", null, true, function (data) {
                                    // 3a. insert as a <style> element
                                    SDL.jQuery("head").append(SDL.jQuery("<style />", {
                                        id: url,
                                        text: CssFileHandler.updatePaths(data, url) + "\n\n/* APPENDED: (" + file.url + ") */\n\n" + CssFileHandler.updatePaths(file.data, file.url)
                                    }));
                                }, function (errorThrow) {
                                    // 3b. insert as a <style> element
                                    SDL.jQuery("head").append(SDL.jQuery("<style />", {
                                        id: url,
                                        text: "/* FAILED LOADING \"" + url + "\":\n" + errorThrow + "*/\n\n/* APPENDED: (" + file.url + ") */\n\n" + CssFileHandler.updatePaths(file.data, file.url)
                                    }));
                                });
                            }
                        } else {
                            SDL.jQuery("head").append(SDL.jQuery("<style />", {
                                id: file.url,
                                text: CssFileHandler.updatePaths(file.data, file.url)
                            }));
                        }
                    };
                    return CssFileHandler;
                })(Resources.FileResourceHandler);
                FileHandlers.CssFileHandler = CssFileHandler;
                Resources.FileResourceHandler.registeredResourceHandlers.push(new CssFileHandler());
            })(Resources.FileHandlers || (Resources.FileHandlers = {}));
            var FileHandlers = Resources.FileHandlers;
        })(Client.Resources || (Client.Resources = {}));
        var Resources = Client.Resources;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=CssFileHandler.js.map
