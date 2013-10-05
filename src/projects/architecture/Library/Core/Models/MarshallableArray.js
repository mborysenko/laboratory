/*! @namespace {SDL.Client.Models.MarshallableArray} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MarshallableArray");

SDL.Client.Models.MarshallableArray.$constructor = function SDL$Client$Models$MarshallableArray$constructor()
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	this.properties.array = [];
};

SDL.Client.Models.MarshallableArray.prototype.getArray = function SDL$Client$Models$MarshallableArray$getArray()
{
	return this.properties.array;
};

SDL.Client.Models.MarshallableArray.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MarshallableArray$pack()
{
	return {array: this.properties.array};
});

SDL.Client.Models.MarshallableArray.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MarshallableArray$unpack(data)
{
	if (data && data.array)
	{
		this.properties.array = SDL.Client.Types.Array.clone(data.array);
	}
});