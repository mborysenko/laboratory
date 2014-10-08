/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="DropdownList.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryDropdownList extends Core.Controls.JQueryControl {
        enable(): JQueryDropdownList;
        disable(): JQueryDropdownList;
        isDisabled(): boolean;
        getValue(): string;
        setValue(value: string): JQueryDropdownList;
    }
}
interface JQuery {
    dropdownList(options?: SDL.UI.Controls.IDropdownListOptions): SDL.UI.Controls.JQueryDropdownList;
}
