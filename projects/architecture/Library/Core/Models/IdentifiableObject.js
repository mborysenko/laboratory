/*! @namespace {SDL.Client.Models.IdentifiableObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.IdentifiableObject");

/*
	Adds an identifier (ID) to an object.
*/
SDL.Client.Models.IdentifiableObject.$constructor = function SDL$Client$Models$IdentifiableObject$constructor(id)
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	var p = this.properties;
	p.id = id;
};

/*
	Returns the ID of the object.
*/
SDL.Client.Models.IdentifiableObject.prototype.getId = function SDL$Client$Models$IdentifiableObject$getId()
{
	return this.properties.id;
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.IdentifiableObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$IdentifiableObject$pack()
{
	var p = this.properties;
	return {
		id: p.id
	};
});

SDL.Client.Models.IdentifiableObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$IdentifiableObject$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.id = data.id;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides
