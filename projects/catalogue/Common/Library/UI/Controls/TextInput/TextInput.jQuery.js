/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="TextInput.ts" />

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.TextInput, "textInput", [
    { method: "isInvalid", returnsValue: true },
    { method: "setInvalid" }
]);
//# sourceMappingURL=TextInput.jQuery.js.map
