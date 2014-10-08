/// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Types/String.d.ts" />
/// <reference path="../Diagnostics/Assert.d.ts" />
/// <reference path="Xml.Base.ts" />
module SDL.Client.Xml
{
	export function containsNode(parent: Node, child: Node): boolean
	{
		if (parent)
		{
			if (parent.nodeType == 2)
			{
				return child == parent;
			}
			else if (child && child.nodeType == 2)
			{
				child = Xml.selectSingleNode(child, "..");
			}

			while (child && child != parent)
			{
				child = child.parentNode;
			}
			return child == parent;
		}
		return false;
	};

	export function createElementNS(xmlDoc: Document, ns: string, name: string): Element
	{
		Diagnostics.Assert.isDocument(xmlDoc);
		Diagnostics.Assert.isString(ns);
		Diagnostics.Assert.isString(name);

		if (xmlDoc.createElementNS)
		{
			return xmlDoc.createElementNS(ns, name);
		}
		else
		{
			return (<any>xmlDoc).createNode(1, name, ns);
		}
	};

	export function escape(value: string, attribute = false): string
	{
		if (value != null)
		{
			value = value.toString();
			value = value.replace(/&/g, "&amp;");
			value = value.replace(/</g, "&lt;");
			value = value.replace(/>/g, "&gt;");
			if (attribute)
			{
				value = value.replace(/\'/g, "&apos;");
				value = value.replace(/\"/g, "&quot;");
			}
		}
		return value;
	};

	export function getInnerXml(node: Node, xpath: string, namespaces: INamespaceDefinitions): string
	{
		if (node)
		{
			var selection = xpath ? selectSingleNode(node, xpath, namespaces) : node;
			if (selection)
			{
				var stringBuilder: string[] = [];
				var childNode = selection.firstChild;
				while (childNode)
				{
					stringBuilder.push(getOuterXml(childNode));
					childNode = childNode.nextSibling;
				}
				return stringBuilder.join("");
			}
		}
	};

	export function getNewXsltProcessor(xslt: string): any;
	export function getNewXsltProcessor(xslt: Document): any;
	export function getNewXsltProcessor(xslt: any): any
	{
		Diagnostics.Assert.isNotNullOrUndefined(xslt);

		var stylesheetXml = Type.isString(xslt)
			? getNewXmlDocument(xslt)
			: xslt;

		if ((<any>window).XSLTProcessor)
		{
			var processor = new (<any>window).XSLTProcessor();
			if (SDL.jQuery.browser.mozilla)	// in FF output method="html" causes the generated output to be in xhtml namespace. Typically we don't want that.
			{
				var htmlMethodAttribute = selectSingleNode(stylesheetXml, "/xsl:stylesheet/xsl:output/@method[.='html']");
				if (htmlMethodAttribute)
				{
					(<Attr>htmlMethodAttribute).value = "xml";
				}
			}

			try
			{
				processor.importStylesheet(stylesheetXml);
			}
			catch (e)
			{
				Diagnostics.Assert.raiseError(e.message);
				throw e;
			}
			return processor;
		}
		else
		{
			var progIDs = Xml.progIDs();
			if (progIDs.xslTemplate)
			{
				var xslt = new ActiveXObject(progIDs.xslTemplate);
				var freeTheadedXml = getNewXmlDocument(stylesheetXml.xml, true, true);

				xslt.stylesheet = freeTheadedXml;
				return xslt.createProcessor();
			}
			else
			{
				throw Error("Unable to create xsltProcessor");
			}
		}
	};

	export function getParentNode(child: Node): Node
	{
		return child.nodeType == 2 ? selectSingleNode(child, "..") : child.parentNode;
	};

	export function getOuterXml(node: Node, xpath?: string): string
	{
		if (node)
		{
			var selection = xpath ? selectSingleNode(node, xpath) : node;
			if (selection)
			{
				if (Type.isString((<any>selection).xml))
				{
					return (<any>selection).xml;
				}
				else
				{
					return (new (<any>window).XMLSerializer()).serializeToString(selection);
				}
			}
		}
	};

	export function selectStringValue(parent: Node, xPath?: string, namespaces?: INamespaceDefinitions): string
	{
		var doc = (!parent || parent.nodeType == 9) ? parent : parent.ownerDocument;
		if (doc)
		{
			if ((<any>doc).evaluate)
			{
				var xPathResult = (<any>doc).evaluate(xPath, parent, createResolver(namespaces),
					(<any>window).XPathResult.STRING_TYPE, null);

				return xPathResult ? xPathResult.stringValue : null;
			}
			else
			{
				if (namespaces)
				{
					var nsList = String((<any>doc).getProperty("SelectionNamespaces") || "").split(" ");
					for (var prefix in namespaces)
					{
						var spec = Types.String.format("xmlns:{0}=\"{1}\"", prefix, namespaces[prefix]);
						if (SDL.jQuery.inArray(spec, nsList) == -1)
						{
							nsList.push(spec);
						}
					}
					(<any>doc).setProperty("SelectionNamespaces", nsList.join(" "));
				}
				var node: Node = (<any>parent).selectSingleNode(xPath);
				return node ? (node.nodeType == 2 ? (<Attr>node).value : node.nodeValue) : null;
			}
		}
	};

	export function removeAll(nodeList: NodeList): void
	{
		if (typeof((<any>nodeList).context) != "undefined")  // xml node list
		{
			(<any>nodeList).removeAll();
		}
		else
		{
			for (var i = 0, len = nodeList.length; i < len; i++)
			{
				var node = nodeList[i];
				switch (node.nodeType)
				{
					case 2: //node.ATTRIBUTE_NODE:
						(<Element>getParentNode(node)).removeAttributeNode(<Attr>node);
						break;
					default:
						node.parentNode.removeChild(node);
						break;
				}
			}
		}
	};

	export function setInnerText(node: Node, value: string): void
	{
		if (node == null)
		{
			return null;
		}

		if (node.nodeType == 2)
		{
			(<Attr>node).value = value;
		}
		else
		{
			if (node.nodeType == 9)
			{
				node = (<Document>node).documentElement;
			}

			if (node.textContent != undefined)
			{
				node.textContent = value;
			}
			else
			{
				(<any>node).text = value;
			}
		}
	};

	export function setInnerXml(node: Node, xml: string): void
	{
		if (node)
		{
			setInnerText(node, "");
			if (xml)
			{
				var doc = getNewXmlDocument("<r>" + xml + "</r>");

				var docElement = importNode(node.ownerDocument, doc.documentElement, true);
				var child = docElement.firstChild;
				while (child)
				{
					node.appendChild(child);
					child = docElement.firstChild;
				}
			}
		}
	};

	export function importNode(document: Document, node: Node, deep?: boolean): Node
	{
		if (SDL.jQuery.browser.msie && progIDs().domDocument == "MSXML2.DOMDocument.3.0")	// msxml 3.0 does not support importNode() method
		{
			return node.cloneNode(deep);
		}
		else if (document && node)
		{
			return document.importNode(node, deep);
		}
	};

	export function setOuterXml(node: Node, xml: string): Node
	{
		if (node && node.nodeType == 1)
		{
			var parent = node.parentNode;
			if (xml)
			{
				var doc = getNewXmlDocument(xml);
				var newNode = importNode(node.ownerDocument, doc.documentElement, true);
				parent.replaceChild(newNode, node);
				return newNode;
			}
			else
			{
				// xml is null - remove node
				parent.removeChild(node);
			}
		}
		return null;
	};

	/**
	* Transforms the supplied xml document and returns the result as a new <c>XMLDocument</c>
	* @param {XMLDocument} inputDoc The document to transform.
	* @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
	* @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
	* @returns {XMLDocument} The result of the transformation.
	*/
	export function transformToXmlDocument(inputDoc: Document, xslProcessor: any, parameters?: {[par: string]: any;}): Document
	{
		Diagnostics.Assert.isNode(inputDoc);
		Diagnostics.Assert.isNotNullOrUndefined(xslProcessor);

		return xsltTransform(xslProcessor, inputDoc, parameters, true);
	};

	/**
	* Transforms the supplied xml document and returns the result as a string.
	* @param {XMLDocument} inputDoc The document to transform
	* @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
	* @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
	* @returns {String} The result of the transformation.
	*/
	export function transformToString(inputDoc: Document, xslProcessor: any, parameters?: {[par: string]: any;}): string
	{
		Diagnostics.Assert.isNode(inputDoc);
		Diagnostics.Assert.isNotNullOrUndefined(xslProcessor);

		return xsltTransform(xslProcessor, inputDoc, parameters, false);
	};

	/**
	* Transforms the supplied xml document and returns the result as a new <c>XsltProcessor</c>
	* @param {XMLDocument} inputDoc The document to transform
	* @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
	* @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
	* @returns {XSLTProcessor} The result of the transformation.
	*/
	export function transformToXslProcessor(inputDoc: Document, xslProcessor: any, parameters?: {[par: string]: any;}, namespaces?: INamespaceDefinitions): any
	{
		Diagnostics.Assert.isNode(inputDoc);
		Diagnostics.Assert.isNotNullOrUndefined(xslProcessor);

		var nsDeclares: string[] = [];
		var nsExcludes: string[] = [];
		if (namespaces)
		{
			for (var prefix in namespaces)
			{
				nsExcludes.push(prefix);
				nsDeclares.push(Types.String.format('xmlns:{0}="{1}"', prefix, namespaces[prefix]));
			}
		}

		var xslText = transformToString(inputDoc, xslProcessor, parameters);
		if (xslText.match(/xmlns:xsl/))
		{
			xslText = xslText.replace(/xmlns:out="[^\"]+"/g, "");
		}

		xslText = xslText.replace(/XSL\/Transform\/Generated/, "XSL/Transform");
		xslText = xslText.replace(/<out:/g, "<xsl:");
		xslText = xslText.replace(/<\/out:/g, "</xsl:");
		xslText = xslText.replace(/xmlns:out/g, "xmlns:xsl");

		xslText = xslText.replace(/[\s\S]*(<xsl:stylesheet .*?)>/,
			"$1 " + nsDeclares.join(" ") +
			' exclude-result-prefixes="' + nsExcludes.join(" ") + '">');

		var xslDocument = getNewXmlDocument(xslText);
		var xslProcessor = getNewXsltProcessor(xslDocument);
		return xslProcessor;
	};

	export function xsltTransform(xsltProcessor: any, xml: Document, parameters?: {[par: string]: any;}, toDocument?: boolean): any
	{
		var output: any = null;

		try
		{
			if (xsltProcessor && xml)
			{
				if (typeof(parameters) == "object")
				{
					for (var key in parameters)
					{
						if (parameters[key] == null)
						{
							continue;
						}
						if (xsltProcessor.setParameter)
						{
							xsltProcessor.setParameter(null, key, parameters[key]);
						}
						else
						{
							xsltProcessor.addParameter(key, parameters[key]);
						}
					}
				}

				if (xsltProcessor.transformToDocument)
				{
					output = xsltProcessor.transformToDocument(xml);
					if (!toDocument)
					{
						output = getOuterXml(output);
					}
					xsltProcessor.clearParameters();
				}
				else
				{
					xsltProcessor.reset();
					xsltProcessor.input = xml;
					if (toDocument)
					{
						output = getNewXmlDocument();
						xsltProcessor.output = output;
						xsltProcessor.transform();
					}
					else
					{
						xsltProcessor.transform();
						output = xsltProcessor.output;
					}
					xsltProcessor.output = null;
				}
			}
		}
		catch (e)
		{
			SDL.Client.Diagnostics.Assert.raiseError(e.message);
			throw e;
		}
		return output;
	};

	export function getAttributes(xmlNode: Node)
	{
		if (xmlNode)
		{
			return selectNodes(xmlNode, "@*");
		}
	};

	export function toJson(xmlNode: Node, attrPrefix?: string): Object
	{
		if (xmlNode)
		{
			var nodeType = xmlNode.nodeType;
			if (nodeType == 9)
			{
				xmlNode = (<Document>xmlNode).documentElement;
				if (xmlNode)
				{
					nodeType = xmlNode.nodeType;
				}
				else
				{
					return;
				}
			}

			var result: any;

			if (nodeType == 2)	// attribute
			{
				result = (<Attr>xmlNode).value;
			}
			else if (nodeType == 1)	// element
			{
				if (attrPrefix == null)
				{
					attrPrefix = "@";
				}

				var attribs: Node[] = getAttributes(xmlNode);
				var attrLen: number = attribs.length;
				var childNode = getFirstElementChild(xmlNode);

				if (attrLen || childNode)
				{
					var propCount = 0;
					var arrayProp: string;
					var first = true;

					result = {};

					for (var i = 0; i < attrLen; i++)
					{
						propCount++;
						result[attrPrefix + getLocalName(attribs[i])] = toJson(attribs[i]);
					}

					while (childNode)
					{
						var propName = getLocalName(childNode);
						if (propName in result)
						{
							var existProp = result[propName];
							if (!SDL.Client.Type.isArray(existProp))
							{
								arrayProp = propName;
								existProp = result[propName] = [existProp];
							}
							existProp.push(toJson(childNode, attrPrefix));
						}
						else
						{
							propCount++;
							result[propName] = toJson(childNode, attrPrefix);
						}

						childNode = getNextElementSibling(childNode);
					}
					if (propCount == 1 && arrayProp)
					{
						result = result[arrayProp];
					}
				}
				else
				{
					result = getInnerText(xmlNode);
				}
			}
			return result;
		}
	};

	export function getLocalName(node: Node): string
	{
		if (node)
		{
					// standard   || IE XML DOM
			return node.localName || (<any>node).baseName;
		}
	};

	export function getNextElementSibling(node: Node): Element
	{
		if (node)
		{
			node = node.nextSibling;
			while (node && node.nodeType != 1)
			{
				node = node.nextSibling;
			}
		}
		return <Element>node;
	};

	export function getFirstElementChild(node: Node): Element
	{
		if (node)
		{
			node = node.firstChild;
			if (node && node.nodeType != 1)
			{
				node = getNextElementSibling(node);
			}
		}
		return <Element>node;
	};
}