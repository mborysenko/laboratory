/// <reference path="globalize.d.ts" />
/// <reference path="../jQuery/SDL.jQuery.ts" />
/// <reference path="../../Types/Types.d.ts" />
/// <reference path="../../Types/String.d.ts" />
/// <reference path="../../Localization/Localization.ts" />
/// <reference path="../../Event/EventRegister.d.ts" />
/// <reference path="../../Resources/FileResourceHandler.ts" />

// load this module before globalize.js
module SDL
{
	export interface GlobalizeCultures
	{
		[index: string]: GlobalizeCulture;
	}

	export interface SDLGlobalizeStatic extends GlobalizeStatic 
	{
		findClosestCulture(cultureSelector: string, skipCount?: number): GlobalizeCulture;
		localize(key: string, parameters?: string[], cultureSelector?: string): string;
		localize(key: string, parameters?: any, cultureSelector?: string): string;
	};

	eval(Client.Types.OO.enableCustomInheritance);
    export class GlobalizeClass extends Client.Types.ObjectWithEvents implements SDLGlobalizeStatic
	{
		private _globalize: GlobalizeStatic;

		constructor()
		{
			super();

			this._globalize = (<any>window).Globalize;

			Object.defineProperty(this, "cultures", {
					get : function()
						{
							if (!this._globalize)  throw "SDL.Globalize is not initialized.";
							return this._globalize.cultures;
						},
					set : function(value)
						{
							if (!this._globalize)  throw "SDL.Globalize is not initialized.";
							this._globalize.cultures = value;
						},
					enumerable : true
				});

			Object.defineProperty(this, "cultureSelector", {
				get : function()
					{
						if (!this._globalize)  throw "SDL.Globalize is not initialized.";
						return this._globalize.cultureSelector;
					},
				set : function(value)
					{
						if (!this._globalize)  throw "SDL.Globalize is not initialized.";
						this._globalize.cultureSelector = value;
					},
				enumerable : true
			});

			Client.Event.EventRegister.addEventHandler(Client.Localization, "culturechange", (e: Client.Event.Event) =>
			{
				if (this._globalize)
				{
					this.culture(e.data.culture);
				}
				Client.Resources.FileResourceHandler.updateCultureResources(() =>
					{
						this.fireEvent("culturechange", {culture: e.data.culture});
					});
			});
		}

		public initializeNoConflict(): void	// call this method after globalize.js has been loaded
		{
			var _globalize = (<any>window).Globalize;

			if (_globalize != this._globalize)
			{
				(<any>window).Globalize = this._globalize;
				this._globalize = _globalize;
			}

			if (_globalize)
			{
				this.culture(Client.Localization.getCulture());
			}
		}

		public TranslateDate(value: string): string
		{
			var date = new Date(Date.parse(value));
			return this.format(date, "d") + " " + this.format(date, "t");
		}

		// GlobalizeStatic implementation
		public cultures: GlobalizeCultures;
		public cultureSelector: string;
		public init(cultureSelector: string): GlobalizeStatic
		{
			if (!this._globalize)  throw "SDL.Globalize is not initialized.";
			return this._globalize.init.apply(this._globalize, arguments);
		}

		public culture(cultureSelector: string): GlobalizeCulture;
		public culture(cultureSelector: string[]): GlobalizeCulture;
		public culture(): GlobalizeCulture;
		public culture(): GlobalizeCulture
		{
			if (!this._globalize)  throw "SDL.Globalize is not initialized.";

			if (arguments.length == 1)
			{
				var culture = arguments[0];
				if (!culture)
				{
					return;
				}
				else if (SDL.Client.Type.isString(culture) && Client.Localization.getCulture() != culture)
				{
					Client.Localization.setCulture(culture);	// this will trigger the function call again, can exit now
					return;
				}
			}
			
			return this._globalize.culture.apply(this._globalize, arguments);
		}

		public addCultureInfo(cultureName: string, baseCultureName: any, info?: any): void
		{
			if (!this._globalize)  throw "SDL.Globalize is not initialized.";

			if (typeof cultureName !== "string")
			{
				// cultureName argument is optional string. If not specified, assume info is first
				// and only argument. Specified info deep-extends current culture.
				info = cultureName;
				cultureName = baseCultureName = this.culture().name;
			}
			else if (typeof baseCultureName !== "string")
			{
				// baseCultureName argument is optional string. If not specified, assume info is second
				// argument. Specified info deep-extends specified culture.
				// If specified culture does not exist, create by deep-extending default
				info = baseCultureName;
				baseCultureName = !this.cultures[cultureName] ? "default" : cultureName;
			}
			else
			{
				// cultureName and baseCultureName specified
				base = this.cultures[baseCultureName];
			}

			var isNew = !this.cultures[cultureName];
			var base = this.cultures[baseCultureName];
			var prevMessages = isNew ? null : this.cultures[cultureName].messages;

			this.cultures[cultureName] = <GlobalizeCulture>SDL.jQuery.extend(true, {},
					base,
					info,
					{messages: null},
					{messages: SDL.jQuery.extend({}, prevMessages, info.messages)});

			// Make the standard calendar the current culture if it's a new culture
			if (isNew)
			{
				this.cultures[cultureName].calendar = this.cultures[cultureName].calendars.standard;
			}
		}

		public findClosestCulture(cultureSelector: string, skipCount?: number): GlobalizeCulture
		{
			if (!this._globalize) throw "SDL.Globalize is not initialized.";

			var match: GlobalizeCulture;
			if (cultureSelector == undefined)
			{
				cultureSelector = this._globalize.cultureSelector;
			}

			if (cultureSelector)
			{
				var names: any = Client.Type.isString(cultureSelector) ? cultureSelector.split(",") : <any>cultureSelector;

				if (Client.Type.isArray(names))
				{
					var lang: string,
						cultures = this._globalize.cultures,
						list: string[] = names,
						i: number, l = list.length,
						prioritized: {lang: string; pri: number;}[] = [];
					for (i = 0; i < l; i++)
					{ 
						cultureSelector = SDL.jQuery.trim(list[i]);
						var pri: number, parts = cultureSelector.split(";");
						lang = SDL.jQuery.trim(parts[0]);
						if (parts.length === 1)
						{
							pri = 1;
						}
						else
						{
							cultureSelector = SDL.jQuery.trim(parts[1]);
							if (cultureSelector.indexOf("q=") === 0)
							{
								cultureSelector = cultureSelector.substr(2);
								pri = parseFloat(cultureSelector);
								pri = isNaN(pri) ? 0 : pri;
							}
							else
							{
								pri = 1;
							}
						}
						prioritized.push({ lang: lang, pri: pri }); 
					}
					prioritized.sort(function(a, b)
					{
						if (a.pri < b.pri)
						{
							return 1;
						}
						else if (a.pri > b.pri)
						{
							return -1;
						}
						return 0;
					});
					// exact match
					for (i = 0; i < l; i++)
					{
						lang = prioritized[i].lang;
						match = (<GlobalizeCultures>cultures)[lang];
						if (match && (!skipCount || !skipCount--))	// !skipCount-- makes sure we decrease the count after a match has been found
						{
							return match;
						}
					}

					// neutral language match
					for (i = 0; i < l; i++)
					{
						lang = prioritized[i].lang;
						do
						{
							var index = lang.lastIndexOf("-");
							if (index === -1)
							{
								break;
							}
							// strip off the last part. e.g. en-US => en
							lang = lang.substr(0, index);
							match = (<GlobalizeCultures>cultures)[lang];
							if (match && (!skipCount || !skipCount--))	// !skipCount-- makes sure we decrease the count after a match has been found
							{
								return match;
							}
						}
						while (1);
					}

					// last resort: match first culture using that language
					for (i = 0; i < l; i++)
					{
						lang = prioritized[i].lang;
						for (var cultureKey in cultures)
						{
							var culture = cultures[cultureKey];
							if (culture.language === lang && (!skipCount || !skipCount--))	// !skipCount-- makes sure we decrese the count after a match has been found
							{
								return culture;
							}
						}
					}
				}
				else if (SDL.Client.Type.isObject(names))
				{
					if (!skipCount)
					{
						return names;
					}
					else
					{
						return this.findClosestCulture((<any>names).name, skipCount);
					}
				}
			}
			return !skipCount ? (<GlobalizeCultures>this._globalize.cultures)["default"] : null;
		}

		public format(value: any, format: string, cultureSelector?: string): string
		{
			if (!this._globalize)  throw "SDL.Globalize is not initialized.";
			return this._globalize.format.apply(this._globalize, arguments);
		}

		public localize(key: string, parameters?: string[], cultureSelector?: string): string
		{
			if (key)
			{
				if (!this._globalize)  throw "SDL.Globalize is not initialized.";

				if (!cultureSelector && parameters && !Client.Type.isArray(parameters))
				{
					cultureSelector = <string>(<any>parameters);
					parameters = null;
				}

				var ckipCount = 0;
				var culture: GlobalizeCulture;
				var message: string;
				do {
					culture = this.findClosestCulture( cultureSelector, ckipCount++ );
					if (culture)
					{
						message = culture.messages[ key ];
						if (message != null)
						{
							if (Client.Type.isArray(parameters))
							{
								message = Client.Types.String.format(message, parameters);
							}
							return message;
						}
					}
				} while (culture);
			}
		}

		public parseDate(value: string, formats?: any, cultureSelector?: string): Date
		{
			if (!this._globalize)  throw "SDL.Globalize is not initialized.";
			return this._globalize.parseDate.apply(this._globalize, arguments);
		}

		public parseInt(value: string, radix?: number, cultureSelector?: string): number
		{
			if (!this._globalize)  throw "SDL.Globalize is not initialized.";
			return this._globalize.parseInt.apply(this._globalize, arguments);
		}

		public parseFloat(value: string, radix?: number, cultureSelector?: string): number
		{
			if (!this._globalize)  throw "SDL.Globalize is not initialized.";
			return this._globalize.parseFloat.apply(this._globalize, arguments);
		}
    }
	SDL.Client.Types.OO.createInterface("SDL.GlobalizeClass", GlobalizeClass);
}

module SDL
{
	export var Globalize: GlobalizeClass = new GlobalizeClass();
}