/// <reference path="../../SDL.Client.UI.Core/Controls/FocusableControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Utils/Dom.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Css/ZIndexManager.d.ts" />
/// <reference path="../ActionBar/ActionBar.jQuery.ts" />

module SDL.UI.Controls
{
	export enum CalloutPosition
	{
		ABOVE = <any>"above",
		BELOW = <any>"below",
		LEFT = <any>"left",
		RIGHT = <any>"right"
	}

	export enum CalloutPurpose
	{
		GENERAL = <any>"general",
		MENU = <any>"menu"
	}

	export interface ICalloutTargetCoordinates
	{
		x: number;
		y: number;
	}

	export interface ICalloutTargetBox
	{
		xLeft: number;
		xRight: number;
		yAbove: number;
		yBelow: number;
	}

	export interface ICalloutOptions extends IActionBarOptions
	{
		targetElement?: HTMLElement;						// element, on which the callout is shown. Default value is body
		targetCoordinates?: ICalloutTargetCoordinates;		// specifies coordinates of the location where the callout will point (optional)
		targetBox?: ICalloutTargetBox;						// if no targetCoordinates are provided, specify a box rather than a single location point. By default targetElement's bounds define the box.
		preferredPosition?: CalloutPosition;				// where the callout should be shown related to the element/coordinates/box if space allows. Can be a single value or an array of positions (optional)
		purpose?: CalloutPurpose;							// purpose of the callout, influences styling (general is white, menu is grayish)
		hideOnBlur?: boolean;								// by default the callout captures focus and hides on blur. This can be overwritten by setting hideOnBlur to false
		bringToFront?: boolean;								// when set to true the callout is shown in front of all elements within it's indexed ancestor
		visible?: boolean;
	}

	export interface ICalloutProperties extends SDL.UI.Core.Controls.IFocusableControlBaseProperties
	{
		options: ICalloutOptions;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class Callout extends SDL.UI.Core.Controls.FocusableControlBase
	{
		public properties: ICalloutProperties;

		private $element: JQuery;
		private $actionbar: JQuery;
		private isVisible: boolean;
		private pointer: HTMLDivElement;
		private showTimeout: number;

		constructor(element: HTMLElement, options?: ICalloutOptions)
		{
			super(element, options || {});
		}

		$initialize(): void
		{
			this.callBase("SDL.UI.Core.Controls.FocusableControlBase", "$initialize");

			var p = this.properties;
			var $element = this.$element = SDL.jQuery(p.element);

			p.options = SDL.jQuery.extend({}, p.options);

			$element.addClass("sdl-callout");
			if (p.options.purpose && p.options.purpose != CalloutPurpose.GENERAL)
			{
				$element.addClass("sdl-callout-" + p.options.purpose);
			}

			if (p.options.visible != null && p.options.visible.toString() == "false")	// show by default, unless visibility is set to false or "false"
			{
				if ((!p.options.actions || !p.options.actions.length) && !p.options.actionFlag)
				{
					this.removeActionBar();
				}
				this.hide();
			}
			else
			{
				if (p.options.actions && p.options.actions.length || p.options.actionFlag)
				{
					this.createActionBar();
				}
				this.show();
			}
		}

		public update(options?: ICalloutOptions): void
		{
			var p = this.properties;
			var prevOptions = p.options;
			options = SDL.jQuery.extend({}, options);

			this.callBase("SDL.UI.Core.Controls.FocusableControlBase", "update", [options]);

			if (p.options.purpose != prevOptions.purpose)
			{
				if (prevOptions.purpose && prevOptions.purpose != CalloutPurpose.GENERAL)
				{
					this.$element.removeClass("sdl-callout-" + prevOptions.purpose);
				}

				if (p.options.purpose && p.options.purpose != CalloutPurpose.GENERAL)
				{
					this.$element.addClass("sdl-callout-" + p.options.purpose);
				}
			}

			if (p.options.visible != null && p.options.visible.toString() == "false")
			{
				this.hide();
			}
			else if (p.options.visible || this.isVisible)
			{
				if ((!p.options.actions || !p.options.actions.length) && !p.options.actionFlag)
				{
					this.removeActionBar();
				}
				else if (this.$actionbar)
				{
					this.$actionbar.actionBar({ actions: p.options.actions, actionFlag: p.options.actionFlag });
				}
				else
				{
					this.createActionBar();
				}
				this.show();
			}
		}

		public show(): void
		{
			if (this.isVisible != true)
			{
				this.isVisible = true;
				
				this.showTimeout = setTimeout(() =>	// timeout to allow the content to finish rendering for proper dimensions and to let mouse events finish
					{
						this.showTimeout = null;
						if (this.isVisible)
						{
							this.$element.removeClass("sdl-callout-hidden")
								.keydown(this.getDelegate(this.onKeyDown));

							this._setLocation();
							this.initCaptureFocus();

							this.fireEvent("propertychange", { property: "visible", value: true });
							this.fireEvent("show");
						}
					});

				SDL.UI.Core.Css.ZIndexManager.setNextZIndex(this.properties.element, this.properties.options.bringToFront);
			}
			else if (this.showTimeout)
			{
				// element is about to be shown -> do nothing at this moment
			}
			else
			{
				this.pauseCaptureFocus();	// pause capturing in case focusout is triggered because of mouse events between now and the code below
				setTimeout(() =>			// timeout to allow the content to finish rendering for proper dimensions and to let mouse events finish
					{
						if (this.isVisible)
						{
							this._setLocation();
							this.initCaptureFocus();
						}
					});
				SDL.UI.Core.Css.ZIndexManager.setNextZIndex(this.properties.element, this.properties.options.bringToFront);
			}
		}

		public hide(): void
		{
			if (this.isVisible != false)
			{
				this.isVisible = false;
				this.onHide();
				this.$element.addClass("sdl-callout-hidden");
				this.fireEvent("propertychange", { property: "visible", value: false });
				this.fireEvent("hide");
			}
		}

		public setLocation(targetCoordinates: ICalloutTargetCoordinates): void;
		public setLocation(targetBox: ICalloutTargetBox): void;
		public setLocation(location: any): void
		{
			if (location)
			{
				if ((<ICalloutTargetCoordinates>location).x != null)	// location can be set to coordinates
				{
					this.properties.options.targetCoordinates = (<ICalloutTargetCoordinates>location);
				}
				else if ((<ICalloutTargetBox>location).xLeft != null)	// location can be set to a box
				{
					this.properties.options.targetBox = (<ICalloutTargetBox>location);
				}

				this._setLocation();
			}
			else
			{
				console.warn("Callout.setLocation(): location object is not defined");
			}
		}

		public getActionsFlag(): boolean
		{
			return this.$actionbar ? this.$actionbar.actionBar().getActionFlag() : null;
		}

		public handleFocusOut()
		{
			this.executeCloseAction();
		}

		private _setLocation()
		{
			if (this.isVisible)
			{
				var p = this.properties;
				var options = p.options;

				var container = <HTMLElement>(document.documentElement || document.body.parentNode || document.body);
				var targetElement = options.targetElement || container;

				var targetPosition = SDL.jQuery(targetElement).offset();

				// from https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
				var windowScrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : container.scrollLeft;
				var windowScrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : container.scrollTop;

				var posLeft: number;
				var posAbove: number;
				var posRight: number;
				var posBelow: number;

				var targetOffsetWidth = targetElement.offsetWidth;
				var targetOffsetHeight = targetElement.offsetHeight;

				if (options.targetCoordinates)	// callout is attached to a specific point on the screen
				{
					posLeft = posRight = targetPosition.left + (options.targetCoordinates.x < 0 ? targetOffsetWidth : 0) + (options.targetCoordinates.x || 0) - windowScrollX;
					posAbove = posBelow = targetPosition.top + (options.targetCoordinates.y < 0 ? targetOffsetHeight : 0) + (options.targetCoordinates.y || 0) - windowScrollY;
				}
				else if (options.targetBox)	// callout is attached to a box in the target element
				{
					posLeft = targetPosition.left + (options.targetBox.xLeft < 0 ? targetOffsetWidth : 0) + (options.targetBox.xLeft || 0) - windowScrollX;
					posAbove = targetPosition.top + (options.targetBox.yAbove < 0 ? targetOffsetHeight : 0) + (options.targetBox.yAbove || 0) - windowScrollY;
					posRight = targetPosition.left + (options.targetBox.xRight < 0 ? targetOffsetWidth : 0) + (options.targetBox.xRight || 0) - windowScrollX;
					posBelow = targetPosition.top + (options.targetBox.yBelow < 0 ? targetOffsetHeight : 0) + (options.targetBox.yBelow || 0) - windowScrollY;
				}
				else	// callout is attached to an element rather than a specific location
				{
					posLeft = targetPosition.left - windowScrollX;
					posAbove = targetPosition.top - windowScrollY;
					posRight = targetPosition.left + targetOffsetWidth - windowScrollX;
					posBelow = targetPosition.top + targetOffsetHeight - windowScrollY;
				}

				// ensure the location is in screen
				posLeft = Math.max(0, Math.min(container.clientWidth, posLeft));
				posAbove = Math.max(0, Math.min(container.clientHeight, posAbove));
				posRight = Math.max(0, Math.min(container.clientWidth, posRight));
				posBelow = Math.max(0, Math.min(container.clientHeight, posBelow));

				// calculate available space for showing the callout
				var calloutWidth = p.element.offsetWidth;
				var calloutHeight = p.element.offsetHeight;
				var pointerSize = 9;
				var pointerHalfWidth = 7;
				var pointerMinDistanceFromEdge = 20 + pointerHalfWidth;	// 20 (min distance from the corner)
				var preferedPositions:CalloutPosition[] = options.preferredPosition && (SDL.Client.Type.isArray(options.preferredPosition))
						? ((<any>options.preferredPosition).length ? <any>options.preferredPosition : [CalloutPosition.BELOW])
						: [options.preferredPosition || CalloutPosition.BELOW];

				var position: CalloutPosition;

				// select available position from preferred ones
				for (var i = 0; !position && i < preferedPositions.length; i++)
				{
					switch (preferedPositions[i])
					{
						case CalloutPosition.ABOVE:
							if (calloutHeight + pointerSize <= posAbove && posRight >= pointerMinDistanceFromEdge && posLeft <= container.clientWidth)
							{
								position = CalloutPosition.ABOVE;
							}
							break;
						case CalloutPosition.BELOW:
							if (calloutHeight + pointerSize <= container.clientHeight - posBelow && posRight >= pointerMinDistanceFromEdge && posLeft <= container.clientWidth)
							{
								position = CalloutPosition.BELOW;
							}
							break;
						case CalloutPosition.LEFT:
							if (calloutWidth + pointerSize <= posLeft && posAbove >= pointerMinDistanceFromEdge && posBelow <= container.clientHeight)
							{
								position = CalloutPosition.LEFT;
							}
							break;
						case CalloutPosition.RIGHT:
							if (calloutWidth + pointerSize <= container.clientWidth - posRight && posAbove >= pointerMinDistanceFromEdge && posBelow <= container.clientHeight)
							{
								position = CalloutPosition.RIGHT;
							}
							break;
					}
				}

				if (!position)	// none of the preferred positions can fit the callout -> choose any available
				{
					var diffVertical: number;
					if (posAbove < container.clientHeight - posBelow)	// space below is larger than above -> try to position below
					{
						diffVertical = (container.clientHeight - posBelow) - (calloutHeight + pointerSize);
						if (diffVertical >= 0)
						{
							position = CalloutPosition.BELOW;	// there's enough space below
						}
					}
					else											// otherwise position above
					{
						diffVertical = posAbove - (calloutHeight + pointerSize);
						if (diffVertical >= 0)
						{
							position = CalloutPosition.ABOVE;	// there's enough space above
						}
					}

					var diffHorizontal: number;
					if (posLeft < container.clientWidth - posRight)	// space on the right is larger then on the left -> try position to the right
					{
						diffHorizontal = (container.clientWidth - posRight) - (calloutWidth + pointerSize);
						if (diffHorizontal >= 0 && diffVertical < diffHorizontal)
						{
							position = CalloutPosition.RIGHT;	// there's enough space to the right
						}
					}
					else										// otherwise position to the left
					{
						diffHorizontal = posLeft - (calloutWidth + pointerSize);
						if (diffHorizontal >= 0 && diffVertical < diffHorizontal)
						{
							position = CalloutPosition.LEFT;	// there's enough space to the left
						}
					}

					if (!position)	// no position can fit the callout -> make best out of the first preferred one
					{
						switch (preferedPositions[0])
						{
							case CalloutPosition.ABOVE:
								posAbove = calloutHeight + pointerSize;
								position = CalloutPosition.ABOVE;
								break;
							case CalloutPosition.BELOW:
								posBelow = container.clientHeight - (calloutHeight + pointerSize);
								position = CalloutPosition.BELOW;
								break;
							case CalloutPosition.LEFT:
								posLeft = calloutWidth + pointerSize;
								position = CalloutPosition.LEFT;
								break;
							case CalloutPosition.RIGHT:
								posRight = container.clientWidth - (calloutWidth + pointerSize);
								position = CalloutPosition.RIGHT;
								break;
						}
					}
				}

				// ok, figured out the position, calculate the exact location now
				if (!this.pointer)
				{
					this.pointer = <HTMLDivElement>SDL.jQuery("<div></div>").appendTo(this.$element)[0];
				}
				this.pointer.className = "sdl-callout-pointer-" + position;

				var x: number;
				var y: number;
				var xPointer: number;
				var yPointer: number;

				switch (position)
				{
					case CalloutPosition.ABOVE:
					case CalloutPosition.BELOW:
						x = (posRight + posLeft - calloutWidth) >> 1;		// [>> 1] is division by 2
						x = Math.max(0, Math.min(container.clientWidth - calloutWidth, x));
						xPointer = ((posRight + posLeft) >> 1) - pointerHalfWidth;
						xPointer = Math.max(pointerMinDistanceFromEdge - pointerHalfWidth, Math.min(container.clientWidth - pointerMinDistanceFromEdge - pointerHalfWidth, xPointer));
						break;
					case CalloutPosition.LEFT:
					case CalloutPosition.RIGHT:
						y = (posBelow + posAbove - calloutHeight) >> 1;		// [>> 1] is division by 2
						y = Math.max(0, Math.min(container.clientHeight - calloutHeight, y));
						yPointer = ((posBelow + posAbove) >> 1) - pointerHalfWidth;
						yPointer = Math.max(pointerMinDistanceFromEdge - pointerHalfWidth, Math.min(container.clientHeight - pointerMinDistanceFromEdge - pointerHalfWidth, yPointer));
						break;
				}

				switch (position)
				{
					case CalloutPosition.ABOVE:
						y = Math.max(0, posAbove - (calloutHeight + pointerSize));
						yPointer = y + calloutHeight - 1;
						break;
					case CalloutPosition.BELOW:
						y = posBelow + pointerSize;
						y = Math.max(pointerSize, Math.min(container.clientHeight - calloutHeight, y));
						yPointer = y - pointerSize + 1;
						break;
					case CalloutPosition.LEFT:
						x = Math.max(0, posLeft - (calloutWidth + pointerSize));
						xPointer = x + calloutWidth - 1;
						break;
					case CalloutPosition.RIGHT:
						x = posRight + pointerSize;
						x = Math.max(pointerSize, Math.min(container.clientWidth - calloutWidth, x));
						xPointer = x - pointerSize + 1;
						break;
				}

				p.element.style.left = x + "px";
				p.element.style.top = y + "px";
				this.pointer.style.left = xPointer + "px";
				this.pointer.style.top = yPointer + "px";
			}
		}

		private initCaptureFocus()
		{
			var hideOnBlur = this.properties.options.hideOnBlur;
			if (hideOnBlur == null || hideOnBlur.toString() != "false")
			{
				this.startCaptureFocus(true, this.properties.options.targetElement || document.body);
			}
			else
			{
				this.stopCaptureFocus();
			}
		}

		private createActionBar()
		{
			var options = this.properties.options;
			this.$actionbar = SDL.jQuery("<div class='sdl-callout-actionbar'></div>")
				.actionBar({ actions: options.actions, actionFlag: options.actionFlag })
					.on("action", this.getDelegate(this.onActionBarAction))
					.on("actionflagchange", this.getDelegate(this.onActionBarActionFlagChange))
				.end().appendTo(this.$element);
		}

		private onActionBarAction(e: JQueryEventObject)
		{
			this.fireEvent("action", {
					action: (<any>e.originalEvent).data.action,
					actionFlag: (<any>e.originalEvent).data.actionFlag
				});

			switch ((<any>e.originalEvent).data.action)
			{
				case "close":
				case "cancel":
					this.hide();
					break;
			}
		}

		private onActionBarActionFlagChange(e: JQueryEventObject)
		{
			this.fireEvent("actionflagchange", { actionsFlag: (<any>e.originalEvent).data.actionFlag });
			this.fireEvent("propertychange", { property: "actionFlag.selected", value: (<any>e.originalEvent).data.actionFlag });
		}

		private removeActionBar()
		{
			if (this.$actionbar)
			{
				(<JQueryActionStrip>this.$actionbar.actionBar()
						.off("action", this.removeDelegate(this.onActionBarAction))
						.off("actionflagchange", this.removeDelegate(this.onActionBarActionFlagChange)))
						.dispose()
					.remove();
				this.$actionbar = null;
			}
		}

		private onKeyDown(e: JQueryEventObject)
		{
			if (e.which == SDL.UI.Core.Event.Constants.Keys.ESCAPE)
			{
				e.stopPropagation();
				this.executeCloseAction();
			}
		}

		private executeCloseAction()
		{
			var closeAction: IActionBarAction;
			var options = this.properties.options;
			if (options.actions)
			{
				for (var i = options.actions.length - 1; !closeAction && i >= 0; i--)
				{
					switch (options.actions[i].action)
					{
						case "close":
						case "cancel":
							closeAction = options.actions[i];
							break;
					}
				}
			}

			if (closeAction)
			{
				if (SDL.Client.Type.isFunction(closeAction.handler))
				{
					closeAction.handler();
				}

				this.fireEvent("action", {
					action: closeAction.action,
					actionFlag: this.getActionsFlag()
				});
			}
			else
			{
				this.fireEvent("action", {
					action: "close",
					actionFlag: this.getActionsFlag()
				});
			}

			this.hide();
		}

		private onHide()
		{
			this.stopCaptureFocus();
			this.$element.off("keydown", this.getDelegate(this.onKeyDown));
			SDL.UI.Core.Css.ZIndexManager.releaseZIndex(this.properties.element);
		}

		private cleanUp()
		{
			this.onHide();
			this.removeActionBar();

			this.$element.removeClass("sdl-callout sdl-callout-hidden sdl-callout-general sdl-callout-menu");

			if (this.pointer)
			{
				this.properties.element.removeChild(this.pointer);
				this.pointer = null;
			}

			this.$element = null;
		}
	}

	Callout.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Callout$disposeInterface()
	{
		this.cleanUp();
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Callout", Callout);
} 