/*! @namespace {SDL.Client.Models.Base.FilteredNavigationObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.FilteredNavigationObject");

/*
	Base implementation of a FilteredNavigationObject used for navigation.
*/
SDL.Client.Models.Base.FilteredNavigationObject.$constructor = function SDL$Client$Models$Base$FilteredNavigationObject$constructor(id, parentId, filter)
{
	this.addInterface("SDL.Client.Models.IdentifiableObject", [id]);

	var p = this.properties;
	p.parentId = parentId;
	p.filterOptions = filter;
	p.filter = null;
};

/*
	Returns the ID of an {SDL.Client.Models.Base.ListProvider} object that created the current list using {SDL.Client.Models.Base.ListProvider:getList} method.
*/
SDL.Client.Models.Base.FilteredNavigationObject.prototype.getParentId = function SDL$Client$Models$Base$FilteredNavigationObject$getParentId()
{
	return this.properties.parentId;
};

/*
	Returns an {SDL.Client.Models.Base.ListProvider} object that created the current list using {SDL.Client.Models.Base.ListProvider:getList} method.
*/
SDL.Client.Models.Base.FilteredNavigationObject.prototype.getParent = function SDL$Client$Models$Base$FilteredNavigationObject$getParent()
{
	return SDL.Client.Models.getItem(this.getParentId());
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that is used for creating an {SDL.Client.Models.Base.ListFilter} object
*/
SDL.Client.Models.Base.FilteredNavigationObject.prototype.getListFilterType = function SDL$Client$Models$Base$FilteredNavigationObject$getListFilterType()
{
	return "SDL.Client.Models.Base.ListFilter";
};

/*
	Returns a javascript object that is used for creating an {SDL.Client.Models.Base.ListFilter} object
*/
SDL.Client.Models.Base.FilteredNavigationObject.prototype.getListFilterOptions = function SDL$Client$Models$Base$FilteredNavigationObject$getListFilterOptions()
{
	return this.properties.filterOptions;
};

/*
	Returns an {SDL.Client.Models.Base.ListFilter} object
*/
SDL.Client.Models.Base.FilteredNavigationObject.prototype.getListFilter = function SDL$Client$Models$Base$FilteredNavigationObject$getListFilter()
{
	var p = this.properties;
	if (!p.filter)
	{
		var filterType = SDL.Client.Type.resolveNamespace(this.getListFilterType());
		p.filter = new filterType(p.filterOptions);
	}
	return p.filter;
};

/*
	Returns true if the current list object can be used for the specified filter (see {SDL.Client.Models.Base.ListProvider:getList}).
*/
SDL.Client.Models.Base.FilteredNavigationObject.prototype.isFilterApplied = function SDL$Client$Models$Base$FilteredNavigationObject$isFilterApplied(filter)
{
	return this.getListFilter().equals(filter);
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.FilteredNavigationObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$FilteredNavigationObject$pack()
{
	var p = this.properties;
	return {
		parentId: p.parentId,
		filter: p.filter
	};
});

SDL.Client.Models.Base.FilteredNavigationObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$FilteredNavigationObject$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.parentId = data.parentId;
		if (data.filter)
		{
			p.filter = SDL.Client.Types.OO.importObject(data.filter);
		}
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides
