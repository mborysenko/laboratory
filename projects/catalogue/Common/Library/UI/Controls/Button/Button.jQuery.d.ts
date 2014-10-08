/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Button.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryButton extends Core.Controls.JQueryControl {
        enable(): JQueryButton;
        disable(): JQueryButton;
        isOn(): boolean;
        isOff(): boolean;
        toggleOn(): JQueryButton;
        toggleOff(): JQueryButton;
    }
}
interface JQuery {
    button(options?: SDL.UI.Controls.IButtonOptions): SDL.UI.Controls.JQueryButton;
}
