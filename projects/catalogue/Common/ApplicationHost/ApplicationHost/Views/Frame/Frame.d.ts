/// <reference path="../../ViewModels/Navigation.d.ts" />
/// <reference path="../../../../../SDL.Client/SDL.Client.Core/Types/Object.d.ts" />
/// <reference path="../../../../../SDL.Client/SDL.Client.UI.Core/Views/ViewBase.d.ts" />
/// <reference path="../../../../../SDL.Client/SDL.Client.UI.Core.Knockout/ViewModels/ViewModelBase.d.ts" />
declare module SDL.Client.UI.ApplicationHost.Views {
    interface IFrameViewModel extends SDL.UI.Core.Knockout.ViewModels.ViewModelBase {
        initialized: KnockoutObservable<boolean>;
        navigationGroups: ViewModels.Navigation.INavigationGroup[];
        visitedNavigationGroups: KnockoutObservableArray<ViewModels.Navigation.INavigationGroup>;
        currentNavigationItem: KnockoutObservable<ViewModels.Navigation.INavigationItem>;
        currentNavigationGroup: KnockoutObservable<ViewModels.Navigation.INavigationGroup>;
        navigationPaneShown: KnockoutObservable<boolean>;
        navigationPaneToggleShown: KnockoutComputed<boolean>;
        isTargetDisplayOut: (targetDisplay: ViewModels.Navigation.ITargetDisplay) => boolean;
        isTargetDisplaySlideAnimated: (targetDisplay: ViewModels.Navigation.ITargetDisplay, element: HTMLDivElement) => boolean;
        expandedNavigationGroup: KnockoutObservable<ViewModels.Navigation.INavigationGroup>;
        navigationItemTargetDisplays: ViewModels.Navigation.INavigationItemTargetDisplay[];
        authenticationTargetDisplays: ViewModels.Navigation.IAuthenticationTargetDisplay[];
        topNavigationGroup: ViewModels.Navigation.INavigationGroup;
        homeNavigationItem: ViewModels.Navigation.INavigationItem;
        shownTargetDisplay: KnockoutComputed<ViewModels.Navigation.ITargetDisplay>;
        toggleNavigationPane: () => void;
        selectNavigationItem: (item: ViewModels.Navigation.INavigationItem) => void;
        selectNavigationGroup: (group: ViewModels.Navigation.INavigationGroup) => void;
        toggleExpandNavigationGroup: (group: ViewModels.Navigation.INavigationGroup) => void;
        onNavigationSelectionChanged: KnockoutComputed<void>;
        onExpandedNavigationGroupChanged: KnockoutSubscription;
        blurredNavigationPane: () => void;
        setTargetDisplayLocation: (targetDisplay: ViewModels.Navigation.INavigationItemTargetDisplay, node: Node) => void;
        animateLoadingFeedback: (element: HTMLElement) => void;
        initCustomScroll: (customScrollWrapper: HTMLElement) => void;
        getNavigationItemName: (item: ViewModels.Navigation.INavigationItem) => string;
        getNavigationGroupName: (item: ViewModels.Navigation.INavigationGroup) => string;
        registerTargetDisplayFrame: (targetDisplay: ViewModels.Navigation.ITargetDisplay, frame: HTMLIFrameElement) => void;
    }
    class Frame extends SDL.UI.Core.Views.ViewBase {
        private model;
        private initialized;
        private updateTitleBar;
        public getRenderOptions(): IFrameViewModel;
        private setInitialized();
    }
}
