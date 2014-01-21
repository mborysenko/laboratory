/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />

module SDL.UI.Controls
{
	export interface ITooltipOptions
	{
		trackMouse?: boolean;
		relativeTo?: string;	// "element", "mouse", "page"
		position?: string;		// "top", "left", "bottom", "right" - only applied when relativeTo === "element"
		offsetX?: number;
		offsetY?: number;
		fitToScreen?: boolean;
		delay?: number;
		showWhenCursorStationary?: boolean;
		showIfNoOverflow?: boolean;
		content?: string;
	}

	interface IMouse
	{
		x: number;
		y: number;
		moving: boolean;
		movementTimer: number;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class Tooltip extends SDL.UI.Core.Controls.ControlBase
	{
		private static tooltipTimer: number = 0;
		private static shownTooltip: Tooltip = null;

		private $: JQueryStatic;
		private $element: JQuery;
		private settings: ITooltipOptions;
		private mouse: IMouse = {
				x: 0,
				y: 0,
				moving: false,
				movementTimer: 0
			};
		private shown: boolean = false;

		$initialize(): void
		{
			var p = this.properties;
			this.$ = p.jQuery || SDL.jQuery || jQuery;
			var $element = this.$element = this.$(p.element);

			var settings: ITooltipOptions = this.settings = this.$.extend({
				trackMouse: false,
				relativeTo: "element", // "element", "mouse", "page"
				position: "bottom", // "top", "left", "bottom", "right" - only applied when relativeTo === "element" NOTE: currently not supported - defaults to "bottom"
				offsetX: 0,
				offsetY: 20,
				fitToScreen: true,
				delay: 500,
				showWhenCursorStationary: false,
				showIfNoOverflow: true,
				content: null
			}, p.options);

			// set the content, either from the settings or from the 'tooltip' attribute
			if (settings.content !== null)
			{
				$element.attr("tooltip", settings.content);
			}

			$element.mouseenter(e => this.onMouseEnter(e));
			$element.mouseleave(() => this.onMouseLeave());
			$element.mousemove(e => this.onMouseMove(e));

			this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");
		}

		public update(options?: ITooltipOptions): void
		{
			this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

			this.settings = this.$.extend(this.settings, this.properties.options);

			// set the content, either from the settings or from the 'tooltip' attribute
			if (this.settings.content !== null)
			{
				this.$element.attr("tooltip", this.settings.content);
			}

			this.fireEvent("update");
		}

		/**
			Show the tooltip either immediately, or after a short delay depending on the settings
		*/
		public showTooltip(): void
		{
			if (this.settings.delay)
			{
				Tooltip.tooltipTimer = setTimeout(() => this.doShowTooltip(), this.settings.delay);
			}
			else
			{
				this.doShowTooltip();
			}
		}

		/**
            Removes the tooltip from the DOM
        */
		public hideTooltip(): void
		{
			if (this.shown)
			{
				Tooltip.shownTooltip = null;
				this.shown = false;
				this.fireEvent("hide");
				this.fireEvent("propertychange", { property: "shown", value: false});
				this.$(".ui-tooltip").remove();
			}
		}

		/**
            Handles mouseenter events
        */
		private onMouseEnter(e: JQueryMouseEventObject): void
		{
			this.trackMouse(e);
			clearTimeout(Tooltip.tooltipTimer);

			if (this.settings.showIfNoOverflow)
			{
				this.showTooltip();
			}
			else
			{
				var overflowElement: HTMLElement;
				var overflowSelector = this.$element.attr("tooltipoverflow");

				if (overflowSelector)
				{
					overflowElement = this.$element.find(overflowSelector)[0];
				}
				else
				{
					overflowElement = this.$element[0];
				}

				if (overflowElement.offsetWidth < overflowElement.scrollWidth)
				{
					this.showTooltip();
				}
			}
		}

		/**
            Handles mouseleave events
        */
		private onMouseLeave()
		{
			clearTimeout(Tooltip.tooltipTimer);
			if (!this.getDisposed())
			{
				this.hideTooltip();
				this.$element.parent().trigger("mouseenter");
			}
		}

		/**
			Track the mouse movements so that we can reposition the tooltips precisely
		*/
		private onMouseMove(e: JQueryMouseEventObject)
		{
			if (this.mouse.movementTimer)
			{
				clearTimeout(this.mouse.movementTimer);
			}

			this.mouse.moving = true;
			this.trackMouse(e);

			if (this.settings.trackMouse)
			{
				// from https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
				var windowScrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || <HTMLElement>document.body.parentNode || document.body).scrollLeft;
				var windowScrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || <HTMLElement>document.body.parentNode || document.body).scrollTop;

				this.$(".ui-tooltip")
					.css("left", (this.mouse.x + this.settings.offsetX - windowScrollX) + "px")
					.css("top", (this.mouse.y + this.settings.offsetY - windowScrollY) + "px");
			}

			this.mouse.movementTimer = setTimeout(() => { this.mouse.moving = false; }, 100);
		}
		
		/**
            Show the tooltip
        */
		private doShowTooltip(): void
		{
			var $element = this.$element;
			var settings = this.settings;
            var x = 0, y = 0;
			var content = $element.attr("tooltip");

			// from https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
			var windowScrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || <HTMLElement>document.body.parentNode || document.body).scrollLeft;
			var windowScrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || <HTMLElement>document.body.parentNode || document.body).scrollTop;

			switch (settings.relativeTo)
			{
				case "element":
					x = $element.position().left + parseInt($element.css("margin-left")) + settings.offsetX - windowScrollX;
					y = $element.position().top + parseInt($element.css("margin-top")) + $element.outerHeight() + settings.offsetY - windowScrollY;
					break;
				case "mouse":
					x = this.mouse.x + settings.offsetX - windowScrollX;
					y = this.mouse.y + settings.offsetY - windowScrollY;
					break;
				case "page":
					x = settings.offsetX - windowScrollX;
					y = settings.offsetY - windowScrollY;
					break;
			}

			if (Tooltip.shownTooltip)
			{
				Tooltip.shownTooltip.hideTooltip();
			}

			$element.append('<div class="ui-tooltip" style="position: fixed; left: ' + x + 'px; top: ' + y + 'px">' + content + '</div>');

			if (settings.fitToScreen)
			{
				var $tooltip = this.$(".ui-tooltip");
				var position = $tooltip.position();
				var $window = this.$(window);
				if (typeof position !== "undefined" && position !== null)
				{
					if ($tooltip.outerHeight() + position.top > $window.height())
					{
						$tooltip.css("top", ($window.height() - $tooltip.outerHeight() - document.body.scrollTop) + "px");
					}

					if ($tooltip.outerWidth() + position.left > $window.width())
					{
						$tooltip.css("left", ($window.width() - $tooltip.outerWidth() - document.body.scrollLeft) + "px");
					}
				}
			}

			Tooltip.shownTooltip = this;
			this.shown = true;
			this.fireEvent("show");
			this.fireEvent("propertychange", { property: "shown", value: true});
		}

		/**
            Function to track the mouse so that we can precisely position the tooltip relative to the cursor after a short delay
        */
		private trackMouse(e: JQueryMouseEventObject): void
		{
			this.mouse.x = e.pageX;
			this.mouse.y = e.pageY;
		}
	}

	Tooltip.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Tooltip$disposeInterface()
	{
		if (this.mouse.movementTimer)
		{
			clearTimeout(this.mouse.movementTimer);
		}
		this.hideTooltip();
		this.$ = this.$element = null;
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Tooltip", Tooltip);
}