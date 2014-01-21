/*! @namespace {SDL.Client.Types.DisposableObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Types.DisposableObject");

//Copy the block within the comment below to a class implementing SDL.Client.Types.DisposableObject
/*
	// [optional]
	// implement disposeInterface if the current interface needs to be disposed
	// interfaces don't have to remove properties from this.properties,
	// it will be done by SDL.Client.Types.DisposableObject at the end of dispose
	this.disposeInterface = SDL.Client.Types.OO.nonInheritable(function()
	{
	});
*/

SDL.Client.Types.DisposableObject.prototype.dispose = function SDL$Client$Types$DisposableObject$dispose()
{
	var p = this.properties;
	if (!p.disposed && !p.disposing)
	{
		this._setDisposing();
		this.callInterfaces("disposeInterface");

		for (var x in p)
		{
			p[x] = undefined;	// this will release the properties even if 'p' itself is referenced some where
		}

		var interfaces = this.interfaces;
		var newProperties = {disposed:true};
		for (var i in interfaces)
		{
			if (i != "type")
			{
				interfaces[i].properties = newProperties;	// set new properties for each interface
			}
		}
	}
};

SDL.Client.Types.DisposableObject.prototype.getDisposed = function SDL$Client$Types$DisposableObject$getDisposed()
{
	return this.properties.disposed;
};

SDL.Client.Types.DisposableObject.prototype._setDisposing = function SDL$Client$Types$UI$DisposableObject$_setDisposing()
{
	this.properties.disposing = true;
};

SDL.Client.Types.DisposableObject.prototype.getDisposing = function SDL$Client$Types$DisposableObject$getDisposing()
{
	return this.properties.disposing;
};