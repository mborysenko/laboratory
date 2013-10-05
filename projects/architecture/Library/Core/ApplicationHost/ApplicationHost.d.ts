/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Xml/Xml.d.ts" />
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
    interface IApplicationHost extends Client.Types.IObjectWithEvents {
        applications: IApplication[];
        applicationsIndex: {
            [id: string]: IApplication;
        };
        initialize(callback?: () => void): void;
        registerApplication(applicationEntries: string);
        applicationEntryPointLoaded(libraryVersion: string, eventHandler: (e: {
            type: string;
            data: any;
        }) => void): Client.Application.IApplicationHostData;
        exposeApplicationFacade(applicationEntryPointId: string): void;
        applicationEntryPointUnloaded(): void;
        setCulture(culture: string): void;
        setActiveApplicationEntryPoint(applicationEntryPointId: string, applicationId?: string): void;
        setApplicationEntryPointUrl(applicationEntryPointId: string, url: string, applicationId?: string, allowedDomains?: string[]): void;
        callApplicationFacade(applicationEntryPointId: string, method: string, args?: any[], callback?: (result: any) => void, applicationId?: string, allowedDomains?: string[]): void;
        initializeApplicationSuite(includeApplicationEntryPointIds?: string[], excludeApplicationEntryPointIds?: string[], domainDefinitions?: {
            [id: string]: Client.Application.IApplicationDomain;
        }): void;
        resetApplicationSuite(): void;
        resolveCommonLibraryResources(resourceGroupName: string): Client.Resources.IResolvedResourceGroupResult[];
        getCommonLibraryResources(files: Client.Resources.IFileResourceDefinition[], version: string, onFileLoad: (resource: {
            url: string;
            data: string;
        }) => void, onFailure: (error: string) => void): void;
        getCommonLibraryResource(file: Client.Resources.IFileResourceDefinition, version: string, onSuccess: (data: string) => void, onFailure: (error: string) => void): void;
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
    interface IApplicationEntryPointGroup {
        id: string;
        title: string;
        translations?: {
            [lang: string]: string;
        };
        entryPoints: IApplicationEntryPoint[];
        application: IApplication;
    }
    interface IApplicationEntryPoint {
        id: string;
        title: string;
        translations: {
            [lang: string]: string;
        };
        domain: IApplicationDomain;
        baseUrl: string;
        url: string;
        icon: string;
        type: string;
        hidden: boolean;
        contextual: boolean;
        external: boolean;
        overlay: boolean;
        targetDisplay: IApplicationEntryPointTargetDisplay;
        application: IApplication;
    }
    interface ITargetDisplay {
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
