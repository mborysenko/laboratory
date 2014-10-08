/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="ResizeTrigger.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryResizeTrigger extends Core.Controls.JQueryControl {
    }
}
interface JQuery {
    resizeTrigger(): SDL.UI.Controls.JQueryResizeTrigger;
}
