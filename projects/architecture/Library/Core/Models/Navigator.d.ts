/// <reference path="../Types/DisposableObject.d.ts" />
declare module SDL.Client.Models 
{
    class Navigator extends SDL.Client.Types.DisposableObject 
    {
        navigateTo(item: any, exploring: any, fromWindow: Window): void;
        disposeInterface(): void;
        static getNavigator(): Navigator;
    }
}