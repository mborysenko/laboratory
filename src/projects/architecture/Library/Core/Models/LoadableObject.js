/*! @namespace {SDL.Client.Models.LoadableObject} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.LoadableObject");

/*
An interface that provides base implementation for loading and unloading an item.
It triggers related events (loading, load, loadfailed), manages item timestamp and its cached state.
Interfaces inheriting from SDL.Client.Models.LoadableObject will override _executeLoad() method
to implent the actual loading of data from a server and _processLoadResult() to handle the loaded data.
*/
SDL.Client.Models.LoadableObject.$constructor = function SDL$Client$Models$LoadableObject$constructor()
{
	this.addInterface("SDL.Client.Models.CacheableObject");

	var p = this.properties;
	p.loading = false;
	p.loaded = false;
};

SDL.Client.Models.LoadableObject.prototype._invalidateCachedState = function SDL$Client$Models$LoadableObject$_invalidateCachedState()
{
	this.callInterfaces("invalidateInterfaceCachedState");
	this.properties.loaded = false;
};

/*
Load object's data from the server.
If the data is already loaded the data will not be requested from the server and the method will return false.
Pass reload = true to force the loading of the data.
The method returns true of a request is made to the server.
When data is loaded the object will trigger "load" event if the operation was successfull
or "loadfailed" if loading did not succeed.
*/
SDL.Client.Models.LoadableObject.prototype.load = function SDL$Client$Models$LoadableObject$load(reload)
{
	if (!this.isLoading() && (reload || !this.isLoaded(true)))
	{
		this._setLoading();
		this._executeLoad(reload);
		return true;
	}
	else
	{
		return this.isLoading();
	}
};

/*
Invalidates the loaded data and triggers "unload" event.
*/
SDL.Client.Models.LoadableObject.prototype.unload = function SDL$Client$Models$LoadableObject$unload()
{
	this._invalidateCachedState();
	this.fireEvent("unload");
};

/*
Returns true if the object's data has been loaded from the server.
*/
SDL.Client.Models.LoadableObject.prototype.isLoaded = function SDL$Client$Models$LoadableObject$isLoaded(checkCacheValidity)
{
	return this.properties.loaded && (!checkCacheValidity || this.isCacheValid());
};

SDL.Client.Models.LoadableObject.prototype._setLoaded = function SDL$Client$Models$LoadableObject$_setLoaded()
{
	this.callInterfaces("beforeSetLoaded");
	this.properties.loading = false;
	this.properties.loaded = true;
	this.fireEvent("load");
	this.callInterfaces("afterSetLoaded");
};

/*
Returns true if object's data is being loaded from the server
*/
SDL.Client.Models.LoadableObject.prototype.isLoading = function SDL$Client$Models$LoadableObject$isLoading()
{
	return this.properties.loading;
};

SDL.Client.Models.LoadableObject.prototype._setLoading = function SDL$Client$Models$LoadableObject$_setLoading()
{
	this.properties.loading = true;
	this.fireEvent("loading");
};

SDL.Client.Models.LoadableObject.prototype._executeLoad = function SDL$Client$Models$LoadableObject$_executeLoad(reload)
{
	this._onLoad(); // to be overridden
};

SDL.Client.Models.LoadableObject.prototype._onLoad = function SDL$Client$Models$LoadableObject$_onLoad(result, webRequest)
{
	this._processLoadResult(result, webRequest);
	this.setTimeStamp(new Date().getTime());
	this._setLoaded();
};

SDL.Client.Models.LoadableObject.prototype._processLoadResult = function SDL$Client$Models$LoadableObject$_processLoadResult(result, webRequest)
{
	this._invalidateCachedState();
	// to be overridden
};

SDL.Client.Models.LoadableObject.prototype._onLoadFailed = function SDL$Client$Models$LoadableObject$_onLoadFailed(error, webRequest)
{
	var p = this.properties;
	p.loading = false;

	if (SDL.Client.Type.isString(error))
	{
		var errorCode = webRequest ? webRequest.statusCode : null;
		this.registerError(errorCode, error);
		this.fireEvent("loadfailed", { error: error, errorCode: errorCode });
	}
	else
	{
		if (!error.errorCode && webRequest)
		{
			error.errorCode = webRequest.statusCode;
		}
		this.registerError(error.errorCode, error.message);
		this.fireEvent("loadfailed", error);
	}
	this.callInterfaces("afterLoadFailed", [error, webRequest]);
};

SDL.Client.Models.LoadableObject.prototype.registerError = function SDL$Client$Models$LoadableObject$registerError(errorCode, errorMessage)
{
	SDL.Client.MessageCenter.registerException(new SDL.Client.Exception.Exception(errorCode, errorMessage));
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.LoadableObject.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$LoadableObject$pack()
{
	var p = this.properties;
	return {
		loading: p.loading,
		loaded: p.loaded
	};
});

SDL.Client.Models.LoadableObject.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$LoadableObject$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.loading = data.loading;
		p.loaded = data.loaded;
	}
});

SDL.Client.Models.LoadableObject.prototype.afterInitializeMarshalledObject = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$LoadableObject$afterInitializeMarshalledObject(object)
{
	var p = this.properties;
	if (p.loading)
	{
		// the item was loading before marshalling -> make sure it gets loaded in the new model repository
		p.loading = false;
		this.load(true);
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides
