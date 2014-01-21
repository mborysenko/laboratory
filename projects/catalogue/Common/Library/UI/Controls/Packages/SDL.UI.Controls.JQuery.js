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
				if (script.getAttribute('data-package-name') == 'SDL.UI.Controls.JQuery')
				{
					packageContextUrl = src.replace(/[^\/]*$/, '');
					break;
				}
				else if (!packageContextUrl &&
					src.slice(-26).toLowerCase() == '/sdl.ui.controls.jquery.js')
				{
					packageContextUrl = src.slice(0, -25);
				}
			}
		}
	}

	var globalEval = eval;
	globalEval(/*FILE-BEGIN*/"SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Tooltip, \"tooltip\", [\r\n    { method: \"show\", implementation: \"showTooltip\" },\r\n    { method: \"hide\", implementation: \"hideTooltip\" }\r\n]);\r\n//# sourceMappingURL=Tooltip.jQuery.js.map\r\n"/*FILE-END*/ + '\n//@ sourceURL=' + (packageContextUrl ? packageContextUrl.replace(/([^\/]+\/){1}$/, '') : defaultLocation) + "Tooltip/Tooltip.jQuery.js");
})();