module SDL.Client.Xml
{
	export interface INamespaceDefinitions {[prefix: string]: string;};

	/**
	* Defines several common namespaces in use throughout the system.
	*/
	export var Namespaces =
	{
		xsl: "http://www.w3.org/1999/XSL/Transform",
		xlink: "http://www.w3.org/1999/xlink",
		models: "http://wwww.sdlcommonui.com/core/models",
		apphost: "http://www.sdl.com/2013/ApplicationHost"
	};

	var isIE = ((/msie|trident/i).test(navigator.userAgent) && !(/chrome|webkit|opera/i).test(navigator.userAgent));	// MS IE

	export function progIDs()
	{
		var progIDs: {(): void; domDocument: string; freeThreadedDOMDocument: string; xslTemplate: string; initialized: boolean} = <any>Xml.progIDs;
		if (!progIDs.initialized)
		{
			progIDs.initialized = true;
			var msXmlProgIDs = [".6.0", ".3.0"];
			for (var i = 0, l = msXmlProgIDs.length; i < l; i++)
			{
				var ver = msXmlProgIDs[i];

				if (!progIDs.domDocument)
				{
					try
					{
						new ActiveXObject("MSXML2.DOMDocument" + ver);
						progIDs.domDocument = "MSXML2.DOMDocument" + ver;
					}
					catch (err) { }
				}
				if (!progIDs.freeThreadedDOMDocument)
				{
					try
					{
						new ActiveXObject("MSXML2.FreeThreadedDOMDocument" + ver);
						progIDs.freeThreadedDOMDocument = "MSXML2.FreeThreadedDOMDocument" + ver;
					}
					catch (err) { }
				}
				if (!progIDs.xslTemplate)
				{
					try
					{
						new ActiveXObject("MSXML2.XSLTemplate" + ver);
						progIDs.xslTemplate = "MSXML2.XSLTemplate" + ver;
					}
					catch (err) { }
				}
				if (progIDs.domDocument && progIDs.freeThreadedDOMDocument && progIDs.xslTemplate)
				{
					break;
				}
			}
		}
		return progIDs;
	};

	export function getNewXmlDocument(xml?: string, async?: boolean, freeThreaded?: boolean): Document
	{
		var xmlDoc: any = null;
		var errorText: string = null;
		try
		{
			if (isIE)
			{
				var progIDs = Xml.progIDs();
				if (!freeThreaded && progIDs.domDocument || freeThreaded && progIDs.freeThreadedDOMDocument)
				{
					xmlDoc = new ActiveXObject(freeThreaded ? progIDs.freeThreadedDOMDocument : progIDs.domDocument);
					xmlDoc.async = async ? true : false;
					xmlDoc.preserveWhiteSpace = true;

					var namespaces: string[] = [];
					for (var prefix in Namespaces)
					{
						namespaces.push("xmlns:" + prefix + "=\"" + Namespaces[prefix] + "\"");
					}

					if (namespaces.length > 0)
					{
						xmlDoc.setProperty("SelectionNamespaces", namespaces.join(" "));
					}
					xmlDoc.setProperty("SelectionLanguage", "XPath");

					if (progIDs.domDocument == "MSXML2.DOMDocument.6.0")
					{
						xmlDoc.setProperty("AllowXsltScript", true);
					}

					if (xml)
					{
						xmlDoc.loadXML(xml);
					}
				}
				else
				{
					errorText = "Could not find appropriate progID";
				}
			}
			else
			{
				xmlDoc = (new (<any>window).DOMParser()).parseFromString(xml, "text/xml");
				var namespaceURI = xmlDoc.documentElement.namespaceURI;
				if (xmlDoc.documentElement.nodeName == "parsererror" &&
					(namespaceURI == "http://www.w3.org/1999/xhtml" || namespaceURI == "http://www.mozilla.org/newlayout/xml/parsererror.xml"))
				{
					errorText = Xml.getInnerText(xmlDoc);
				}
				else
				{
					var firstChild = xmlDoc.documentElement.firstChild;
					if (firstChild)
					{
						if (firstChild.nodeName == "parsererror" && firstChild.namespaceURI == "http://www.w3.org/1999/xhtml")
						{
							errorText = Xml.getInnerText(firstChild);
						}
						else if ((firstChild = firstChild.firstChild) && firstChild.nodeName == "parsererror" && firstChild.namespaceURI == "http://www.w3.org/1999/xhtml")
						{
							errorText = Xml.getInnerText(firstChild);
						}
					}
				}
			}
		}
		catch (err)
		{
			errorText = err.message;
		}

		if (errorText !== null)
		{
			xmlDoc = { parseError: { errorCode: 1, reason: errorText, srcText: xml} };
		}

		return xmlDoc;
	};

	export function getInnerText(node: Node, xpath?: string, defaultValue?: string, namespaces?: INamespaceDefinitions): string
	{
		if (node && xpath)
		{
			node = selectSingleNode(node, xpath, namespaces);
			if (!node)
			{
				return defaultValue;
			}
		}

		if (node)
		{
			if (node.nodeType == 9)
			{
				node = (<Document>node).documentElement;
			}

			if (node.textContent != undefined)
			{
				return node.textContent;
			}
			else
			{
				return (<any>node).text;
			}
		}
	};

	export function selectSingleNode(parent: Node, xPath: string, namespaces?: INamespaceDefinitions): Node
	{
		var doc = (!parent || parent.nodeType == 9) ? parent : parent.ownerDocument;
		if (doc)
		{
			if ((<any>doc).evaluate)
			{
				var xPathResult = (<any>doc).evaluate(xPath, parent, createResolver(namespaces),
					(<any>window).XPathResult.FIRST_ORDERED_NODE_TYPE, null);

				return xPathResult.singleNodeValue;
			}
			else
			{
				if (namespaces)
				{
					var nsList = String((<any>doc).getProperty("SelectionNamespaces") || "").split(" ");
					for (var prefix in namespaces)
					{
						var spec = "xmlns:" + prefix + "=\"" + namespaces[prefix] + "\"";
						if (nsList.indexOf(spec) == -1)
						{
							nsList.push(spec);
						}
					}
					(<any>doc).setProperty("SelectionNamespaces", nsList.join(" "));
				}
				return (<any>parent).selectSingleNode(xPath);
			}
		}
	};

	export function selectNodes(parent: Node, xPath: string, namespaces?: INamespaceDefinitions)
	{
		var result: Node[] = [];
		var doc = (!parent || parent.nodeType == 9) ? parent : parent.ownerDocument;
		if (doc)
		{
			if ((<any>doc).evaluate)
			{
				var xPathResult = (<any>doc).evaluate(xPath, parent, createResolver(namespaces),
					(<any>window).XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

				var node = xPathResult.iterateNext();
				while (node)
				{
					result[result.length] = node;
					node = xPathResult.iterateNext();
				}
			}
			else
			{
				if (namespaces)
				{
					var nsList = String((<any>doc).getProperty("SelectionNamespaces") || "").split(" ");
					for (var prefix in namespaces)
					{
						var spec = "xmlns:" + prefix + "=\"" + namespaces[prefix] + "\"";
						if (nsList.indexOf(spec) == -1)
						{
							nsList.push(spec);
						}
					}
					(<any>doc).setProperty("SelectionNamespaces", nsList.join(" "));
				}
				result = (<any>parent).selectNodes(xPath);
			}
		}
		return result;
	};

	export function createResolver(namespaces: INamespaceDefinitions)
	{
		return function Xml$resolvePrefix(prefix: string): string
		{
			return (namespaces && namespaces[prefix]) || Namespaces[prefix];
		}
	};

	/**
	* Returns a string that provides information about a document's parse error, if it has one.
	* @param {XMLDocument} document The document for which to generate parse error text.
	* @return {String} An error text associated with the specified document's parse error, if it has one; otherwise
	* the return value is <c>null</c>.
	*/
	export function getParseError(doc: Document): string
	{
		if (doc && hasParseError(doc))
		{
			return (<any>doc).url + ": (" + (<any>doc).parseError.reason + ")";
		}
		else if (!doc || doc.nodeType != 9)
		{
			throw Error("Xml.getParseError: Object should be a document node");
		}
	};

	/**
	* Returns <c>true</c> if the specified documen has a parse error.
	* @param {XMLDocument} document The document to check.
	* @return {Boolean} <c>true</c> if the specified documen has a parse error; otherwise <c>false</c>.
	*/
	export function hasParseError(doc: Document): boolean
	{
		return ((<any>doc).parseError && (<any>doc).parseError.errorCode != 0) || false;
	};
};