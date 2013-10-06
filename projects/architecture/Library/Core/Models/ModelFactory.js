/*! @namespace {SDL.Client.Models.ModelFactory} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.ModelFactory");

/*
	Defines interface for a Domain Model Factory. A domain model factory manages
	objects that belong to a specific domain model.
	A domain model factory can be registered with {SDL.Client.Models} models facade.
*/


/*
	Returns the item type of the provided item.
*/
SDL.Client.Models.ModelFactory.prototype.getItemType = function SDL$Client$Models$ModelFactory$getItemType(item)
{
};

/*
	Returns an instance of a domain model item with the specified ID.
*/
SDL.Client.Models.ModelFactory.prototype.getItem = function SDL$Client$Models$ModelFactory$getItem(id)
{
	if (!id)
	{
		return null;
	}

	var item = SDL.Client.Models.getFromRepository(id);
	if (!item)
	{
		item = SDL.Client.Models.createInRepository(id, this.getItemType(id), id);
	}

	if (SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.UpdatableObject"))
	{
		//this will initialize the item with static data, if found in any of the loaded lists
		SDL.Client.Models.updateItemData(item);
	}

	return item;
};

/*
	Creates an instance of a new (non-existing) domain model item based on the specified Item Type.
*/
SDL.Client.Models.ModelFactory.prototype.createNewItem = function SDL$Client$Models$ModelFactory$createNewItem(type)
{
};