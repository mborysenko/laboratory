/// <reference path="Url1.ts" />
module SDL.Client.Types.Url
{
	export enum UrlParts {
		PROTOCOL,
		HOSTNAME,
		PORT,
		DOMAIN,
		PATH,
		FILE,
		SEARCH,
		HASH
	};

	export function isAbsoluteUrl(url: string): boolean
	{
		return /^[\w]+\:[^\d]/i.test(url);
	};

	export function getAbsoluteUrl(path: string): string
	{
		return (path && !isAbsoluteUrl(path))
			? combinePath(location.protocol + "//" + location.host + "/", path)
			: path;
	};

	export function combinePath(base: string, path: string): string
	{
		if (!path || path == ".")
		{
			return base;
		}
		else if (!base || isAbsoluteUrl(path))
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
				var baseParts = parseUrl(base);

				if (charAt0 != "/")
				{
					path = Url.normalize(baseParts[UrlParts.PATH] + path);
				}
				else if (path.charAt(1) == "/")
				{
					// path starts with // (a hostname without the protocol)
					return baseParts[UrlParts.PROTOCOL] + path;
				}
				return baseParts[UrlParts.DOMAIN] + path;
			}
		}
	};

	export function normalize(url: string): string
	{
		// get rid of /../ and /./
		if (url)
		{
			var parts = parseUrl(url);
			var path = parts[UrlParts.PATH];
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
			url = parts[UrlParts.DOMAIN] + path + parts[UrlParts.FILE] + parts[UrlParts.SEARCH] + parts[UrlParts.HASH];
		}
		return url;
	};

	export function parseUrl(url: string): string[]
	{
		if (url != null)
		{
			var m = url.toString().match(/^(([\w]+:)?\/{2,}([^\/?#:]+)(:(\d+))?)?([^?#]*\/)*([^\/?#]*)?(\?[^#]*)?(#.*)?$/);
			var parts: string[] = [];
			parts[UrlParts.PROTOCOL] = m[2] || "";
			parts[UrlParts.HOSTNAME] = m[3] || "";
			parts[UrlParts.PORT] = m[5] || "";
			parts[UrlParts.DOMAIN] = m[1] || "";
			parts[UrlParts.PATH] = m[6] || (m[1] ? "/" : "");
			parts[UrlParts.FILE] = m[7] || "";
			parts[UrlParts.SEARCH] = m[8] || "";
			parts[UrlParts.HASH] = m[9] || "";
			return parts;
		}
	};
}