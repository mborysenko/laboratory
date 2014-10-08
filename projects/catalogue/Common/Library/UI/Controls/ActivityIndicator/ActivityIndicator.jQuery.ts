 /// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="ActivityIndicator.ts" />
module SDL.UI.Controls
{
	export interface JQueryActivityIndicator extends SDL.UI.Core.Controls.JQueryControl
	{

	}
}

interface JQuery
{
	activityIndicator(options?: SDL.UI.Controls.IActivityIndicatorOptions): SDL.UI.Controls.JQueryActivityIndicator;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.ActivityIndicator, "activityIndicator",
	[

	]);