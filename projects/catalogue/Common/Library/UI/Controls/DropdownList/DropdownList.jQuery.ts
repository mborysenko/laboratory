/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="DropdownList.ts" />

module SDL.UI.Controls
{
	export interface JQueryDropdownList extends SDL.UI.Core.Controls.JQueryControl
	{
		enable(): JQueryDropdownList;
		disable(): JQueryDropdownList;
		isDisabled(): boolean;
		getValue(): string;
		setValue(value: string): JQueryDropdownList;
	}
}

interface JQuery
{
	dropdownList(options?: SDL.UI.Controls.IDropdownListOptions): SDL.UI.Controls.JQueryDropdownList;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.DropdownList, "dropdownList",
	[
		{ method: "isDisabled", returnsValue: true },
		{ method: "getValue", returnsValue: true },
		{ method: "setValue" },
		{ method: "disable" },
		{ method: "enable" }
	]);