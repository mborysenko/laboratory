/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="DropdownList.ts" />

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.DropdownList, "dropdownList", [
    { method: "isDisabled", returnsValue: true },
    { method: "getValue", returnsValue: true },
    { method: "setValue" },
    { method: "disable" },
    { method: "enable" }
]);
//# sourceMappingURL=DropdownList.jQuery.js.map
