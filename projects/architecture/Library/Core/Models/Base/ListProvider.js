/*! @namespace {SDL.Client.Models.Base.ListProvider} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ListProvider");

/*
	Base implementation of an object used for navigation
*/
SDL.Client.Models.Base.ListProvider.$constructor = function SDL$Client$Models$Base$ListProvider$constructor(id)
{
	this.addInterface("SDL.Client.Models.ModelObject", [id]);
	var p = this.properties;
	p.lists = [];
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that is used for creating an {SDL.Client.Models.Base.List} object
	returned by {SDL.Client.Models.Base.ListProvider:getList}.
*/
SDL.Client.Models.Base.ListProvider.prototype.getListType = function SDL$Client$Models$Base$ListProvider$getListType(filter)
{
	return "SDL.Client.Models.Base.List";
};

SDL.Client.Models.Base.ListProvider.prototype.getList = function SDL$Client$Models$Base$ListProvider$getList(filter)
{
	filter = SDL.Client.Types.Object.clone(filter);

	var p = this.properties;

	for (var i = 0, len = p.lists.length; i < len; i++)
	{
		var list = SDL.Client.Models.getFromRepository(p.lists[i]);
		if (list.isFilterApplied(filter))
		{
			return list;
		}
	}

	var listType = this.getListType(filter);
	var id = this.getId();
	var model = this.getModelFactory();
	var listId = model.getModelSpecificUri(id + "-" + SDL.Client.Models.getUniqueId(), model.getListType());
	p.lists.push(listId);
	return SDL.Client.Models.createInRepository(listId, listType, listId, id, filter);
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.ListProvider.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ListProvider$pack()
{
	var p = this.properties;
	return {
		lists: p.lists
	};
});

SDL.Client.Models.Base.ListProvider.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ListProvider$unpack(data)
{
	if (data && data.lists)
	{
		var p = this.properties;
		p.lists = SDL.Client.Types.Array.clone(data.lists);
	}
});

// ------- end of SDL.Client.Models.MarshallableObject overrides
