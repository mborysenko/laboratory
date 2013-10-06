/*! @namespace {SDL.Client.Models.Base.TreeProvider} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.TreeProvider");

/*
	Base implementation of an object used for tree navigation
*/
SDL.Client.Models.Base.TreeProvider.$constructor = function SDL$Client$Models$Base$TreeProvider$constructor(id)
{
	this.addInterface("SDL.Client.Models.Base.ListProvider", [id]);
	var p = this.properties;
	p.trees = [];
};

/*
	Returns a value from {SDL.Client.Models.ItemType} enum that is used for creating an {SDL.Client.Models.Base.Tree} object
	returned by {SDL.Client.Models.Base.TreeProvider:getTree}.
*/
SDL.Client.Models.Base.TreeProvider.prototype.getTreeType = function SDL$Client$Models$Base$TreeProvider$getTreeType(filter)
{
	return "SDL.Client.Models.Base.Tree";
};

SDL.Client.Models.Base.TreeProvider.prototype.getTree = function SDL$Client$Models$Base$TreeProvider$getTree(filter)
{
	filter = SDL.Client.Types.Object.clone(filter);

	var p = this.properties;

	for (var i = 0, len = p.trees.length; i < len; i++)
	{
		var tree = SDL.Client.Models.getFromRepository(p.trees[i]);
		if (tree.isFilterApplied(filter))
		{
			return tree;
		}
	}

	var treeType = this.getTreeType(filter);
	var id = this.getId();
	var model = this.getModelFactory();
	var treeId = model.getModelSpecificUri(id + "-" + SDL.Client.Models.getUniqueId(), model.getTreeType());
	p.trees.push(treeId);
	return SDL.Client.Models.createInRepository(treeId, treeType, treeId, id, filter);
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.TreeProvider.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$TreeProvider$pack()
{
	var p = this.properties;
	return {
		trees: p.trees
	};
});

SDL.Client.Models.Base.TreeProvider.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$TreeProvider$unpack(data)
{
	if (data && data.trees)
	{
		var p = this.properties;
		p.trees = SDL.Client.Types.Array.clone(data.trees);
	}
});

// ------- end of SDL.Client.Models.MarshallableObject overrides
