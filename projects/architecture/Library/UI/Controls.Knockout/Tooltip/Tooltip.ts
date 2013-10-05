/// <reference path="../../SDL.Client.UI.Core.Knockout/Controls/Base.d.ts" />
/// <reference path="../../SDL.Client.UI.Controls/Tooltip/Tooltip.d.ts" />
SDL.UI.Core.Knockout.Controls.createKnockoutBinding(SDL.UI.Controls.Tooltip, "SDL.UI.Controls.Knockout.Tooltip",
	[
		{ event: "show" },
		{ event: "hide" },
		{ event: "update" }
	]);