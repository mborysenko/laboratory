/// <reference path="../Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Types/String.d.ts" />
/// <reference path="../Diagnostics/Assert.d.ts" />
/// <reference path="Xml.Base.d.ts" />
declare module SDL.Client.Xml {
    function containsNode(parent: Node, child: Node): boolean;
    function createElementNS(xmlDoc: Document, ns: string, name: string): Element;
    function escape(value: string, attribute?: boolean): string;
    function getInnerXml(node: Node, xpath: string, namespaces: INamespaceDefinitions): string;
    function getNewXsltProcessor(xslt: string): any;
    function getNewXsltProcessor(xslt: Document): any;
    function getParentNode(child: Node): Node;
    function getOuterXml(node: Node, xpath?: string): string;
    function selectStringValue(parent: Node, xPath?: string, namespaces?: INamespaceDefinitions): string;
    function removeAll(nodeList: NodeList): void;
    function setInnerText(node: Node, value: string): void;
    function setInnerXml(node: Node, xml: string): void;
    function importNode(document: Document, node: Node, deep?: boolean): Node;
    function setOuterXml(node: Node, xml: string): Node;
    /**
    * Transforms the supplied xml document and returns the result as a new <c>XMLDocument</c>
    * @param {XMLDocument} inputDoc The document to transform.
    * @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
    * @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
    * @returns {XMLDocument} The result of the transformation.
    */
    function transformToXmlDocument(inputDoc: Document, xslProcessor: any, parameters?: {
        [par: string]: any;
    }): Document;
    /**
    * Transforms the supplied xml document and returns the result as a string.
    * @param {XMLDocument} inputDoc The document to transform
    * @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
    * @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
    * @returns {String} The result of the transformation.
    */
    function transformToString(inputDoc: Document, xslProcessor: any, parameters?: {
        [par: string]: any;
    }): string;
    /**
    * Transforms the supplied xml document and returns the result as a new <c>XsltProcessor</c>
    * @param {XMLDocument} inputDoc The document to transform
    * @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
    * @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
    * @returns {XSLTProcessor} The result of the transformation.
    */
    function transformToXslProcessor(inputDoc: Document, xslProcessor: any, parameters?: {
        [par: string]: any;
    }, namespaces?: INamespaceDefinitions): any;
    function xsltTransform(xsltProcessor: any, xml: Document, parameters?: {
        [par: string]: any;
    }, toDocument?: boolean): any;
    function getAttributes(xmlNode: Node): Node[];
    function toJson(xmlNode: Node, attrPrefix?: string): Object;
    function getLocalName(node: Node): string;
    function getNextElementSibling(node: Node): Element;
    function getFirstElementChild(node: Node): Element;
}
