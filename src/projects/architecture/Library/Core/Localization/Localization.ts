/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Types/ObjectWithEvents.ts" />

module SDL.Client
{
	eval(Types.OO.enableCustomInheritance);
	export class LocalizationClass extends Types.ObjectWithEvents
	{
		private _culture;

		public setCulture(value: string): void
		{
			if (this._culture != value)
			{
				this._culture = value;
				this.fireEvent("culturechange", {culture: value});
			}
		}

		public getCulture(): string
		{
			return this._culture;
		}
	}
	SDL.Client.Types.OO.createInterface("SDL.Client.LocalizationClass", LocalizationClass);
}

module SDL.Client
{
	// has to be in a separate module definition, otherwise creating an instance of the interface fails
	export var Localization = new LocalizationClass();
}