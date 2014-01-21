/// <reference path="..\MarshallableObject.d.ts" />
declare module SDL.Client.Models.Base
{ 
    export interface IXmlBasedObjectProperties
    {
        xml: string;
        xmlDocument: Document;
    }
    export class XmlBasedObject extends MarshallableObject
    {
        constructor ();  
        setXml(value: string): void;
        getXml(): string;
        getXmlDocument(): Document;
        properties: IXmlBasedObjectProperties;
    }
}