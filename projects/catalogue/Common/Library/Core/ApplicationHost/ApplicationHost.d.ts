/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Application/Application.d.ts" />
/// <reference path="../Application/ApplicationFacade.d.ts" />
/// <reference path="../ConfigurationManager/ConfigurationManager.d.ts" />
/// <reference path="../CrossDomainMessaging/CrossDomainMessaging.d.ts" />
/// <reference path="../Types/Object.d.ts" />
/// <reference path="../Xml/Xml.d.ts" />
/// <reference path="../Types/Url.d.ts" />
/// <reference path="../Types/Array.d.ts" />
/// <reference path="../Resources/ResourceManager.d.ts" />
/// <reference path="../Resources/FileResourceHandler.d.ts" />
/// <reference path="../Resources/FileHandlers/CssFileHandler.d.ts" />
/// <reference path="../Event/EventRegister.d.ts" />
/// <reference path="../Event/Event.d.ts" />
/// <reference path="ApplicationManifestReceiver.d.ts" />
declare module SDL.Client.ApplicationHost {
    interface IApplicationHost extends Types.IObjectWithEvents {
        applications: IApplication[];
        applicationsIndex: {
            [id: string]: IApplication;
        };
        initialize(callback?: () => void): void;
        registerApplication(applicationEntries: string): void;
        applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: {
            type: string;
            data: any;
        }) => void): Application.IApplicationHostData;
        exposeApplicationFacade(applicationEntryPointId: string): void;
        applicationEntryPointUnloaded(): void;
        setCulture(culture: string): void;
        startCaptureDomEvents(events: string[]): void;
        stopCaptureDomEvents(events?: string[]): void;
        setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string): void;
        setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string, allowedDomains?: string[]): void;
        callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string, allowedDomains?: string[]): void;
        initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
            [id: string]: Application.IApplicationDomain;
        }): void;
        resetApplicationSuite(): void;
        storeApplicationData(key: string, data: any): void;
        storeApplicationSessionData(key: string, data: any): void;
        getApplicationData(key: string): any;
        getApplicationSessionData(key: string): any;
        clearApplicationData(): void;
        clearApplicationSessionData(): void;
        removeApplicationData(key: string): void;
        removeApplicationSessionData(key: string): void;
        resolveCommonLibraryResources(resourceGroupName: string): Resources.IResolvedResourceGroupResult[];
        getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: Application.ICommonLibraryResource) => void, onFailure?: (error: string) => void): void;
        getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void): void;
    }
    interface IApplication {
        id: string;
        manifestUrl: string;
        authenticationUrl: string;
        authenticated?: boolean;
        authenticationMode: string;
        authenticationTargetDisplay?: ITargetDisplay;
        domains: {
            [id: string]: IApplicationDomain;
        };
        entryPointGroups: IApplicationEntryPointGroup[];
        entryPointGroupsIndex: {
            [id: string]: IApplicationEntryPointGroup;
        };
        targetDisplays: IApplicationEntryPointTargetDisplay[];
        targetDisplaysIndex: {
            [name: string]: IApplicationEntryPointTargetDisplay;
        };
    }
    interface IApplicationDomain {
        id: string;
        baseUrl: string;
        domain: string;
        deferred: boolean;
        initialized: boolean;
        validDomains: string[];
    }
    interface ITranslations {
        [lang: string]: string;
    }
    interface IApplicationEntryPointGroup {
        id: string;
        title: string;
        translations?: ITranslations;
        entryPoints: IApplicationEntryPoint[];
        application: IApplication;
    }
    interface IApplicationEntryPoint {
        id: string;
        title: string;
        translations: ITranslations;
        domain: IApplicationDomain;
        baseUrl: string;
        url: string;
        icon: string;
        type: string;
        hidden: boolean;
        contextual: boolean;
        visited: boolean;
        external: boolean;
        overlay: boolean;
        targetDisplay: IApplicationEntryPointTargetDisplay;
        application: IApplication;
    }
    interface ITargetDisplay {
        id: string;
        application?: IApplication;
        frame?: HTMLIFrameElement;
        loadedDomain?: string;
        eventHandler?: (event: {
            type: string;
            data: any;
        }) => void;
    }
    interface IApplicationEntryPointTargetDisplay extends ITargetDisplay {
        name: string;
        domains: IApplicationDomain[];
        entryPoints: IApplicationEntryPoint[];
        exposedApplicationFacade?: string;
        delayedFacadeInvocations: {
            [entryPointId: string]: IDelayedFacadeInvocation[];
        };
    }
    interface IDelayedFacadeInvocation {
        (): void;
    }
    var ApplicationHost: IApplicationHost;
}
