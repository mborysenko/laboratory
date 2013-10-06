/// <reference path="IdentifiableObject.d.ts"/>
/// <reference path="LoadableObject.d.ts"/>
declare module SDL.Client.Models
{ 
    export class UpdatableObject extends SDL.Client.Models.LoadableObject implements IIdentifiableObject
    {
        constructor(id: string); 
        setLastUpdateCheckTimeStamp(timeStamp:number): void;
        getLastUpdateCheckTimeStamp(): number;
        setDataFromList(data:any, parentId:string, timeStamp:number): void;
        updateData(data:any, parentId: string): void;
        getId(): string;
    }
}