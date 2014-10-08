/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />

module SDL.UI.Controls
{
	export interface IButtonIconClassOption
	{
		dark: string;
		light: string;
	}

	export enum ButtonPurpose
	{
		GENERAL = <any>"general",
		CONFIRM = <any>"confirm",
		CRITICAL = <any>"critical",
		PROCEED = <any>"proceed",
		TOGGLE = <any>"toggle",
		TOGGLE_IRREVERSIBLE = <any>"toggle_irreversible"
	}

	export enum ButtonStyle
	{
		DEFAULT = <any>"default",
		ICON = <any>"icon",
		ICON_ROUND = <any>"round"
	}

	export enum ButtonToggleState
	{
		OFF = <any>"off",
		ON = <any>"on"
	}

	export interface IButtonOptions
	{
		purpose?: ButtonPurpose;
		style?: ButtonStyle;
		state?: ButtonToggleState;
		iconClass?: IButtonIconClassOption;
		disabled?: boolean;
	}

	export interface IButtonProperties extends SDL.UI.Core.Controls.IControlBaseProperties
	{
		options: IButtonOptions;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class Button extends SDL.UI.Core.Controls.ControlBase
	{
		public properties: IButtonProperties;

		private $element: JQuery;
		private pressed: boolean;
		private $icon: JQuery;
		private tabIndex: string;
		private initialTabIndex: string;

		constructor(element: HTMLElement, options?: IButtonOptions)
		{
			super(element, options || {});
		}

		$initialize(): void
		{
			this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

			var p = this.properties;
			var $element = this.$element = SDL.jQuery(p.element);

			p.options = SDL.jQuery.extend({purpose: ButtonPurpose.GENERAL, style: ButtonStyle.DEFAULT}, p.options);

			this.initialTabIndex = $element.attr("tabIndex");
			this.tabIndex = this.initialTabIndex || "0";
			if (p.options.disabled != null)
			{
				p.options.disabled = p.options.disabled.toString() == "true";
			}
			else
			{
				p.options.disabled = this.isDisabled();
			}

			this.updateDisabledState();
			this.updateIconMarkup();

			$element.on("mousedown", this.getDelegate(this.onMouseDown))
				.on("mouseup", this.getDelegate(this.onMouseUp))
				.on("mouseleave", this.getDelegate(this.onMouseLeave))
				.on("keydown", this.getDelegate(this.onKeyDown))
				.on("keyup", this.getDelegate(this.onKeyUp))
				.on("blur", this.getDelegate(this.onMouseLeave))
				.addClass(this.getPurposeClassName(p.options.purpose))
				.addClass("sdl-button-style-" + (p.options.style || ButtonStyle.DEFAULT));

			this.setStateStyle();
		}

		public update(options?: IButtonOptions): void
		{
			if (options)
			{
				var p = this.properties;
				var prevOptions: IButtonOptions = SDL.jQuery.extend({}, p.options, { disabled: this.isDisabled() });

				this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

				options = p.options = SDL.jQuery.extend(true, {}, prevOptions, p.options);

				var changedProperties: string[] = [];

				if (prevOptions.purpose != options.purpose)
				{
					this.$element.removeClass(this.getPurposeClassName(prevOptions.purpose))
						.addClass(this.getPurposeClassName(options.purpose));
					changedProperties.push("purpose");
				}

				if (prevOptions.style != options.style)
				{
					this.$element.removeClass("sdl-button-style-" + prevOptions.style)
						.addClass("sdl-button-style-" + options.style);
					changedProperties.push("style");
				}

				if (options.iconClass && (options.iconClass.dark || options.iconClass.light))
				{
					if (prevOptions.iconClass)
					{
						var changed = false;
						if (prevOptions.iconClass.dark != options.iconClass.dark)
						{
							if (this.$icon)
							{
								this.$icon.removeClass(options.iconClass.dark);
								changed = true;
							}
						}

						if (prevOptions.iconClass.light != options.iconClass.light)
						{
							if (this.$icon)
							{
								this.$icon.removeClass(options.iconClass.light);
								changed = true;
							}
						}

						if (changed)
						{
							changedProperties.push("iconClass");
						}
					}
					else
					{
						changedProperties.push("iconClass");
					}
				}

				if (options.disabled != null)
				{
					options.disabled = options.disabled.toString() == "true";
					if (prevOptions.disabled == null || prevOptions.disabled != options.disabled)
					{
						this.updateDisabledState();
						changedProperties.push("disabled");
					}
				}

				this.updateIconMarkup();
				this.setStateStyle();

				for (var i = 0, len = changedProperties.length; i < len; i++)
				{
					this.fireEvent("propertychange", {property: changedProperties[i], value: (<any>options)[changedProperties[i]]});
				}
			}
		}

		public isOn(): boolean
		{
			var options = this.properties.options;
			if (options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE)
			{
				return options.state == ButtonToggleState.ON;
			}
		}

		public isOff(): boolean
		{
			var options = this.properties.options;
			if (options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE)
			{
				return options.state != ButtonToggleState.ON;	// will return true for undefined state too
			}
		}

		public toggleOn(): void
		{
			var options = this.properties.options;
			if (options.state != ButtonToggleState.ON)
			{
				options.state = ButtonToggleState.ON;
				if (options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE)
				{
					this.setStateStyle();
					this.fireEvent("propertychange", {property: "state", value: ButtonToggleState.ON});
					this.fireEvent("click");
				}
			}
		}

		public toggleOff(): void
		{
			var options = this.properties.options;
			if (options.state == ButtonToggleState.ON)
			{
				options.state = ButtonToggleState.OFF;
				if (options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE)
				{
					this.setStateStyle();
					this.fireEvent("propertychange", {property: "state", value: ButtonToggleState.OFF});
					this.fireEvent("click");
				}
			}
		}

		public disable(): void
		{
			if (!this.isDisabled())
			{
				this.properties.options.disabled = true;
				this.updateDisabledState();
				this.setStateStyle();
				this.fireEvent("propertychange", {property: "disabled", value: true});
			}
		}

		public enable(): void
		{
			if (this.isDisabled())
			{
				this.properties.options.disabled = false;
				this.updateDisabledState();
				this.setStateStyle();
				this.fireEvent("propertychange", {property: "disabled", value: false});
			}
		}

		public isDisabled(): boolean
		{
			return !!this.$element.attr("disabled");
		}

		private updateDisabledState()
		{
			var p = this.properties;
			if (p.options.disabled)
			{
				this.tabIndex = this.$element.attr("tabIndex") || "0";
				this.$element.attr("disabled", "true")
					.removeAttr("tabIndex");
			}
			else
			{
				this.$element.removeAttr("disabled")
					.attr("tabIndex", this.tabIndex);
			}
		}

		private onMouseDown(e: JQueryEventObject)
		{
			if (e.which == 1)
			{
				this.onDown();
			}
		}

		private onMouseUp(e: JQueryEventObject)
		{
			if (e.which == 1)
			{
				this.onUp();
			}
		}

		private onMouseLeave(e: JQueryEventObject)
		{
			if (this.pressed)
			{
				this.pressed = false;
				this.setStateStyle();
			}
		}

		private onKeyDown(e: JQueryEventObject)
		{
			if (e.which == SDL.UI.Core.Event.Constants.Keys.SPACE || e.which == SDL.UI.Core.Event.Constants.Keys.ENTER)
			{
				this.onDown();
			}
		}

		private onKeyUp(e: JQueryEventObject)
		{
			if (e.which == SDL.UI.Core.Event.Constants.Keys.SPACE || e.which == SDL.UI.Core.Event.Constants.Keys.ENTER)
			{
				this.onUp();
			}
		}

		private onDown()
		{
			if (!this.pressed && !this.isDisabled())
			{
				this.pressed = true;
				this.setStateStyle();
			}
		}

		private onUp()
		{
			if (this.pressed && !this.isDisabled())
			{
				var options = this.properties.options;

				this.pressed = false;

				if (options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE)
				{
					if (options.state != ButtonToggleState.ON)
					{
						this.toggleOn();
					}
					else
					{
						if (options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE)
						{
							this.setStateStyle();
						}
						else
						{
							this.toggleOff();
						}
					}
				}
				else
				{
					this.setStateStyle();
					this.fireEvent("click");
				}
			}
		}

		private setStateStyle()
		{
			var options = this.properties.options;

			if (this.pressed)
			{
				this.$element.addClass("sdl-button-pressed");
			}
			else
			{
				this.$element.removeClass("sdl-button-pressed");
			}

			if (options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE)
			{
				if (options.state == ButtonToggleState.ON)
				{
					this.$element.removeClass("sdl-button-toggle-off")
						.addClass("sdl-button-toggle-on");
				}
				else
				{
					this.$element.removeClass("sdl-button-toggle-on")
						.addClass("sdl-button-toggle-off");
				}
			}
			else
			{
				this.$element.removeClass("sdl-button-toggle-on")
					.removeClass("sdl-button-toggle-off");
			}

			if (this.$icon && options.iconClass)
			{
				if (this.isDisabled() ||
					(!this.pressed &&
						(
							!options.purpose || options.purpose == ButtonPurpose.GENERAL ||
							(
								(options.purpose == ButtonPurpose.TOGGLE || options.purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE) &&
								options.state != ButtonToggleState.ON
							)
						)
					))
				{
					if (options.iconClass.light)
					{
						this.$icon.removeClass(options.iconClass.light);
					}
					if (options.iconClass.dark)
					{
						this.$icon.addClass(options.iconClass.dark);
					}
				}
				else
				{
					if (options.iconClass.dark)
					{
						this.$icon.removeClass(options.iconClass.dark);
					}
					if (options.iconClass.light)
					{
						this.$icon.addClass(options.iconClass.light);
					}
				}
			}
		}

		private updateIconMarkup()
		{
			var options = this.properties.options;
			if ((options.style == ButtonStyle.ICON || options.style == ButtonStyle.ICON_ROUND) ||
					(options.iconClass && (options.iconClass.dark || options.iconClass.light)))
			{
				if (!this.$icon)
				{
					this.$icon = SDL.jQuery("<span>&nbsp;</span>");
					this.$icon.prependTo(this.$element);
					this.$icon.addClass("sdl-button-image");
				}
			}
			else
			{
				this.removeIconMarkup();
			}
		}

		private removeIconMarkup()
		{
			if (this.$icon)
			{
				this.$icon.remove();
				this.$icon = null;
			}
		}

		private getPurposeClassName(purpose: ButtonPurpose): string
		{
			return "sdl-button-purpose-" + (purpose == ButtonPurpose.TOGGLE_IRREVERSIBLE ? ButtonPurpose.TOGGLE : (purpose || ButtonPurpose.GENERAL));
		}
	}

	Button.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Button$disposeInterface()
	{
		var $element: JQuery = this.$element;
		var options: IButtonOptions = this.properties.options;

		$element.off("mousedown", (<Button>this).getDelegate(this.onMouseDown))
			.off("mouseup", (<Button>this).getDelegate(this.onMouseUp))
			.off("mouseleave", (<Button>this).getDelegate(this.onMouseLeave))
			.off("keydown", this.getDelegate(this.onKeyDown))
			.off("keyup", this.getDelegate(this.onKeyUp))
			.off("blur", this.getDelegate(this.onMouseLeave)).removeClass("sdl-button-pressed")
			.removeClass(this.getPurposeClassName(options.purpose))
			.removeClass("sdl-button-style-" + (options.style || ButtonStyle.DEFAULT))
			.removeClass("sdl-button-toggle-on").removeClass("sdl-button-toggle-off");

		if (!this.initialTabIndex)
		{
			$element.removeAttr("tabIndex");
		}
		else
		{
			$element.attr("tabIndex", this.initialTabIndex);
		}

		this.removeIconMarkup();

		this.$element = null;
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Button", Button);
}