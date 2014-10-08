/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Button.ts" />

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Button, "button", [
    { method: "isOn", returnsValue: true },
    { method: "isOff", returnsValue: true },
    { method: "toggleOn" },
    { method: "toggleOff" },
    { method: "disable" },
    { method: "enable" }
]);
//# sourceMappingURL=Button.jQuery.js.map
