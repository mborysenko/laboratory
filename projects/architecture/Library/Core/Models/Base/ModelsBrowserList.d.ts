///<reference path="List.d.ts"/>
declare module SDL.Client.Models.Base
{ 
    export interface IModelsBrowserListProperties extends IFilterNavigationProperties
    { 
        parentId: any;
        items: Array;
    } 
    export class ModelsBrowserList extends SDL.Client.Models.Base.List
    {
        constructor (id: any, parentId?:any);
        isLoaded(): boolean;
        isFilterApplied(): boolean;
        getItems(): any[];
        properties: IModelsBrowserListProperties;
    }
}