/*! @namespace {SDL.Client.Models.UpdatableListObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.UpdatableListObject");

/*
	An interface to define methods for a list object that can be dynamically updated when
	an item in the list is changed. SDL.Client.Models.UpdatableListObject will also notify {SDL.Client.Models.UpdatableObject}
	items in the list when new list data is loaded from the server.
	A list of SDL.Client.Models.UpdatableListObject objects is maintained in the ModelRepository. Whenever a new
	instance of {SDL.Client.Models.UpdatableObject} is cerated in the ModelRepository all SDL.Client.Models.UpdatableListObject's
	are queried for data for the item.
*/
SDL.Client.Models.UpdatableListObject.$constructor = function SDL$Client$Models$UpdatableListObject$constructor(id)
{
	this.addInterface("SDL.Client.Models.IdentifiableObject", [id]);
	this.addInterface("SDL.Client.Models.LoadableObject");
};

SDL.Client.Models.UpdatableListObject.prototype.beforeSetLoaded = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$UpdatableListObject$beforeSetLoaded()
{
	SDL.Client.Models.registerList(this);
});

SDL.Client.Models.UpdatableListObject.prototype.unload = function SDL$Client$Models$UpdatableListObject$unload()
{
	SDL.Client.Models.unregisterList(this);
	this.callBase("SDL.Client.Models.LoadableObject", "unload");
};

/*
	Informs the list that an item has been updated.
	Allows the list to update it's state and trigger "itemupdate" or "itemadd" event.
*/
SDL.Client.Models.UpdatableListObject.prototype.itemUpdated = function SDL$Client$Models$UpdatableListObject$itemUpdated(item)
{
	// this.fireEvent("itemupdate", {item: item}) if the item is and stays in the list
	// this.fireEvent("itemadd", {item: item}) if the item has been added to the list
};

/*
	Informs the list that an item has been removed from the list.
	Allows the list to update it's state and trigger "itemremove" event.
*/
SDL.Client.Models.UpdatableListObject.prototype.itemRemoved = function SDL$Client$Models$UpdatableListObject$itemRemoved(itemId)
{
	// this.fireEvent("itemremove", , {itemId: itemId}); if item was in the list
};

/*
	If the list has some data related to an item, this data can be used to initialize the state
	of the {SDL.Client.Models.UpdatableObject} item without loading the full item from the server.
	updateItemData() will extract data related to the item from the list and pass it to the item object.
*/
SDL.Client.Models.UpdatableListObject.prototype.updateItemData = function SDL$Client$Models$UpdatableListObject$updateItemData(item)
{
};