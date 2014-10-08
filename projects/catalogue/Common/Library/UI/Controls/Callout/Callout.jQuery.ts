  /// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Callout.ts" />

module SDL.UI.Controls
{
	export interface JQueryCallout extends SDL.UI.Core.Controls.JQueryControl
	{
		location(targetCoordinates: ICalloutTargetCoordinates): void;
		location(targetBox: ICalloutTargetBox): void;
		getActionFlag(): boolean;
	}
}

interface JQuery
{
	callout(options?: SDL.UI.Controls.ICalloutOptions): SDL.UI.Controls.JQueryCallout;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Callout, "callout",
	[
		{ method: "show" },
		{ method: "hide" },
		{ method: "location", implementation: "setLocation" },
		{ method: "getActionFlag", returnsValue: true }
	]);