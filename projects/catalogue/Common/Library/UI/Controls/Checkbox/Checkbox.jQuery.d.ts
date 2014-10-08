/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Checkbox.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryCheckbox extends Core.Controls.JQueryControl {
        getInputElement(): HTMLInputElement;
    }
}
interface JQuery {
    checkbox(): SDL.UI.Controls.JQueryCheckbox;
}
