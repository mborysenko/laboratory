/*! @namespace {SDL.Client.Models.Base.ModelsBrowser} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ModelsBrowser");

/*
	Folder object for navigating through all registered models that have getSystemRootId() method.
*/
SDL.Client.Models.Base.ModelsBrowser.$constructor = function SDL$Client$Models$Base$ModelsBrowser$constructor(id)
{
	this.addInterface("SDL.Client.Models.Base.ListProvider", [id]);
};

SDL.Client.Models.Base.ModelsBrowser.prototype.getListType = function SDL$Client$Models$Base$ModelsBrowser$getListType(filter)
{
	return "SDL.Client.Models.Base.ModelsBrowserList";
};