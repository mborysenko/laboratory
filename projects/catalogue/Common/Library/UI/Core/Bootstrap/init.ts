/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/ConfigurationManager/ConfigurationManager.d.ts" />
/// <reference path="../../SDL.Client.Core/Resources/ResourceManager.d.ts" />
/// <reference path="../../SDL.Client.Core/Event/EventRegister.d.ts" />
/// <reference path="../Renderers/ViewRenderer.ts" />
/// <reference path="../Renderers/ControlRenderer.ts" />

module SDL.UI.Core
{
	var cm = SDL.Client.Configuration.ConfigurationManager;
	var rm = SDL.Client.Resources.ResourceManager;

	var pageNode: Element = cm.getCurrentPageConfigurationNode();
	if (pageNode)
	{
		var view = pageNode.getAttribute("view");
		if (view)
		{
			rm.load("SDL.UI.Core.Renderers.ViewRenderer", function ()
			{
				var target: HTMLElement = document.getElementById("main-view-target") || document.body;
				Renderers.ViewRenderer.renderView(view, target, null, function(view)
					{
						SDL.Client.Event.EventRegister.addEventHandler(SDL.Client.Event.EventRegister, "beforedispose", function()
						{
							Renderers.ViewRenderer.disposeView(view);
						});
					});

				SDL.Client.Event.EventRegister.addEventListener("dispose", function ()
				{
					var undisposed: string[] = [];
					SDL.jQuery.each(Renderers.ViewRenderer.getCreatedViewCounts(),
								function (i, value)
								{
									if (value != 0)
									{
										undisposed.push(i + " (" + value + ")");
									}
								});

					if (Renderers.ControlRenderer != null)
					{
						SDL.jQuery.each(Renderers.ControlRenderer.getCreatedControlCounts(),
									function (i, value)
									{
										if (value != 0)
										{
											undisposed.push(i + " (" + value + ")");
										}
									});
					}

					if (undisposed.length)
					{
						alert("Some views/controls have been left undisposed:\n" + undisposed.join("\n"));
					}
				});
			});
			rm.load(view);	// this is to start loading view's resources while ViewRenderer is being loaded
		}
	}
}