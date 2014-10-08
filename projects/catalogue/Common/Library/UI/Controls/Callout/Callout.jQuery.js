/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Callout.ts" />

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Callout, "callout", [
    { method: "show" },
    { method: "hide" },
    { method: "location", implementation: "setLocation" },
    { method: "getActionFlag", returnsValue: true }
]);
//# sourceMappingURL=Callout.jQuery.js.map
