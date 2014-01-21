SDL.Client.Type.registerNamespace("SDL.Client.Models.System");

(function()
{
	var model = SDL.Client.Models.System.Model = new SDL.Client.Models.Base.ModelFactory();

	model.getSettings().prefix = "system:";

	model.getSystemRootId = function SDL$Client$Models$System$Model$getSystemRootId()
	{
		return this.getModelSpecificUri("models-list-provider", model.getFolderType());
	};

	model.getSystemRootTitle = function SDL$Client$Models$System$Model$getSystemRootTitle()
	{
		return this.properties.settings.prefix + "system";
	};

	SDL.Client.Models.registerModelFactory(
		model.getIdMatchRegExp(),
		model,
		[
			{
				id: model.getFolderType(),
				alias: "SDL_SYSTEM_MODELSLISTPROVIDER",
				implementation: "SDL.Client.Models.System.ModelsListProvider"
			}
		]
	)
})();