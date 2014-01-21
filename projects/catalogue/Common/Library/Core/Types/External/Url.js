var SDL;
(function (SDL) {
    (function (Client) {
        (function (Types) {
            /**
            *	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
            **/
            (function (Url) {
                function isSameDomain(url1, url2) {
                    if (url1 && url2) {
                        var m1 = url1.toLowerCase().match(/^(https?):\/{2,}([^\/:]+)(:(\d+))?/);
                        var m2 = url2.toLowerCase().match(/^(https?):\/{2,}([^\/:]+)(:(\d+))?/);
                        if (m1 && m2) {
                            return (m1[1] == m2[1] && m1[2] == m2[2] && (m1[4] == m2[4] || (m1[4] == null && m2[4] == (m2[1] == "http" ? "80" : "443")) || (m2[4] == null && m1[4] == (m1[1] == "http" ? "80" : "443"))));
                        }
                    }
                    return false;
                }
                Url.isSameDomain = isSameDomain;

                function getDomain(url) {
                    if (url != null) {
                        var m = url.toString().match(/^[\w]+:\/{2,}[^\/?#]*/);
                        return m ? m[0] : "";
                    }
                }
                Url.getDomain = getDomain;
                ;
            })(Types.Url || (Types.Url = {}));
            var Url = Types.Url;
        })(Client.Types || (Client.Types = {}));
        var Types = Client.Types;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//@ sourceMappingURL=Url.js.map
