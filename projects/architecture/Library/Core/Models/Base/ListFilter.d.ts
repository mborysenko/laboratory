/// <reference path="../MarshallableObject.d.ts"/>
declare module SDL.Client.Models.Base
{ 
    export interface IListFilterProperties
    { 
        forTree: boolean;
        relatedItem: any;
        itemTypes: any;
        searchText: string;
    } 
    export class ListFilter extends MarshallableObject
    {
        constructor (properties: any[]);
        setForTree(value: any): void;
        getForTree(): any;
        setItemTypes(value:any): void;
        getItemTypes(): any;
        setRelatedItem(value: any): void;
        getRelatedItem(): any;
        setSearchText(value: any): void;
        getSearchText(): string;
        equals(filter: ListFilter): boolean;
        properties: IListFilterProperties;
    }
}