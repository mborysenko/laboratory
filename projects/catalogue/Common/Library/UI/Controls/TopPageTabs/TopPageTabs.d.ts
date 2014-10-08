/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
/// <reference path="../Tooltip/Tooltip.jQuery.d.ts" />
/// <reference path="../ScrollView/ScrollView.jQuery.d.ts" />
/// <reference path="../Callout/Callout.jQuery.d.ts" />
/// <reference path="../ResizeTrigger/ResizeTrigger.jQuery.d.ts" />
declare module SDL.UI.Controls {
    interface ITabsOptions {
        selectedIndex?: number;
    }
    interface ITabsProperties extends Core.Controls.IControlBaseProperties {
        options: ITabsOptions;
    }
    class TopPageTabs extends Core.Controls.ControlBase {
        public properties: ITabsProperties;
        private $element;
        private initialTabIndex;
        private $pages;
        private $firstOffScreenTab;
        private $leftOffScreenTabs;
        private $lastShownPage;
        private flyoutButtonMinWidth;
        private tabSwitchHeight;
        private flyoutMenuElement;
        private flyoutMenuListElement;
        private flyoutMenuPopulated;
        private flyoutMenuPositionBox;
        private flyoutCallout;
        private flyoutScrollView;
        private isFlyoutButtonShown;
        private isFlyoutMenuShown;
        private isFlyoutMenuHiding;
        private $resizeTrigger;
        private containerMutationObserver;
        private tabsPagesMutationObservers;
        private tabsNoPagesMutationObservers;
        private monitoring;
        private monitorTimeout;
        private monitorCount;
        constructor(element: HTMLElement, options?: ITabsOptions);
        public $initialize(): void;
        public update(options?: ITabsOptions): void;
        public selectNext(): void;
        public selectPrevious(): void;
        public selectFirst(): void;
        public selectLast(): void;
        public setSelectedIndex(index: number): void;
        public setSelection(page: JQuery): void;
        public setSelectedElement(page: HTMLElement): void;
        public getSelectedIndex(): number;
        public getSelection(): JQuery;
        public getSelectedElement(): HTMLElement;
        private updateFlyoutButton(show, flyoutButtonWidth?);
        private positionFlyoutMenu();
        private updateFlyoutMenuList(element?, updateProperty?);
        private updateMenuItem(item, tab, updateProperty?);
        private invalidateFlyoutMenu();
        private setFlyoutMenuListDimensions();
        private scrollToFlyoutMenuSelection();
        private showFlyoutMenu();
        private hideFlyoutMenu();
        private processHidden();
        private processDescendants();
        private recalculate();
        private onElementMouseDown(e);
        private onFlyoutMouseDown(e);
        private onFlyoutHide();
        private onKeyDown(e);
        private cancelScroll(e);
        private updateSelection(newPage, oldPage?);
        private onTabsElementResize();
        private onTabsChildrenChange();
        private onPageAttributeChange(changes);
        private onPageSwitchLabelChange(changes);
        private onPageSwitchTitleChange(changes);
        private onNoPageChange();
        private processChanges();
        private startMonitoring();
        private stopMonitoring();
        private resumeMonitoring();
        private cleanUp();
    }
}
