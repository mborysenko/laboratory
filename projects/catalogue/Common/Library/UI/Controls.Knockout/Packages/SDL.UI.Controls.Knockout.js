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
				if (script.getAttribute('data-package-name') == 'SDL.UI.Controls.Knockout')
				{
					packageContextUrl = src.replace(/[^\/]*$/, '');
					break;
				}
				else if (!packageContextUrl &&
					src.slice(-28).toLowerCase() == '/sdl.ui.controls.knockout.js')
				{
					packageContextUrl = src.slice(0, -27);
				}
			}
		}
	}

	var globalEval = eval;
	globalEval(/*FILE-BEGIN*/"/// \u003creference path=\"../../SDL.Client.UI.Core.Knockout/Controls/Base.d.ts\" /\u003e\r\n/// \u003creference path=\"../../SDL.Client.UI.Controls/Tooltip/Tooltip.d.ts\" /\u003e\r\nSDL.UI.Core.Knockout.Controls.createKnockoutBinding(SDL.UI.Controls.Tooltip, \"SDL.UI.Controls.Knockout.Tooltip\", [\r\n    { event: \"show\" },\r\n    { event: \"hide\" },\r\n    { event: \"update\" }\r\n]);\r\n//# sourceMappingURL=Tooltip.js.map\r\n"/*FILE-END*/ + '\n//@ sourceURL=' + (packageContextUrl ? packageContextUrl.replace(/([^\/]+\/){1}$/, '') : defaultLocation) + "Tooltip/Tooltip.js");
})();