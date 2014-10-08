 /// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="ActionBar.ts" />

module SDL.UI.Controls
{
	export interface JQueryActionStrip extends SDL.UI.Core.Controls.JQueryControl
	{
		getActionFlag(): boolean;
	}
}

interface JQuery
{
	actionBar(options?: SDL.UI.Controls.IActionBarOptions): SDL.UI.Controls.JQueryActionStrip;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.ActionBar, "actionBar", [
		{ method: "getActionFlag", returnsValue: true }
	]);