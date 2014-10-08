/// <reference path="../../SDL.Client.Core/Libraries/Globalize/SDL.Globalize.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
/// <reference path="../ScrollView/ScrollView.jQuery.d.ts" />
/// <reference path="../Callout/Callout.jQuery.d.ts" />
/// <reference path="../ResizeTrigger/ResizeTrigger.jQuery.d.ts" />
/// <reference path="../Tooltip/Tooltip.jQuery.d.ts" />
declare module SDL.UI.Controls {
    interface ITopBarRibbonTab extends Client.Application.ITopBarRibbonTab {
    }
    enum TopBarButton {
        MESSAGES,
        WORKFLOWS,
        NOTIFICATIONS,
        USER,
        SEARCH,
        HELP,
        CLOSE,
    }
    interface ITopBarButtonOptions extends Client.Application.ITopBarButtonOptions {
    }
    interface ITopBarButtons extends Client.Application.ITopBarButtons {
    }
    interface ITopBarOptions extends Client.Application.ITopBarOptions {
        ribbonTabs?: ITopBarRibbonTab[];
        buttons?: ITopBarButtons;
        ribbonTabsFlyoutMenuShown?: boolean;
    }
    interface ITopBarProperties extends Core.Controls.IControlBaseProperties {
        options: ITopBarOptions;
        $element: JQuery;
        $resizeTrigger: JQuery;
        $resizeTriggerControl: JQueryResizeTrigger;
        $ribbonTabsContainer: JQuery;
        $buttonsContainer: JQuery;
        $tabsOverflowButton: JQuery;
        flyoutMenuPopulated: boolean;
        flyoutMenuElement: HTMLElement;
        flyoutMenuListElement: HTMLElement;
        flyoutCallout: JQueryCallout;
        flyoutScrollView: JQueryScrollView;
    }
    interface ITopBarButtonPosition {
        left: number;
        right: number;
    }
    interface ITopBarButtonSelectionState {
        selected: boolean;
        position?: ITopBarButtonPosition;
    }
    class TopBar extends Core.Controls.ControlBase {
        public properties: ITopBarProperties;
        constructor(element: HTMLElement, options?: ITopBarOptions);
        public $initialize(): void;
        public update(options?: ITopBarOptions): void;
        private hasRibbonTabId(id);
        private populateRibbonTabs();
        private populateButtons();
        private updateButtons();
        private onRibbonTabsResize();
        private calculateRibbonTabs();
        private onRibbonTabClick(e);
        private onButtonClick(e);
        private getRibbonTabIndexById(tabId);
        private getRibbonTabById(tabId);
        private showFlyoutMenu();
        private setFlyoutPosition();
        private updateFlyoutMenuList();
        private updateMenuItem(item, tab);
        private setFlyoutMenuListDimensions();
        private scrollToFlyoutMenuSelection();
        private hideFlyoutMenu();
        private onFlyoutHide();
        private onFlyoutKeyDown(e);
        private onFlyoutMouseDown(e);
        public selectNextRibbonTab(skipHidden?: boolean): void;
        public selectPreviousRibbonTab(skipHidden?: boolean): void;
        public selectFirstRibbonTab(skipHidden?: boolean): void;
        public selectLastRibbonTab(skipHidden?: boolean): void;
        public showRibbonTab(tabId: string): void;
        public hideRibbonTab(tabId: string): void;
        public selectRibbonTabId(tabId: string): void;
        public selectRibbonTabIndex(tabIndex: number): void;
        private getSelectedRibbonTab();
        private getFirstRibbonTab(skipHidden?);
        private getLastRibbonTab(skipHidden?);
        private getRibbonTabs(excludeHidden?);
        private selectRibbonTab($tab);
        public selectedRibbonTabId(): string;
        public showButton(buttonId: TopBarButton): void;
        public hideButton(buttonId: TopBarButton): void;
        public selectButton(buttonId: TopBarButton): void;
        public unselectButton(buttonId: TopBarButton): void;
        public toggleButton(buttonId: TopBarButton): void;
        public getButtonSelectionState(buttonId: TopBarButton): ITopBarButtonSelectionState;
        private getButtonPosition($button);
    }
}
