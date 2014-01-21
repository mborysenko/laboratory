/// <reference path="../Base/ModelFactory.d.ts"/>
declare module SDL.Client.Models.URL
{ 
    export class ModelFactory extends SDL.Client.Models.Base.ModelFactory
    {
        constructor(id: string);  
        getItemType(item: any): string;
    }
}