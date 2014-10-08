 /// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Message.ts" />

module SDL.UI.Controls
{
	export interface JQueryMessage extends SDL.UI.Core.Controls.JQueryControl
	{
	}
}

interface JQuery
{
	message(options?: SDL.UI.Controls.IMessageOptions): SDL.UI.Controls.JQueryMessage;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Message, "message");