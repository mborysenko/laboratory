/*! @namespace {SDL.Client.Models.Base.Tree} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.Tree");

SDL.Client.Models.Base.Tree.$constructor = function SDL$Client$Models$Base$Tree$constructor(id, parentId, filter)
{
	this.addInterface("SDL.Client.Models.Base.FilteredNavigationObject", [id, parentId, filter]);

	var p = this.properties;

	var item = SDL.Client.Models.getItem(parentId);
	if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.Base.Item"))
	{
		SDL.Client.Event.EventRegister.addEventHandler(item, "staticload", this.getDelegate(this.processItemUpdated));
	}
	
	p.lists = {};		// ListProvider id -> list id
	p.paths = {};		// child -> parent relationships
	p.searching = {};
	p.loadingTrees = {};
};

SDL.Client.Models.Base.Tree.prototype.tryGetListId = function SDL$Client$Models$Base$Tree$tryGetListId(item)
{
	if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		return this.properties.lists[item.getId()];
	}
};

SDL.Client.Models.Base.Tree.prototype.getList = function SDL$Client$Models$Base$Tree$getList(item)
{
	var listId = this.tryGetListById(item) || this.addList(item);
	return listId ? SDL.Client.Models.getItem(listId) : null;
};

SDL.Client.Models.Base.Tree.prototype.addList = function SDL$Client$Models$Base$Tree$addList(item, list)
{
	var p = this.properties;
	var itemId;

	if (SDL.Client.Type.isString(item))
	{
		itemId = item;
		item = SDL.Client.Models.getItem(itemId);
	}

	if (!list)
	{
		if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.Base.ListProvider"))
		{
			list = item.getList(this.getListFilterOptions());
		}
	}
	else if (SDL.Client.Type.isString(list))
	{
		list = SDL.Client.Models.getItem(list);
	}
	
	if (SDL.Client.Types.OO.implementsInterface(list, "SDL.Client.Models.Base.List"))
	{
		if (!itemId && SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
		{
			itemId = item.getId();
		}

		var listId = p.lists[itemId] = list.getId();

		SDL.Client.Event.EventRegister.addEventHandler(item, "delete", this.getDelegate(this.processItemDeleted));
		SDL.Client.Event.EventRegister.addEventHandler(list, "*", this.getDelegate(this.listEventHandler));
		return listId;
	}
	else
	{
		return null;
	}
};

SDL.Client.Models.Base.Tree.prototype.removeList = function SDL$Client$Models$Base$Tree$removeList(item)
{
	var itemId;
	if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	var lists = this.properties.lists;
	var list = SDL.Client.Models.getItem(lists[itemId]);
	if (list)
	{
		if (SDL.Client.Type.isString(item))
		{
			item = SDL.Client.Models.getItem(item);
		}
		SDL.Client.Event.EventRegister.removeEventHandler(item, "delete", this.getDelegate(this.processItemDeleted));
		SDL.Client.Event.EventRegister.removeEventHandler(list, "*", this.getDelegate(this.listEventHandler));

		delete lists[itemId];
	}
	return list;
};

SDL.Client.Models.Base.Tree.prototype.processItemUpdated = function SDL$Client$Models$Base$Tree$processItemUpdated(event)
{
	this.fireEvent("itemupdate", {itemId: event.target.getId()});
};

SDL.Client.Models.Base.Tree.prototype.listEventHandler = function SDL$Client$Models$Base$Tree$listEventHandler(event)
{
	switch (event.type)
	{
		case "load":
			this.processListLoaded(event);
			break;
		case "loadfailed":
			this.processListLoaded(event);
			break;
		case "unload":
			this.fireEvent("unload", {id: SDL.Client.Types.Object.find(this.properties.lists, event.target.getId())});
			break;
		case "dispose":
			this.removeList(event.target.getParentId());
			break;
		case "itemadd":
		case "itemupdate":
		case "itemremove":
			this.fireEvent(event.type, {id: SDL.Client.Types.Object.find(this.properties.lists, event.target.getId()), itemId: event.data.itemId});
			break;
	}
}

/*
	Returns an 'array of arrays' - hierarchical structure of the tree, built from the lists included in the tree
*/
SDL.Client.Models.Base.Tree.prototype.getItems = function SDL$Client$Models$Base$Tree$getItems(item, toIds, onlyValidCache)
{
	var p = this.properties;
	var itemId;
	if (!item)
	{
		itemId = p.parentId;
		item = SDL.Client.Models.getItem(p.parentId);
	}
	else if (SDL.Client.Type.isString(item))
	{
		itemId = item;
		item = SDL.Client.Models.getItem(itemId);
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	var listRootEntry = {item: item, id: itemId};

	if (item)
	{
		var list = this.getList(item);
		if (list)
		{
			listRootEntry.canHaveChildren = true;

			var items = list.getItems(onlyValidCache);
			if (items)
			{
				// list loaded
				listRootEntry.items = SDL.jQuery.map(items, function (item) { return SDL.Client.Types.Object.clone(item); });

				if (toIds && toIds.length)
				{
					for (var i = 0, len = toIds.length; i < len; i++)
					{
						var path = this.getPath(toIds[i], itemId);
						if (path && path.length > 1 && path[0] == itemId)
						{
							var parentList = listRootEntry.items;
							for (var j = 1, lenj = path.length - 1; j < lenj && parentList; j++)
							{
								var id = path[j];
								var child;
								for (var k = 0, lenk = parentList.length; k < lenk; k++)
								{
									if (parentList[k].id == id)
									{
										child = parentList[k];
										break;
									}
								}
								if (child)
								{
									if (child.canHaveChildren == undefined)
									{
										// child's list is not 'loaded'
										list = this.getList(id);
										if (list)
										{
											child.canHaveChildren = true;

											items = list.getItems(onlyValidCache);
											if (items)
											{
												child.items = SDL.jQuery.map(items, function (item) { return SDL.Client.Types.Object.clone(item); });
											}
										}
										else
										{
											child.canHaveChildren = false;
										}
									}
									parentList = child.items;
								}
								else
								{
									// the ancestor is not in the available structure -> cannot expand to the item
									break;
								}
							}
						}
					}
				}
			}
		}
		else
		{
			listRootEntry.canHaveChildren = false;
		}
	}
	return listRootEntry;
};

SDL.Client.Models.Base.Tree.prototype.isLoaded = function SDL$Client$Models$Base$Tree$isLoaded(item, toIds, checkCacheValidity)
{
	var p = this.properties;
	var itemId;
	if (!item)
	{
		itemId = p.parentId;
		item = SDL.Client.Models.getItem(p.parentId);
	}
	else if (SDL.Client.Type.isString(item))
	{
		itemId = item;
		item = SDL.Client.Models.getItem(itemId);
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	var list = this.getList(item);
	if (list)
	{
		var items = list.getItems(onlyValidCache);
		if (!items)
		{
			return false;
		}

		if (toIds && toIds.length)
		{
			for (var i = 0, len = toIds.length; i < len; i++)
			{
				var path = this.getPath(toIds[i], itemId);
				if (!path)
				{
					return false;
				}

				if (path && path.length > 1 && path[0] == itemId)
				{
					var parentList = items;
					for (var j = 1, lenj = path.length - 1; j < lenj && parentList; j++)
					{
						var id = path[j];
						var child;
						for (var k = 0, lenk = parentList.length; k < lenk; k++)
						{
							if (parentList[k].id == id)
							{
								child = parentList[k];
								break;
							}
						}

						parentList = null;

						if (child)
						{
							list = this.getList(id);
							if (list)
							{
								parentList = list.getItems(onlyValidCache);
								if (!parentList)
								{
									return false;
								}
							}
						}
					}
				}
			}
		}
	}
	return true;
};

SDL.Client.Models.Base.Tree.prototype.invalidateCache = function SDL$Client$Models$Base$Tree$invalidateCache()
{
	var lists = this.properties.lists;
	for (var id in lists)
	{
		var list = SDL.Client.Models.getItem(lists[id]);
		if (list)
		{
			list.invalidateCache();
		}
	}
};

SDL.Client.Models.Base.Tree.prototype.unload = function SDL$Client$Models$Base$Tree$unload(item)
{
	var itemId;
	if (!item)
	{
		itemId = p.parentId;
	}
	else if (SDL.Client.Type.isString(item))
	{
		itemId = item;
		item = SDL.Client.Models.getItem(itemId);
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	this._unload(item);
	this.fireEvent("unload", {id: itemId, deep: true});
};

SDL.Client.Models.Base.Tree.prototype._unload = function SDL$Client$Models$Base$Tree$_unload(item)
{
	var list = this.removeList(item);
	
	var paths = this.properties.paths;
	var children = [];

	// collect all known child nodes
	for (var id in paths)
	{
		if (paths[id] == item)
		{
			children.push(id);
		}
	}

	// remove child->parent information
	var i;
	var len = children.length;
	for (i = 0; i < len; i++)
	{
		var child = children[i];
		delete paths[child];
	}

	// unload the current list
	if (list)
	{
		list.unload();
	}
	
	//unload all cached sub nodes
	for (i = 0; i < len; i++)
	{
		this._unload(children[i]);
	}
};

SDL.Client.Models.Base.Tree.prototype.load = function SDL$Client$Models$Base$Tree$load(item, toIds, refresh)
{
	if (refresh || !this.isLoaded(item, toIds, true))
	{
		var p = this.properties;

		var itemId;
		if (!item)
		{
			itemId = p.parentId;
		}
		else if (SDL.Client.Type.isString(item))
		{
			itemId = item;
			item = SDL.Client.Models.getItem(itemId);
		}
		else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
		{
			itemId = item.getId();
		}

		var loadingTree = p.loadingTrees[itemId];

		if (toIds && toIds.length > 0)
		{
			var i, len;

			if (!loadingTree)
			{
				loadingTree = p.loadingTrees[itemId] = {refresh: refresh};
			}
			else if (!loadingTree.refresh && refresh)
			{
				loadingTree.refresh = true;
			}

			if (!SDL.jQuery.isEmptyObject(loadingTree.toIds))
			{
				var localToIds = [];
				for (i = 0, len = toIds.length; i < len; i++)
				{
					var toId = toIds[i];
					if (!(toId in loadingTree.toIds))
					{
						loadingTree.toIds[toId] = false;
						localToIds.push(toId);
					}
				}
				for (i = 0, len = localToIds.length; i < len; i++)
				{
					this.findItem(localToIds[i], refresh);
				}
			}
			else
			{
				loadingTree.toIds = {};
				len = toIds.length;

				for (i = 0; i < len; i++)
				{
					loadingTree.toIds[toIds[i]] = false;
				}
				for (i = 0; i < len; i++)
				{
					this.findItem(toIds[i], refresh);
				}
			}
		}
		else if (!loadingTree)
		{
			p.loadingTrees[itemId] = {refresh: refresh};
			this.loadLists(itemId);
		}
	}
};

SDL.Client.Models.Base.Tree.prototype.processFindItem = function SDL$Client$Models$Base$Tree$processFindItem(id)
{
	var loadingTrees = this.properties.loadingTrees;
	for (var itemId in loadingTrees)
	{
		var toIds = loadingTrees[itemId].toIds;
		if (toIds && toIds[id] === false)
		{
			toIds[id] = true;
			for (var i in toIds)
			{
				if (toIds[i] === false)
				{
					return;
				}
			}
			// when all items are found -> load all needed lists for the item
			this.loadLists(itemId);
		}
	}
};

SDL.Client.Models.Base.Tree.prototype.loadLists = function SDL$Client$Models$Base$Tree$loadLists(item)
{
	var itemId;
	if (SDL.Client.Type.isString(item))
	{
		itemId = item;
		item = SDL.Client.Models.getItem(itemId);
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	var loadingTree = this.properties.loadingTrees[itemId];
	var lists = loadingTree.lists;
	if (!lists)
	{
		lists = loadingTree.lists = {};
	}

	var list = this.getList(item);
	var listId = list.getId();

	if (loadingTree.refresh || !list.isLoaded(true))
	{
		lists[listId] = false;
		list.load(loadingTree.refresh);
	}

	var toIds = loadingTree.toIds;
	if (toIds)
	{
		for (var id in toIds)
		{
			var path = this.getPath(id, item);
			if (path && path.length > 1 && path[0] == itemId)
			{
				for (var j = 1, lenj = path.length - 1; j < lenj; j++)
				{
					list = this.getList(path[j]);
					listId = list.getId();
					if (!(listId in lists) && (loadingTree.refresh || !list.isLoaded(true)))
					{
						lists[listId] = false;
						list.load(loadingTree.refresh);
					}
				}
			}
		}
	}

	this.processTreeLoaded(itemId);	// see if everything is loaded
};

SDL.Client.Models.Base.Tree.prototype.processTreeLoaded = function SDL$Client$Models$Base$Tree$processTreeLoaded(item)
{
	var itemId;
	if (SDL.Client.Type.isString(item))
	{
		itemId = item;
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	var loadingTrees = this.properties.loadingTrees;
	var loadingTree = loadingTrees[itemId];
	var lists = loadingTree.lists;
	for (var list in lists)
	{
		if (!lists[list])
		{
			// not everything is loaded yet
			return;
		}
	}

	var toIds = loadingTree.toIds;
	for (var id in toIds)
	{
		if (!toIds[id])
		{
			// not all paths are resolved yet
			return;
		}
	}

	// all lists are loaded
	var toIds = SDL.jQuery.map(toIds, function(item, id) { return id; } );
	delete loadingTrees[itemId];
	this.fireEvent("load", {id: itemId, toIds: toIds});
};

SDL.Client.Models.Base.Tree.prototype.processListLoaded = function SDL$Client$Models$Base$Tree$processListLoaded(event)
{
	var id = event.target.getId();
	var loadingTrees = this.properties.loadingTrees;

	var fireEvent = true;
	var allLists = this.properties.lists;
	for (var item in loadingTrees)
	{
		if (allLists[item] == id)
		{
			fireEvent = false;
		}
	}
	if (fireEvent)
	{
		// if there is no subtree being loaded for this list -> fire the list's event, otherwise the subtree will fire its own event when loaded
		this.fireEvent("load", {id: SDL.Client.Types.Object.find(allLists, id)});
	}
	
	for (var item in loadingTrees)
	{
		var lists = loadingTrees[item].lists;
		if (lists && lists[id] === false)
		{
			lists[id] = true;
			this.processTreeLoaded(item);
		}
	}

};

SDL.Client.Models.Base.Tree.prototype.processItemDeleted = function SDL$Client$Models$Base$Tree$processItemDeleted(event)
{
	var item = event.target;
	if (item)
	{
		var list = this.removeList(item);
		var paths = this.properties.paths;
		var children = [];

		item = item.getId();
		// collect all known child nodes
		for (var id in paths)
		{
			if (paths[id] == item)
			{
				children.push(id);
			}
		}

		// remove child->parent information
		var i;
		var len = children.length;
		for (i = 0; i < len; i++)
		{
			var child = children[i];
			delete paths[child];
			var childItem = SDL.Client.Models.getItem(child);
			if (SDL.Client.Types.OO.implementsInterface(childItem, "SDL.Client.Models.LoadableObject"))
			{
				childItem._invalidateCachedState();
			}
		}
	}
};
SDL.Client.Models.Base.Tree.prototype.isSearchingItem = function SDL$Client$Models$Base$Tree$isSearchingItem(item)
{
	var itemId;
	if (SDL.Client.Type.isString(item))
	{
		itemId = item;
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	return this.properties.searching[itemId] || false;
};

SDL.Client.Models.Base.Tree.prototype.findItem = function SDL$Client$Models$Base$Tree$findItem(item, refresh)
{
	var itemId;
	if (SDL.Client.Type.isString(item))
	{
		itemId = item;
		item = SDL.Client.Models.getItem(itemId);
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	if (itemId && !this.isSearchingItem(itemId))
	{
		var p = this.properties;
		p.searching[itemId] = true;

		var path;
		if (!refresh && (path = this.getPath(item)) && path.length > 0 && (path[0] == p.parentId))	// no need to go to the server, the data is available on the client
		{
			delete p.searching[itemId];
			this.processFindItem(itemId);
			this.fireEvent("finditem", { id: itemId, path: path });
		}
		else
		{
			var self = this;
			this.executeFindItem(itemId, p.parentId, function SDL$Client$Models$Base$Tree$findItem$onSuccess(path)
			{
				delete p.searching[itemId];
				self.processFindItem(itemId);
				self.fireEvent("finditem", { id: itemId, path: path });
			},
			function SDL$Client$Models$Base$Tree$findItem$onError(error)
			{
				delete p.searching[itemId];
				p.paths[itemId] = null;
				this.registerError(error);
				self.processFindItem(itemId);
				self.fireEvent("finditemfailed", { id: itemId, error: error });
			});
		}
	}
};

SDL.Client.Models.Base.Tree.prototype.getPath = function SDL$Client$Models$Base$Tree$getPath(item, fromItem)
{
	var paths = this.properties.paths;

	var itemId;
	if (SDL.Client.Type.isString(item))
	{
		itemId = item;
	}
	else if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
	{
		itemId = item.getId();
	}

	var parentId = this.properties.parentId;
	var fromItemId;
	if (!fromItem)
	{
		fromItemId = parentId;
	}
	else if (SDL.Client.Type.isString(fromItem))
	{
		fromItemId = fromItem;
	}
	else if (SDL.Client.Types.OO.implementsInterface(fromItem, "SDL.Client.Models.IdentifiableObject"))
	{
		fromItemId = fromItem.getId();
	}

	var path = [itemId];
	while (itemId && itemId != fromItemId && itemId != parentId)
	{
		var modelItem = SDL.Client.Models.getItem(itemId);
		var parent = undefined;
		if (modelItem)
		{
			// TODO: get parent item from modelItem, need an interface for that
			//parent = modelItem.getParentItem();
		}

		if (parent !== null)
		{
			paths[item] = parent;
			path.push(parent);
		}

		itemId = parent;
	}
	return path.reverse();
};

SDL.Client.Models.Base.Tree.prototype.registerError = function SDL$Client$Models$Base$Tree$registerError(error)
{
	SDL.Client.MessageCenter.registerError(error);
};

SDL.Client.Models.Base.Tree.prototype.executeFindItem = function SDL$Client$Models$Base$Tree$executeFindItem(id, parentId, success, failure)
{
	throw Error("SDL.Client.Models.Base.Tree does not implement executeFindItem() method.");
};
// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.Tree.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Tree$pack()
{
	var p = this.properties;
	return {
				searching: p.searching,
				lists: p.lists,
				paths: p.paths,
				loadingTrees: p.loadingTrees
			};
});

SDL.Client.Models.Base.Tree.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Tree$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.searching = SDL.Client.Types.Object.clone(data.searching);
		p.paths = SDL.Client.Types.Object.clone(data.paths);
		for (var item in data.loadingTrees)
		{
			var treeData = data.loadingTrees[item];
			p.loadingTrees[item] =
			{
				toIds: SDL.Client.Types.Object.clone(treeData.toIds),
				lists: SDL.Client.Types.Object.clone(treeData.lists),
				refresh: treeData.refresh
			}
		}
		for (var item in data.lists)
		{
			this.addList(item, data.lists[item]);
		}
	}
});

SDL.Client.Models.Base.Tree.prototype.afterInitializeMarshalledObject = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Tree$afterInitializeMarshalledObject(object)
{
	var searching = this.properties.searching;
	this.properties.searching = {};
	for (var id in searching)
	{
		//the tree was searching for the item before marshalling -> make sure the operation is finished
		this.findItem(id);
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides
