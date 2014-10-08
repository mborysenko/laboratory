/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />

module SDL.UI.Controls
{
	export interface ITextInputOptions
	{
		invalid?: boolean;
	}

	export interface ITextInputProperties extends SDL.UI.Core.Controls.IControlBaseProperties
	{
		options: ITextInputOptions;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class TextInput extends SDL.UI.Core.Controls.ControlBase
	{
		properties: ITextInputProperties;

		private _$elem: JQuery;

		$initialize()
		{
			this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

			var p = this.properties;
			var $elem = this._$elem = SDL.jQuery(p.element);
			var opts = p.options = SDL.jQuery.extend({}, p.options);

			var type = $elem.prop("type");
			if (type == "text" || type == "email" || type == "url" || type == "password")
			{
				$elem.addClass("sdl-textinput");

				opts.invalid = opts.invalid != undefined ? opts.invalid.toString() == "true" : false;
				this._updateInvalidState();
			}
		}

		public setInvalid(value: boolean): void
		{
			var oldValue = this.properties.options.invalid;
			this.properties.options.invalid = value = value != undefined ? value.toString() == "true" : false;
			if (oldValue != value)
			{
				this._updateInvalidState();
				this.fireEvent("propertychange", { property: "invalid", value: value });
			}
		}

		public isInvalid(): boolean
		{
			return this.properties.options.invalid;
		}

		public update(options?: ITextInputOptions): void
		{
			if (options)
			{
				var p = this.properties;
				var prevOptions = SDL.jQuery.extend({}, p.options);

				this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

				if (options.invalid != undefined)
				{
					options.invalid = options.invalid.toString() == "true";
					if (prevOptions.invalid !== options.invalid)
					{
						this._updateInvalidState();
						this.fireEvent("propertychange", { property: "invalid", value: options.invalid });
					}
				}
			}
		}

		private _updateInvalidState(): void
		{
			if (this.properties.options.invalid)
			{
				this._$elem.addClass("invalid");
			}
			else
			{
				this._$elem.removeClass("invalid");
			}
		}
	}

	TextInput.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$TextInput$disposeInterface()
	{
		this._$elem.removeClass("sdl-textinput invalid");
		this._$elem = undefined;
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.TextInput", TextInput);
}