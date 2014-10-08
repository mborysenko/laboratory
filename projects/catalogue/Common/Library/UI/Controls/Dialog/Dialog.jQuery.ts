  /// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Dialog.ts" />

module SDL.UI.Controls
{
	export interface JQueryDialog extends SDL.UI.Core.Controls.JQueryControl
	{
		getActionFlag(): boolean;
	}
}

interface JQuery
{
	message(options?: SDL.UI.Controls.IDialogOptions): SDL.UI.Controls.JQueryDialog;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Dialog, "dialog",
	[
		{ method: "show" },
		{ method: "hide" },
		{ method: "getActionFlag", returnsValue: true }
	]);