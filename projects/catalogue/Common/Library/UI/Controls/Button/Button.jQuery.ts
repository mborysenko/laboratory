/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Button.ts" />
module SDL.UI.Controls
{
	export interface JQueryButton extends SDL.UI.Core.Controls.JQueryControl
	{
		enable(): JQueryButton;
		disable(): JQueryButton;
		isOn(): boolean;
		isOff(): boolean;
		toggleOn(): JQueryButton;
		toggleOff(): JQueryButton;
	}
}

interface JQuery
{
	button(options?: SDL.UI.Controls.IButtonOptions): SDL.UI.Controls.JQueryButton;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Button, "button",
	[
		{ method: "isOn", returnsValue: true },
		{ method: "isOff", returnsValue: true },
		{ method: "toggleOn" },
		{ method: "toggleOff" },
		{ method: "disable" },
		{ method: "enable" }
	]);