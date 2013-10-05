/// <reference path="../ModelObject.d.ts"/>
/// <reference path="../LoadableObject.d.ts"/>
declare module SDL.Client.Models.Base
{ 
    export interface IItemProperties
    {        
        title: string;
        lastModified: string;
    }
    export interface IItem extends ILoadableObject,SDL.Client.Models.IModelObject
    {
        invalidateInterfaceCachedState(): void;
        getTitle(): string;
        getLastModifiedDateString(): string;
        getOriginalId(): any;

        getModelFactory(): SDL.Client.Models.ModelFactory;
        getItemType(): string;
    }
    export class Item extends SDL.Client.Models.LoadableObject
       implements IItem
    {
        constructor (id: any);
        invalidateInterfaceCachedState(): void;
        getTitle(): string;
        getLastModifiedDateString(): string;
        getOriginalId(): any;
        getModelFactory(): SDL.Client.Models.ModelFactory;
        getItemType(): string;
        getId(): any;
        properties: any;
    }
}