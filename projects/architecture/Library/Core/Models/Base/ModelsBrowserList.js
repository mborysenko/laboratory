/*! @namespace {SDL.Client.Models.Base.ModelsBrowserList} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ModelsBrowserList");

/*
	Implements navigating through all registered navigatable domain models (models that expose a getSystemRoot() object).
	getItems() method returns the list of root folders, one root for each system.
*/
SDL.Client.Models.Base.ModelsBrowserList.$constructor = function SDL$Client$Models$Base$ModelsBrowserList$constructor(id, parentId)
{
	this.addInterface("SDL.Client.Models.Base.List", [id, parentId]);
	var p = this.properties;
	p.parentId = parentId;
	p.items;
};

SDL.Client.Models.Base.ModelsBrowserList.prototype.isLoaded = function SDL$Client$Models$Base$ModelsBrowserList$isLoaded()
{
	return true;
};

SDL.Client.Models.Base.ModelsBrowserList.prototype.isFilterApplied = function SDL$Client$Models$Base$ModelsBrowserList$isFilterApplied(filter)
{
	return true;
};

SDL.Client.Models.Base.ModelsBrowserList.prototype.getItems = function SDL$Client$Models$Base$ModelsBrowserList$getItems()
{
	var p = this.properties;
	if (!p.items)
	{
		var parentId = p.parentId;
		p.items = [];
		var factories = SDL.Client.Models.getModelFactories();
		for (var i = 0, len = factories.length; i < len; i++)
		{
			var factory = factories[i];
			if (SDL.Client.Type.isFunction(factory.getSystemRootId))
			{
				var id = factory.getSystemRootId();
				if (id && id != parentId)
				{
					p.items.push({id: id, title: factory.getSystemRootTitle()});
				}
			}
		}
	}
	return p.items;
};