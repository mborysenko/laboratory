/// <reference path="IdentifiableObject.d.ts"/>
/// <reference path="LoadableObject.d.ts"/>
declare module SDL.Client.Models
{
	export interface IUpdatableObject extends IIdentifiableObject, ILoadableObject
	{
		setLastUpdateCheckTimeStamp(timeStamp: number): void;
		getLastUpdateCheckTimeStamp(): number;
		setDataFromList(data: any, parentId: string, timeStamp:number): void;
		updateData(data: any, parentId: string): void;
	}

    export class UpdatableObject extends LoadableObject implements IUpdatableObject
    {
		constructor(id: string); 
		setLastUpdateCheckTimeStamp(timeStamp: number): void;
		getLastUpdateCheckTimeStamp(): number;
		setDataFromList(data: any, parentId: string, timeStamp?: number): void;
		updateData(data: any, parentId: string): void;
		getId(): string;
    }
}