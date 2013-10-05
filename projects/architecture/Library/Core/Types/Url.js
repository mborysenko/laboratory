/*! @namespace {SDL.Client.Types.Url} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.Url");

SDL.Client.Types.Url.isAbsoluteUrl = function SDL$Client$Types$URL$Document$getAbsoluteUrl(url)
{
	return /^[\w]+\:[^\d]/i.test(url);
};

SDL.Client.Types.Url.getAbsoluteUrl = function SDL$Client$Types$URL$Document$getAbsoluteUrl(path)
{
	return (path && !this.isAbsoluteUrl(path))
		? this.combinePath(location.protocol + "//" + location.host + "/", path)
		: path;
};

SDL.Client.Types.Url.makeRelativeUrl = function SDL$Client$Types$URL$Document$makeRelativeUrl(base, url)
{
	if (!url || url == base)
	{
		url = "";
	}
	else if (!this.getDomain(url) || (this.getDomain(base) && this.isSameDomain(base, url)))
	{
		var urlParts = this.parseUrl(url);

		if (urlParts[this.UrlParts.PATH].charAt(0) == "/")	// given url is not relative -> process
		{
			var baseParts = this.parseUrl(base);
			url = "";

			if (baseParts[this.UrlParts.PATH] == urlParts[this.UrlParts.PATH])	// same path
			{
				if (urlParts[this.UrlParts.FILE] != baseParts[this.UrlParts.FILE] ||			// different file
					!urlParts[this.UrlParts.SEARCH] &&
						(baseParts[this.UrlParts.SEARCH] ||										// or same file, but need overwrite search param
						(!urlParts[this.UrlParts.HASH] && baseParts[this.UrlParts.HASH])))		//								or hash param
				{
					url = urlParts[this.UrlParts.FILE] || "./";
				}
			}
			else
			{
				var baseDirs = baseParts[this.UrlParts.PATH].split("/");
				var urlDirs = urlParts[this.UrlParts.PATH].split("/");
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
				url += (urlParts[this.UrlParts.FILE] || (url ? "" : "./"));
			}

			if (url || (urlParts[this.UrlParts.SEARCH] != baseParts[this.UrlParts.SEARCH]) ||
				(!urlParts[this.UrlParts.HASH] && baseParts[this.UrlParts.HASH]))
			{
				url += urlParts[this.UrlParts.SEARCH];
			}

			if (url || (urlParts[this.UrlParts.HASH] != baseParts[this.UrlParts.HASH]))
			{
				url += urlParts[this.UrlParts.HASH];
			}
		}
	}
	return url;
};

SDL.Client.Types.Url.combinePath = function SDL$Client$Types$URL$Document$combinePath(base, path)
{
	if (!path || path == ".")
	{
		return base;
	}
	else if (!base || this.isAbsoluteUrl(path))
	{
		return path;
	}
	else
	{
		var hashIndx = base.indexOf("#");
		if (hashIndx != -1)
		{
			base = base.slice(0, hashIndx);	// removed the hash from the base if present
		}

		var charAt0 = path.charAt(0);
		if (charAt0 == "#")
		{
			return base + path;
		}
		else if (charAt0 == "?")
		{
			var searchIndx = base.indexOf("?");
			if (searchIndx != -1)
			{
				return base.slice(0, searchIndx) + path;
			}
			else
			{
				return base + path;
			}
		}
		else
		{
			var baseParts = SDL.Client.Types.Url.parseUrl(base);

			if (charAt0 != "/")
			{
				path = SDL.Client.Types.Url.normalize(baseParts[SDL.Client.Types.Url.UrlParts.PATH] + path);
			}
			else if (path.charAt(1) == "/")
			{
				// path starts with // (a hostname without the protocol)
				return baseParts[SDL.Client.Types.Url.UrlParts.PROTOCOL] + path;
			}
			return baseParts[SDL.Client.Types.Url.UrlParts.DOMAIN] + path;
		}
	}
};

SDL.Client.Types.Url.normalize = function SDL$Client$Types$Url$normailize(url)
{
	// get rid of /../ and /./
	if (url)
	{
		var parts = SDL.Client.Types.Url.parseUrl(url);
		var path = parts[SDL.Client.Types.Url.UrlParts.PATH];
		if (path)
		{
			var pathParts = path.match(/[^\/]+/g);
			if (pathParts)
			{
				var i = 0;
				while (i < pathParts.length)
				{
					if (pathParts[i] == "..")
					{
						if (i > 0 && pathParts[i - 1] != "..")
						{
							pathParts.splice(i - 1, 2);
							i--;
							continue;
						}
					}
					else if (pathParts[i] == ".")
					{
						pathParts.splice(i, 1);
						continue;
					}

					i++;
				}

				if (path.charAt(path.length - 1) == "/")
				{
					pathParts.push("");		// will add / at the end
				}

				if (path.charAt(0) == "/" && (pathParts.length <= 1 || pathParts[0] != ""))
				{
					pathParts.unshift("");	// will add / at the start
				}
				path = pathParts.join("/");
			}
		}
		url = parts[SDL.Client.Types.Url.UrlParts.DOMAIN] + path + parts[SDL.Client.Types.Url.UrlParts.FILE] +
			parts[SDL.Client.Types.Url.UrlParts.SEARCH] + parts[SDL.Client.Types.Url.UrlParts.HASH];
	}
	return url;
};

SDL.Client.Types.Url.getFileExtension = function SDL$Client$Types$Url$getFileExtension(file)
{
	var dotIndex = file ? file.lastIndexOf(".") : -1;
	return (dotIndex > -1 ? file.slice(dotIndex + 1) : "");
};

SDL.Client.Types.Url.getFileName = function SDL$Client$Types$Url$getFileName(file)
{
	return file && file.match(/[^\\//]*$/)[0];
};

SDL.Client.Types.Url.getUrlParameter = function SDL$Client$Types$Url$getUrlParameter(url, parameterName)
{
	var m = SDL.Client.Types.Url.parseUrl(url);
	var params = m[SDL.Client.Types.Url.UrlParts.SEARCH];
	if (params)
	{
		m = params.match(new RegExp("(\\?|&)\\s*" + SDL.Client.Types.RegExp.escape(parameterName) + "\\s*=([^&]+)(&|$)"));
		if (m)
		{
			return decodeURIComponent(m[2]);
		}
	}
};

SDL.Client.Types.Url.getHashParameter = function SDL$Client$Types$Url$getUrlParameter(url, parameterName)
{
	var m = SDL.Client.Types.Url.parseUrl(url);
	var params = m[SDL.Client.Types.Url.UrlParts.HASH];
	if (params)
	{
		m = params.match(new RegExp("(#|&)\s*" + SDL.Client.Types.RegExp.escape(parameterName) + "\s*=([^&]+)(&|$)"));
		if (m)
		{
			return decodeURIComponent(m[2]);
		}
	}
};

SDL.Client.Types.Url.setHashParameter = function SDL$Client$Types$Url$setUrlParameter(url, parameterName, value)
{
	var prevValue;
	var parts = SDL.Client.Types.Url.parseUrl(url);
	var hash = parts[SDL.Client.Types.Url.UrlParts.HASH];
	var paramMatch;
	var paramRegExp;

	if (hash)
	{
		paramRegExp = new RegExp("(#|&)(\s*" + SDL.Client.Types.RegExp.escape(parameterName) + "\s*=)([^&]*)(&|$)");
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
};

SDL.Client.Types.Url.isSameDomain = function SDL$Client$Types$Url$isSameDomain(url1, url2)
{
	if (url1 && url2)
	{
		var m1 = url1.toLowerCase().match(/^(https?):\/{2,}([^\/:]+)(:(\d+))?/);
		var m2 = url2.toLowerCase().match(/^(https?):\/{2,}([^\/:]+)(:(\d+))?/);
		if (m1 && m2)
		{
			return (
				m1[1] == m2[1] &&
				m1[2] == m2[2] &&
				(
					m1[4] == m2[4] ||
					(m1[4] == null && m2[4] == (m1[1] == "http" ? "80" : "443")) ||
					(m2[4] == null && m1[4] == (m2[1] == "http" ? "80" : "443"))
				)
			);
		}
	}
	return false;
};

SDL.Client.Types.Url.getDomain = function SDL$Client$Types$Url$getDomain(url)
{
	var parts = this.parseUrl(url);
	return parts ? parts[SDL.Client.Types.Url.UrlParts.DOMAIN] : null;
};

SDL.Client.Types.Url.parseUrl = function SDL$Client$Types$Url$parseUrl(url)
{
	if (url != null)
	{
		var m = url.toString().match(/^(([\w]+:)?\/{2,}([^\/?#:]+)(:(\d+))?)?([^?#]*\/)*([^\/?#]*)?(\?[^#]*)?(#.*)?$/);
		var parts = [];
		var typesUrlParts = SDL.Client.Types.Url.UrlParts;
		parts[typesUrlParts.PROTOCOL] = m[2] || "";
		parts[typesUrlParts.HOSTNAME] = m[3] || "";
		parts[typesUrlParts.PORT] = m[5] || "";
		parts[typesUrlParts.DOMAIN] = m[1] || "";
		parts[typesUrlParts.PATH] = m[6] || (m[1] ? "/" : "");
		parts[typesUrlParts.FILE] = m[7] || "";
		parts[typesUrlParts.SEARCH] = m[8] || "";
		parts[typesUrlParts.HASH] = m[9] || "";
		return parts;
	}
};

SDL.Client.Types.Url.UrlParts = {
	PROTOCOL: 0,
	HOSTNAME: 1,
	PORT: 2,
	DOMAIN: 3,
	PATH: 4,
	FILE: 5,
	SEARCH: 6,
	HASH: 7
};