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

                        if (urlParts[4 /* PATH */].charAt(0) == "/") {
                            var baseParts = Url.parseUrl(base);
                            url = "";

                            if (baseParts[4 /* PATH */] == urlParts[4 /* PATH */]) {
                                if (urlParts[5 /* FILE */] != baseParts[5 /* FILE */] || !urlParts[6 /* SEARCH */] && (baseParts[6 /* SEARCH */] || (!urlParts[7 /* HASH */] && baseParts[7 /* HASH */]))) {
                                    url = urlParts[5 /* FILE */] || "./";
                                }
                            } else {
                                var baseDirs = baseParts[4 /* PATH */].split("/");
                                var urlDirs = urlParts[4 /* PATH */].split("/");
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
                                url += (urlParts[5 /* FILE */] || (url ? "" : "./"));
                            }

                            if (url || (urlParts[6 /* SEARCH */] != baseParts[6 /* SEARCH */]) || (!urlParts[7 /* HASH */] && baseParts[7 /* HASH */])) {
                                url += urlParts[6 /* SEARCH */];
                            }

                            if (url || (urlParts[7 /* HASH */] != baseParts[7 /* HASH */])) {
                                url += urlParts[7 /* HASH */];
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
                    var params = m[6 /* SEARCH */];
                    if (params) {
                        m = params.match(new RegExp("(\\?|&)\\s*" + Types.RegExp.escape(parameterName) + "\\s*=([^&]+)(&|$)"));
                        if (m) {
                            return decodeURIComponent(m[2]);
                        }
                    }
                }
                Url.getUrlParameter = getUrlParameter;
                ;

                function getHashParameter(url, parameterName) {
                    var m = SDL.Client.Types.Url.parseUrl(url);
                    var params = m[7 /* HASH */];
                    if (params) {
                        m = params.match(new RegExp("(#|&)\s*" + Types.RegExp.escape(parameterName) + "\s*=([^&]+)(&|$)"));
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
                    var hash = parts[7 /* HASH */];
                    var paramMatch;
                    var paramRegExp;

                    if (hash) {
                        paramRegExp = new RegExp("(#|&)(\s*" + Types.RegExp.escape(parameterName) + "\s*=)([^&]*)(&|$)");
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

                        url = parts[3 /* DOMAIN */] + parts[4 /* PATH */] + parts[5 /* FILE */] + parts[6 /* SEARCH */] + hash;
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
