/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Message.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryMessage extends Core.Controls.JQueryControl {
    }
}
interface JQuery {
    message(options?: SDL.UI.Controls.IMessageOptions): SDL.UI.Controls.JQueryMessage;
}
