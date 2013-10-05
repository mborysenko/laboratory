/*! @namespace {SDL.Client.Models} */
SDL.Client.Type.registerNamespace("SDL.Client.Models");

SDL.Client.Models.ItemType =
	{
		NONE: 0
	};

(function()
{
	var models = SDL.Client.Models;

	models.idMatches = {};
	models.itemTypes = {};

	/*
		Registers a domain model factory {SDL.Client.ModelFactory}.
		matchPattern is a regular expression object or a string that matches
			ID's of items managed by the model factory {SDL.Client.ModelFactory}.
		factory is a domain model factory object. A model factory provides a number of methods to manage
			model items that belong to a certain domain.
		itemTypes is an array of object of the following form:
			{
				id: ...,		// item type id, i.e. CMIS.Model.getDocumentType()
				alias: ...,		// a string to be added to {SDL.Client.Models.ItemType} enum,
								// i.e. "CMIS_DOCUMENT"
				implementation: ...	// a string, the class implementing the given item type,
								// i.e. "{Cmis.Document}"
			}
	*/
	models.registerModelFactory = function SDL$Client$Models$registerModelFactory(matchPattern, factory, itemTypes)
	{
		if (!(matchPattern in this.idMatches))
		{
			if (!SDL.Client.Types.OO.implementsInterface(factory, "SDL.Client.Models.ModelFactory"))
			{
				SDL.Client.Diagnostics.Assert.raiseError("SDL.Client.Models.ModelFactory object is not specified for item types with idmatch: " + matchPattern);
			}
			this.idMatches[matchPattern] = { regExp: new RegExp(matchPattern), factory: factory };
		}
		else
		{
			factory = this.idMatches[matchPattern].factory;
		}

		if (itemTypes)
		{
			for (var i = 0, len = itemTypes.length; i < len; i++)
			{
				this.registerItemType(itemTypes[i], factory);
			}
		}
	};

	/*
		Associates a specific itemType with a model factory {SDL.Client.ModelFactory}.
	*/
	models.registerItemType = function SDL$Client$Models$registerItemType(itemType, factory)
	{
		var id = itemType.id;
		SDL.Client.Models.ItemType[itemType.alias] = id;

		if (itemType.implementation)
		{
			var impl = SDL.Client.Type.resolveNamespace(itemType.implementation);
			if (impl)
			{
				impl.ItemType = id;
			}
			else
			{
				SDL.Client.Diagnostics.Assert.raiseError("Type implementation \"" + itemType.implementation + "\" is missing.");
			}
		}
		itemType.factory = factory;
		this.itemTypes[id] = itemType;
	};

	/*
		Returns the Model (model factory) object for the given item.
		The model factory is resolved based on the ID of the item.
		Every model factory registers itself using registerModelFactory() method
	*/
	models.getModelFactory = function SDL$Client$Models$getModelFactory(item)
	{
		if (item)
		{
			if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.IdentifiableObject"))
			{
				item = item.getId();
			}

			var idMatchRegistry = this.idMatches;
			for (var idmatch in idMatchRegistry)
			{
				if (idmatch)
				{
					if (idMatchRegistry[idmatch].regExp.test(item))
					{
						return idMatchRegistry[idmatch].factory;
					}
				}
			}
			if ("" in idMatchRegistry)
			{
				return idMatchRegistry[""].factory;
			}
		}
	};

	/*
		Returns the owning window of the SDL.Client.Models object.
	*/
	models.getOwningWindow = function SDL$Client$Models$getOwningWindow()
	{
		return window;
	};

	/*
		Returns the owning window of the model repository.
	*/
	models.getRepositoryOwningWindow = function()
	{
		var repository = SDL.Client.ModelRepository;
		if (repository.isMarshalling())
		{
			return repository.getMarshalObject().getOwningWindow();
		}
		else
		{
			return repository.getOwningWindow();
		}
	};

	/*
		Returns a list of all registered Models (model factories).
		Every model factory registers itself using registerModelFactory() method.
	*/
	models.getModelFactories = function SDL$Client$Models$getModelFactories()
	{
		var factories = [];
		var idMatchRegistry = this.idMatches;
		for (var idmatch in idMatchRegistry)
		{
			var factory = idMatchRegistry[idmatch].factory;
			if (factory && SDL.jQuery.inArray(factory, factories) == -1)
			{
				factories.push(factory);
			}
		}
		return factories;
	};

	/*
		Returns an domain model object for the specified ID.
		Examples:
			var schema = SDL.Client.Models.getItem("/schemas/schema.xsd");
			var item = SDL.Client.Models.getItem("url:document//doc.xml");
	*/
	models.getItem = function SDL$Client$Models$getItem(id)
	{
		var factory = this.getModelFactory(id);
		if (factory)
		{
			return factory.getItem(id);
		}
	};

	/*
		Creates a new domain model object instance in the {SDL.Client.ModelRepository} based on the provided item type.
		Example:
			var item = SDL.Client.Models.createNewItem({SDL.Client.Models.ItemType}.CMIS_DOCUMENT);
	*/
	models.createNewItem = function SDL$Client$Models$createNewItem(type)
	{
		var itemTypeData = this.itemTypes[type];
		if (itemTypeData)
		{
			return itemTypeData.factory.createNewItem(type);
		}
		else
		{
			SDL.Client.Diagnostics.Assert.raiseError("Cannot determine a model factory for item type \"" + type + "\".");
		}
	};

	/*
		Returns an item type for the given ID.
		Example:
			SDL.Client.Models.getItemType("/schemas/schema.xsd") == {SDL.Client.Models.ItemType}.URL_DOCUMENT;
	*/
	models.getItemType = function SDL$Client$Models$getItemType(id)
	{
		var factory = this.getModelFactory(id);
		if (factory)
		{
			return factory.getItemType(id);
		}
	};

	/*
		Returns a string that can be used as an ID for a domain model object instance.
	*/
	models.getUniqueId = function SDL$Client$Models$getUniqueId()
	{
		var repository = SDL.Client.ModelRepository;
		var id;
		if (repository.isMarshalling())
		{
			id = repository.getMarshalObject().getUniqueId();
		}
		else
		{
			id = repository.getUniqueId();
		}

		return id;
	};

	/*
		Adds the provided item to {SDL.Client.ModelRepository} with the specified ID.
	*/
	models.addToRepository = function SDL$Client$Models$addToRepository(id, item)
	{
		var repository = SDL.Client.ModelRepository;
		var result;
		if (!repository.getDisposing() && !repository.getDisposed())
		{
			result = repository.setItem(id, item);
		}
		else if (repository.isMarshalling())
		{
			result = repository.getMarshalObject().setItem(id, item);
		}

		return result;
	};

	/*
		Returns an item with the specified ID from {SDL.Client.ModelRepository}.
	*/
	models.getFromRepository = function SDL$Client$Models$getFromRepository(id)
	{
		var item;
		var repository = SDL.Client.ModelRepository;

		if (!repository.getDisposing() && !repository.getDisposed())
		{
			item = repository.getItem(id);
		}
		else if (repository.isMarshalling())
		{
			var repositoryMarshalTarget = repository.getMarshalObject();
			item = repositoryMarshalTarget.getItem(id);
			if (!item)
			{
				item = repository.getItem(id);
				if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.MarshallableObject") && item.isMarshalling())
				{
					item = item.getMarshalObject();
				}
			}
		}

		return item;
	};

	/*
		Creates a new instance of an object in {SDL.Client.ModelRepository} based on the provided ID, type and constructor arguments.
		Passed 'type' parameter can be a domain model item type or a class name (constructor).
		Examples:
			var item = SDL.Client.Models.createInRepository(url, {SDL.Client.Models.ItemType}.URL_DOCUMENT, url);
	*/
	models.createInRepository = function SDL$Client$Models$createInRepository(id, type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10)
	{
		var repository = SDL.Client.ModelRepository;
		if (repository.isMarshalling())
		{
			repository = repository.getMarshalObject();
		}

		var item;
		if (!repository.getDisposing() && !repository.getDisposed())
		{
			// apply() would not work across windows, have to specify the list of arguments explicitly
			if (type in this.itemTypes)
			{
				// resolve implementation based on the configuration
				var itemTypeData = this.itemTypes[type];
				if (itemTypeData)
				{
					var className = itemTypeData.implementation;
					if (className)
					{
						item = repository.createItem(id, className, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
					}
					else
					{
						SDL.Client.Diagnostics.Assert.raiseError("Implementation is not defined for item type \"" + type + "\"");
					}
				}
			}
			else
			{
				item = repository.createItem(id, type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
			}
		}

		return item;
	};

	/*
		Removes an object with the specified ID from {SDL.Client.ModelRepository}.
	*/
	models.removeFromRepository = function SDL$Client$Models$removeFromRepository(id)
	{
		var repository = SDL.Client.ModelRepository;
		repository.removeItem(id);
		if (repository.isMarshalling())
		{
			repository.getMarshalObject().removeItem(id);
		}
	};

	/*
		Changes the ID of an object in {SDL.Client.ModelRepository}.
	*/
	models.updateItemId = function SDL$Client$Models$updateItemId(oldId, newId)
	{
		var item;
		var repository = SDL.Client.ModelRepository;
		if (repository.isMarshalling())
		{
			var repositoryMarshalTarget = repository.getMarshalObject();
			item = repositoryMarshalTarget.getItem(id);
			if (item)
			{
				repositoryMarshalTarget.removeItem(oldId);
				repositoryMarshalTarget.setItem(newId, item);
				repository.removeItem(oldId);
			}
		}

		if (!item)
		{
			item = repository.getItem(oldId);
			repository.removeItem(oldId);
			repository.setItem(newId, item);
		}
	};

	/*
		Returns an {SDL.Client.MarshallableArray} collection of all registered {SDL.Client.Models.UpdatableListObject} objects.
	*/
	models.getListsRegistry = function SDL$Client$Models$getListsRegistry()
	{
		var lists = (this.getFromRepository("models-list-registry") ||
			this.createInRepository("models-list-registry", "SDL.Client.Models.MarshallableArray"));
		return lists ? lists.getArray() : null;
	};

	/*
		Adds an {SDL.Client.Models.UpdatableListObject} object to the collection of registered lists.
	*/
	models.registerList = function SDL$Client$Models$registerList(list)
	{
		var lists = this.getListsRegistry();
		if (lists && SDL.Client.Types.OO.implementsInterface(list, "SDL.Client.Models.UpdatableListObject"))
		{
			var listId = list.getId();
			var index = SDL.jQuery.inArray(listId, lists);
			if (index != -1)
			{
				SDL.Client.Types.Array.move(lists, index, lists.length - 1);
			}
			else
			{
				lists.push(listId);
			}
		}
	};

	/*
		Removes an {SDL.Client.Models.UpdatableListObject} object from the collection of registered lists.
	*/
	models.unregisterList = function SDL$Client$Models$unregisterList(list)
	{
		var lists = this.getListsRegistry();
		if (lists)
		{
			var index = SDL.jQuery.inArray(list.getId(), lists);
			if (index != -1)
			{
				SDL.Client.Types.Array.removeAt(lists, index);
			}
		}
	};

	/*
		Calls {SDL.Client.Models.UpdatableListObject}::itemUpdated method for all registered lists.
	*/
	models.itemUpdated = function SDL$Client$Models$itemUpdated(item, oldId)
	{
		if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.UpdatableObject"))
		{
			var lists = this.getListsRegistry();
			if (lists)
			{
				lists = SDL.Client.Types.Array.clone(lists);
				for (var i = 0, len = lists.length; i < len; i++)
				{
					var list = this.getFromRepository(lists[i])
					if (list)
					{
						list.itemUpdated(item, oldId);
					}
				}
			}
		}
	};

	/*
		Calls {SDL.Client.Models.UpdatableListObject}::itemRemoved method for all registered lists.
	*/
	models.itemRemoved = function SDL$Client$Models$itemRemoved(id)
	{
		var lists = this.getListsRegistry();
		if (lists)
		{
			lists = SDL.Client.Types.Array.clone(lists);
			for (var i = 0, len = lists.length; i < len; i++)
			{
				var list = this.getItem(lists[i]);
				if (list)
				{
					list.itemRemoved(id);
				}
			}
		}
	};

	/*
		Calls {SDL.Client.Models.UpdatableListObject}::updateItemData method for all registered lists.
	*/
	models.updateItemData = function SDL$Client$Models$updateItemData(item)
	{
		if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.UpdatableObject"))
		{
			var lists = this.getListsRegistry();
			if (lists && lists.length > 0)
			{
				lists = SDL.Client.Types.Array.clone(lists);
				var timeStamp = item.getLastUpdateCheckTimeStamp();
				var listTimeStamp = 0;
				for (var i = 0; i < lists.length; i++)	//loop from older to newer lists, so most recent values ovewrite obsolete values; lists.length might change during the operation
				{
					var list = this.getItem(lists[i]);
					if (list)
					{
						listTimeStamp = list.getTimeStamp();
						if (listTimeStamp > timeStamp)
						{
							// timeStamp will change here, but it doesn't matter as the list of lists is ordered by timeStamp
							list.updateItemData(item);
						}
					}
				}
				if (listTimeStamp > timeStamp)
				{
					item.setLastUpdateCheckTimeStamp(listTimeStamp); //set the time stamp to the last checked list's time stamp
				}
			}
		}
	};

	/*
	Calls {SDL.Client.Models.LoadableObject:load} method on the item and executes a callback function when operation is finished.
	This is a helper method that should only be called from within a domain model implementation.
	*/
	models.loadItem = function SDL$Client$Models$loadItem(item, reload, onSuccess, onFailure)
	{
		if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.LoadableObject"))
		{
			if (!reload && item.isLoaded())
			{
				onSuccess();
			}
			else
			{
				var loaded = function(event)
				{
					var item = event.target;
					SDL.Client.Event.EventRegister.removeEventHandler(item, "load", loaded);
					SDL.Client.Event.EventRegister.removeEventHandler(item, "loadfailed", loadFailed);
					onSuccess();
				}
				var loadFailed = function(event)
				{
					var item = event.target;
					SDL.Client.Event.EventRegister.removeEventHandler(item, "load", loaded);
					SDL.Client.Event.EventRegister.removeEventHandler(item, "loadfailed", loadFailed);
					onFailure(event.data.error);
				}

				SDL.Client.Event.EventRegister.addEventHandler(item, "load", loaded);
				SDL.Client.Event.EventRegister.addEventHandler(item, "loadfailed", loadFailed);
				item.load();
			}
		}
	};

	var discoveryMode = SDL.Client.Configuration.ConfigurationManager.getAppSetting("modelRepositoryDiscoveryMode");
	var repositoryId = SDL.Client.Configuration.ConfigurationManager.getAppSetting("modelRepositoryId");
	SDL.Client.Repository.RepositoryBase.initRepository(discoveryMode, repositoryId);	// initializes SDL.Client.ModelRepository object
}
)();
