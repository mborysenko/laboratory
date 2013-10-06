/// <reference path="../Application/Application.d.ts" />
/// <reference path="../Net/Ajax.d.ts" />
/// <reference path="../CrossDomainMessaging/CrossDomainMessaging.d.ts" />
declare module SDL.Client.Resources {
    class CommonResourcesLoader {
        static load(file: Resources.IFileResourceDefinition, corePath: string, sync: boolean, onSuccess: (data: string) => void, onFailure: (error: string) => void);
    }
}
