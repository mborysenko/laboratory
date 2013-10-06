/// <reference path="..\..\SDL.Client.Core\Types\Types.d.ts" />
/// <reference path="..\..\SDL.Client.Core\Types\DisposableObject.d.ts" />
/// <reference path="..\..\SDL.Client.Core\Libraries\Globalize\SDL.Globalize.d.ts" />
/// <reference path="..\..\SDL.Client.Core\Event\EventRegister.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />

module SDL.UI.Core.Knockout.ViewModels
{
	eval(Client.Types.OO.enableCustomInheritance);

	var culture: KnockoutObservable<string> = ko.observable(SDL.Globalize.culture().name);
	SDL.Client.Event.EventRegister.addEventHandler(SDL.Globalize, "culturechange", (e: Client.Event.Event) =>
	{
		culture(e.data.culture);
	});

	export class ViewModelBase extends SDL.Client.Types.DisposableObject
	{
		public culture: KnockoutObservable<string> = culture;

		public localize(resource: string, parameters?: string[]): string
		{
			culture();	// this adds a dependency on the culture
			return SDL.Globalize.localize(resource, parameters);
		}

		public format(value: number, format?: string): string;
		public format(value: Date, format?: string): string;
		public format(value: any, format?: string): string
		{
			return SDL.Globalize.format(value, format);
		}
	}
	SDL.Client.Types.OO.createInterface("SDL.UI.Core.Knockout.ViewModels.ViewModelBase", ViewModelBase);
}
