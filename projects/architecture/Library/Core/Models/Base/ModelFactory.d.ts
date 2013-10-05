/// <reference path="../../Types/OO.d.ts" />
/// <reference path="../ModelFactory.d.ts" />
declare module SDL.Client.Models.Base
{
    export interface IModelFactoryProperties
    { 
        idMatchRegExp: any;
        settings: { prefix: any; };
	}

    export class ModelFactory extends SDL.Client.Models.ModelFactory
    {
        constructor ();
        getPrefix(): any;
        getSystemRootId(): any;
        getSystemRootTitle(): any;
        getSystemRoot(): any;
        isModelSpecificUri(id: any): boolean;
        getModelSpecificUri(id: any, type: any): any;
        getOriginalId(modelSpecificId: any): number;
        getFolderType(): any;
        getDocumentType(): any;
        getListType(): any;
        getIdMatchRegExp(): any;
        getSettings(): any;
        properties: any;
    }
}