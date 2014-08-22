/// <reference path="../../../../SDL.Client/SDL.Client.Core/ApplicationHost/ApplicationHost.d.ts" />
/// <reference path="../../../../SDL.Client/SDL.Client.Core/Types/Url.d.ts" />
/// <reference path="../../../../SDL.Client/SDL.Client.UI.Core.Knockout/Libraries/knockout/knockout.d.ts" />
declare module SDL.Client.UI.ApplicationHost.ViewModels.Navigation {
    interface ITargetDisplay {
        targetDisplay: Client.ApplicationHost.ITargetDisplay;
        src: string;
        accessed: KnockoutObservable<boolean>;
        loaded: KnockoutObservable<boolean>;
        loading: KnockoutComputed<boolean>;
        timeout: number;
    }
    interface INavigationItemTargetDisplay extends ITargetDisplay {
        targetDisplay: Client.ApplicationHost.IApplicationEntryPointTargetDisplay;
        navigationItem: KnockoutObservable<INavigationItem>;
    }
    interface IAuthenticationTargetDisplay extends ITargetDisplay {
        navigationGroup: KnockoutObservable<INavigationGroup>;
        authenticationMode: string;
        authenticated: boolean;
        disposed: KnockoutObservable<boolean>;
    }
    interface INavigationItem {
        id: string;
        title?: string;
        titleResource?: string;
        applicationEntryPoint?: Client.ApplicationHost.IApplicationEntryPoint;
        icon?: string;
        topIcon?: string;
        src: KnockoutObservable<string>;
        navigationGroup?: INavigationGroup;
        targetDisplay: INavigationItemTargetDisplay;
        type: string;
        translations?: Client.ApplicationHost.ITranslations;
        external?: boolean;
        contextual: KnockoutObservable<boolean>;
        hidden: KnockoutObservable<boolean>;
        overlay?: boolean;
    }
    interface INavigationGroup {
        id: string;
        title: string;
        applicationEntryPointGroup: Client.ApplicationHost.IApplicationEntryPointGroup;
        navigationItems: INavigationItem[];
        applications: Client.ApplicationHost.IApplication[];
        authenticationTargetDisplay?: KnockoutObservable<IAuthenticationTargetDisplay>;
        translations?: Client.ApplicationHost.ITranslations;
        shownItems: KnockoutObservable<number>;
        applicationId?: string;
    }
    var navigationGroups: INavigationGroup[];
    var topNavigationGroup: INavigationGroup;
    var homeNavigationItem: INavigationItem;
    var currentNavigationItem: KnockoutObservable<INavigationItem>;
    var currentNavigationGroup: KnockoutObservable<INavigationGroup>;
    var authenticationTargetDisplays: IAuthenticationTargetDisplay[];
    var navigationItemTargetDisplays: INavigationItemTargetDisplay[];
    function selectNavigationItem(navigationItem: INavigationItem): void;
    function setNavigationSelectionFromUrl(ignoreErrors?: boolean): void;
    function initialize(callback?: () => void): void;
    function getNavigationItemById(navigationItemId: string, applicationId: string): INavigationItem;
}
