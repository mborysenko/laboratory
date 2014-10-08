/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
/// <reference path="../../SDL.Client.Core/ConfigurationManager/ConfigurationManager.d.ts" />

module SDL.UI.Controls
{
	export enum ActivityIndicatorScreen
	{
		BRIGHT = <any>"bright",
		DARK = <any>"dark",
		NONE = <any>"none"
	}

	export enum ActivityIndicatorSize
	{
		LARGE = <any>"large",
		MEDIUM = <any>"medium",
		SMALL = <any>"small"
	}

	export interface IActivityIndicatorOptions
	{
		text: string;
		size: ActivityIndicatorSize;
		screen: ActivityIndicatorScreen;
		//legacyMode: boolean;	<-- a hidden feature for demo purposes only
	}

	export interface IActivityIndicatorProperties extends SDL.UI.Core.Controls.IControlBaseProperties
	{
		options: IActivityIndicatorOptions;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class ActivityIndicator extends SDL.UI.Core.Controls.ControlBase
	{
		public properties: IActivityIndicatorProperties;

		private $element: JQuery;
		private $childElement: JQuery;
		private rotateTimeout: number;
		private screenClass: string;
		private sizeClass: string;

		constructor(element: HTMLElement, options?: IActivityIndicatorOptions)
		{
			super(element, options || {});
		}

		$initialize(): void
		{
			this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

			var p = this.properties;
			var $element = this.$element = SDL.jQuery(p.element);
			/*
				<[contro-element] class="sdl-activityindicator">
					<div class='sdl-activityindicator-child'>
						<div></div>		<!-- text -->
						<div></div>		<!-- rotated circle -->
					</div>
				</[control-element]>
			*/

			this.screenClass = (p.options.screen == ActivityIndicatorScreen.NONE)
						? ""
						: "sdl-activityindicator-child-screen-" + (p.options.screen || ActivityIndicatorScreen.BRIGHT);

			this.sizeClass = (!p.options.size || p.options.size == ActivityIndicatorSize.LARGE)
						? "sdl-activityindicator-child-size-large"
						: "sdl-activityindicator-child-size-" + p.options.size;

			$element.addClass("sdl-activityindicator" +
				((<any>p.options).legacyMode || ((<any>p.options).legacyMode !== false &&
						SDL.Client.Configuration && SDL.Client.Configuration.ConfigurationManager &&
						SDL.Client.Configuration.ConfigurationManager.getAppSetting("activityIndicatorLegacyMode") == "true")
					? "-legacy"
					: ""));
			this.$childElement = SDL.jQuery("<div class='sdl-activityindicator-child" +
									(this.screenClass ? " " + this.screenClass : "") +
									(this.sizeClass ? " " + this.sizeClass : "") +
					"'><div></div><div><svg><circle cx='10' cy='10' r='8'/><path d='M10,2 A8,8 0 0,1 18,10'/><path d='M17.996,9.8 A8,8 0 0,1 10,18'/></svg></div></div>")
				.appendTo($element);
			this.$childElement.children(":first").text((p.options.text || "").trim());
			if (p.element.style.animation == undefined && (<any>p.element.style).webkitAnimation == undefined)
			{
				// IE9 does not support animation -> use javascript
				var position = 0;
				var step = 12;
				var rotateElementStyle = this.$childElement.children(":last")[0].style;

				var scheduleRotation = () =>
				{
					this.rotateTimeout = window.setTimeout(rotate, (<any>p.options).legacyMode ? 33 : 17);
				};

				var rotate = function()
				{
					position += step;
					if (position >= 360)
					{
						position -= 360;
					}
					rotateElementStyle.msTransform = "rotate(" + position + "deg)";
					scheduleRotation();
				};

				scheduleRotation();
			}
		}

		public update(options?: IActivityIndicatorOptions): void
		{
			if (options)
			{
				var p = this.properties;
				var prevOptionsText = p.options.text;
				var prevOptionsScreen = p.options.screen;
				var prevOptionsSize = p.options.size;
				var prevOptionsLegacy = (<any>p.options).legacyMode;

				this.callBase("SDL.UI.Core.Controls.ControlBase", "update", arguments);

				var changedProperties: string[] = [];

				if (prevOptionsText != options.text)
				{
					changedProperties.push("text");
					this.$childElement.children(":first").text((options.text || "").trim());
				}

				if (prevOptionsScreen != options.screen)
				{
					changedProperties.push("screen");

					if (this.screenClass)
					{
						this.$childElement.removeClass(this.screenClass);
					}

					this.screenClass = (p.options.screen == ActivityIndicatorScreen.NONE)
						? ""
						: "sdl-activityindicator-child-screen-" + (p.options.screen || ActivityIndicatorScreen.BRIGHT);

					if (this.screenClass)
					{
						this.$childElement.addClass(this.screenClass);
					}
				}

				if (prevOptionsSize != options.size)
				{
					changedProperties.push("size");

					if (this.sizeClass)
					{
						this.$childElement.removeClass(this.sizeClass);
					}

					this.sizeClass = (!p.options.size || p.options.size == ActivityIndicatorSize.LARGE)
						? "sdl-activityindicator-child-size-large"
						: "sdl-activityindicator-child-size-" + p.options.size;

					if (this.sizeClass)
					{
						this.$childElement.addClass(this.sizeClass);
					}
				}

				if (prevOptionsLegacy != (<any>options).legacyMode)
				{
					changedProperties.push("legacy");
					var app = SDL.Client.Application;
					var isLegacy = (<any>options).legacyMode || ((<any>options).legacyMode !== false &&
						SDL.Client.Configuration.ConfigurationManager.getAppSetting("activityIndicatorLegacyMode") == "true");

					this.$element.removeClass("sdl-activityindicator" + (isLegacy ? "" : "-legacy"))
						.addClass("sdl-activityindicator" + (isLegacy ? "-legacy" : ""));
				}

				for (var i = 0, len = changedProperties.length; i < len; i++)
				{
					this.fireEvent("propertychange", {property: changedProperties[i], value: (<any>options)[changedProperties[i]]});
				}
			}
		}

	}

	ActivityIndicator.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$ActivityIndicator$disposeInterface()
	{
		if (this.rotateTimeout)
		{
			window.clearTimeout(this.rotateTimeout);
			this.rotateTimeout = null;
		}
		if (this.$childElement)
		{
			this.$childElement.remove();
			this.$childElement = null
		}
		if (this.$element)
		{
			this.$element.removeClass("sdl-activityindicator sdl-activityindicator-legacy");
			this.$element = null;
		}
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.ActivityIndicator", ActivityIndicator);
}