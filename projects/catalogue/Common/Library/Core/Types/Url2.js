var SDL;
(function (SDL) {
    (function (Client) {
        (function (Types) {
            /// <reference path="Url1.ts" />
            (function (Url) {
                (function (UrlParts) {
                    UrlParts[UrlParts["PROTOCOL"] = 0] = "PROTOCOL";
                    UrlParts[UrlParts["HOSTNAME"] = 1] = "HOSTNAME";
                    UrlParts[UrlParts["PORT"] = 2] = "PORT";
                    UrlParts[UrlParts["DOMAIN"] = 3] = "DOMAIN";
                    UrlParts[UrlParts["PATH"] = 4] = "PATH";
                    UrlParts[UrlParts["FILE"] = 5] = "FILE";
                    UrlParts[UrlParts["SEARCH"] = 6] = "SEARCH";
                    UrlParts[UrlParts["HASH"] = 7] = "HASH";
                })(Url.UrlParts || (Url.UrlParts = {}));
                var UrlParts = Url.UrlParts;
                ;

                function isAbsoluteUrl(url) {
                    return /^[\w]+\:[^\d]/i.test(url);
                }
                Url.isAbsoluteUrl = isAbsoluteUrl;
                ;

                function getAbsoluteUrl(path) {
                    return (path && !isAbsoluteUrl(path)) ? combinePath(location.protocol + "//" + location.host + "/", path) : path;
                }
                Url.getAbsoluteUrl = getAbsoluteUrl;
                ;

                function combinePath(base, path) {
                    if (!path || path == ".") {
                        return base;
                    } else if (!base || isAbsoluteUrl(path)) {
                        return path;
                    } else {
                        var hashIndx = base.indexOf("#");
                        if (hashIndx != -1) {
                            base = base.slice(0, hashIndx); // removed the hash from the base if present
                        }

                        var charAt0 = path.charAt(0);
                        if (charAt0 == "#") {
                            return base + path;
                        } else if (charAt0 == "?") {
                            var searchIndx = base.indexOf("?");
                            if (searchIndx != -1) {
                                return base.slice(0, searchIndx) + path;
                            } else {
                                return base + path;
                            }
                        } else {
                            var baseParts = parseUrl(base);

                            if (charAt0 != "/") {
                                path = SDL.Client.Types.Url.normalize(baseParts[4 /* PATH */] + path);
                            } else if (path.charAt(1) == "/") {
                                // path starts with // (a hostname without the protocol)
                                return baseParts[0 /* PROTOCOL */] + path;
                            }
                            return baseParts[3 /* DOMAIN */] + path;
                        }
                    }
                }
                Url.combinePath = combinePath;
                ;

                function normalize(url) {
                    // get rid of /../ and /./
                    if (url) {
                        var parts = parseUrl(url);
                        var path = parts[4 /* PATH */];
                        if (path) {
                            var pathParts = path.match(/[^\/]+/g);
                            if (pathParts) {
                                var i = 0;
                                while (i < pathParts.length) {
                                    if (pathParts[i] == "..") {
                                        if (i > 0 && pathParts[i - 1] != "..") {
                                            pathParts.splice(i - 1, 2);
                                            i--;
                                            continue;
                                        }
                                    } else if (pathParts[i] == ".") {
                                        pathParts.splice(i, 1);
                                        continue;
                                    }

                                    i++;
                                }

                                if (path.charAt(path.length - 1) == "/") {
                                    pathParts.push(""); // will add / at the end
                                }

                                if (path.charAt(0) == "/" && (pathParts.length <= 1 || pathParts[0] != "")) {
                                    pathParts.unshift(""); // will add / at the start
                                }
                                path = pathParts.join("/");
                            }
                        }
                        url = parts[3 /* DOMAIN */] + path + parts[5 /* FILE */] + parts[6 /* SEARCH */] + parts[7 /* HASH */];
                    }
                    return url;
                }
                Url.normalize = normalize;
                ;

                function parseUrl(url) {
                    if (url != null) {
                        var m = url.toString().match(/^(([\w]+:)?\/{2,}([^\/?#:]+)(:(\d+))?)?([^?#]*\/)*([^\/?#]*)?(\?[^#]*)?(#.*)?$/);
                        var parts = [];
                        parts[0 /* PROTOCOL */] = m[2] || "";
                        parts[1 /* HOSTNAME */] = m[3] || "";
                        parts[2 /* PORT */] = m[5] || "";
                        parts[3 /* DOMAIN */] = m[1] || "";
                        parts[4 /* PATH */] = m[6] || (m[1] ? "/" : "");
                        parts[5 /* FILE */] = m[7] || "";
                        parts[6 /* SEARCH */] = m[8] || "";
                        parts[7 /* HASH */] = m[9] || "";
                        return parts;
                    }
                }
                Url.parseUrl = parseUrl;
                ;
            })(Types.Url || (Types.Url = {}));
            var Url = Types.Url;
        })(Client.Types || (Client.Types = {}));
        var Types = Client.Types;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=Url2.js.map
