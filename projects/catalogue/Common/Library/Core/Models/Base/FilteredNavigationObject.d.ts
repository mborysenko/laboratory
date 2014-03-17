///<reference path="../IdentifiableObject.d.ts"/>
///<reference path="ListProvider.d.ts"/>
///<reference path="ListFilter.d.ts"/>

declare module SDL.Client.Models.Base
{
    export interface IFilterNavigationProperties extends SDL.Client.Models.IIdentifiableObjectProperties
    { 
        parentId: any;
        filterOptions: IListFilterProperties;
        filter: ListFilter;
    }
    export interface IFilterNavigationObject
    {
        getParentId(): any;
        getParent(): SDL.Client.Models.Base.ListProvider;
        getListFilterType(): string;
        getListFilterOptions(): IListFilterProperties;
        getListFilter(): ListFilter;
        isFilterApplied(): boolean;   
    }
    export class FilteredNavigationObject extends SDL.Client.Models.IdentifiableObject
        implements IFilterNavigationObject
    {
        constructor(id: string, parentId?: string, filter?: IListFilterProperties);
        getParentId(): string;
        getParent(): ListProvider;
        getListFilterType(): string;
        getListFilterOptions(): IListFilterProperties;
        getListFilter(): ListFilter;
        isFilterApplied(): boolean;       
        properties: IFilterNavigationProperties;
    }
}