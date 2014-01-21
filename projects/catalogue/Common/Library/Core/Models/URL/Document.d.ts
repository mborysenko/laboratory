/// <reference path="../Base/Item.d.ts"/>
declare module SDL.Client.Models.URL
{ 
    export interface IDocumentProperties extends Base.IItemProperties
    {
        content: string;
        contentUrl: string;
        mimeType: string;
    }
    export class Document extends Base.Item
    {
        constructor(id: string);
        getContentUrl(): string;
        getContent(): string;
        getMimeType(): string;
        properties: IDocumentProperties;
    }
}