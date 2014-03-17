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
	globalEval(/*FILE-BEGIN*/"/// \u003creference path=\"../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"../../SDL.Client.UI.Core/Controls/jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"Button.ts\" /\u003e\r\n\r\nSDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Button, \"button\", [\r\n    { method: \"isOn\", returnsValue: true },\r\n    { method: \"isOff\", returnsValue: true },\r\n    { method: \"toggleOn\" },\r\n    { method: \"toggleOff\" },\r\n    { method: \"disable\" },\r\n    { method: \"enable\" }\r\n]);\r\n//# sourceMappingURL=Button.jQuery.js.map\r\n"/*FILE-END*/ + '\n//@ sourceURL=' + (packageContextUrl ? packageContextUrl.replace(/([^\/]+\/){1}$/, '') : defaultLocation) + "Button/Button.jQuery.js");
	globalEval(/*FILE-BEGIN*/"/// \u003creference path=\"../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"../../SDL.Client.UI.Core/Controls/jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"Callout.ts\" /\u003e\r\n\r\nSDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Callout, \"callout\", [\r\n    { method: \"show\" },\r\n    { method: \"hide\" }\r\n]);\r\n//# sourceMappingURL=Callout.jQuery.js.map\r\n"/*FILE-END*/ + '\n//@ sourceURL=' + (packageContextUrl ? packageContextUrl.replace(/([^\/]+\/){1}$/, '') : defaultLocation) + "Callout/Callout.jQuery.js");
	globalEval(/*FILE-BEGIN*/"/// \u003creference path=\"../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"../../SDL.Client.UI.Core/Controls/jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"Dialog.ts\" /\u003e\r\n\r\nSDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Dialog, \"dialog\", [\r\n    { method: \"show\" },\r\n    { method: \"hide\" }\r\n]);\r\n//# sourceMappingURL=Dialog.jQuery.js.map\r\n"/*FILE-END*/ + '\n//@ sourceURL=' + (packageContextUrl ? packageContextUrl.replace(/([^\/]+\/){1}$/, '') : defaultLocation) + "Dialog/Dialog.jQuery.js");
	globalEval(/*FILE-BEGIN*/"/// \u003creference path=\"../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"../../SDL.Client.UI.Core/Controls/jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"Message.ts\" /\u003e\r\n\r\nSDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Message, \"message\");\r\n//# sourceMappingURL=Message.jQuery.js.map\r\n"/*FILE-END*/ + '\n//@ sourceURL=' + (packageContextUrl ? packageContextUrl.replace(/([^\/]+\/){1}$/, '') : defaultLocation) + "Message/Message.jQuery.js");
	globalEval(/*FILE-BEGIN*/"/// \u003creference path=\"../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"../../SDL.Client.UI.Core/Controls/jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"Tabs.ts\" /\u003e\r\n\r\nSDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Tabs, \"tabs\", [\r\n    { method: \"selectNext\" },\r\n    { method: \"selectPrevious\" },\r\n    { method: \"selectFirst\" },\r\n    { method: \"selectLast\" },\r\n    { method: \"selectedIndex\", implementation: \"getSelectedIndex\", returnsValue: true },\r\n    { method: \"selection\", implementation: \"getSelection\", returnsValue: true },\r\n    { method: \"setSelection\" },\r\n    { method: \"setSelectedIndex\" }\r\n]);\r\n//# sourceMappingURL=Tabs.jQuery.js.map\r\n"/*FILE-END*/ + '\n//@ sourceURL=' + (packageContextUrl ? packageContextUrl.replace(/([^\/]+\/){1}$/, '') : defaultLocation) + "Tabs/Tabs.jQuery.js");
	globalEval(/*FILE-BEGIN*/"/// \u003creference path=\"../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"../../SDL.Client.UI.Core/Controls/jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"Tooltip.ts\" /\u003e\r\n\r\nSDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Tooltip, \"tooltip\", [\r\n    { method: \"show\", implementation: \"showTooltip\" },\r\n    { method: \"hide\", implementation: \"hideTooltip\" },\r\n    { method: \"dospose\" }\r\n]);\r\n//# sourceMappingURL=Tooltip.jQuery.js.map\r\n"/*FILE-END*/ + '\n//@ sourceURL=' + (packageContextUrl ? packageContextUrl.replace(/([^\/]+\/){1}$/, '') : defaultLocation) + "Tooltip/Tooltip.jQuery.js");
	globalEval(/*FILE-BEGIN*/"/// \u003creference path=\"../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"../../SDL.Client.UI.Core/Controls/jQuery.d.ts\" /\u003e\r\n/// \u003creference path=\"ScrollView.ts\" /\u003e\r\n\r\nSDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.ScrollView, \"scrollView\");\r\n//# sourceMappingURL=ScrollView.jQuery.js.map\r\n"/*FILE-END*/ + '\n//@ sourceURL=' + (packageContextUrl ? packageContextUrl.replace(/([^\/]+\/){1}$/, '') : defaultLocation) + "ScrollView/ScrollView.jQuery.js");
})();