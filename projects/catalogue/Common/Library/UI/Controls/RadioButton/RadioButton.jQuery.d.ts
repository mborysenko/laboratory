/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="RadioButton.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryRadioButton extends Core.Controls.JQueryControl {
        getInputElement(): HTMLInputElement;
    }
}
interface JQuery {
    radioButton(): SDL.UI.Controls.JQueryRadioButton;
}
