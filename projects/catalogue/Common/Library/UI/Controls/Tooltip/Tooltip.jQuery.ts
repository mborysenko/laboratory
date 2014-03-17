/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Tooltip.ts" />

module SDL.UI.Controls
{
	export interface JQueryTooltip extends SDL.UI.Core.Controls.JQueryControl
	{
	}
}

interface JQuery
{
	tooltip(options?: SDL.UI.Controls.ITooltipOptions): SDL.UI.Controls.JQueryTooltip;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Tooltip, "tooltip",
	[
		{ method: "show", implementation: "showTooltip" },
		{ method: "hide", implementation: "hideTooltip" },
		{ method: "dospose" }
	]);