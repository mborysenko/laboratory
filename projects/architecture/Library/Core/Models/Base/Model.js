/*! @namespace {SDL.Client.Models.Base.Models} */
SDL.Client.Type.registerNamespace("SDL.Client.Models.Base");

(function()
{
	var model = SDL.Client.Models.Base.Model = new SDL.Client.Models.Base.ModelFactory();

	model.getSettings().prefix = "base:";

	model.getSystemRootId = function SDL$Client$Models$Base$Model$getSystemRootId()
	{
		return this.getModelSpecificUri("models-browser", SDL.Client.Models.Base.Model.getFolderType());
	};

	model.getSystemRootTitle = function SDL$Client$Models$Base$Model$getSystemRootTitle()
	{
		return this.properties.settings.prefix + "system";
	};

	SDL.Client.Models.registerModelFactory(
		model.getIdMatchRegExp(),
		model,
		[
			{
				id: model.getFolderType(),
				alias: "SDL_BASE_MODELSBROWSER",
				implementation: "SDL.Client.Models.Base.ModelsBrowser"
			}
		]
	)
})();