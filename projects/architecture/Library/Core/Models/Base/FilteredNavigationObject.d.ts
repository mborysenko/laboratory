///<reference path="../IdentifiableObject.d.ts"/>
///<reference Path="ListProvider.d.ts"/>
///<reference Path="ListFilter.d.ts"/>

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
        constructor (id: any, parentId?: any, filter?:ListFilter);
        getParentId(): any;
        getParent(): SDL.Client.Models.Base.ListProvider;
        getListFilterType(): string;
        getListFilterOptions(): IListFilterProperties;
        getListFilter(): ListFilter;
        isFilterApplied(): boolean;       
        properties: any;
    }
}