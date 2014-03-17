/// <reference path="../Types/ObjectWithEvents.d.ts" />
declare module SDL.Client.Models
{
	// // The structure of Properties 
	export interface IMarshallableObjectProperties extends Types.IObjectWithEventsProperties
	{
		target: IMarshallableObject;
		marshalling: boolean;
	}
	export interface IMarshallableObject extends Types.IObjectWithEvents
	{
		getMarshalObject(): IMarshallableObject;
		pack(): any;
		unpack(data: any): void;
		isMarshalling(): boolean;
	}
	class MarshallableObject extends Types.ObjectWithEvents         
	{
		getMarshalObject(): IMarshallableObject;
		pack(): any;
		unpack(data: any): void;
		isMarshalling(): boolean;
		_marshalData(target: IMarshallableObject): void;
		_initializeMarshalledObject(obj: IMarshallableObject): void;
		properties: IMarshallableObjectProperties;
	}
}