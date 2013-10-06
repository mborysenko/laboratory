/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Tooltip.ts" />
interface JQuery
{
	tooltip(options?: SDL.UI.Controls.ITooltipOptions): JQuery;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Tooltip, "tooltip",
	[
		{ method: "show", implementation: "showTooltip" },
		{ method: "hide", implementation: "hideTooltip" }
	]);