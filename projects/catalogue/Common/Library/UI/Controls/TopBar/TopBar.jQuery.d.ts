/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/jQuery.d.ts" />
/// <reference path="TopBar.d.ts" />
declare module SDL.UI.Controls {
    interface JQueryTopBar extends Core.Controls.JQueryControl {
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
interface JQuery {
    topBar(options?: SDL.UI.Controls.ITopBarOptions): SDL.UI.Controls.JQueryTopBar;
}
