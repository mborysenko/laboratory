/*! @namespace {SDL.Client.Models.URL.ModelFactory} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.URL.ModelFactory");

/*
	Implements a model factory used for managing documents loaded from a URL.
*/
SDL.Client.Models.URL.ModelFactory.$constructor = function SDL$Client$Models$URL$ModelFactory$constructor()
{
	this.addInterface("SDL.Client.Models.Base.ModelFactory");

	var s = this.properties.settings;
	s.prefix = "url:";
	s.root = "/";	// root URL is used to resolve relative URL's
}

SDL.Client.Models.URL.ModelFactory.prototype.getItemType = function SDL$Client$Models$URL$ModelFactory$getItemType(item)
{
	if (item)
	{
		return this.getDocumentType();
	}
};