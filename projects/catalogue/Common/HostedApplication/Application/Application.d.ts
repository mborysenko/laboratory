/// <reference path="../../SDL.Client.Core/Resources/Resources.d.ts" />
/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core.Knockout/Libraries/knockout/knockout.d.ts" />
/// <reference path="../Types/Url1.d.ts" />
/// <reference path="../CrossDomainMessaging/CrossDomainMessaging.d.ts" />
/// <reference path="ApplicationHost.d.ts" />
/// <reference path="ApplicationFacade.d.ts" />
/**
*	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
**/
declare module SDL.Client.Application {
    var defaultApplicationEntryPointId: string;
    var defaultApplicationSuiteId: string;
    var isHosted: boolean;
    var applicationSuiteId: string;
    var isReloading: boolean;
    var applicationHostUrl: string;
    var applicationHostCorePath: string;
    var defaultApplicationHostUrl: string;
    var trustedApplicationHostDomains: string[];
    var trustedApplications: string[];
    var trustedApplicationDomains: string[];
    var ApplicationHost: IApplicationHost;
    var useHostedLibraryResources: boolean;
    var libraryVersion: string;
    var isInitialized: boolean;
    var initCallbacks: {
        (): void;
    }[];
    var readyCallbacks: {
        (): void;
    }[];
    function initialize(callback?: () => void): void;
    function addInitializeCallback(callback: () => void): void;
    function addReadyCallback(callback: () => void): void;
    function setApplicationReady(): void;
    function exposeApplicationFacade(): void;
    function exposeApplicationFacadeUnsecure(): void;
    function registerResourceGroupRendered(resourceGroupName: string): void;
    function loadLibraryResourceGroup(resourceGroupName: string, jQuery?: JQueryStatic, knockout?: KnockoutStatic, callback?: () => void): void;
}
