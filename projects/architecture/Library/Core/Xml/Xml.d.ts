declare module SDL.Client
{
    export module Xml 
    {        
        export module Namespaces 
        {
            var xsl: string;
            var xlink: string;
            var models: string;
            var list: string;
        }
        function containsNode(parent: Node, child: Node): boolean;
        function createResolver(namespaces: {[prefix: string]: string;}): any;
        function createElementNS(doc: Document, ns: string, name: string): Element;
        function createAttributeNS(doc: Document, ns: string, name: string): Attr;
        function setAttributeNodeNS(doc: Document, ns: string, name: string): any;
        function escape(str: string, isattribute: boolean): string;
        function getInnerText(node: Node, xpath?: string, defaultValue?: string, namespaces?: {[prefix: string]: string;}): string;
        function getInnerXml(node: Node, xpath: string, namespaces?: {[prefix: string]: string;}): string;
        function getNewXmlDocument(xml: string, async?: boolean, freeThreaded?: boolean): Document;
        function getNewXsltProcessor(xslt: string): any;
        function getNewXsltProcessor(xslt: Document): any;
        function getParentNode(child: Node): Node;
        function getOuterXml(node: Node, xpath: string): string;
        function getParseError(document: Document): any;
        function hasParseError(document: Document): boolean;
        function selectStringValue(parent: Node, xPath: string, namespaces?: {[prefix: string]: string;}): string;
        function selectSingleNode(parent: Node, xPath: string, namespaces?: {[prefix: string]: string;}): Node;
        function selectNodes(parent: Node, xPath: string, namespaces?: {[prefix: string]: string;}): Node[];
        function removeAll(nodeList: NodeList): void;
        function removeAll(nodeList: Node[]): void;
		function setInnerText(node: Node, value: string): void;
        function setInnerXml(node: Node, xml: string): void;
		function setOuterXml(node: Node, xml: string): Node;
        function importNode(document: Document, importedNode: Node, deep: boolean): Node;
        function transformToXmlDocument(inputDoc: Document, xslProcessor: any, parameters: any): Document;
        function transformToString(inputDoc: Document, xslProcessor: any, parameters: any): string;
        function transformToXslProcessor(inputDoc: Document, xslProcessor: any, parameters: any, namespaceSelectors: string[]): any;
        function xsltTransform(xslProcessor: any, xml: string, parameters: any, toDocument: Document): any;
        function getAttributes(xmlNode: Node): Node[];
        function toJson(xmlNode: Node, attrPrefix?: string): any;
        function getLocalName(node: Node): string;
		function getNextElementSibling(node: Node): Node;
		function getFirstElementChild(node: Node): Node;
    }
}