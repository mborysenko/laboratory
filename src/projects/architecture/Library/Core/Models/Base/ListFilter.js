/*! @namespace {SDL.Client.Models.Base.ListFilter} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ListFilter");

/*
	Base implementation of a filter object passed as a parameter to {SDL.Client.Models.Base.ListProvider}::getList() method.
	ListFilter defines the types of items to be returned/shown in a specific list.
*/
SDL.Client.Models.Base.ListFilter.$constructor = function SDL$Client$Models$Base$ListFilter$constructor(properties)
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	if (properties)
	{
		var p = this.properties;

		p.forTree = properties.forTree;
		if (properties.itemTypes)
		{
			p.itemTypes = SDL.Client.Types.Array.normalize(SDL.Client.Types.Array.clone(properties.itemTypes));
		}
		p.relatedItem = properties.relatedItem;
		p.searchText = properties.searchText;
	}
};

SDL.Client.Models.Base.ListFilter.prototype.setForTree = function SDL$Client$Models$Base$ListFilter$setForTree(value)
{
	this.properties.forTree = value;
};

SDL.Client.Models.Base.ListFilter.prototype.getForTree = function SDL$Client$Models$Base$ListFilter$getForTree()
{
	return this.properties.forTree || false;
};

SDL.Client.Models.Base.ListFilter.prototype.setItemTypes = function SDL$Client$Models$Base$ListFilter$setItemTypes(value)
{
	this.properties.itemTypes = value ? SDL.Client.Types.Array.normalize(SDL.Client.Types.Array.clone(value)) : undefined;
};

SDL.Client.Models.Base.ListFilter.prototype.getItemTypes = function SDL$Client$Models$Base$ListFilter$getItemTypes()
{
	return this.properties.itemTypes || null;
};

SDL.Client.Models.Base.ListFilter.prototype.setRelatedItem = function SDL$Client$Models$Base$ListFilter$setRelatedItem(value)
{
	this.properties.relatedItem = value;
};

SDL.Client.Models.Base.ListFilter.prototype.getRelatedItem = function SDL$Client$Models$Base$ListFilter$getRelatedItem()
{
	return this.properties.relatedItem || null;
};

SDL.Client.Models.Base.ListFilter.prototype.setSearchText = function SDL$Client$Models$Base$ListFilter$setSearchText(value)
{
	this.properties.searchText = value;
};

SDL.Client.Models.Base.ListFilter.prototype.getSearchText = function SDL$Client$Models$Base$ListFilter$getSearchText()
{
	return this.properties.searchText || null;
};

SDL.Client.Models.Base.ListFilter.prototype.equals = function SDL$Client$Models$Base$ListFilter$equals(filter)
{
	if (filter)
	{
		if (SDL.Client.Types.OO.implementsInterface(filter, "SDL.Client.Models.Base.ListFilter"))
		{
			return (this == filter) ||
				(
					this.getForTree() == filter.getForTree() &&
					this.getRelatedItem() == filter.getRelatedItem() &&
					this.getSearchText() == filter.getSearchText() &&
					SDL.Client.Types.Array.areEqual(this.getItemTypes(), filter.getItemTypes())
				);
		}
		else
		{
			return (this.getForTree() == (filter.forTree || false) &&
				this.getRelatedItem() == (filter.relatedItem || null) &&
				this.getSearchText() == (filter.searchText || null) &&
				SDL.Client.Types.Array.areEqual(this.getItemTypes(), filter.itemTypes || null));
		}
	}
	else
	{
		return !this.getForTree() && !this.getRelatedItem() && !this.getItemTypes();
	}
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.ListFilter.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ListFilter$pack()
{
	var p = this.properties;
	return {
		forTree: p.forTree,
		itemTypes: p.itemTypes,
		relatedItem: p.relatedItem,
		searchText: p.searchText
	};
});

SDL.Client.Models.Base.ListFilter.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ListFilter$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.forTree = data.forTree;
		if (data.itemTypes)
		{
			p.itemTypes = SDL.Client.Types.Array.clone(data.itemTypes);
		}
		p.relatedItem = data.relatedItem;
		p.searchText = data.searchText;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides