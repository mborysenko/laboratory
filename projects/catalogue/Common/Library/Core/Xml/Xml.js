var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
        /// <reference path="../Types/Types.d.ts" />
        /// <reference path="../Types/String.d.ts" />
        /// <reference path="../Diagnostics/Assert.d.ts" />
        /// <reference path="Xml.Base.ts" />
        (function (Xml) {
            function containsNode(parent, child) {
                if (parent) {
                    if (parent.nodeType == 2) {
                        return child == parent;
                    } else if (child && child.nodeType == 2) {
                        child = Xml.selectSingleNode(child, "..");
                    }

                    while (child && child != parent) {
                        child = child.parentNode;
                    }
                    return child == parent;
                }
                return false;
            }
            Xml.containsNode = containsNode;
            ;

            function createElementNS(xmlDoc, ns, name) {
                Client.Diagnostics.Assert.isDocument(xmlDoc);
                Client.Diagnostics.Assert.isString(ns);
                Client.Diagnostics.Assert.isString(name);

                if (xmlDoc.createElementNS) {
                    return xmlDoc.createElementNS(ns, name);
                } else {
                    return xmlDoc.createNode(1, name, ns);
                }
            }
            Xml.createElementNS = createElementNS;
            ;

            function escape(value, attribute) {
                if (typeof attribute === "undefined") { attribute = false; }
                if (value != null) {
                    value = value.toString();
                    value = value.replace(/&/g, "&amp;");
                    value = value.replace(/</g, "&lt;");
                    value = value.replace(/>/g, "&gt;");
                    if (attribute) {
                        value = value.replace(/\'/g, "&apos;");
                        value = value.replace(/\"/g, "&quot;");
                    }
                }
                return value;
            }
            Xml.escape = escape;
            ;

            function getInnerXml(node, xpath, namespaces) {
                if (node) {
                    var selection = xpath ? Xml.selectSingleNode(node, xpath, namespaces) : node;
                    if (selection) {
                        var stringBuilder = [];
                        var childNode = selection.firstChild;
                        while (childNode) {
                            stringBuilder.push(getOuterXml(childNode));
                            childNode = childNode.nextSibling;
                        }
                        return stringBuilder.join("");
                    }
                }
            }
            Xml.getInnerXml = getInnerXml;
            ;

            function getNewXsltProcessor(xslt) {
                Client.Diagnostics.Assert.isNotNullOrUndefined(xslt);

                var stylesheetXml = Client.Type.isString(xslt) ? Xml.getNewXmlDocument(xslt) : xslt;

                if (window.XSLTProcessor) {
                    var processor = new window.XSLTProcessor();
                    if (SDL.jQuery.browser.mozilla) {
                        var htmlMethodAttribute = Xml.selectSingleNode(stylesheetXml, "/xsl:stylesheet/xsl:output/@method[.='html']");
                        if (htmlMethodAttribute) {
                            htmlMethodAttribute.value = "xml";
                        }
                    }

                    try  {
                        processor.importStylesheet(stylesheetXml);
                    } catch (e) {
                        Client.Diagnostics.Assert.raiseError(e.message);
                        throw e;
                    }
                    return processor;
                } else {
                    var progIDs = Xml.progIDs();
                    if (progIDs.xslTemplate) {
                        var xslt = new ActiveXObject(progIDs.xslTemplate);
                        var freeTheadedXml = Xml.getNewXmlDocument(stylesheetXml.xml, true, true);

                        xslt.stylesheet = freeTheadedXml;
                        return xslt.createProcessor();
                    } else {
                        throw Error("Unable to create xsltProcessor");
                    }
                }
            }
            Xml.getNewXsltProcessor = getNewXsltProcessor;
            ;

            function getParentNode(child) {
                return child.nodeType == 2 ? Xml.selectSingleNode(child, "..") : child.parentNode;
            }
            Xml.getParentNode = getParentNode;
            ;

            function getOuterXml(node, xpath) {
                if (node) {
                    var selection = xpath ? Xml.selectSingleNode(node, xpath) : node;
                    if (selection) {
                        if (Client.Type.isString(selection.xml)) {
                            return selection.xml;
                        } else {
                            return (new window.XMLSerializer()).serializeToString(selection);
                        }
                    }
                }
            }
            Xml.getOuterXml = getOuterXml;
            ;

            function selectStringValue(parent, xPath, namespaces) {
                var doc = (!parent || parent.nodeType == 9) ? parent : parent.ownerDocument;
                if (doc) {
                    if (doc.evaluate) {
                        var xPathResult = doc.evaluate(xPath, parent, Xml.createResolver(namespaces), window.XPathResult.STRING_TYPE, null);

                        return xPathResult ? xPathResult.stringValue : null;
                    } else {
                        if (namespaces) {
                            var nsList = String(doc.getProperty("SelectionNamespaces") || "").split(" ");
                            for (var prefix in namespaces) {
                                var spec = Client.Types.String.format("xmlns:{0}=\"{1}\"", prefix, namespaces[prefix]);
                                if (SDL.jQuery.inArray(spec, nsList) == -1) {
                                    nsList.push(spec);
                                }
                            }
                            doc.setProperty("SelectionNamespaces", nsList.join(" "));
                        }
                        var result = parent.selectSingleNode(xPath);
                        return result ? result.nodeValue : null;
                    }
                }
            }
            Xml.selectStringValue = selectStringValue;
            ;

            function removeAll(nodeList) {
                if (typeof (nodeList.context) != "undefined") {
                    nodeList.removeAll();
                } else {
                    for (var i = 0, len = nodeList.length; i < len; i++) {
                        var node = nodeList[i];
                        switch (node.nodeType) {
                            case 2:
                                getParentNode(node).removeAttributeNode(node);
                                break;
                            default:
                                node.parentNode.removeChild(node);
                                break;
                        }
                    }
                }
            }
            Xml.removeAll = removeAll;
            ;

            function setInnerText(node, value) {
                if (node == null) {
                    return null;
                }

                if (node.nodeType == 9) {
                    node = node.documentElement;
                }

                if (node.textContent != undefined) {
                    node.textContent = value;
                } else {
                    node.text = value;
                }
            }
            Xml.setInnerText = setInnerText;
            ;

            function setInnerXml(node, xml) {
                if (node) {
                    setInnerText(node, "");
                    if (xml) {
                        var doc = Xml.getNewXmlDocument("<r>" + xml + "</r>");

                        var docElement = importNode(node.ownerDocument, doc.documentElement, true);
                        var child = docElement.firstChild;
                        while (child) {
                            node.appendChild(child);
                            child = docElement.firstChild;
                        }
                    }
                }
            }
            Xml.setInnerXml = setInnerXml;
            ;

            function importNode(document, node, deep) {
                if (SDL.jQuery.browser.msie && Xml.progIDs().domDocument == "MSXML2.DOMDocument.3.0") {
                    return node.cloneNode(deep);
                } else if (document && node) {
                    return document.importNode(node, deep);
                }
            }
            Xml.importNode = importNode;
            ;

            function setOuterXml(node, xml) {
                if (node && node.nodeType == 1) {
                    var parent = node.parentNode;
                    if (xml) {
                        var doc = Xml.getNewXmlDocument(xml);
                        var newNode = importNode(node.ownerDocument, doc.documentElement, true);
                        parent.replaceChild(newNode, node);
                        return newNode;
                    } else {
                        // xml is null - remove node
                        parent.removeChild(node);
                    }
                }
                return null;
            }
            Xml.setOuterXml = setOuterXml;
            ;

            /**
            * Transforms the supplied xml document and returns the result as a new <c>XMLDocument</c>
            * @param {XMLDocument} inputDoc The document to transform.
            * @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
            * @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
            * @returns {XMLDocument} The result of the transformation.
            */
            function transformToXmlDocument(inputDoc, xslProcessor, parameters) {
                Client.Diagnostics.Assert.isNode(inputDoc);
                Client.Diagnostics.Assert.isNotNullOrUndefined(xslProcessor);

                return xsltTransform(xslProcessor, inputDoc, parameters, true);
            }
            Xml.transformToXmlDocument = transformToXmlDocument;
            ;

            /**
            * Transforms the supplied xml document and returns the result as a string.
            * @param {XMLDocument} inputDoc The document to transform
            * @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
            * @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
            * @returns {String} The result of the transformation.
            */
            function transformToString(inputDoc, xslProcessor, parameters) {
                Client.Diagnostics.Assert.isNode(inputDoc);
                Client.Diagnostics.Assert.isNotNullOrUndefined(xslProcessor);

                return xsltTransform(xslProcessor, inputDoc, parameters, false);
            }
            Xml.transformToString = transformToString;
            ;

            /**
            * Transforms the supplied xml document and returns the result as a new <c>XsltProcessor</c>
            * @param {XMLDocument} inputDoc The document to transform
            * @param {XSLTProcessor} xslProcessor The stylesheet to transform with.
            * @param {Object} parameters The name/value hash of arguments to supply to the processor prior to transforming.
            * @returns {XSLTProcessor} The result of the transformation.
            */
            function transformToXslProcessor(inputDoc, xslProcessor, parameters, namespaces) {
                Client.Diagnostics.Assert.isNode(inputDoc);
                Client.Diagnostics.Assert.isNotNullOrUndefined(xslProcessor);

                var nsDeclares = [];
                var nsExcludes = [];
                if (namespaces) {
                    for (var prefix in namespaces) {
                        nsExcludes.push(prefix);
                        nsDeclares.push(Client.Types.String.format('xmlns:{0}="{1}"', prefix, namespaces[prefix]));
                    }
                }

                var xslText = transformToString(inputDoc, xslProcessor, parameters);
                if (xslText.match(/xmlns:xsl/)) {
                    xslText = xslText.replace(/xmlns:out="[^\"]+"/g, "");
                }

                xslText = xslText.replace(/XSL\/Transform\/Generated/, "XSL/Transform");
                xslText = xslText.replace(/<out:/g, "<xsl:");
                xslText = xslText.replace(/<\/out:/g, "</xsl:");
                xslText = xslText.replace(/xmlns:out/g, "xmlns:xsl");

                xslText = xslText.replace(/[\s\S]*(<xsl:stylesheet .*?)>/, "$1 " + nsDeclares.join(" ") + ' exclude-result-prefixes="' + nsExcludes.join(" ") + '">');

                var xslDocument = Xml.getNewXmlDocument(xslText);
                var xslProcessor = getNewXsltProcessor(xslDocument);
                return xslProcessor;
            }
            Xml.transformToXslProcessor = transformToXslProcessor;
            ;

            function xsltTransform(xsltProcessor, xml, parameters, toDocument) {
                var output = null;

                try  {
                    if (xsltProcessor && xml) {
                        if (typeof (parameters) == "object") {
                            for (var key in parameters) {
                                if (parameters[key] == null) {
                                    continue;
                                }
                                if (xsltProcessor.setParameter) {
                                    xsltProcessor.setParameter(null, key, parameters[key]);
                                } else {
                                    xsltProcessor.addParameter(key, parameters[key]);
                                }
                            }
                        }

                        if (xsltProcessor.transformToDocument) {
                            output = xsltProcessor.transformToDocument(xml);
                            if (!toDocument) {
                                output = getOuterXml(output);
                            }
                            xsltProcessor.clearParameters();
                        } else {
                            xsltProcessor.reset();
                            xsltProcessor.input = xml;
                            if (toDocument) {
                                output = Xml.getNewXmlDocument();
                                xsltProcessor.output = output;
                                xsltProcessor.transform();
                            } else {
                                xsltProcessor.transform();
                                output = xsltProcessor.output;
                            }
                            xsltProcessor.output = null;
                        }
                    }
                } catch (e) {
                    SDL.Client.Diagnostics.Assert.raiseError(e.message);
                    throw e;
                }
                return output;
            }
            Xml.xsltTransform = xsltTransform;
            ;

            function getAttributes(xmlNode) {
                if (xmlNode) {
                    return Xml.selectNodes(xmlNode, "@*");
                }
            }
            Xml.getAttributes = getAttributes;
            ;

            function toJson(xmlNode, attrPrefix) {
                if (xmlNode) {
                    var nodeType = xmlNode.nodeType;
                    if (nodeType == 9) {
                        xmlNode = xmlNode.documentElement;
                        if (xmlNode) {
                            nodeType = xmlNode.nodeType;
                        } else {
                            return;
                        }
                    }

                    var result;

                    if (nodeType == 2) {
                        result = xmlNode.value;
                    } else if (nodeType == 1) {
                        if (attrPrefix == null) {
                            attrPrefix = "@";
                        }

                        var attribs = getAttributes(xmlNode);
                        var attrLen = attribs.length;
                        var childNode = getFirstElementChild(xmlNode);

                        if (attrLen || childNode) {
                            var propCount = 0;
                            var arrayProp;
                            var first = true;

                            result = {};

                            for (var i = 0; i < attrLen; i++) {
                                propCount++;
                                result[attrPrefix + getLocalName(attribs[i])] = toJson(attribs[i]);
                            }

                            while (childNode) {
                                var propName = getLocalName(childNode);
                                if (propName in result) {
                                    var existProp = result[propName];
                                    if (!SDL.Client.Type.isArray(existProp)) {
                                        arrayProp = propName;
                                        existProp = result[propName] = [existProp];
                                    }
                                    existProp.push(toJson(childNode, attrPrefix));
                                } else {
                                    propCount++;
                                    result[propName] = toJson(childNode, attrPrefix);
                                }

                                childNode = getNextElementSibling(childNode);
                            }
                            if (propCount == 1 && arrayProp) {
                                result = result[arrayProp];
                            }
                        } else {
                            result = Xml.getInnerText(xmlNode);
                        }
                    }
                    return result;
                }
            }
            Xml.toJson = toJson;
            ;

            function getLocalName(node) {
                if (node) {
                    // standard   || IE XML DOM
                    return node.localName || node.baseName;
                }
            }
            Xml.getLocalName = getLocalName;
            ;

            function getNextElementSibling(node) {
                if (node) {
                    node = node.nextSibling;
                    while (node && node.nodeType != 1) {
                        node = node.nextSibling;
                    }
                }
                return node;
            }
            Xml.getNextElementSibling = getNextElementSibling;
            ;

            function getFirstElementChild(node) {
                if (node) {
                    node = node.firstChild;
                    if (node && node.nodeType != 1) {
                        node = getNextElementSibling(node);
                    }
                }
                return node;
            }
            Xml.getFirstElementChild = getFirstElementChild;
            ;
        })(Client.Xml || (Client.Xml = {}));
        var Xml = Client.Xml;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=Xml.js.map
