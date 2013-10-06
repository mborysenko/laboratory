/// <reference path="CacheableObject.d.ts"/>

declare module SDL.Client.Models
{ 
    export interface ILoadableObject
    {
        load(reload?: boolean): boolean;
        unload(): void;
        isLoaded(): boolean;
        registerError(errorCode, errorMessage): void;
    }
    export interface ILoadableObjectProperties
    {
        loading: boolean;
    }
    export class LoadableObject extends SDL.Client.Models.CacheableObject
        implements ILoadableObject
    {
        constructor ();  
        _invalidateCachedState(): void;
        load(reload?: boolean): boolean;
        unload(): void;
        isLoaded(): boolean;
        _setLoading(): void;
        _executeLoad(reload: boolean): void;
        _onLoad(result:any, WebRequest:any):void;
        _processLoadResult(result:any, WebRequest:any):void;
        _onLoadFailed(error:any, webRequest:any):void;
        registerError(errorCode, errorMessage):void;
        properties: any;
    }
}