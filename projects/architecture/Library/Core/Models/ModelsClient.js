(function()
{
	var sdl;
	var models;

	try
	{
		if (top.opener && !top.opener.closed && (sdl = top.opener.SDL) && sdl.Client)
		{
			models = sdl.Client.Models;
		}
	}
	catch (err)
	{
		// must be cross-domain
	}
	
	try
	{
		if (!models && parent && !parent.closed && parent != window && (sdl = parent.SDL) && sdl.Client)
		{
			models = sdl.Client.Models;
		}
	}
	catch (err)
	{
		// must be cross-domain
	}

	if (!models)
	{
		SDL.Client.Diagnostics.Assert.raiseError("This is a stand-alone view, it does not have an opener or a parent that has SDL.Client.Models available.");
	}
	else
	{
		SDL.Client.Models = models;
		SDL.Client.Models.ItemType = sdl.Client.Models.ItemType;
	}
})();

SDL.Client.Event.EventRegister.addEventHandler(models.getOwningWindow(), "unload", function ()
	{
		SDL.Client.Models = {};
		SDL.Client.Models.ItemType = {};
	});