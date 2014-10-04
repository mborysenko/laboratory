/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Application/Application.d.ts" />
/// <reference path="../Application/ApplicationHostFacade.d.ts" />
/// <reference path="../Application/ApplicationFacade.d.ts" />
/// <reference path="ApplicationHostFacade.d.ts" />
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
declare var SDL_GoogleTagManager_DataLayer: any[];
declare module SDL.Client.ApplicationHost {
    interface IApplicationHost extends Types.IObjectWithEvents {
        applications: IApplication[];
        applicationsIndex: {
            [id: string]: IApplication;
        };
        initialize(callback?: () => void): void;
        publishEvent(type: string, data: any, targetDisplay?: ITargetDisplay): void;
        registerApplication(applicationEntries: string, caller?: ICallerSignature): void;
        applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: {
            type: string;
            data: any;
        }) => void, caller?: ICallerSignature): Application.IApplicationHostData;
        exposeApplicationFacade(applicationEntryPointId: string, caller?: ICallerSignature): void;
        applicationEntryPointUnloaded(caller?: ICallerSignature): void;
        setCulture(culture: string, caller?: ICallerSignature): void;
        startCaptureDomEvents(events: string[], caller?: ICallerSignature): void;
        stopCaptureDomEvents(events?: string[], caller?: ICallerSignature): void;
        setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string, caller?: ICallerSignature): void;
        setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string, allowedDomains?: string[], caller?: ICallerSignature): void;
        callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string, allowedDomains?: string[], caller?: ICallerSignature): void;
        initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
            [id: string]: Application.IApplicationDomain;
        }, caller?: ICallerSignature): void;
        resetApplicationSuite(caller?: ICallerSignature): void;
        updateTargetDisplayUrl(url: string, caller?: ICallerSignature): void;
        storeApplicationData(key: string, data: any, caller?: ICallerSignature): void;
        storeApplicationSessionData(key: string, data: any, caller?: ICallerSignature): void;
        getApplicationData(key: string, caller?: ICallerSignature): any;
        getApplicationSessionData(key: string, caller?: ICallerSignature): any;
        clearApplicationData(caller?: ICallerSignature): void;
        clearApplicationSessionData(caller?: ICallerSignature): void;
        removeApplicationData(key: string, caller?: ICallerSignature): void;
        removeApplicationSessionData(key: string, caller?: ICallerSignature): void;
        triggerAnalyticsEvent(event: string, object: any, caller?: ICallerSignature): void;
        showTopBar(caller?: ICallerSignature): void;
        setTopBarOptions(options: any, caller?: ICallerSignature): void;
        resolveCommonLibraryResources(resourceGroupName: string, caller?: ICallerSignature): Resources.IResolvedResourceGroupResult[];
        getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: Application.ICommonLibraryResource) => void, onFailure?: (error: string) => void, caller?: ICallerSignature): void;
        getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void, caller?: ICallerSignature): void;
    }
    interface ICallerSignature {
        sourceWindow: Window;
        sourceDomain: string;
        sourceDisplay?: ITargetDisplay;
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
        urlLoggingFilterRegExp?: RegExp;
        domainLoggingHide?: boolean;
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
        topIcon: string;
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
        loadedUrl?: string;
        eventHandler?: (event: {
            type: string;
            data: any;
        }) => void;
    }
    interface IApplicationEntryPointTargetDisplay extends ITargetDisplay {
        name: string;
        domains: IApplicationDomain[];
        entryPoints: IApplicationEntryPoint[];
        currentApplicationEntryPoint?: IApplicationEntryPoint;
        exposedApplicationFacade?: string;
        delayedFacadeInvocations: {
            [entryPointId: string]: IDelayedFacadeInvocation[];
        };
    }
    interface IDelayedFacadeInvocation {
        (): void;
    }
    interface IApplicationManifest {
        iframe: HTMLIFrameElement;
        domain: string;
        url: string;
        id: string;
        xmlElement: Element;
        timeout: number;
        loadStartTime?: number;
    }
    interface IApplicationSessionData {
        entryPoints: {
            [id: string]: IApplicationEntryPointSessionData;
        };
    }
    interface IApplicationEntryPointSessionData {
        baseUrl: string;
        url?: string;
        visited?: boolean;
    }
    interface IApplicationHostClassProperties extends Types.IObjectWithEventsProperties {
        applications: IApplication[];
        applicationsIndex: {
            [id: string]: IApplication;
        };
        activeApplicationEntryPointId: string;
        activeApplicationEntryPoint: IApplicationEntryPoint;
        activeApplicationId: string;
        selfTargetDisplay: ITargetDisplay;
        initialized: boolean;
        libraryVersions: string[];
        initCallbacks: {
            (): void;
        }[];
        applicationManifestsCount: number;
        applicationManifests: IApplicationManifest[];
        applicationsSessionData: {
            [id: string]: IApplicationSessionData;
        };
        domEventsTargetDisplays: {
            [id: string]: string[];
        };
    }
    class ApplicationHostClass extends Types.ObjectWithEvents implements IApplicationHost {
        public applications: IApplication[];
        public applicationsIndex: {
            [id: string]: IApplication;
        };
        private analyticsDataLayerProperties;
        private manifestsLoadStartTime;
        public properties: IApplicationHostClassProperties;
        constructor();
        public $initialize(): void;
        public applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: {
            type: string;
            data: any;
        }) => void, caller?: ICallerSignature): Application.IApplicationHostData;
        public exposeApplicationFacade(applicationEntryPointId: string, caller?: ICallerSignature): void;
        public applicationEntryPointUnloaded(caller?: ICallerSignature): void;
        public setCulture(culture: string, caller?: ICallerSignature): void;
        public startCaptureDomEvents(events: string[], caller?: ICallerSignature): void;
        public stopCaptureDomEvents(events?: string[], caller?: ICallerSignature): void;
        public setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationSuiteId?: string, caller?: ICallerSignature): void;
        public setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationSuiteId?: string, allowedDomains?: string[], caller?: ICallerSignature): void;
        public updateTargetDisplayUrl(url: string, caller?: ICallerSignature): void;
        public callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationSuiteId?: string, allowedDomains?: string[], caller?: ICallerSignature): void;
        public initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
            [id: string]: Application.IApplicationDomain;
        }, caller?: ICallerSignature): void;
        public resetApplicationSuite(caller?: ICallerSignature): void;
        public storeApplicationData(key: string, data: any, caller?: ICallerSignature): void;
        public storeApplicationSessionData(key: string, data: any, caller?: ICallerSignature): void;
        public getApplicationData(key: string, caller?: ICallerSignature): any;
        public getApplicationSessionData(key: string, caller?: ICallerSignature): any;
        public clearApplicationData(caller?: ICallerSignature): void;
        public clearApplicationSessionData(caller?: ICallerSignature): void;
        public removeApplicationData(key: string, caller?: ICallerSignature): void;
        public removeApplicationSessionData(key: string, caller?: ICallerSignature): void;
        public triggerAnalyticsEvent(event: string, object: any, caller?: ICallerSignature): void;
        public showTopBar(caller?: ICallerSignature): void;
        public setTopBarOptions(options: any, caller?: ICallerSignature): void;
        public resolveCommonLibraryResources(resourceGroupName: string, caller?: ICallerSignature): Resources.IResolvedResourceGroupResult[];
        public getCommonLibraryResources(files: Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: Application.ICommonLibraryResource) => void, onFailure?: (error: string) => void, caller?: ICallerSignature): void;
        public getCommonLibraryResource(file: Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure?: (error: string) => void, caller?: ICallerSignature): void;
        public initialize(callback?: () => void): void;
        public registerApplication(applicationEntries: string, caller?: ICallerSignature): void;
        public publishEvent(type: string, data: any, targetDisplay?: ITargetDisplay): void;
        public getCallerTargetDisplay(allowAuthenticationTargetDisplay: boolean, allowSelfTargetDisplay: boolean, allowUnauthenticated: boolean, caller: ICallerSignature): ITargetDisplay;
        public getApplicationEntryPointById(applicationEntryPointId: string, application: IApplication): IApplicationEntryPoint;
        private loadApplicationManifests();
        private applicationManifestLoaded();
        private initializeApplicationHost();
        private buildApplicationEntryPointGroup(entryPointGroupNode, domains, parentApplication);
        private buildApplicationEntryPoint(entryPointNode, domains, parentApplication);
        private buildNameTranslations(parent);
        private getLoggedApplicationEntryPointUrl(applicationEntryPoint);
        private getLoggedApplicationUrl(url, application);
        private saveApplicationEntryPointSessionData(applicationEntryPoint, property);
        private getApplicationEntryPointSessionData(applicationSuiteId, applicationEntryPointId, baseUrl, property);
        private _getRawApplicationStorageData(storage, application);
        private _storeApplicationData(storage, application, applicationEntryPointDomain, key, data);
        private _getApplicationData(storage, application, applicationEntryPointDomain, key);
        private _removeApplicationData(storage, application, applicationEntryPointDomain, key?);
        private _stopCaptureDomEvents(targetDisplay, events?);
        private addCaptureDomEventListener(event);
        private removeCaptureDomEventListener(event);
        private handleCaptureDomEvent(e);
    }
    var ApplicationHost: IApplicationHost;
    function initialize(callback?: () => void): void;
}
