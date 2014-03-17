/// <reference path="../../SDL.Client.UI.Core/Renderers/ViewRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../../SDL.Client.Core/Event/EventRegister.d.ts" />

module SDL.UI.Core.Knockout.Renderers
{
	class KnockoutRenderer implements SDL.UI.Core.Renderers.ITemplateRenderer
	{
		render(templateContent: string, target: HTMLElement, options: any, callback?: () => void)
		{
			if (templateContent && target)
			{
				var $target = SDL.jQuery(target);
				$target.html(templateContent);
				ko.applyBindingsToDescendants(options, target);
			}

			if (callback)
			{
				callback();
			}
		}
	};

	SDL.Client.Event.EventRegister.addEventHandler(SDL.Client.Event.EventRegister, "beforedispose", function()
		{
			ko.cleanNode(document.body);
		});

	SDL.UI.Core.Renderers.ViewRenderer.registerTemplateRenderer("text/html+knockout", new KnockoutRenderer());
}