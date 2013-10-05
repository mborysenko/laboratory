/// <reference path="XmlBasedObject.d.ts" />
declare module SDL.Client.Models.Base
{
    export interface IEditableXmlBasedObjProperties
    { 
        changeXml: string;
        changeXmlDocument: Document;
    }
    export class EditableXmlBasedObject extends SDL.Client.Models.Base.XmlBasedObject
    {
        constructor (id?:number, parentId?:number, filter?:any);
        setChangeXml(value: any):void;
        getChangeXml(): string;
        getChangeXmlDocument(): Document;
        properties: IEditableXmlBasedObjProperties;
        _createChangeXml(): any;
        _ensureXmlElement(xpath: any, parent: any): any;
    }
}