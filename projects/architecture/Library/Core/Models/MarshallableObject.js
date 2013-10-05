/*! @namespace {SDL.Client.Models.MarshallableObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MarshallableObject");

SDL.Client.Models.MarshallableObject.$constructor = function SDL$Client$Models$MarshallableObject$constructor()
{
	this.addInterface("SDL.Client.Types.ObjectWithEvents");

	this.properties.target;
	this.properties.marshalling;

	//Copy the block within the comment below to a class implementing SDL.Client.Models.MarshallableObject
	/*

	// [optional]
	// implement pack whenever needed for marshalling
	this.pack = SDL.Client.Types.OO.nonInheritable(function()
	{
		return null;	// returns an object that packs private variables
	});

	// [optional]
	// implement unpack whenever needed for marshalling
	this.unpack = SDL.Client.Types.OO.nonInheritable(function(data)
	{
		//gets an object and unpacks it to private variables, making sure all object (reference type) variables are recreated locally
	});
	*/
};

SDL.Client.Models.MarshallableObject.prototype.getMarshalObject = function SDL$Client$Models$MarshallableObject$getMarshalObject()
{
	return this.properties.target;
};

SDL.Client.Models.MarshallableObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MarshallableObject$pack()
{
	var properties = this.properties;
	return {"handlers": properties.handlers};
});

SDL.Client.Models.MarshallableObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MarshallableObject$unpack(data)
{
	if (data && data.handlers)
	{
		var handlers = {};
		var events = data.handlers;
		for (var e in events)
		{
			var h = events[e];
			var tmp = handlers[e] = [];
			for (var i = 0; i < h.length; i++)
			{
				tmp[i] = {fnc: h[i].fnc};
			}
		}
		this.properties.handlers = handlers;
	}
});

SDL.Client.Models.MarshallableObject.prototype._marshalData = function SDL$Client$Models$MarshallableObject$_marshalData(target)
{
	var p = this.properties;
	p.marshalling = true;
	p.target = target;
	var targetInterfaces = target.interfaces;
	var sourceInterfaces = this.interfaces;
	if (sourceInterfaces && targetInterfaces)
	{
		for (var iface in targetInterfaces)
		{
			var targetBase = targetInterfaces[iface];
			var sourceBase = sourceInterfaces[iface];
			if (targetBase.unpack && sourceBase.pack)
			{
				try
				{
					targetBase.unpack(sourceBase.pack());
				}
				catch (err)
				{
					alert("Failed to marshal interface \"" + iface + "\": " + err.message);
				}
			}
		}
	}
	p.marshalling = false;
	this.fireEvent("marshal");
	p.handlers = undefined;	// after marshalling the target object is responsible for firing all events
};

SDL.Client.Models.MarshallableObject.prototype._initializeMarshalledObject = function SDL$Client$Models$MarshallableObject$_initializeMarshalledObject(object)
{
	if (object && object._marshalData && this.getTypeName() == object.getTypeName())
	{
		object._marshalData(this);
		this.callInterfaces("afterInitializeMarshalledObject", [object]);
		return true;
	}
};

SDL.Client.Models.MarshallableObject.prototype.isMarshalling = function SDL$Client$Models$MarshallableObject$isMarshalling()
{
	return this.properties.marshalling || false;
};