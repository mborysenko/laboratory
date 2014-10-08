/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="TopPageTabs.ts" />

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.TopPageTabs, "topPageTabs", [
    { method: "selectNext" },
    { method: "selectPrevious" },
    { method: "selectFirst" },
    { method: "selectLast" },
    { method: "selectedIndex", implementation: "getSelectedIndex", returnsValue: true },
    { method: "selection", implementation: "getSelection", returnsValue: true },
    { method: "setSelection" },
    { method: "setSelectedIndex" }
]);
//# sourceMappingURL=TopPageTabs.jQuery.js.map
