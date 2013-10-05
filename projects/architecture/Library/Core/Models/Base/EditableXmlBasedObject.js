/*! @namespace {SDL.Client.Models.Base.EditableXmlBasedObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.EditableXmlBasedObject");

/*
	Adds an ability for an {SDL.Client.XmlBasedObject} to modify its xml data.
*/
SDL.Client.Models.Base.EditableXmlBasedObject.$constructor = function SDL$Client$Models$Base$EditableXmlBasedObject$constructor(id, parentId, filter)
{
	this.addInterface("SDL.Client.Models.Base.XmlBasedObject");

	var p = this.properties;
	p.changeXml;
	p.changeXmlDocument;
};

/*
	Sets a changed xml string to the object.
*/
SDL.Client.Models.Base.EditableXmlBasedObject.prototype.setChangeXml = function SDL$Client$Models$Base$EditableXmlBasedObject$setChangeXml(value)
{
	 var p = this.properties;
	 p.changeXml = value;
	 p.changeXmlDocument = undefined;
};

/*
	Gets a changed xml string from the object.
*/
SDL.Client.Models.Base.EditableXmlBasedObject.prototype.getChangeXml = function SDL$Client$Models$Base$EditableXmlBasedObject$getChangeXml()
{
	var p = this.properties;
	if (p.changeXml === undefined && p.changeXmlDocument)
	{
		p.changeXml = SDL.Client.Xml.getOuterXml(p.changeXmlDocument) || null;
	}
	return p.changeXml;
};

/*
	Gets a changed xml from the object as an xml document.
*/
SDL.Client.Models.Base.EditableXmlBasedObject.prototype.getChangeXmlDocument = function SDL$Client$Models$Base$EditableXmlBasedObject$getChangeXmlDocument()
{
	var p = this.properties;
	if (!p.changeXmlDocument)
	{
		var xml = this.getChangeXml();
		if (xml)
		{
			p.changeXmlDocument = SDL.Client.Xml.getNewXmlDocument(xml);
		}
	}
	return this.properties.changeXmlDocument;
};

SDL.Client.Models.Base.EditableXmlBasedObject.prototype._createChangeXml = function SDL$Client$Models$Base$EditableXmlBasedObject$_createChangeXml()
{
	var p = this.properties;
	if (!this.getChangeXml() && this.isLoaded())
	{
		var xmlDoc = SDL.Client.Xml.getNewXmlDocument(this.getXml());
		SDL.Client.Xml.setInnerText(xmlDoc.documentElement, "");
		p.changeXml = SDL.Client.Xml.getOuterXml(xmlDoc);
	}
	return p.changeXml;
};

SDL.Client.Models.Base.EditableXmlBasedObject.prototype._ensureXmlElement = function SDL$Client$Models$Base$EditableXmlBasedObject$_ensureXmlElement(xpath, parent)
{
	this._createChangeXml();
	var xmlDoc = this.getChangeXmlDocument();
	if (xmlDoc)
	{
		if (!parent)
		{
			parent = xmlDoc.documentElement;
		}

		var node;
		if (!xpath)
		{
			node = parent;
		}
		else
		{
			node = SDL.Client.Xml.selectSingleNode(parent, xpath)
			if (!node)
			{
				var m = xpath.match(/^(.*)\/([^\/]+)$/);
				if (m)
				{
					var parentXpath = m[1];
					if (parentXpath)
					{
						parent = this._ensureXmlElement(parentXpath, parent);
						xpath = m[2];
					}
				}
				m = xpath.match(/^(([^\:]+)\:)?([^\:]+)$/);
				if (m)
				{
					var prefix = m[2];
					var name = m[3];
					var ns = prefix ? SDL.Client.Xml.Namespaces[prefix] :"";

					node = SDL.Client.Xml.createElementNS(xmlDoc, ns, name);
					parent.appendChild(node);
					this.properties.changeXml = undefined;
				}
			}
		}
		return node;
	}
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.EditableXmlBasedObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$EditableXmlBasedObject$pack()
{
	var p = this.properties;
	return {
		changeXml: this.getChangeXml()
	};
});

SDL.Client.Models.Base.EditableXmlBasedObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$EditableXmlBasedObject$unpack(data)
{
	var p = this.properties;
	if (data)
	{
		p.changeXml = data.changeXml;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides