/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="TextInput.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryTextInput extends Core.Controls.JQueryControl {
        setInvalid(value: boolean): JQueryTextInput;
        isInvalid(): boolean;
    }
}
interface JQuery {
    textInput(options?: SDL.UI.Controls.ITextInputOptions): SDL.UI.Controls.JQueryTextInput;
}
