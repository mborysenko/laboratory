///<reference path="ListProvider.d.ts"/>
///<reference path="ListFilter.d.ts"/>
///<reference path="../UpdatableListObject.d.ts"/>
///<reference path="FilteredNavigationObject.d.ts"/>
declare module SDL.Client.Models.Base
{
    export interface IListProperties extends ILoadableObjectProperties, IFilterNavigationProperties
    { 
        items: any[];        
    }

    export class List extends UpdatableListObject implements IFilterNavigationObject
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
        properties: IListProperties;
    }
}