/// <reference path="jQuery.d.ts" />
var SDL;
(function (SDL) {
    SDL.jQuery;
})(SDL || (SDL = {}));

SDL.jQuery = jQuery.noConflict(true);

(function ($) {
    if (!$.browser) {
        function uaMatch(ua) {
            ua = ua.toLowerCase();

            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || (ua.indexOf("trident\/") > -1 && [null, "msie", (/(\brv\:([\w.]+))/.exec(ua) || [])[2]]);
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        }
        ;

        var matched = uaMatch(navigator.userAgent);
        var browser = {};

        if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version;
        }

        if (browser.chrome) {
            browser.webkit = true;
        } else if (browser.webkit) {
            browser.safari = true;
        }

        $.browser = browser;
    }
    $.browser.macintosh = navigator.userAgent.indexOf("Macintosh") > -1;
    $.browser.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
})(SDL.jQuery);
//# sourceMappingURL=SDL.jQuery.js.map
