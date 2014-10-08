/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="RadioButton.ts" />

module SDL.UI.Controls
{
	export interface JQueryRadioButton extends SDL.UI.Core.Controls.JQueryControl
	{
		getInputElement(): HTMLInputElement;
	}
}

interface JQuery
{
	radioButton(): SDL.UI.Controls.JQueryRadioButton;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.RadioButton, "radioButton",
[
	{ method: "getInputElement", returnsValue: true }
]);