/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="TextInput.ts" />

module SDL.UI.Controls
{
	export interface JQueryTextInput extends SDL.UI.Core.Controls.JQueryControl
	{
		setInvalid(value: boolean): JQueryTextInput;
		isInvalid(): boolean;
	}
}

interface JQuery
{
	textInput(options?: SDL.UI.Controls.ITextInputOptions): SDL.UI.Controls.JQueryTextInput;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.TextInput, "textInput",
[
	{ method: "isInvalid", returnsValue: true },
	{ method: "setInvalid" }
]);