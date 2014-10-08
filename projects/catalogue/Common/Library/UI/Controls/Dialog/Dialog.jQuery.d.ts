/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Dialog.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryDialog extends Core.Controls.JQueryControl {
        getActionFlag(): boolean;
    }
}
interface JQuery {
    message(options?: SDL.UI.Controls.IDialogOptions): SDL.UI.Controls.JQueryDialog;
}
