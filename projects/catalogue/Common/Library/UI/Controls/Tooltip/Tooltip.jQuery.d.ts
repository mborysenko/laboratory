/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Tooltip.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryTooltip extends Core.Controls.JQueryControl {
    }
}
interface JQuery {
    tooltip(options?: SDL.UI.Controls.ITooltipOptions): SDL.UI.Controls.JQueryTooltip;
}
