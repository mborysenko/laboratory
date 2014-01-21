/// <reference path="Url2.ts" />
module SDL.Client.Types.Url
{
	export function makeRelativeUrl(base: string, url: string): string
	{
		if (!url || url == base)
		{
			url = "";
		}
		else if (!getDomain(url) || (getDomain(base) && isSameDomain(base, url)))
		{
			var urlParts = parseUrl(url);

			if (urlParts[UrlParts.PATH].charAt(0) == "/")	// given url is not relative -> process
			{
				var baseParts = parseUrl(base);
				url = "";

				if (baseParts[UrlParts.PATH] == urlParts[UrlParts.PATH])	// same path
				{
					if (urlParts[UrlParts.FILE] != baseParts[UrlParts.FILE] ||			// different file
						!urlParts[UrlParts.SEARCH] &&
							(baseParts[UrlParts.SEARCH] ||										// or same file, but need overwrite search param
							(!urlParts[UrlParts.HASH] && baseParts[UrlParts.HASH])))		//								or hash param
					{
						url = urlParts[UrlParts.FILE] || "./";
					}
				}
				else
				{
					var baseDirs = baseParts[UrlParts.PATH].split("/");
					var urlDirs = urlParts[UrlParts.PATH].split("/");
					var i = 0;
					while (i < baseDirs.length && i < urlDirs.length && baseDirs[i] == urlDirs[i])
					{
						i++;
					}
				
					for (var j = baseDirs.length - 1; j > i; j--)
					{
						url += "../";
					}

					while (i < urlDirs.length - 1)
					{
						url += (urlDirs[i] + "/");
						i++;
					}
					url += (urlParts[UrlParts.FILE] || (url ? "" : "./"));
				}

				if (url || (urlParts[UrlParts.SEARCH] != baseParts[UrlParts.SEARCH]) ||
					(!urlParts[UrlParts.HASH] && baseParts[UrlParts.HASH]))
				{
					url += urlParts[UrlParts.SEARCH];
				}

				if (url || (urlParts[UrlParts.HASH] != baseParts[UrlParts.HASH]))
				{
					url += urlParts[UrlParts.HASH];
				}
			}
		}
		return url;
	};

	export function getFileExtension(file: string): string
	{
		var dotIndex = file ? file.lastIndexOf(".") : -1;
		return (dotIndex > -1 ? file.slice(dotIndex + 1) : "");
	};

	export function getFileName(file: string): string
	{
		return file && file.match(/[^\\//]*$/)[0];
	};

	export function getUrlParameter(url: string, parameterName: string): string
	{
		var m = SDL.Client.Types.Url.parseUrl(url);
		var params = m[SDL.Client.Types.Url.UrlParts.SEARCH];
		if (params)
		{
			m = params.match(new RegExp("(\\?|&)\\s*" + (<any>Types).RegExp.escape(parameterName) + "\\s*=([^&]+)(&|$)"));
			if (m)
			{
				return decodeURIComponent(m[2]);
			}
		}
	};

	export function getHashParameter(url: string, parameterName: string): string
	{
		var m = SDL.Client.Types.Url.parseUrl(url);
		var params = m[SDL.Client.Types.Url.UrlParts.HASH];
		if (params)
		{
			m = params.match(new RegExp("(#|&)\s*" + (<any>Types).RegExp.escape(parameterName) + "\s*=([^&]+)(&|$)"));
			if (m)
			{
				return decodeURIComponent(m[2]);
			}
		}
	};

	export function setHashParameter(url: string, parameterName: string, value: string): string
	{
		var prevValue: string;
		var parts = SDL.Client.Types.Url.parseUrl(url);
		var hash = parts[SDL.Client.Types.Url.UrlParts.HASH];
		var paramMatch: string[];
		var paramRegExp: RegExp;

		if (hash)
		{
			paramRegExp = new RegExp("(#|&)(\s*" + (<any>Types).RegExp.escape(parameterName) + "\s*=)([^&]*)(&|$)");
			paramMatch = hash.match(paramRegExp);
			if (paramMatch)
			{
				prevValue = decodeURIComponent(paramMatch[3]);
			}
		}

		if ((value || prevValue) && value != prevValue)
		{
			if (!value)
			{
				if (paramMatch[4] == "&")
				{
					hash = hash.replace(paramRegExp, "$1");
				}
				else
				{
					hash = hash.replace(paramRegExp, "");
				}
			}
			else
			{
				value = encodeURIComponent(value);
				if (paramMatch)
				{
					hash = hash.replace(paramRegExp, "$1$2" + value + "$4");
				}
				else
				{
					if (hash && hash.length > 1)
					{
						hash += ("&" + parameterName + "=" + value);
					}
					else
					{
						hash = "#" + parameterName + "=" + value;
					}
				}
			}
		
			url = parts[SDL.Client.Types.Url.UrlParts.DOMAIN] + parts[SDL.Client.Types.Url.UrlParts.PATH] +
				parts[SDL.Client.Types.Url.UrlParts.FILE] + parts[SDL.Client.Types.Url.UrlParts.SEARCH] + hash;
		}
		return url;
	}
}