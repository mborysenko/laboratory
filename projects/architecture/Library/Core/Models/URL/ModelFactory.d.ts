/// <reference path="../Base/ModelFactory.d.ts"/>
declare module SDL.Client.Models.URL
{ 
    export interface IModelFactoryProperties extends SDL.Client.Models.Base.IModelFactoryProperties
    { 
        prefix: string;
        root: string;
    }
    export class ModelFactory extends SDL.Client.Models.Base.ModelFactory
    {
        constructor (id:number);  
        getItemType(item:any): any;
        properties: any;
    }
}