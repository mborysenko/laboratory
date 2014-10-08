/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/ConfigurationManager/ConfigurationManager.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/DisposableObject.d.ts" />
/// <reference path="../../SDL.Client.Core/Libraries/Globalize/SDL.Globalize.d.ts" />
/// <reference path="../../SDL.Client.Core/Event/EventRegister.d.ts" />
/// <reference path="../../SDL.Client.Core/Resources/FileResourceHandler.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Views/ViewBase.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />

module SDL.UI.Core.Knockout.ViewModels
{
	export interface ITemplateResource
	{
		url: string;
		version: string;
	}

	eval(Client.Types.OO.enableCustomInheritance);

	var culture: KnockoutObservable<string> = ko.observable(SDL.Globalize.culture().name);
	SDL.Client.Event.EventRegister.addEventHandler(SDL.Globalize, "culturechange", (e: Client.Event.Event) =>
	{
		culture(e.data.culture);
	});

	export class ViewModelBase extends SDL.Client.Types.DisposableObject
	{
		private view: SDL.UI.Core.Views.ViewBase;

		public culture: KnockoutObservable<string> = culture;
		public template: ITemplateResource;

		constructor(view?: SDL.UI.Core.Views.ViewBase)
		{
			super();

			if (view)
			{
				var templateResource = view.getTemplateResource();
				var url = templateResource.url;
				if (url && url.indexOf("~/") == 0)
				{
					url = SDL.Client.Types.Url.combinePath(
							SDL.Client.Application.applicationHostCorePath || SDL.Client.Configuration.ConfigurationManager.corePath,
							url.slice(2));
				}

				this.template = <ITemplateResource>{
						url: SDL.Client.Types.Url.getAbsoluteUrl(url),
						version: templateResource.version
					};
			}
		}

		public localize(resource: string, parameters?: string[]): string
		{
			culture();	// this adds a dependency on the culture
			return SDL.Globalize.localize(resource, parameters);
		}

		public format(value: number, format?: string): string;
		public format(value: Date, format?: string): string;
		public format(value: any, format?: string): string
		{
			culture();	// this adds a dependency on the culture
			return SDL.Globalize.format(value, format);
		}

		public setting(name: string): string
		{
			return SDL.Client.Configuration.ConfigurationManager.getAppSetting(name);
		}

		public path(path?: string): string
		{
			return this.template ? SDL.Client.Types.Url.combinePath(this.template.url, path) : path;
		}
	}
	SDL.Client.Types.OO.createInterface("SDL.UI.Core.Knockout.ViewModels.ViewModelBase", ViewModelBase);
}