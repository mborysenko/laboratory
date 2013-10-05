/// <reference path="../Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../Net/Ajax.d.ts" />
/// <reference path="../Xml/Xml.d.ts" />
/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Types/Url.d.ts" />
declare module SDL.Client.Configuration {
    var settingsFile: string;
    var settingsVersion: string;
    interface IConfigurationManager {
        configuration: Node;
        corePath: string;
        coreVersion: string;
        init(callback?: () => void): void;
        init(settingsUrl: string, callback?: () => void): void;
        getAppSetting(name: string): string;
    }
    var ConfigurationManager: IConfigurationManager;
}
