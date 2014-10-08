/// <reference path="../../../SDL.Client.Core/Application/Application.d.ts" />
/// <reference path="../../../SDL.Client.UI.Core.Knockout/ViewModels/ViewModelBase.d.ts" />
/// <reference path="../../../SDL.Client.UI.Controls/TopBar/Application/TopBar.d.ts" />
declare module SDL.UI.Controls.Knockout.Application.ViewModels {
    interface ITopBarRibbonTab {
        id: KnockoutObservable<string>;
        label: KnockoutObservable<string>;
        hidden?: KnockoutObservable<boolean>;
    }
    interface ITopBarButtonPosition {
        left?: KnockoutObservable<number>;
        right?: KnockoutObservable<number>;
    }
    interface ITopBarButtonOptions {
        hidden?: KnockoutObservable<boolean>;
        selected?: KnockoutObservable<boolean>;
        position?: ITopBarButtonPosition;
    }
    interface ITopBarButtonWithValueOptions extends ITopBarButtonOptions {
        value?: KnockoutObservable<number>;
    }
    interface ITopBarButtonUserOptions extends ITopBarButtonOptions {
        isLoggedIn?: KnockoutObservable<boolean>;
        isPicture?: KnockoutObservable<boolean>;
        pictureUrl?: KnockoutObservable<string>;
    }
    interface ITopBarButtons {
        workflows?: ITopBarButtonWithValueOptions;
        notifications?: ITopBarButtonWithValueOptions;
        messages?: ITopBarButtonWithValueOptions;
        user?: ITopBarButtonUserOptions;
        search?: ITopBarButtonOptions;
        help?: ITopBarButtonOptions;
        close?: KnockoutObservable<boolean>;
    }
    interface ITopBar {
        ribbonTabs?: KnockoutObservableArray<ITopBarRibbonTab>;
        selectedRibbonTabId?: KnockoutObservable<string>;
        buttons?: ITopBarButtons;
        onCloseClick?: () => void;
    }
    class TopBar extends Core.Knockout.ViewModels.ViewModelBase implements ITopBar {
        public ribbonTabs: KnockoutObservableArray<ITopBarRibbonTab>;
        public selectedRibbonTabId: KnockoutObservable<string>;
        public buttons: ITopBarButtons;
        public onCloseClick: () => void;
        private computedOptions;
        constructor(ribbonTabs?: ITopBarRibbonTab[], selectedRibbonTabId?: KnockoutObservable<string>, buttons?: ITopBarButtons);
        public $initialize(): void;
        private pushTopBarOptions();
        private onTopBarEvent(e);
    }
}
