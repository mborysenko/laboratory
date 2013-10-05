/// <reference path="../Base/Item.d.ts"/>
declare module SDL.Client.Models.URL
{ 
    export interface IDocumentProperties
    {
        content: any;
        contentUrl: string;
        mimeType: string;
    }
    export class Document extends SDL.Client.Models.Base.Item
    {
        constructor (id: any);  
        invalidateInterfaceCachedState(): void;       
        getTitle(): string;
        getContentUrl(): string;
        getContent(): string;
        getMimeType(): string;
        isLoaded(): boolean;
        _executeLoad(reload: boolean): void;
        _processLoadResult(result, webRequest): any;
        properties: any;
    }
}