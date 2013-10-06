/*! @namespace {SDL.Client.Models.Base.ModelFactory} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ModelFactory");

/*
	Implements a model factory that can be used as a base for other model factories.
*/
SDL.Client.Models.Base.ModelFactory.$constructor = function SDL$Client$Models$Base$ModelFactory$constructor()
{
	this.addInterface("SDL.Client.Models.ModelFactory");

	var p = this.properties;
	p.idMatchRegExp;

	p.settings = {
		// prefix used by the current instance of domain model factory
		prefix: undefined
	};
};

/*
	Returns a string used as a prefix for item ID's managed by the current model factory.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getPrefix = function SDL$Client$Models$Base$ModelFactory$getPrefix()
{
	return this.properties.settings.prefix;
};

SDL.Client.Models.Base.ModelFactory.prototype.getItemType = function SDL$Client$Models$Base$ModelFactory$getItemType(item)
{
	if (item)
	{
		if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
		{
			item = item.getId();
		}

		if (SDL.Client.Type.isString(item))
		{
			var m = item.match(this.getIdMatchRegExp());
			if (m)
			{
				return m[1] + m[2];
			}
			else
			{
				return item;
			}
		}
	}
};

/*
	Returns the ID of the global root folder {SDL.Client.Models.Base.ModelsBrowser}.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getSystemRootId = function SDL$Client$Models$Base$ModelFactory$getSystemRootId()
{
	return null;
};

/*
	Returns the title of the root folder of the system represented by the current model factory.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getSystemRootTitle = function SDL$Client$Models$Base$ModelFactory$getSystemRootTitle()
{
	return null;
};

/*
	Returns the root folder {SDL.Client.Models.Base.ListProvider} of the system represented by the current model factory.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getSystemRoot = function SDL$Client$Models$Base$ModelFactory$getSystemRoot()
{
	var id = this.getSystemRootId();
	if (id)
	{
		return this.getItem(id);
	}
};

/*
	Returns true if the provided id is for the specific domain model factory.
	Example:
		SDL.Client.Models.URL.Model.isModelSpecificUri("url:document//schemas/schema.xsd");
				// true, ID is using the domain model prefix
		CMIS.Model.isModelSpecificUri("url:document//schemas/schema.xsd");
				// false, domain model prefix does not match the ID prefix
		SDL.Client.Models.URL.Model.isModelSpecificUri("/schemas/schema.xsd");
				// false, ID is not using the domain model prefix
*/
SDL.Client.Models.Base.ModelFactory.prototype.isModelSpecificUri = function SDL$Client$Models$Base$ModelFactory$isModelSpecificUri(id)
{
	return this.getIdMatchRegExp().test(id);
},

/*
	Returns a model specific ID for the id and the item type specified.
	Example:
		SDL.Client.Models.URL.Model.getModelSpecificUri("/schemas/schema.xsd", {SDL.Client.Models.ItemType}.BASE_URL_DOCUMENT);
				// returns "url:document//schemas/schema.xsd"
*/
SDL.Client.Models.Base.ModelFactory.prototype.getModelSpecificUri = function SDL$Client$Models$Base$ModelFactory$getModelSpecificUri(id, type)
{
	return type + "/" + this.getOriginalId(id);
};

/*
	Returns the original id. Reverse of {SDL.Client.Models.Base.ModelFactory:getModelSpecificUri}.
	Example:
		SDL.Client.Models.URL.Model.getOriginalId("url:document//schemas/schema.xsd");
				// returns "/schemas/schema.xsd"
*/
SDL.Client.Models.Base.ModelFactory.prototype.getOriginalId = function SDL$Client$Models$Base$ModelFactory$getOriginalId(modelSpecificId)
{
	return modelSpecificId.replace(this.getIdMatchRegExp(), "");
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that corresponds to the folder type.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getFolderType = function SDL$Client$Models$Base$ModelFactory$getFolderType()
{
	return this.properties.settings.prefix + "folder";
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that corresponds to the document type for documents.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getDocumentType = function SDL$Client$Models$Base$ModelFactory$getDocumentType()
{
	return  this.properties.settings.prefix + "document";
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that corresponds to the list type.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getListType = function SDL$Client$Models$Base$ModelFactory$getListType()
{
	return  this.properties.settings.prefix + "list";
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that corresponds to the list type.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getTreeType = function SDL$Client$Models$Base$ModelFactory$getTreeType()
{
	return  this.properties.settings.prefix + "tree";
};

/*
	Returns a regular expression that matches ID's of items managed by the current domain model factory.
*/
SDL.Client.Models.Base.ModelFactory.prototype.getIdMatchRegExp = function SDL$Client$Models$Base$ModelFactory$getIdMatchRegExp()
{
	var p = this.properties;
	if (p.idMatchRegExp === undefined)
	{
		p.idMatchRegExp = new RegExp("^(" + SDL.Client.Types.RegExp.escape(p.settings.prefix) + ")([^\\/]+)(\\/?|$)");
	}
	return p.idMatchRegExp;
};

/*
	Returns settings for the current Model Factory.The settings object defines the properties that can be overridden in child classes
*/
SDL.Client.Models.Base.ModelFactory.prototype.getSettings = function SDL$Client$Models$Base$ModelFactory$getSettings()
{
	return this.properties.settings;
};