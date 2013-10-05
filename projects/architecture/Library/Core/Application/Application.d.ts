/// <reference path="../Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../Xml/Xml.d.ts" />
/// <reference path="../ConfigurationManager/ConfigurationManager.d.ts" />
/// <reference path="../CrossDomainMessaging/CrossDomainMessaging.d.ts" />
/// <reference path="../Event/EventRegister.d.ts" />
/// <reference path="ApplicationHost.d.ts" />
/// <reference path="ApplicationFacade.d.ts" />
declare module SDL.Client.Application {
    var defaultApplicationEntryPointId: string;
    var defaultApplicationSuiteId: string;
    var isHosted: boolean;
    var applicationSuiteId: string;
    var isReloading: boolean;
    var defaultApplicationHostUrl: string;
    var trustedApplicationHostDomains: string[];
    var trustedApplications: string[];
    var trustedApplicationDomains: string[];
    var ApplicationHost: IApplicationHost;
    var useHostedLibraryResources: boolean;
    function initialize(callback?: () => void): void;
    function exposeApplicationFacade(): void;
    function exposeApplicationFacadeUnsecure(): void;
}
