///<reference path="Base/Item.d.ts" />

declare module SDL.Client.Models
{ 
    export class ModelFactory
    {
        constructor ();
        getItemType(item: SDL.Client.Models.Base.Item): any;
        getItem(id: number): SDL.Client.Models.Base.Item;
        createNewItem(type: any): void;
    }
}