/// <reference path="IdentifiableObject.d.ts"/>
/// <reference path="LoadableObject.d.ts"/>
/// <reference path="UpdatableObject.d.ts"/>

declare module SDL.Client.Models
{ 
    export interface IUpdatableListObject extends IIdentifiableObject
    {
        itemUpdated(item: IUpdatableObject): void;
        itemRemoved(itemid: string): void;
        updateItemData(item: IUpdatableObject): void;
    }
	export class UpdatableListObject extends LoadableObject implements IUpdatableListObject
    {
        constructor(id: string); 
        itemUpdated(item: IUpdatableObject): void;
        itemRemoved(itemid: string): void;
        updateItemData(item: IUpdatableObject): void;
		getId(): string;
    }
}