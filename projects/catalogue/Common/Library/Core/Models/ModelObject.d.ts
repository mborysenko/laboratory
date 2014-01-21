/// <reference path="IdentifiableObject.d.ts"/>
/// <reference path="ModelFactory.d.ts"/>

declare module SDL.Client.Models
{ 
    export interface IModelObjectProperties extends IIdentifiableObjectProperties
    { 
        modelFactory: ModelFactory;
        itemType: string;
    }
    export interface IModelObject extends IIdentifiableObject
    {
        getModelFactory(): ModelFactory;
        getItemType(): string;        
    }
    export class ModelObject extends IdentifiableObject implements IModelObject
    {
        constructor(id: string); 
        getModelFactory(): ModelFactory;
        getItemType(): string;
        properties: IModelObjectProperties;
    }
}