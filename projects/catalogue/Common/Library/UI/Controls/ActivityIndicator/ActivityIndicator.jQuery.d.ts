/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="ActivityIndicator.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryActivityIndicator extends Core.Controls.JQueryControl {
    }
}
interface JQuery {
    activityIndicator(options?: SDL.UI.Controls.IActivityIndicatorOptions): SDL.UI.Controls.JQueryActivityIndicator;
}
