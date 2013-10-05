/// <reference path="MarshallableObject.d.ts"/>

declare module SDL.Client.Models
{ 
    export interface IIdentifiableObjectProperties
	{
        id: any;
	}
    export interface IIdentifiableObject extends IMarshallableObject
    {
        getId(): any;
    }
    export class IdentifiableObject extends SDL.Client.Models.MarshallableObject 
        implements IIdentifiableObject
    {
        constructor (id: any);  
        getId(): any;
        properties: any;
    }
}