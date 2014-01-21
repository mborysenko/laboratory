/*! @namespace {SDL.Client.Models.Base.List} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.List");

/*
	Base implementation of a List object used for navigating.
*/
SDL.Client.Models.Base.List.$constructor = function SDL$Client$Models$Base$List$constructor(id, parentId, filter)
{
	this.addInterface("SDL.Client.Models.Base.FilteredNavigationObject", [id, parentId, filter]);
	this.addInterface("SDL.Client.Models.UpdatableListObject", [id]);

	var p = this.properties;
	p.items;
};

SDL.Client.Models.Base.List.prototype.invalidateInterfaceCachedState = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$List$invalidateInterfaceCachedState()
{
	this.properties.items = undefined;
});

SDL.Client.Models.Base.List.prototype.isLoaded = function SDL$Client$Models$Base$List$isLoaded(checkCacheValidity)
{
	return !!this.getItems(checkCacheValidity);
};

SDL.Client.Models.Base.List.prototype.getItems = function SDL$Client$Models$Base$List$getItems(onlyValidCache)
{
	return (!onlyValidCache || this.isCacheValid()) && this.properties.items;
};

SDL.Client.Models.Base.List.prototype.getItem = function SDL$Client$Models$Base$List$getItem(id)
{
	// to be overridden
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.List.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$List$pack()
{
	var p = this.properties;
	return {
		items: p.items
	};
});

SDL.Client.Models.Base.List.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$List$unpack(data)
{
	if (data && data.items)
	{
		var items = this.properties.items = [];
		for (var i = 0, len = data.items.length; i < len; i++)
		{
			items.push(SDL.Client.Types.Object.clone(data.items[i]));
		}
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides
