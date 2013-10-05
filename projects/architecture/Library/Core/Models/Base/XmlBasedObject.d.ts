/// <reference path="..\MarshallableObject.d.ts" />
declare module SDL.Client.Models.Base
{ 
    export interface IXmlBasedObject
    {
        xml: any;
        xmlDocument: Document;
    }
    export class XmlBasedObject extends MarshallableObject
    {
        constructor ();  
        setXml(value: string): void;
        getXml(): string;
        getXmlDocument(): any;
        properties: any;
    }
}