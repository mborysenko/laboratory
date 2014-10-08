/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="ScrollView.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryScrollView extends Core.Controls.JQueryControl {
    }
}
interface JQuery {
    scrollView(options?: SDL.UI.Controls.IScrollViewOptions): SDL.UI.Core.Controls.JQueryControl;
}
