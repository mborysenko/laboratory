/// <reference path="../Application/Application.d.ts" />
/// <reference path="../Net/Ajax.d.ts" />
/// <reference path="Resources.d.ts" />
declare module SDL.Client.Resources {
    class ResourceLoader {
        static load(file: Resources.IFileResourceDefinition, corePath: string, sync: boolean, onSuccess: (data: string, isShared: boolean) => void, onFailure: (error: string) => void): Client.Net.IWebRequest;
    }
}
