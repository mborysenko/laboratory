/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />

module SDL.UI.Controls
{
	export enum MessageType
	{
		INFO = <any>"info",
		QUESTION = <any>"question",
		WARNING = <any>"warning",
		ERROR = <any>"error",
		PROGRESS = <any>"progress",
		GOAL = <any>"goal"
	}

	export interface IMessageOptions
	{
		type: MessageType;
		title: string;
	}

	export interface IMessageProperties extends SDL.UI.Core.Controls.IControlBaseProperties
	{
		options: IMessageOptions;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class Message extends SDL.UI.Core.Controls.ControlBase
	{
		public properties: IMessageProperties;

		private $element: JQuery;
		private $title: JQuery;

		constructor(element: HTMLElement, options?: IMessageOptions)
		{
			super(element, options || {});
		}

		$initialize(): void
		{
			this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

			var p = this.properties;
			var $element = this.$element = SDL.jQuery(p.element);
			p.options = SDL.jQuery.extend({}, p.options);

			if (p.options.title)
			{
				this.$title = SDL.jQuery("<div class='sdl-message-title'></div>").prependTo($element).text(p.options.title);
			}

			if (p.options.type)
			{
				$element.addClass("sdl-message-" + p.options.type);
			}

			$element.addClass("sdl-message");
		}

		public update(options?: IMessageOptions): void
		{
			var p = this.properties;
			var prevOptions = p.options;
			options = SDL.jQuery.extend({}, options);

			this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

			if (p.options.title != prevOptions.title)
			{
				if (p.options.title)
				{
					if (!this.$title)
					{
						this.$title = SDL.jQuery("<div class='sdl-message-title'></div>").prependTo(this.$element);
					}
					this.$title.text(p.options.title);
				}
				else if (this.$title)
				{
					this.$title.remove();
					this.$title = null;
				}
			}

			if (p.options.type != prevOptions.type)
			{
				if (prevOptions.type)
				{
					this.$element.removeClass("sdl-message-" + prevOptions.type);
				}

				if (p.options.type)
				{
					this.$element.addClass("sdl-message-" + p.options.type);
				}
			}


		}

		private cleanUp()
		{
			var $element = this.$element;
			var options: IMessageOptions = this.properties.options;

			this.$element.removeClass("sdl-message sdl-message-info sdl-message-question sdl-message-warning sdl-message-error sdl-message-progress sdl-message-goal");

			if(this.$title)
			{
				this.$title.remove();
				this.$title = null;
			}

			this.$element = null;
		}
	}

	Message.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Message$disposeInterface()
	{
		this.cleanUp();
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Message", Message);
} 