/// <reference path="Application.d.ts" />
/**
*	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
**/
declare module SDL.Client.Application {
    interface ICallingApplicationData {
        applicationId: string;
        applicationDomain: string;
    }
    var ApplicationFacade: {
        [method: string]: Function;
    };
    var isApplicationFacadeSecure: boolean;
    module ApplicationFacadeStub {
        function callApplicationFacade(method: string, arguments: any[], caller: ICallingApplicationData): void;
    }
}
