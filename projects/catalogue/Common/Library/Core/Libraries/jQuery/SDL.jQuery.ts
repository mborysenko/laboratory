/// <reference path="jQuery.d.ts" />
module SDL
{
	export interface JQueryBrowserInfo
	{
		safari?: boolean;
		opera?: boolean;
		msie?: boolean;
		mozilla?: boolean;
		webkit?: boolean;
		chrome?: boolean;
		macintosh?: boolean;
		mobile?: boolean;
		version?: string;
	}

	export interface SDLJQueryStatic extends JQueryStatic
	{
		browser: JQueryBrowserInfo;
	}

	export var jQuery:SDL.SDLJQueryStatic;
}

SDL.jQuery = <SDL.SDLJQueryStatic>jQuery.noConflict(true);

(function($: SDL.SDLJQueryStatic)
{
	if (!$.browser)
	{
		function uaMatch(ua: string)
		{
			ua = ua.toLowerCase();

			var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
				/(webkit)[ \/]([\w.]+)/.exec(ua) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) || (ua.indexOf("trident\/") > -1  && [null, "msie", (/(\brv\:([\w.]+))/.exec(ua) || <any[]>[])[2]])
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
				<any>[];

			return {
				browser: match[1] || "",
				version: match[2] || "0"
			};
		};

		var matched = uaMatch(navigator.userAgent);
		var browser: SDL.JQueryBrowserInfo = {};

		if (matched.browser)
		{
			browser[matched.browser] = true;
			browser.version = matched.version;
		}

		// Chrome is Webkit, but Webkit is also Safari.
		if (browser.chrome)
		{
			browser.webkit = true;
		}
		else if (browser.webkit)
		{
			browser.safari = true;
		}

		$.browser = browser;
	}
	$.browser.macintosh = navigator.userAgent.indexOf("Macintosh") > -1;
	$.browser.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
})(SDL.jQuery);