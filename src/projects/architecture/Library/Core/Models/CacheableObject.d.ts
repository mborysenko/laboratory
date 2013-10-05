/// <reference path="MarshallableObject.d.ts"/>

declare module SDL.Client.Models
{ 
    export interface ICacheableObjectProperties
    {
        timeStamps: Array;
        maxAge: number;
    }
    export interface ICacheableObject
    {
        getMaxAge(): number;
        isCacheValid(data:any): boolean;
        invalidateCache(data:any): void;
        getTimeStamp(data:any): Date;
        setTimeStamp(timestamp:Date,data:any): void;
    }
    export class CacheableObject extends SDL.Client.Models.MarshallableObject
        implements ICacheableObject
    {
        constructor ();
        getMaxAge(): number;
        isCacheValid(data:any): boolean;
        invalidateCache(data:any): void;
        getTimeStamp(data:any): Date;
        setTimeStamp(timestamp:Date,data:any): void;
        properties: any;
    }
}