/// <reference path="Application.d.ts" />
declare module SDL.Client.Application {
    interface ICallingApplicationData {
        applicationId: string;
        applicationDomain: string;
    }
    var ApplicationFacade: {};
    var isApplicationFacadeSecure: boolean;
    module ApplicationFacadeStub {
        function callApplicationFacade(method: string, arguments: any[], caller: ICallingApplicationData);
    }
}
