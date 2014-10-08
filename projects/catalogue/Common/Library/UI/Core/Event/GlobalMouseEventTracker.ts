/// <reference path="../../SDL.Client.Core/Application/Application.d.ts" />
/// <reference path="../../SDL.Client.Core/Event/EventRegister.d.ts" />
/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />

module SDL.UI.Core.Event.GlobalMouseEventTracker
{
	if (SDL.Client)
	{
		var Application = SDL.Client.Application;
		if (Application)
		{
			Application.addInitializeCallback(() =>
				{
					if (Application.isHosted && Application.ApplicationHost.isSupported("startCaptureDomEvents"))
					{
						document.addEventListener("mousedown", () =>
						{
							Application.ApplicationHost.startCaptureDomEvents(["mouseup", "mousemove"]);
						});

						document.addEventListener("mouseup", () =>
						{
							Application.ApplicationHost.stopCaptureDomEvents();
						});

						Application.ApplicationHost.addEventListener("domevent", (e: any) =>
						{
							if (e.data.type == "mouseup")
							{
								SDL.Client.Application.ApplicationHost.stopCaptureDomEvents();
							}

							if (SDL.jQuery)
							{
								SDL.jQuery(document).trigger(e.data);
							}

							if (SDL.Client.Event)
							{
								var EventRegister = SDL.Client.Event.EventRegister;
								if (EventRegister)
								{
									EventRegister.handleEvent(document, e.data);
								}
							}
						})
					}
				});
		}
	}
}