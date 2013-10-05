/*! @namespace {SDL.Client.Models.URL} */
SDL.Client.Type.registerNamespace("SDL.Client.Models.URL");

(function()
{
	var model = SDL.Client.Models.URL.Model = new SDL.Client.Models.URL.ModelFactory();

	SDL.Client.Models.registerModelFactory(
		model.getIdMatchRegExp(),
		model,
		[
			{
				id: model.getDocumentType(),
				alias: "SDL_URL_DOCUMENT",
				implementation: "SDL.Client.Models.URL.Document"
			}
		]);

	SDL.Client.Models.registerModelFactory("", model);	// matches all unrecognized id's
})();