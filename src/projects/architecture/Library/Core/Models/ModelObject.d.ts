/// <reference path="IdentifiableObject.d.ts"/>
/// <reference path="ModelFactory.d.ts"/>

declare module SDL.Client.Models
{ 
    export interface IModelObjectProperties
    { 
        modelFactory: SDL.Client.Models.ModelFactory;
        itemType: string;
    }
    export interface IModelObject extends IIdentifiableObject
    {
        getModelFactory(): SDL.Client.Models.ModelFactory;
        getItemType(): string;        
    }
    export class ModelObject extends SDL.Client.Models.IdentifiableObject 
        implements IModelObject
    {
        constructor (id: any); 
        getModelFactory(): SDL.Client.Models.ModelFactory;
        getItemType(): string;
        properties: any;
    }
}