/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="TopPageTabs.ts" />
module SDL.UI.Controls
{
	export interface JQueryTopPageTabs extends SDL.UI.Core.Controls.JQueryControl
	{
		selectNext(): JQueryTopPageTabs;
		selectPrevious(): JQueryTopPageTabs;
		selectFirst(): JQueryTopPageTabs;
		selectLast(): JQueryTopPageTabs;
		selectedIndex(): number;
		selection(): JQuery;
		setSelection(index: number): JQueryTopPageTabs;
		setSelectedIndex(index: number): JQueryTopPageTabs;
	}
}

interface JQuery
{
	topPageTabs(options?: SDL.UI.Controls.ITabsOptions): SDL.UI.Controls.JQueryTopPageTabs;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.TopPageTabs, "topPageTabs",
	[
		{ method: "selectNext" },
		{ method: "selectPrevious" },
		{ method: "selectFirst" },
		{ method: "selectLast" },
		{ method: "selectedIndex", implementation: "getSelectedIndex", returnsValue: true },
		{ method: "selection", implementation: "getSelection", returnsValue: true },
		{ method: "setSelection" },
		{ method: "setSelectedIndex" }
	]); 