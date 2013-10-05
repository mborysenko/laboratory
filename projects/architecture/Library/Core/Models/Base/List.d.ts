///<reference path="ListProvider.d.ts"/>
///<reference Path="ListFilter.d.ts"/>
///<reference Path="../UpdatableListObject.d.ts"/>
///<reference Path="FilteredNavigationObject.d.ts"/>
declare module SDL.Client.Models.Base
{
    export interface IListProperties extends IFilterNavigationProperties
    { 
        lists: Array;        
    } 
    export class List extends SDL.Client.Models.UpdatableListObject
        implements IFilterNavigationObject
    {
        constructor (id: any, parentId: any, filter?:ListFilter);
        invalidateInterfaceCachedState(): void;
        isLoaded(): boolean;
        getItems(): any[];
		getItem(id: string): any;
        getParentId(): any;
        getParent(): SDL.Client.Models.Base.ListProvider;
        getListFilterType(): string;
        getListFilterOptions(): IListFilterProperties;
        getListFilter(): ListFilter;
        isFilterApplied(): boolean;
        properties: any;
    }
}