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

	function registerModelFactory(matchPattern: string, factory: ModelFactory, itemTypes: IItemTypeEntry[]): void;
	function registerModelFactory(matchPattern: RegExp, factory: ModelFactory, itemTypes: IItemTypeEntry[]): void;
	function registerItemType(itemType: IItemTypeEntry, factory: ModelFactory): void;
	function getModelFactory(item: string): ModelFactory;
	function getModelFactory(item: IdentifiableObject): ModelFactory;
	function getOwningWindow(): Window;
	function getRepositoryOwningWindow(): Window;
	function getModelFactories(): ModelFactory[];
	function getItem(id: string): IdentifiableObject;
	function createNewItem(type: string): IdentifiableObject;
	function getItemType(item: string): string;
	function getItemType(item: IdentifiableObject): string;
	function getUniqueId(): string;
	function addToRepository(id: string, item: IdentifiableObject): void;
	function getFromRepository(id: string): IdentifiableObject;
	function createInRepository(id: string, type: string, ...args: any[]): IdentifiableObject;
	function removeFromRepository(id: string): void;
	function updateItemId(oldId: string, newId: string): void;
	function getListsRegistry(): MarshallableArray;
	function registerList(list: UpdatableListObject): void;
	function unregisterList(list: UpdatableListObject): void;
	function itemUpdated(item: UpdatableObject, oldId: string): void;
	function itemRemoved(id: string): void;
	function updateItemData(item: UpdatableObject): void;
	function loadItem(item: LoadableObject, reload: boolean, onSuccess: ()=>void, onFailure: (error: string)=>void);
}