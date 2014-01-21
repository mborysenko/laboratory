/// <reference path="../Types/Url1.d.ts" />
/**
*	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
**/
declare module SDL.Client.CrossDomainMessaging {
    interface IMessage {
        method?: string;
        args?: any[];
        respId?: number;
        reqId?: number;
        retire?: boolean;
        execute?: boolean;
    }
    interface ICallbackHandler {
        (): void;
        reoccuring?: boolean;
        retire?: () => void;
    }
    function addTrustedDomain(url: string): void;
    function clearTrustedDomains(): void;
    function addAllowedHandlerBase(handler: any): void;
    function call(target: Window, method: string, args?: any[], callback?: (result: any) => void): void;
    function executeMessage(message: IMessage, source: Window, origin: string): void;
}
