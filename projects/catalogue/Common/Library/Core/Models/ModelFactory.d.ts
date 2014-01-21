///<reference path="Base/Item.d.ts" />

declare module SDL.Client.Models
{
	export interface IModelFactory
    {
        getItemType(item: Base.Item): string;
        getItem(id: string): Base.Item;
        createNewItem(type: string): void;
    }
    export class ModelFactory implements IModelFactory
    {
        constructor();
        getItemType(item: Base.Item): string;
        getItem(id: string): Base.Item;
        createNewItem(type: string): void;
    }
}