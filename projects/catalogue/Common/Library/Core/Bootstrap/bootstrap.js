var SDL;
(function()
{
	var sdl = SDL || (SDL = {});
	var sdl_client = sdl.Client;
	if (!sdl_client)
	{
		sdl_client = sdl.Client = {};
	}
	var sdl_configuration = sdl_client.Configuration;
	if (!sdl_configuration)
	{
		sdl_configuration = sdl_client.Configuration = {};
	}

	if (!sdl_client.Application)
	{
		var app = sdl_client.Application = {
			initCallbacks: []
		};
		app.initialize = app.addInitializeCallback = function(callback)
			{
				if (callback)
				{
					this.initCallbacks.push(callback);
				}
			};
	}

	var path;
	var versionFile;

	var scripts = document.getElementsByTagName("script");
	for (var i = 0, len = scripts.length; i < len; i++)
	{
		var script = scripts[i];
		if (script.src)
		{
			var srcMatch = script.src.match(/^(https?\:\/\/[^\/]*)?(.*?)(\/library\/core\/bootstrap)?\/bootstrap\.js/i);
			if (srcMatch)
			{
				var isDataSet = script.getAttribute('data-package-name') == 'SDL.Client.Bootstrap';
				if (isDataSet || !path)
				{
					path = (srcMatch[2] || "") + "/";
					versionFile = script.getAttribute("data-version-file") || "/version.txt";
					sdl_configuration.settingsFile = script.getAttribute("data-configuration-file") || "/configuration.xml";
					if (isDataSet)
					{
						break;
					}
				}
			}
		}
	}

	if (path == null)
	{
		throw Error("bootstrap.js: unable to resolve path to 'bootstrap.js'.");
	}
	
	function getXhr(url, callback, breakOnError)
	{
		var xhr;
		if (window.XMLHttpRequest)
		{
			xhr = new window.XMLHttpRequest();
		}

		if (!xhr)
		{
			throw Error("bootstrap.js: unable to create XMLHttpRequest object.");
		}
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4)	// 4 is 'ready'
			{
				xhr.onreadystatechange = function(){};
				if (breakOnError && xhr.status != 200)
				{
					var error;
					try
					{
						error = xhr.statusText;
					}
					catch (err)
					{
						error = xhr.responseText || "";
					}
					throw Error("bootstrap.js: unable to load \"" + url + ": (" + xhr.status + ") " + error);
				}
				callback(xhr.responseText || "");
			}
		};

		xhr.open("GET", url, true);
		xhr.send();
	}

	var reload = (new Date().getTime() - 1380000000000)/60000|0	// the value changes every minute triggering reload of the version file every minute
	getXhr(versionFile + "?" + reload, function(result)
	{
		var version = "";
		if (result)
		{
			var m = result.match(/^\s*confVersion\s*=\s*(\d+(\.\d+)*)/m);
			if (m)
			{
				// configuration version
				sdl_configuration.settingsVersion = m[1];
			}

			m = result.match(/^\s*initVersion\s*=\s*(\d+(\.\d+)*)/m);
			if (m)
			{
				// initial package version
				version = m[1];
			}
		}

		var url = "Library/Core/Packages/SDL.Client.Init.js";
		getXhr(path + url + (version ? "?" + version : ""), function(result)
		{
			var resources = (sdl_client.Resources || (sdl_client.Resources = {}));
			var packages = resources.preloadPackages || (resources.preloadPackages = {});
			packages["~/" + url.toLowerCase()] = {packageName: "SDL.Client.Init", url: "~/" + url, data: result};

			var globalEval = eval;
			url = resources.executingPackageUrl = location.protocol + "//" + location.host + path + url;
			globalEval(result + "\n//@ sourceURL=" + url);
		});
	});
})();