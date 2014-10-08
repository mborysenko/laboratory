 /// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="TopBar.ts" />
module SDL.UI.Controls
{
	export interface JQueryTopBar extends SDL.UI.Core.Controls.JQueryControl
	{
		showRibbonTab(tabId: string): void;
		hideRibbonTab(tabId: string): void;
		selectRibbonTab(tabId: string): void;
		selectedRibbonTabId(): string;
		showButton(buttonId: TopBarButton): void;
		hideButton(buttonId: TopBarButton): void;
		selectButton(buttonId: TopBarButton): void;
		unselectButton(buttonId: TopBarButton): void;
		toggleButton(buttonId: TopBarButton): void;
		getButtonSelectionState(buttonId: TopBarButton): ITopBarButtonSelectionState;
	}
}

interface JQuery
{
	topBar(options?: SDL.UI.Controls.ITopBarOptions): SDL.UI.Controls.JQueryTopBar;
}

SDL.UI.Core.Controls.createJQueryPlugin(SDL.jQuery, SDL.UI.Controls.TopBar, "topBar",
	[
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