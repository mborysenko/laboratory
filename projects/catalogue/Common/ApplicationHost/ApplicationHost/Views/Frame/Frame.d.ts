/// <reference path="../../ViewModels/Navigation.d.ts" />
/// <reference path="../../../../../SDL.Client/SDL.Client.Core/Types/Object.d.ts" />
/// <reference path="../../../../../SDL.Client/SDL.Client.UI.Core/Views/ViewBase.d.ts" />
/// <reference path="../../../../../SDL.Client/SDL.Client.UI.Core.Knockout/ViewModels/ViewModelBase.d.ts" />
declare module SDL.Client.UI.ApplicationHost.Views {
    interface IFrameViewModel extends SDL.UI.Core.Knockout.ViewModels.ViewModelBase {
        initialized: KnockoutObservable<boolean>;
        navigationGroups: ApplicationHost.ViewModels.Navigation.INavigationGroup[];
        visitedNavigationGroups: KnockoutObservableArray<ApplicationHost.ViewModels.Navigation.INavigationGroup>;
        currentNavigationItem: KnockoutObservable<ApplicationHost.ViewModels.Navigation.INavigationItem>;
        currentNavigationGroup: KnockoutObservable<ApplicationHost.ViewModels.Navigation.INavigationGroup>;
        navigationPaneShown: KnockoutObservable<boolean>;
        navigationPaneToggleShown: KnockoutComputed<boolean>;
        expandedNavigationGroup: KnockoutObservable<ApplicationHost.ViewModels.Navigation.INavigationGroup>;
        navigationItemTargetDisplays: ApplicationHost.ViewModels.Navigation.INavigationItemTargetDisplay[];
        authenticationTargetDisplays: ApplicationHost.ViewModels.Navigation.IAuthenticationTargetDisplay[];
        topNavigationGroup: ApplicationHost.ViewModels.Navigation.INavigationGroup;
        homeNavigationItem: ApplicationHost.ViewModels.Navigation.INavigationItem;
        shownTargetDisplay: KnockoutComputed<ApplicationHost.ViewModels.Navigation.ITargetDisplay>;
        toggleNavigationPane: () => void;
        selectNavigationItem: (item: ApplicationHost.ViewModels.Navigation.INavigationItem) => void;
        selectNavigationGroup: (group: ApplicationHost.ViewModels.Navigation.INavigationGroup) => void;
        toggleExpandNavigationGroup: (group: ApplicationHost.ViewModels.Navigation.INavigationGroup) => void;
        onNavigationSelectionChanged: KnockoutComputed<void>;
        onExpandedNavigationGroupChanged: KnockoutSubscription;
        blurredNavigationPane: () => void;
        setTargetDisplayLocation: (targetDisplay: ApplicationHost.ViewModels.Navigation.INavigationItemTargetDisplay, node: Node) => void;
        animateLoadingFeedback: (element: HTMLElement) => void;
        initCustomScroll: (customScrollWrapper: HTMLElement) => void;
        getNavigationItemName: (item: ApplicationHost.ViewModels.Navigation.INavigationItem) => string;
        getNavigationGroupName: (item: ApplicationHost.ViewModels.Navigation.INavigationGroup) => string;
        registerTargetDisplayFrame: (targetDisplay: ApplicationHost.ViewModels.Navigation.ITargetDisplay, frame: HTMLIFrameElement) => void;
    }
    class Frame extends SDL.UI.Core.Views.ViewBase {
        private scrollHeightMonitorInterval;
        private model;
        private initialized;
        private updateTitleBar;
        public getRenderOptions(): IFrameViewModel;
        private setInitialized();
    }
}
