SDL.Client.Types.OO.createInterface("SDL.Client.Models.System.ModelsListProvider");

/*
	Folder object for navigating through all registered models that have getSystemRootId() method.
*/
SDL.Client.Models.System.ModelsListProvider.$constructor = function SDL$Client$Models$System$ModelsListProvider$constructor(id)
{
	this.addInterface("SDL.Client.Models.Base.ListProvider", [id]);
};

SDL.Client.Models.System.ModelsListProvider.prototype.getListType = function SDL$Client$Models$System$ModelsListProvider$getListType(filter)
{
	return "SDL.Client.Models.System.ModelsList";
};