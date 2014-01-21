/// <reference path="../MarshallableObject.d.ts"/>
declare module SDL.Client.Models.Base
{ 
    export interface IListFilterProperties extends IMarshallableObjectProperties
    { 
        forTree: boolean;
        relatedItem: string;
        itemTypes: string[];
        searchText: string;
    } 
    export class ListFilter extends MarshallableObject
    {
        constructor(properties: IListFilterProperties);
        setForTree(value: boolean): void;
        getForTree(): boolean;
        setItemTypes(value: string[]): void;
        getItemTypes(): string[];
        setRelatedItem(value: string): void;
        getRelatedItem(): string;
        setSearchText(value: string): void;
        getSearchText(): string;
        equals(filter: ListFilter): boolean;
        properties: IListFilterProperties;
    }
}