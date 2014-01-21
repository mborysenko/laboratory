/// <reference path="..\Types\ObjectWithEvents.d.ts" />
declare module SDL.Client.Models
{
    // // The structure of Properties 
	export interface IMarshallableObjectProperties
	{
		target: IMarshallableObject;
		marshalling: boolean;
	}
	export interface IMarshallableObject extends SDL.Client.Types.IObjectWithEvents
	{
        getMarshalObject(): IMarshallableObject;
        pack(): any;
        unpack(data: any): void;
        isMarshalling(): boolean;
	}
    class MarshallableObject extends SDL.Client.Types.ObjectWithEvents         
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