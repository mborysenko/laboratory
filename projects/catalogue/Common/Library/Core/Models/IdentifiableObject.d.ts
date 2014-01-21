/// <reference path="MarshallableObject.d.ts"/>

declare module SDL.Client.Models
{ 
    export interface IIdentifiableObjectProperties extends IMarshallableObjectProperties
	{
        id: string;
	}
    export interface IIdentifiableObject extends IMarshallableObject
    {
        getId(): string;
    }
    export class IdentifiableObject extends MarshallableObject
        implements IIdentifiableObject
    {
        constructor(id: string);  
        getId(): string;
        properties: IIdentifiableObjectProperties;
    }
}