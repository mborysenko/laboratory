/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="ResizeTrigger.ts" />
module SDL.UI.Controls
{
	export interface JQueryResizeTrigger extends SDL.UI.Core.Controls.JQueryControl
	{
	}
}

interface JQuery
{
	resizeTrigger(): SDL.UI.Controls.JQueryResizeTrigger;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.ResizeTrigger, "resizeTrigger");