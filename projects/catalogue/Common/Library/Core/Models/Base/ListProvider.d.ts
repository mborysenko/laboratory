///<reference path="List.d.ts"/>
///<reference path="../ModelObject.d.ts"/>
///<reference path="../../Types/ObjectWithEvents.d.ts"/>
declare module SDL.Client.Models.Base
{
	export interface IListProviderProperties extends IModelObjectProperties
	{
		lists: List[];
	}

	export class ListProvider extends ModelObject
	{
		constructor(id: string);
		getListType(filter?: IListFilterProperties): string;
		getList(filter?: IListFilterProperties): List;
		properties: IListProviderProperties;
	}
}