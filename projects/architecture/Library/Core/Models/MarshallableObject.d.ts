/// <reference path="../Types/ObjectWithEvents.d.ts" />
declare module SDL.Client.Models
{
    // // The structure of Properties 
	export interface IProperties
	{
		target: any;
		marshalling: boolean;
	}
	export interface IMarshallableObject extends SDL.Client.Types.IObjectWithEvents
	{
        getMarshalObject(): any;
        pack(): any;
        unpack(): void;
        isMarshalling(): boolean;
	}
    class MarshallableObject extends SDL.Client.Types.ObjectWithEvents         
    {
        getMarshalObject(): MarshallableObject;
        pack(): any;
        unpack(): void;
        isMarshalling(): boolean;
        _marshalData(target: any): void;
        _initializeMarshalledObject(obj: any): void;
		properties: any;        
    }
}
