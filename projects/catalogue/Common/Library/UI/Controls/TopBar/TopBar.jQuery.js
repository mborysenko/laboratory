/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="TopBar.ts" />

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.TopBar, "topBar", [
    { method: "showRibbonTab" },
    { method: "hideRibbonTab" },
    { method: "selectRibbonTab" },
    { method: "selectedRibbonTabId", returnsValue: true },
    { method: "showButton" },
    { method: "hideButton" },
    { method: "selectButton" },
    { method: "unselectButton" },
    { method: "toggleButton" },
    { method: "getButtonSelectionState", returnsValue: true }
]);
//# sourceMappingURL=TopBar.jQuery.js.map
