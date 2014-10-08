/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Checkbox.ts" />

module SDL.UI.Controls
{
	export interface JQueryCheckbox extends SDL.UI.Core.Controls.JQueryControl
	{
		getInputElement(): HTMLInputElement;
	}
}

interface JQuery
{
	checkbox(): SDL.UI.Controls.JQueryCheckbox;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Checkbox, "checkbox",
[
	{ method: "getInputElement", returnsValue: true }
]);