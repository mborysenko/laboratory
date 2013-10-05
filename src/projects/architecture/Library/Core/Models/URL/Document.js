/*! @namespace {SDL.Client.Models.URL.Document} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.URL.Document");

/*
* Represents a base for documents loaded from a URL.
*/
SDL.Client.Models.URL.Document.$constructor = function SDL$Client$Models$URL$Document$constructor(id)
{
	this.addInterface("SDL.Client.Models.Base.Item", [id]);

	var p = this.properties;
	p.content;
	p.contentUrl;
	p.mimeType;
};

SDL.Client.Models.URL.Document.prototype.invalidateInterfaceCachedState = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$URL$Document$invalidateInterfaceCachedState()
{
	this.properties.content = undefined;
});

SDL.Client.Models.URL.Document.prototype.getTitle = function SDL$Client$Models$URL$Document$getTitle()
{
	var m = this.getId().match(/([^\/\\]*)\/?$/);
	return m ? m[1] : null;
};

SDL.Client.Models.URL.Document.prototype.getContentUrl = function SDL$Client$Models$URL$Document$getContentUrl()
{
	var p = this.properties;
	if (p.contentUrl === undefined)
	{
		var id = this.getOriginalId() || "";
		if (/^\//.test(id))
		{
			p.contentUrl = SDL.Client.Types.Url.getAbsoluteUrl(id);
		}
		else if (/\:/.test(id))
		{
			p.contentUrl = id;
		}
		else
		{
			var s = this.getModelFactory().getSettings();
			p.contentUrl = SDL.Client.Types.Url.getAbsoluteUrl(SDL.Client.Types.Url.combinePath(s.root, id));
		}
	}
	return p.contentUrl;
};

SDL.Client.Models.URL.Document.prototype.getContent = function SDL$Client$Models$URL$Document$getContent()
{
	return this.properties.content;
};

SDL.Client.Models.URL.Document.prototype.getMimeType = function SDL$Client$Models$URL$Document$getMimeType()
{
	return this.properties.mimeType;
};

SDL.Client.Models.URL.Document.prototype.isLoaded = function SDL$Client$Models$URL$Document$isLoaded()
{
	return this.properties.content != undefined;
};

SDL.Client.Models.URL.Document.prototype._executeLoad = function SDL$Client$Models$URL$Document$_executeLoad(reload)
{
	SDL.Client.Net.getRequest(this.getContentUrl(), this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
};

SDL.Client.Models.URL.Document.prototype._processLoadResult = function SDL$Client$Models$URL$Document$_processLoadResult(result, webRequest)
{
	this.callBase("SDL.Client.Models.Base.Item", "_processLoadResult", [result, webRequest]);

	var p = this.properties;
	p.content = result;

	p.mimeType = webRequest ? webRequest.responseContentType : null;
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.URL.Document.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$URL$Document$pack()
{
	var p = this.properties;
	return {
		content: p.content,
		mimeType: p.mimeType
	};
});

SDL.Client.Models.URL.Document.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$URL$Document$unpack(data)
{
	if (data)
	{
		var p = this.properties;
		p.content = data.content;
		p.mimeType = data.mimeType;
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides