/// <reference path="../Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Types/Url.d.ts" />
/// <reference path="../Types/Object.d.ts" />
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
