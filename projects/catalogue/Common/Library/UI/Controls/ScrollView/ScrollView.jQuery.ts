/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="ScrollView.ts" />

module SDL.UI.Controls
{
	export interface JQueryScrollView extends SDL.UI.Core.Controls.JQueryControl
	{
	}
}

interface JQuery
{
	scrollView(options?: SDL.UI.Controls.IScrollViewOptions): SDL.UI.Core.Controls.JQueryControl;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.ScrollView, "scrollView");