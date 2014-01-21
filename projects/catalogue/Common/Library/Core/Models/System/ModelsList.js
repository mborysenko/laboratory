SDL.Client.Types.OO.createInterface("SDL.Client.Models.System.ModelsList");

/*
	Implements navigating through all registered navigatable domain models (models that expose a getSystemRoot() object).
	getItems() method returns the list of root folders, one root for each system.
*/
SDL.Client.Models.System.ModelsList.$constructor = function SDL$Client$Models$System$ModelsList$constructor(id, parentId)
{
	this.addInterface("SDL.Client.Models.Base.List", [id, parentId]);
	var p = this.properties;
	p.parentId = parentId;
	p.items;
};

SDL.Client.Models.System.ModelsList.prototype.isLoaded = function SDL$Client$Models$System$ModelsList$isLoaded()
{
	return true;
};

SDL.Client.Models.System.ModelsList.prototype.isFilterApplied = function SDL$Client$Models$System$ModelsList$isFilterApplied(filter)
{
	return true;
};

SDL.Client.Models.System.ModelsList.prototype.getItems = function SDL$Client$Models$System$ModelsList$getItems()
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