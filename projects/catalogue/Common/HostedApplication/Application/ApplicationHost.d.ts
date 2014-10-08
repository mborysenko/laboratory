/// <reference path="../../SDL.Client.Core/Resources/Resources.d.ts" />
/// <reference path="../Types/Url1.d.ts" />
/// <reference path="../CrossDomainMessaging/CrossDomainMessaging.d.ts" />
/// <reference path="Application.d.ts" />
/**
*	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
**/
declare module SDL.Client.Application {
    interface IApplicationHost {
        version: string;
        libraryVersionSupported: boolean;
        activeApplicationEntryPointId: string;
        activeApplicationId: string;
        culture: string;
        isTrusted: boolean;
        applicationEntryPointLoaded(coreVersion?: string, callback?: (data: IApplicationHostData) => void): void;
        exposeApplicationFacade(applicationEntryPointId: string): void;
        exposeApplicationFacadeUnsecure(applicationEntryPointId: string): void;
        applicationEntryPointUnloaded(): void;
        setCulture(culture: string): void;
        startCaptureDomEvents(events: string[]): void;
        stopCaptureDomEvents(events?: string[]): void;
        resolveCommonLibraryResources(resourceGroupName: string, callback: (resources: Resources.IResolvedResourceGroupResult[]) => void): void;
        getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: ICommonLibraryResource) => void, onFailure?: (error: string) => void): void;
        getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void): void;
        setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void;
        setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void;
        setApplicationEntryPointUrlUnsecure(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void;
        callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string): void;
        callApplicationFacadeUnsecure(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string): void;
        initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
            [id: string]: IApplicationDomain;
        }): void;
        resetApplicationSuite(): void;
        updateTargetDisplayUrlUnsecure(url: string): void;
        storeApplicationData(key: string, data: any): void;
        storeApplicationSessionData(key: string, data: any): void;
        getApplicationData(key: string, callback: (data: any) => void): void;
        getApplicationSessionData(key: string, callback: (data: any) => void): void;
        clearApplicationData(): void;
        clearApplicationSessionData(): void;
        removeApplicationData(key: string): void;
        removeApplicationSessionData(key: string): void;
        triggerAnalyticsEvent(event: string, object: any): void;
        showTopBar(): void;
        setTopBarOptions(options: ITopBarOptions): void;
        addEventListener(event: string, handler: Function): void;
        removeEventListener(event: string, handler: Function): void;
        fireEvent(event: string, eventData?: any): void;
        isSupported(method: string): boolean;
    }
    interface ITopBarOptions {
        ribbonTabs?: ITopBarRibbonTab[];
        selectedRibbonTabId?: string;
        buttons?: ITopBarButtons;
    }
    interface ITopBarRibbonTab {
        id: string;
        label: string;
        hidden?: boolean;
    }
    interface ITopBarButtons {
        search?: ITopBarButtonOptions;
        help?: ITopBarButtonOptions;
        messages?: ITopBarButtonWithValueOptions;
        workflows?: ITopBarButtonWithValueOptions;
        notiffications?: ITopBarButtonWithValueOptions;
        user?: ITopBarButtonUserOptions;
        close?: boolean;
    }
    interface ITopBarButtonOptions {
        hidden?: boolean;
        selected?: boolean;
    }
    interface ITopBarButtonWithValueOptions extends ITopBarButtonOptions {
        value?: number;
    }
    interface ITopBarButtonUserOptions extends ITopBarButtonOptions {
        isLoggedIn?: boolean;
        isPicture?: boolean;
        pictureUrl?: string;
        userName?: string;
    }
    interface IApplicationData {
        coreVersion?: string;
        loadedUrl: string;
    }
    interface IApplicationHostData {
        applicationHostUrl: string;
        applicationHostCorePath: string;
        applicationSuiteId: string;
        version: string;
        libraryVersionSupported: boolean;
        culture: string;
        activeApplicationEntryPointId: string;
        activeApplicationId: string;
        supportedMethods?: {
            [method: string]: boolean;
        };
        sharedSettings?: {
            [setting: string]: string;
        };
        isApplicationHostProxy?: boolean;
        isApplicationHostTrusted?: boolean;
    }
    interface IApplicationDomain {
        domain: string;
        alternativeDomains: string[];
    }
    interface ICommonLibraryResource {
        url: string;
        data: string;
        context?: string;
    }
    class ApplicationHostProxyClass implements IApplicationHost {
        public version: string;
        public libraryVersionSupported: boolean;
        public activeApplicationEntryPointId: string;
        public activeApplicationId: string;
        public culture: string;
        public isTrusted: boolean;
        private handlers;
        private supportedMethods;
        public setCulture(culture: string): void;
        public applicationEntryPointLoaded(coreVersion?: string, callback?: (data: IApplicationHostData) => void): void;
        public startCaptureDomEvents(events: string[]): void;
        public stopCaptureDomEvents(events?: string[]): void;
        public exposeApplicationFacade(applicationEntryPointId: string): void;
        public exposeApplicationFacadeUnsecure(applicationEntryPointId: string): void;
        public applicationEntryPointUnloaded(): void;
        public resolveCommonLibraryResources(resourceGroupName: string, callback: (file: Resources.IResolvedResourceGroupResult[]) => void): void;
        public getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: ICommonLibraryResource) => void, onFailure?: (error: string) => void): void;
        public getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void): void;
        public setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void;
        public setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void;
        public setApplicationEntryPointUrlUnsecure(applicationEntryPointId: string, url: string, applicationSuiteId?: string): void;
        public updateTargetDisplayUrlUnsecure(url: string): void;
        public callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string): void;
        public callApplicationFacadeUnsecure(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string): void;
        public initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
            [id: string]: IApplicationDomain;
        }): void;
        public resetApplicationSuite(): void;
        public storeApplicationData(key: string, data: any): void;
        public storeApplicationSessionData(key: string, data: any): void;
        public getApplicationData(key: string, callback: (data: any) => void): void;
        public getApplicationSessionData(key: string, callback: (data: any) => void): void;
        public clearApplicationData(): void;
        public clearApplicationSessionData(): void;
        public removeApplicationData(key: string): void;
        public removeApplicationSessionData(key: string): void;
        public triggerAnalyticsEvent(event: string, object: any): void;
        public showTopBar(): void;
        public setTopBarOptions(options: any): void;
        public addEventListener(event: string, handler: Function): void;
        public removeEventListener(event: string, handler: Function): void;
        public fireEvent(eventType: string, eventData?: any): void;
        public isSupported(method: string): boolean;
        private call(method, args?, callback?);
        private onHostEvent(e);
        private getWithLocalDomain(domains);
        private _processHandlers(eventObj, handlersCollectionName);
    }
}
