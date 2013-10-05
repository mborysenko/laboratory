/*! @namespace {SDL.Client.Xml} */
SDL.Client.Type.registerNamespace("SDL.Client.Xml");

SDL.Client.Xml = function SDL$Client$Xml(document)
{
	return SDL.Client.Xml.getOuterXml(document);
};

/**
* Defines several common namespaces in use throughout the system.
*/
SDL.Client.Xml.Namespaces =
{
	xsl: "http://www.w3.org/1999/XSL/Transform",
	xlink: "http://www.w3.org/1999/xlink",
	models: "http://wwww.sdlcommonui.com/core/models",
	apphost: "http://www.sdl.com/2013/ApplicationHost",
	list: "http://www.sdlcommonui.com/2009/GUI/extensions/List"
};


SDL.Client.Xml.containsNode = function SDL$Client$Xml$containsNode(parent, child)
{
	if (parent)
	{
		if (parent.nodeType == 2)
		{
			return child == parent;
		}
		else if (child && child.nodeType == 2)
		{
			child = this.selectSingleNode(child, "..");
		}

		while (child && child != parent)
		{
			child = child.parentNode;
		}
		return child == parent;
	}
	return false;
};

SDL.Client.Xml.createResolver = function SDL$Client$Xml$createResolver(namespaces)
{
	return function Xml$resolvePrefix(prefix)
	{
		if (namespaces && namespaces[prefix])
		{
			return namespaces[prefix];
		}
		return SDL.Client.Xml.Namespaces[prefix];
	}
};

SDL.Client.Xml.createElementNS = function SDL$Client$Xml$createElementNS(xmlDoc, ns, name)
{
	SDL.Client.Diagnostics.Assert.isDocument(xmlDoc);
	SDL.Client.Diagnostics.Assert.isString(ns);
	SDL.Client.Diagnostics.Assert.isString(name);

	if (xmlDoc.createElementNS)
	{
		return xmlDoc.createElementNS(ns, name);
	}
	else
	{
		return xmlDoc.createNode(1, name, ns);
	}
};

SDL.Client.Xml.createAttributeNS = function SDL$Client$Xml$createAttributeNS(xmlDoc, ns, name)
{
	SDL.Client.Diagnostics.Assert.isDocument(xmlDoc);
	SDL.Client.Diagnostics.Assert.isString(ns);
	SDL.Client.Diagnostics.Assert.isString(name);

	if (xmlDoc.createAttributeNS)
	{
		return xmlDoc.createAttributeNS(ns, name);
	}
	else
	{
		return xmlDoc.createNode(2, name, ns);
	}
};

SDL.Client.Xml.setAttributeNodeNS = function SDL$Client$Xml$setAttributeNodeNS(element, attribute, ns)
{
	if (element.setAttributeNodeNS)
	{
		element.setAttributeNodeNS(attribute, ns);
	}
	else
	{
		element.setAttributeNode(attribute);
	}
};

SDL.Client.Xml.escape = function SDL$Client$Xml$escape(string, attribute)
{
	if (string != null)
	{
		string = string.toString();
		string = string.replace(/&/g, "&amp;");
		string = string.replace(/</g, "&lt;");
		string = string.replace(/>/g, "&gt;");
		if (attribute)
		{
			string = string.replace(/\'/g, "&apos;");
			string = string.replace(/\"/g, "&quot;");
		}
	}
	return string;
};

SDL.Client.Xml.getInnerText = function SDL$Client$Xml$getInnerText(node, xpath, defaultValue, namespaces)
{
	if (node && xpath)
	{
		node = this.selectSingleNode(node, xpath, namespaces);
		if (!node)
		{
			return defaultValue;
		}
	}

	if (node)
	{
		if (node.nodeType == 9)
		{
			node = node.documentElement;
		}

		if (node.textContent != undefined)
		{
			return node.textContent;
		}
		else
		{
			return node.text;
		}
	}
};

SDL.Client.Xml.getInnerXml = function SDL$Client$Xml$getInnerXml(node, xpath, namespaces)
{
	if (node)
	{
		var selection = xpath ? this.selectSingleNode(node, xpath, namespaces) : node;
		if (selection)
		{
			var stringBuilder = [];
			var childNode = selection.firstChild;
			while (childNode)
			{
				stringBuilder.push(this.getOuterXml(childNode));
				childNode = childNode.nextSibling;
			}
			return stringBuilder.join("");
		}
	}
};

SDL.Client.Xml.getNewXmlDocument = function SDL$Client$Xml$getNewXmlDocument(xml, async, freeThreaded)
{
	var xmlDoc = null;
	var errorText = null;
	try
	{
		if (window.DOMParser && !SDL.jQuery.browser.msie)
		{
			xmlDoc = (new window.DOMParser()).parseFromString(xml, "text/xml");
			var namespaceURI = xmlDoc.documentElement.namespaceURI;
			if (xmlDoc.documentElement.nodeName == "parsererror" && (namespaceURI == "http://www.w3.org/1999/xhtml" || namespaceURI == "http://www.mozilla.org/newlayout/xml/parsererror.xml"))
			{
				errorText = this.getInnerText(xmlDoc);
			}
			else if (SDL.jQuery.browser.webkit)
			{
				var firstChild = xmlDoc.documentElement.firstChild;
				if (firstChild && firstChild.nodeName == "parsererror" && firstChild.namespaceURI == "http://www.w3.org/1999/xhtml")
				{
					errorText = this.getInnerText(firstChild);
				}
				else if (firstChild && (firstChild = firstChild.firstChild) && firstChild.nodeName == "parsererror" && firstChild.namespaceURI == "http://www.w3.org/1999/xhtml")
				{
					errorText = this.getInnerText(firstChild);
				}
			}
		}
		else
		{
			var progIDs = this.progIDs();
			if (!freeThreaded && progIDs.domDocument || freeThreaded && progIDs.freeThreadedDOMDocument)
			{
				xmlDoc = new ActiveXObject(freeThreaded ? progIDs.freeThreadedDOMDocument : progIDs.domDocument);
				xmlDoc.async = async ? true : false;
				xmlDoc.preserveWhiteSpace = true;

				var namespaces = [];
				for (var prefix in SDL.Client.Xml.Namespaces)
				{
					namespaces.push(SDL.Client.Types.String.format("xmlns:{0}=\"{1}\"", prefix, SDL.Client.Xml.Namespaces[prefix]));
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
	}
	catch (err)
	{
		SDL.Client.Diagnostics.Assert.raiseError(err.message);
		errorText = err.message;
	}

	if (errorText !== null)
	{
		xmlDoc = { parseError: { errorCode: 1, reason: errorText, srcText: xml} };
	}

	return xmlDoc;
};

SDL.Client.Xml.getNewXsltProcessor = function SDL$Client$Xml$getNewXsltProcessor(xslt)
{
	SDL.Client.Diagnostics.Assert.isNotNullOrUndefined(xslt);

	var stylesheetXml = SDL.Client.Type.isString(xslt)
		? this.getNewXmlDocument(xslt)
		: xslt;

	if (window.XSLTProcessor)
	{
		var processor = new XSLTProcessor();
		if (SDL.jQuery.browser.mozilla)	// in FF output method="html" causes the generated output to be in xhtml namespace. Typically we don't want that.
		{
			var htmlMethodAttribute = this.selectSingleNode(stylesheetXml, "/xsl:stylesheet/xsl:output/@method[.='html']");
			if (htmlMethodAttribute)
			{
				htmlMethodAttribute.value = "xml";
			}
		}

		try
		{
			processor.importStylesheet(stylesheetXml);
		}
		catch (e)
		{
			SDL.Client.Diagnostics.Assert.raiseError(e.message);
			throw e;
		}
		return processor;
	}
	else
	{
		var progIDs = this.progIDs();
		if (progIDs.xslTemplate)
		{
			var xslt = new ActiveXObject(progIDs.xslTemplate);
			var freeTheadedXml = this.getNewXmlDocument(stylesheetXml.xml, true, true);

			xslt.stylesheet = freeTheadedXml;
			return xslt.createProcessor();
		}
		else
		{
			throw Error("Unable to create xsltProcessor");
		}
	}
};

SDL.Client.Xml.getParentNode = function SDL$Client$Xml$getParentNode(child)
{
	return child.nodeType == 2 ? this.selectSingleNode(child, "..") : child.parentNode;
};

SDL.Client.Xml.getOuterXml = function SDL$Client$Xml$getOuterXml(node, xpath)
{
	if (node)
	{
		var selection = xpath ? this.selectSingleNode(node, xpath) : node;
		if (selection)
		{
			if (SDL.Client.Type.isString(selection.xml))
			{
				return selection.xml;
			}
			else
			{
				return (new XMLSerializer()).serializeToString(selection);
			}
		}
	}
};

/**
* Returns a string that provides information about a document's parse error, if it has one.
* @param {XMLDocument} document The document for which to generate parse error text.
* @return {String} An error text associated with the specified document's parse error, if it has one; otherwise
* the return value is <c>null</c>.
*/
SDL.Client.Xml.getParseError = function SDL$Client$Xml$getParseError(document)
{
	if (document && this.hasParseError(document))
	{
		return SDL.Client.Types.String.format("{0}: ({1})", document.url, document.parseError.reason);
	}
	SDL.Client.Diagnostics.Assert.isDocument(document);
	return null;
};

/**
* Returns <c>true</c> if the specified documen has a parse error.
* @param {XMLDocument} document The document to check.
* @return {Boolean} <c>true</c> if the specified documen has a parse error; otherwise <c>false</c>.
*/
SDL.Client.Xml.hasParseError = function SDL$Client$Xml$hasParseError(document)
{
	return (document.parseError && document.parseError.errorCode != 0) || false;
};

SDL.Client.Xml.progIDs = function SDL$Client$Xml$progIDs()
{
	var progIDs = this.progIDs;
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

SDL.Client.Xml.selectStringValue = function SDL$Client$Xml$selectStringValue(parent, xPath, namespaces)
{
	var doc = (!parent || parent.nodeType == 9) ? parent : parent.ownerDocument;
	if (doc)
	{
		if (doc.evaluate)
		{
			var xPathResult = doc.evaluate(xPath, parent, this.createResolver(namespaces),
				XPathResult.STRING_TYPE, null);

			return xPathResult ? xPathResult.stringValue : null;
		}
		else
		{
			if (namespaces)
			{
				var nsList = String(doc.getProperty("SelectionNamespaces") || "").split(" ");
				for (var prefix in namespaces)
				{
					var spec = SDL.Client.Types.String.format("xmlns:{0}=\"{1}\"", prefix, namespaces[prefix]);
					if (SDL.jQuery.inArray(spec, nsList) == -1)
					{
						nsList.push(spec);
					}
				}
				doc.setProperty("SelectionNamespaces", nsList.join(" "));
			}
			var result = parent.selectSingleNode(xPath);
			return result ? result.nodeValue : null;
		}
	}
};

SDL.Client.Xml.selectSingleNode = function SDL$Client$Xml$selectSingleNode(parent, xPath, namespaces)
{
	var doc = (!parent || parent.nodeType == 9) ? parent : parent.ownerDocument;
	if (doc)
	{
		if (doc.evaluate)
		{
			var xPathResult = doc.evaluate(xPath, parent, this.createResolver(namespaces),
				XPathResult.FIRST_ORDERED_NODE_TYPE, null);

			return xPathResult.singleNodeValue;
		}
		else
		{
			if (namespaces)
			{
				var nsList = String(doc.getProperty("SelectionNamespaces") || "").split(" ");
				for (var prefix in namespaces)
				{
					var spec = SDL.Client.Types.String.format("xmlns:{0}=\"{1}\"", prefix, namespaces[prefix]);
					if (SDL.jQuery.inArray(spec, nsList) == -1)
					{
						nsList.push(spec);
					}
				}
				doc.setProperty("SelectionNamespaces", nsList.join(" "));
			}
			return parent.selectSingleNode(xPath);
		}
	}
};

SDL.Client.Xml.selectNodes = function SDL$Client$Xml$selectNodes(parent, xPath, namespaces)
{
	var result = [];
	var doc = (!parent || parent.nodeType == 9) ? parent : parent.ownerDocument;
	if (doc)
	{
		if (doc.evaluate)
		{
			var xPathResult = doc.evaluate(xPath, parent, this.createResolver(namespaces),
				XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

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
				var nsList = String(doc.getProperty("SelectionNamespaces") || "").split(" ");
				for (var prefix in namespaces)
				{
					var spec = SDL.Client.Types.String.format("xmlns:{0}=\"{1}\"", prefix, namespaces[prefix]);
					if (SDL.jQuery.inArray(spec, nsList) == -1)
					{
						nsList.push(spec);
					}
				}
				doc.setProperty("SelectionNamespaces", nsList.join(" "));
			}
			result = parent.selectNodes(xPath);
		}
	}
	return result;
};

SDL.Client.Xml.removeAll = function SDL$Client$Xml$removeAll(nodeList)
{
	if (typeof (nodeList.context) != "undefined")  // xml node list
	{
		nodeList.removeAll();
	}
	else
	{
		for (var i = 0, len = nodeList.length; i < len; i++)
		{
			var node = nodeList[i];
			switch (node.nodeType)
			{
				case 2: //node.ATTRIBUTE_NODE:
					this.getParentNode(node).removeAttributeNode(node);
					break;
				default:
					node.parentNode.removeChild(node);
					break;
			}
		}
	}
};

SDL.Client.Xml.setInnerText = function SDL$Client$Xml$setInnerText(node, value)
{
	if (node == null)
	{
		return null;
	}

	if (node.nodeType == 9)
	{
		node = node.documentElement;
	}

	if (node.textContent != undefined)
	{
		node.textContent = value;
	}
	else
	{
		node.text = value;
	}
};

SDL.Client.Xml.setInnerXml = function SDL$Client$Xml$setInnerXml(node, xml)
{
	if (node)
	{
		this.setInnerText(node, "");
		if (xml)
		{
			var doc = this.getNewXmlDocument("<r>" + xml + "</r>");

			var docElement = this.importNode(node.ownerDocument, doc.documentElement, true);
			var child = docElement.firstChild;
			while (child)
			{
				node.appendChild(child);
				child = docElement.firstChild;
			}
		}
	}
};

SDL.Client.Xml.importNode = function SDL$Client$Xml$importNode(document, node, deep)
{
	if (SDL.jQuery.browser.msie && this.progIDs().domDocument == "MSXML2.DOMDocument.3.0")	// msxml 3.0 does not support importNode() method
	{
		return node.cloneNode(deep);
	}
	else if (document && node)
	{
		return document.importNode(node, deep);
	}
};

SDL.Client.Xml.setOuterXml = function SDL$Client$Xml$setOuterXml(node, xml)
{
	if (node && node.nodeType == 1)
	{
		var parent = node.parentNode;
		if (xml)
		{
			var doc = this.getNewXmlDocument(xml);
			var newNode = this.importNode(node.ownerDocument, doc.documentElement, true);
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
SDL.Client.Xml.transformToXmlDocument = function SDL$Client$Xml$transformToXmlDocument(inputDoc, xslProcessor, parameters)
{
	SDL.Client.Diagnostics.Assert.isNode(inputDoc);
	SDL.Client.Diagnostics.Assert.isNotNullOrUndefined(xslProcessor);

	return this.xsltTransform(xslProcessor, inputDoc, parameters, true);
};

/**
* Transforms the supplied xml document and returns the result as a string.
* @param {XMLDocument} inputDoc The document to transform
* @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
* @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
* @returns {String} The result of the transformation.
*/
SDL.Client.Xml.transformToString = function SDL$Client$Xml$transformToString(inputDoc, xslProcessor, parameters)
{
	SDL.Client.Diagnostics.Assert.isNode(inputDoc);
	SDL.Client.Diagnostics.Assert.isNotNullOrUndefined(xslProcessor);

	return this.xsltTransform(xslProcessor, inputDoc, parameters, false);
};

/**
* Transforms the supplied xml document and returns the result as a new <c>XsltProcessor</c>
* @param {XMLDocument} inputDoc The document to transform
* @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
* @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
* @returns {XSLTProcessor} The result of the transformation.
*/
SDL.Client.Xml.transformToXslProcessor = function SDL$Client$Xml$transformToXslProcessor(inputDoc, xslProcessor, parameters, namespaceSelectors)
{
	SDL.Client.Diagnostics.Assert.isNode(inputDoc);
	SDL.Client.Diagnostics.Assert.isNotNullOrUndefined(xslProcessor);

	var nsDeclares = new Array;
	var nsExcludes = new Array;
	if (namespaceSelectors)
	{
		for (var prefix in namespaceSelectors)
		{
			nsExcludes.push(prefix);
			nsDeclares.push(SDL.Client.Types.String.format('xmlns:{0}="{1}"', prefix, namespaceSelectors[prefix]));
		}
	}

	var xslText = this.transformToString(inputDoc, xslProcessor, parameters);
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

	var xslDocument = this.getNewXmlDocument(xslText);
	var xslProcessor = this.getNewXsltProcessor(xslDocument);
	return xslProcessor;
};

SDL.Client.Xml.xsltTransform = function SDL$Client$Xml$xsltTransform(xsltProcessor, xml, parameters, toDocument)
{
	var output = null;

	try
	{
		if (xsltProcessor && xml)
		{
			if (typeof (parameters) == "object")
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
					output = this.getOuterXml(output);
				}
				xsltProcessor.clearParameters();
			}
			else
			{
				xsltProcessor.reset();
				xsltProcessor.input = xml;
				if (toDocument)
				{
					output = this.getNewXmlDocument();
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

SDL.Client.Xml.getAttributes = function SDL$Client$Xml$getAttributes(xmlNode)
{
	if (xmlNode)
	{
		return this.selectNodes(xmlNode, "@*");
	}
};

SDL.Client.Xml.toJson = function SDL$Client$Xml$toJson(xmlNode, attrPrefix)
{
	if (xmlNode)
	{
		var nodeType = xmlNode.nodeType;
		if (nodeType == 9)
		{
			xmlNode = xmlNode.documentElement;
			if (xmlNode)
			{
				nodeType = xmlNode.nodeType;
			}
			else
			{
				return;
			}
		}

		var result;

		if (nodeType == 2)	// attribute
		{
			result = xmlNode.value;
		}
		else if (nodeType == 1)	// element
		{
			if (attrPrefix == null)
			{
				attrPrefix = "@";
			}

			var attribs = this.getAttributes(xmlNode);
			var attrLen = attribs.length
			var childNode = this.getFirstElementChild(xmlNode);

			if (attrLen || childNode)
			{
				var propCount = 0;
				var arrayProp;
				var first = true;

				result = {};

				for (var i = 0; i < attrLen; i++)
				{
					propCount++;
					result[attrPrefix + this.getLocalName(attribs[i])] = this.toJson(attribs[i]);
				}

				while (childNode)
				{
					var propName = this.getLocalName(childNode);
					if (propName in result)
					{
						var existProp = result[propName];
						if (!SDL.Client.Type.isArray(existProp))
						{
							arrayProp = propName;
							existProp = result[propName] = [existProp];
						}
						existProp.push(this.toJson(childNode, attrPrefix));
					}
					else
					{
						propCount++;
						result[propName] = this.toJson(childNode, attrPrefix);
					}

					childNode = this.getNextElementSibling(childNode);
				}
				if (propCount == 1 && arrayProp)
				{
					result = result[arrayProp];
				}
			}
			else
			{
				result = this.getInnerText(xmlNode);
			}
		}
		return result;
	}
};

SDL.Client.Xml.getLocalName = function SDL$Client$Xml$getLocalName(node)
{
	if (node)
	{
				// standard   || IE XML DOM
		return node.localName || node.baseName;
	}
};

SDL.Client.Xml.getNextElementSibling = function SDL$Client$Xml$getNextElementSibling(node)
{
	if (node)
	{
		node = node.nextSibling;
		while (node && node.nodeType != 1)
		{
			node = node.nextSibling;
		}
	}
	return node;
};

SDL.Client.Xml.getFirstElementChild = function SDL$Client$Xml$getFirstElementChild(node)
{
	if (node)
	{
		node = node.firstChild;
		if (node && node.nodeType != 1)
		{
			node = this.getNextElementSibling(node);
		}
	}
	return node;
};