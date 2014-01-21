/// <reference path="XmlBasedObject.d.ts" />
declare module SDL.Client.Models.Base
{
    export interface IEditableXmlBasedObjProperties extends IXmlBasedObjectProperties
    { 
        changeXml: string;
        changeXmlDocument: Document;
    }

    export class EditableXmlBasedObject extends SDL.Client.Models.Base.XmlBasedObject
    {
        constructor();
        setChangeXml(value: string):void;
        getChangeXml(): string;
        getChangeXmlDocument(): Document;
        properties: IEditableXmlBasedObjProperties;
        _createChangeXml(): string;
		_ensureXmlElement(xpath: string, parent: Element): Element;
    }
}