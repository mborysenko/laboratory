/*! @namespace {SDL.Client.Models.UpdatableObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.UpdatableObject");

/*
	Defines methods for an object to update its data based on data loaded by an {SDL.Client.Models.UpdatableListObject} object.
*/
SDL.Client.Models.UpdatableObject.$constructor = function SDL$Client$Models$UpdatableObject$constructor(id)
{
	this.addInterface("SDL.Client.Models.IdentifiableObject", [id]);
	this.addInterface("SDL.Client.Models.LoadableObject");

	var p = this.properties;
	p.lastUpdateCheckTimeStamp = 0;
};

/*
	Sets the timestamp (number) indicating the last time the item was updated with list data using setDataFromList() method.
	This timestamp is used to optimize the process of updating the item using list data: only {SDL.Client.Models.UpdatableListObject} lists that
	have been loaded later than the item's lastUpdateCheckTimeStamp will be queried to update the item.
*/
SDL.Client.Models.UpdatableObject.prototype.setLastUpdateCheckTimeStamp = function SDL$Client$Models$UpdatableObject$setLastUpdateCheckTimeStamp(timeStamp)
{
	this.properties.lastUpdateCheckTimeStamp = timeStamp;
};

/*
	Gets the timestamp (number) indicating the last time the item was updated with list data using setDataFromList() method.
	This timestamp is used to optimize the process of updating the item using list data: only {SDL.Client.Models.UpdatableListObject} lists that
	have been loaded later than the item's lastUpdateCheckTimeStamp will be queried to update the item.
*/
SDL.Client.Models.UpdatableObject.prototype.getLastUpdateCheckTimeStamp = function SDL$Client$Models$UpdatableObject$getLastUpdateCheckTimeStamp()
{
	return this.properties.lastUpdateCheckTimeStamp;
};


SDL.Client.Models.UpdatableObject.prototype.afterSetLoaded = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$UpdatableObject$afterSetLoaded()
{
	SDL.Client.Models.itemUpdated(this);
});


/*
	The method uses data loaded by an {SDL.Client.Models.UpdatableListObject} to initialize the cached state of the item without
	the need to load the full item data from the server.
*/
SDL.Client.Models.UpdatableObject.prototype.setDataFromList = function SDL$Client$Models$UpdatableObject$setDataFromList(data, parentId, timeStamp)
{
	if (!timeStamp || timeStamp > this.getTimeStamp())
	{
		this.updateData(data, parentId);

		if (timeStamp)
		{
			this.setTimeStamp(timeStamp);
		}
	}
};

/*
	The method uses the provided item data to set the cached state of the item.
*/
SDL.Client.Models.UpdatableObject.prototype.updateData = function SDL$Client$Models$UpdatableObject$updateData(data, parentId)
{
	// to be overriden
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.UpdatableObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$UpdatableObject$pack()
{
	var p = this.properties;
	return {
				lastUpdateCheckTimeStamp: p.lastUpdateCheckTimeStamp
			};
});
SDL.Client.Models.UpdatableObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$UpdatableObject$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.lastUpdateCheckTimeStamp = data.lastUpdateCheckTimeStamp;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides