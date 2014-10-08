/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="ActionBar.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryActionStrip extends Core.Controls.JQueryControl {
        getActionFlag(): boolean;
    }
}
interface JQuery {
    actionBar(options?: SDL.UI.Controls.IActionBarOptions): SDL.UI.Controls.JQueryActionStrip;
}
