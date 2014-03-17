/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="Tooltip.ts" />

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.Tooltip, "tooltip", [
    { method: "show", implementation: "showTooltip" },
    { method: "hide", implementation: "hideTooltip" },
    { method: "dospose" }
]);
//# sourceMappingURL=Tooltip.jQuery.js.map
