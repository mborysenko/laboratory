/// <reference path="MarshallableObject.d.ts"/>

declare module SDL.Client.Models
{ 
    export class MarshallableArray<T> extends SDL.Client.Models.MarshallableObject
    {
        constructor();
        getArray(): T[];       
    }
}