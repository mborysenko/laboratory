/// <reference path="../Application/Application.d.ts" />
/// <reference path="../Types/Url2.d.ts" />
/// <reference path="../Xml/Xml.Base.d.ts" />
declare module SDL.Client.Configuration {
    var settingsFile: string;
    var settingsVersion: string;
    interface IConfigurationManager {
        configuration: Node;
        configurationFiles: {
            [resolvedUrl: string]: {
                url: string;
                data?: string;
            };
        };
        corePath: string;
        coreVersion: string;
        initialize(callback?: () => void, nonCoreInitCallback?: () => void): void;
        isInitialized: boolean;
        getAppSetting(name: string): string;
        isApplicationHost: boolean;
    }
    var ConfigurationManager: IConfigurationManager;
}
