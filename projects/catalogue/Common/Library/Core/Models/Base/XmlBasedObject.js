/*! @namespace {SDL.Client.Models.Base.XmlBasedObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.XmlBasedObject");

/*
	Adds methods for managing object's xml data.
*/
SDL.Client.Models.Base.XmlBasedObject.$constructor = function SDL$Client$Models$Base$XmlBasedObject$constructor()
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	var p = this.properties;
	p.xml;
	p.xmlDocument;
};

/*
	Assigns an xml string to the object.
*/
SDL.Client.Models.Base.XmlBasedObject.prototype.setXml = function SDL$Client$Models$Base$XmlBasedObject$setXml(value)
{
	 var p = this.properties;
	 p.xml = value;
	 p.xmlDocument = undefined;
};

/*
	Gets an xml string assigned to the object.
*/
SDL.Client.Models.Base.XmlBasedObject.prototype.getXml = function SDL$Client$Models$Base$XmlBasedObject$getXml()
{
	var p = this.properties;
	if (p.xml === undefined && p.xmlDocument)
	{
		p.xml = SDL.Client.Xml.getOuterXml(p.xmlDocument) || null;
	}
	return p.xml;
};

/*
	Gets xml assigned to the object as an xml document.
*/
SDL.Client.Models.Base.XmlBasedObject.prototype.getXmlDocument = function SDL$Client$Models$Base$XmlBasedObject$getXmlDocument()
{
	var p = this.properties;
	if (!p.xmlDocument)
	{
		var xml = this.getXml();
		if (xml)
		{
			p.xmlDocument = SDL.Client.Xml.getNewXmlDocument(xml);
		}
	}
	return p.xmlDocument;
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.XmlBasedObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$XmlBasedObject$pack()
{
	var p = this.properties;
	return {
		xml: p.xml
	};
});

SDL.Client.Models.Base.XmlBasedObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$XmlBasedObject$unpack(data)
{
	var p = this.properties;
	if (data)
	{
		p.xml = data.xml;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides