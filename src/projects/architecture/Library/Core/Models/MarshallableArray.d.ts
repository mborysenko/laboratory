/// <reference path="MarshallableObject.d.ts"/>

declare module SDL.Client.Models
{ 
    export class MarshallableArray extends SDL.Client.Models.MarshallableObject
    {
        constructor ();
        getArray(): any[];       
    }
}