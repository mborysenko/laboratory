declare module SDL.Client.Xml {
    interface INamespaceDefinitions {
        [prefix: string]: string;
    }
    /**
    * Defines several common namespaces in use throughout the system.
    */
    var Namespaces: {
        xsl: string;
        xlink: string;
        models: string;
        apphost: string;
    };
    function progIDs(): {
        domDocument: string;
        freeThreadedDOMDocument: string;
        xslTemplate: string;
        initialized: boolean;
        (): void;
    };
    function getNewXmlDocument(xml?: string, async?: boolean, freeThreaded?: boolean): Document;
    function getInnerText(node: Node, xpath?: string, defaultValue?: string, namespaces?: INamespaceDefinitions): string;
    function selectSingleNode(parent: Node, xPath: string, namespaces?: INamespaceDefinitions): Node;
    function selectNodes(parent: Node, xPath: string, namespaces?: INamespaceDefinitions): Node[];
    function createResolver(namespaces: INamespaceDefinitions): (prefix: string) => string;
    /**
    * Returns a string that provides information about a document's parse error, if it has one.
    * @param {XMLDocument} document The document for which to generate parse error text.
    * @return {String} An error text associated with the specified document's parse error, if it has one; otherwise
    * the return value is <c>null</c>.
    */
    function getParseError(doc: Document): string;
    /**
    * Returns <c>true</c> if the specified documen has a parse error.
    * @param {XMLDocument} document The document to check.
    * @return {Boolean} <c>true</c> if the specified documen has a parse error; otherwise <c>false</c>.
    */
    function hasParseError(doc: Document): boolean;
}
