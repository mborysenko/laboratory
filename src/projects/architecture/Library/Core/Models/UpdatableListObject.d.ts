/// <reference path="IdentifiableObject.d.ts"/>
/// <reference path="LoadableObject.d.ts"/>
/// <reference path="UpdatableObject.d.ts"/>

declare module SDL.Client.Models
{ 
    export interface IUpdatableListObject extends IIdentifiableObject
    {
        beforeSetLoaded(): void;
        unload(): void;
        itemUpdated(item: UpdatableObject): void;
        itemRemoved(itemid: string): void;
        updateItemData(item: UpdatableObject): void;
        getId(): number;
    }
	export class UpdatableListObject extends SDL.Client.Models.LoadableObject implements IUpdatableListObject
    {
        constructor(id: string); 
        beforeSetLoaded(): void;
        unload(): void;
        itemUpdated(item: UpdatableObject): void;
        itemRemoved(itemid: string): void;
        updateItemData(item: UpdatableObject): void;
        getId(): number;
    }
}