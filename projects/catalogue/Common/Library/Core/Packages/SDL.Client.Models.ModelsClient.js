/*SDL-PACKAGE*/
var SDL;
(function()
{
	var packageContextUrl;
	var defaultLocation = location.protocol + '//' + location.host + '/';
	if (SDL && SDL.Client && SDL.Client.Resources && SDL.Client.Resources.executingPackageUrl)
	{
		packageContextUrl = SDL.Client.Resources.executingPackageUrl.replace(/[^\/]*$/, '');
		SDL.Client.Resources.executingPackageUrl = null;
	}
	else
	{
		var scripts = document.getElementsByTagName('script');
		for (var i = 0, len = scripts.length; i < len; i++)
		{
			var script = scripts[i];
			var src = script.src;
			if (src)
			{
				if (script.getAttribute('data-package-name') == 'SDL.Client.Models.ModelsClient')
				{
					packageContextUrl = src.replace(/[^\/]*$/, '');
					break;
				}
				else if (!packageContextUrl &&
					src.slice(-34).toLowerCase() == '/sdl.client.models.modelsclient.js')
				{
					packageContextUrl = src.slice(0, -33);
				}
			}
		}
	}

	var globalEval = eval;
	globalEval(/*FILE-BEGIN*/"(function()\r\n{\r\n\tvar sdl;\r\n\tvar models;\r\n\r\n\ttry\r\n\t{\r\n\t\tif (top.opener \u0026\u0026 !top.opener.closed \u0026\u0026 (sdl = top.opener.SDL) \u0026\u0026 sdl.Client)\r\n\t\t{\r\n\t\t\tmodels = sdl.Client.Models;\r\n\t\t}\r\n\t}\r\n\tcatch (err)\r\n\t{\r\n\t\t// must be cross-domain\r\n\t}\r\n\t\r\n\ttry\r\n\t{\r\n\t\tif (!models \u0026\u0026 parent \u0026\u0026 !parent.closed \u0026\u0026 parent != window \u0026\u0026 (sdl = parent.SDL) \u0026\u0026 sdl.Client)\r\n\t\t{\r\n\t\t\tmodels = sdl.Client.Models;\r\n\t\t}\r\n\t}\r\n\tcatch (err)\r\n\t{\r\n\t\t// must be cross-domain\r\n\t}\r\n\r\n\tif (!models)\r\n\t{\r\n\t\tSDL.Client.Diagnostics.Assert.raiseError(\"This is a stand-alone view, it does not have an opener or a parent that has SDL.Client.Models available.\");\r\n\t}\r\n\telse\r\n\t{\r\n\t\tSDL.Client.Models = models;\r\n\t\tSDL.Client.Models.ItemType = sdl.Client.Models.ItemType;\r\n\t}\r\n})();\r\n\r\nSDL.Client.Event.EventRegister.addEventHandler(models.getOwningWindow(), \"unload\", function ()\r\n\t{\r\n\t\tSDL.Client.Models = {};\r\n\t\tSDL.Client.Models.ItemType = {};\r\n\t});"/*FILE-END*/ + '\n//@ sourceURL=' + (packageContextUrl ? packageContextUrl.replace(/([^\/]+\/){1}$/, '') : defaultLocation) + "Models/ModelsClient.js");
})();