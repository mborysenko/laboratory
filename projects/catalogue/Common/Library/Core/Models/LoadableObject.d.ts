/// <reference path="CacheableObject.d.ts"/>
/// <reference path="../Net/Ajax.d.ts"/>

declare module SDL.Client.Models
{ 
    export interface ILoadableObject
    {
        load(reload?: boolean): boolean;
        unload(): void;
		isLoaded(): boolean;
		isLoading(): boolean;
        registerError(errorCode: any, errorMessage: string): void;
    }
    export interface ILoadableObjectProperties extends ICacheableObjectProperties
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
		isLoading(): boolean;
		private beforeSetLoaded(): void;
        _setLoaded(): void;
		_setLoading(): void;
        _executeLoad(reload: boolean): void;
        _onLoad(result: string, WebRequest: Net.IWebRequest): void;
        _processLoadResult(result: string, WebRequest: Net.IWebRequest): void;
        _onLoadFailed(error: string, webRequest: Net.IWebRequest): void;
        registerError(errorCode: any, errorMessage: string): void;
        properties: ILoadableObjectProperties;
    }
}