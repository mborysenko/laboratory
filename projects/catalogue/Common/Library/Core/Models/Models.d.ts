///<reference path="ModelFactory.d.ts" />
///<reference path="MarshallableArray.d.ts" />
///<reference path="UpdatableObject.d.ts" />
///<reference path="UpdatableListObject.d.ts" />

declare module SDL.Client.Models
{
	export interface IItemTypeEntry
		{
			id: string;
			implementation: string;
			alias: string;
		}

	function registerModelFactory(matchPattern: string, factory: IModelFactory, itemTypes?: IItemTypeEntry[]): void;
	function registerModelFactory(matchPattern: RegExp, factory: IModelFactory, itemTypes?: IItemTypeEntry[]): void;
	function registerItemType(itemType: IItemTypeEntry, factory: IModelFactory): void;
	function getModelFactory(item: string): IModelFactory;
	function getModelFactory(item: IIdentifiableObject): IModelFactory;
	function getOwningWindow(): Window;
	function getRepositoryOwningWindow(): Window;
	function getModelFactories(): ModelFactory[];
	function getItem(id: string): IIdentifiableObject;
	function createNewItem(type: string): IIdentifiableObject;
	function getItemType(item: string): string;
	function getItemType(item: IIdentifiableObject): string;
	function getUniqueId(): string;
	function addToRepository(id: string, item: IIdentifiableObject): void;
	function getFromRepository(id: string): IIdentifiableObject;
	function createInRepository(id: string, type: string, ...args: any[]): IIdentifiableObject;
	function removeFromRepository(id: string): void;
	function updateItemId(oldId: string, newId: string): void;
	function getListsRegistry(): IUpdatableListObject[];
	function registerList(list: IUpdatableListObject): void;
	function unregisterList(list: IUpdatableListObject): void;
	function itemUpdated(item: IUpdatableObject, oldId: string): void;
	function itemRemoved(id: string): void;
	function updateItemData(item: IUpdatableObject): void;
	function loadItem(item: ILoadableObject, reload: boolean, onSuccess: () => void, onFailure: (error: string) => void): void;
}