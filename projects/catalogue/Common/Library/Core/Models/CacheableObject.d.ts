/// <reference path="MarshallableObject.d.ts"/>

declare module SDL.Client.Models
{ 
    export interface ICacheableObjectProperties extends IMarshallableObjectProperties
    {
        timeStamps: {[data: string]: number;};
        maxAge: number;
    }
    export interface ICacheableObject
    {
        getMaxAge(): number;
        isCacheValid(data: string): boolean;
        invalidateCache(data: string): void;
        getTimeStamp(data?: string): number;
        setTimeStamp(timestamp: number, data?: string): void;
    }
    export class CacheableObject extends MarshallableObject implements ICacheableObject
    {
        constructor();
        getMaxAge(): number;
        isCacheValid(data?: string): boolean;
        invalidateCache(data?: string): void;
        getTimeStamp(data?: string): number;
        setTimeStamp(timestamp: number, data?: string): void;
        properties: ICacheableObjectProperties;
    }
}