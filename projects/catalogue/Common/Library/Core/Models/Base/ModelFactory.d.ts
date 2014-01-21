/// <reference path="../../Types/OO.d.ts" />
/// <reference path="../ModelFactory.d.ts" />
declare module SDL.Client.Models.Base
{
    export interface IModelFactoryProperties
    { 
        idMatchRegExp: RegExp;
        settings: { prefix: string; };
	}

    export class ModelFactory extends Models.ModelFactory
    {
        constructor();
        getPrefix(): string;
        getSystemRootId(): string;
        getSystemRootTitle(): string;
        getSystemRoot(): any;
        isModelSpecificUri(id: string): boolean;
        getModelSpecificUri(id: string, type: string): string;
        getOriginalId(modelSpecificId: string): string;
        getFolderType(): string;
        getDocumentType(): string;
        getListType(): string;
        getIdMatchRegExp(): RegExp;
        getSettings(): any;
        properties: IModelFactoryProperties;
    }
}