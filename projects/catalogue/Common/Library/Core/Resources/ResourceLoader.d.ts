/// <reference path="../ApplicationHost/ApplicationHost.d.ts" />
/// <reference path="../Application/Application.d.ts" />
/// <reference path="../Net/Ajax.d.ts" />
/// <reference path="Resources.d.ts" />
declare module SDL.Client.Resources {
    class ResourceLoader {
        private static cdnCacheResponseHeaderName;
        static load(file: IFileResourceDefinition, corePath: string, sync: boolean, onSuccess: (data: string, isShared: boolean) => void, onFailure: (error: string) => void, caller?: ApplicationHost.ICallerSignature): Net.IWebRequest;
    }
}
