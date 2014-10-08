/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Callout.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryCallout extends Core.Controls.JQueryControl {
        location(targetCoordinates: ICalloutTargetCoordinates): void;
        location(targetBox: ICalloutTargetBox): void;
        getActionFlag(): boolean;
    }
}
interface JQuery {
    callout(options?: SDL.UI.Controls.ICalloutOptions): SDL.UI.Controls.JQueryCallout;
}
