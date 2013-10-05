///<reference path="List.d.ts"/>
declare module SDL.Client.Models.Base
{ 
    export class ModelsBrowser
    {
        constructor (id: number);
        getListType(filter: ListFilter): string;        
    }
}