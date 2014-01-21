var SDL;
(function (SDL) {
    (function (Client) {
        (function (Types) {
            /// <reference path="Url2.ts" />
            (function (Url) {
                function makeRelativeUrl(base, url) {
                    if (!url || url == base) {
                        url = "";
                    } else if (!Url.getDomain(url) || (Url.getDomain(base) && Url.isSameDomain(base, url))) {
                        var urlParts = Url.parseUrl(url);

                        if (urlParts[Url.UrlParts.PATH].charAt(0) == "/") {
                            var baseParts = Url.parseUrl(base);
                            url = "";

                            if (baseParts[Url.UrlParts.PATH] == urlParts[Url.UrlParts.PATH]) {
                                if (urlParts[Url.UrlParts.FILE] != baseParts[Url.UrlParts.FILE] || !urlParts[Url.UrlParts.SEARCH] && (baseParts[Url.UrlParts.SEARCH] || (!urlParts[Url.UrlParts.HASH] && baseParts[Url.UrlParts.HASH]))) {
                                    url = urlParts[Url.UrlParts.FILE] || "./";
                                }
                            } else {
                                var baseDirs = baseParts[Url.UrlParts.PATH].split("/");
                                var urlDirs = urlParts[Url.UrlParts.PATH].split("/");
                                var i = 0;
                                while (i < baseDirs.length && i < urlDirs.length && baseDirs[i] == urlDirs[i]) {
                                    i++;
                                }

                                for (var j = baseDirs.length - 1; j > i; j--) {
                                    url += "../";
                                }

                                while (i < urlDirs.length - 1) {
                                    url += (urlDirs[i] + "/");
                                    i++;
                                }
                                url += (urlParts[Url.UrlParts.FILE] || (url ? "" : "./"));
                            }

                            if (url || (urlParts[Url.UrlParts.SEARCH] != baseParts[Url.UrlParts.SEARCH]) || (!urlParts[Url.UrlParts.HASH] && baseParts[Url.UrlParts.HASH])) {
                                url += urlParts[Url.UrlParts.SEARCH];
                            }

                            if (url || (urlParts[Url.UrlParts.HASH] != baseParts[Url.UrlParts.HASH])) {
                                url += urlParts[Url.UrlParts.HASH];
                            }
                        }
                    }
                    return url;
                }
                Url.makeRelativeUrl = makeRelativeUrl;
                ;

                function getFileExtension(file) {
                    var dotIndex = file ? file.lastIndexOf(".") : -1;
                    return (dotIndex > -1 ? file.slice(dotIndex + 1) : "");
                }
                Url.getFileExtension = getFileExtension;
                ;

                function getFileName(file) {
                    return file && file.match(/[^\\//]*$/)[0];
                }
                Url.getFileName = getFileName;
                ;

                function getUrlParameter(url, parameterName) {
                    var m = SDL.Client.Types.Url.parseUrl(url);
                    var params = m[SDL.Client.Types.Url.UrlParts.SEARCH];
                    if (params) {
                        m = params.match(new RegExp("(\\?|&)\\s*" + (Client.Types).RegExp.escape(parameterName) + "\\s*=([^&]+)(&|$)"));
                        if (m) {
                            return decodeURIComponent(m[2]);
                        }
                    }
                }
                Url.getUrlParameter = getUrlParameter;
                ;

                function getHashParameter(url, parameterName) {
                    var m = SDL.Client.Types.Url.parseUrl(url);
                    var params = m[SDL.Client.Types.Url.UrlParts.HASH];
                    if (params) {
                        m = params.match(new RegExp("(#|&)\s*" + (Client.Types).RegExp.escape(parameterName) + "\s*=([^&]+)(&|$)"));
                        if (m) {
                            return decodeURIComponent(m[2]);
                        }
                    }
                }
                Url.getHashParameter = getHashParameter;
                ;

                function setHashParameter(url, parameterName, value) {
                    var prevValue;
                    var parts = SDL.Client.Types.Url.parseUrl(url);
                    var hash = parts[SDL.Client.Types.Url.UrlParts.HASH];
                    var paramMatch;
                    var paramRegExp;

                    if (hash) {
                        paramRegExp = new RegExp("(#|&)(\s*" + (Client.Types).RegExp.escape(parameterName) + "\s*=)([^&]*)(&|$)");
                        paramMatch = hash.match(paramRegExp);
                        if (paramMatch) {
                            prevValue = decodeURIComponent(paramMatch[3]);
                        }
                    }

                    if ((value || prevValue) && value != prevValue) {
                        if (!value) {
                            if (paramMatch[4] == "&") {
                                hash = hash.replace(paramRegExp, "$1");
                            } else {
                                hash = hash.replace(paramRegExp, "");
                            }
                        } else {
                            value = encodeURIComponent(value);
                            if (paramMatch) {
                                hash = hash.replace(paramRegExp, "$1$2" + value + "$4");
                            } else {
                                if (hash && hash.length > 1) {
                                    hash += ("&" + parameterName + "=" + value);
                                } else {
                                    hash = "#" + parameterName + "=" + value;
                                }
                            }
                        }

                        url = parts[SDL.Client.Types.Url.UrlParts.DOMAIN] + parts[SDL.Client.Types.Url.UrlParts.PATH] + parts[SDL.Client.Types.Url.UrlParts.FILE] + parts[SDL.Client.Types.Url.UrlParts.SEARCH] + hash;
                    }
                    return url;
                }
                Url.setHashParameter = setHashParameter;
            })(Types.Url || (Types.Url = {}));
            var Url = Types.Url;
        })(Client.Types || (Client.Types = {}));
        var Types = Client.Types;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=Url.js.map
