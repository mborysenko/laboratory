/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Utils/Dom.d.ts" />

module SDL.UI.Controls
{
	export interface IScrollViewOptions
	{
		style?: string;
		overflowX?: string;
		overflowY?: string;
		overlay?: boolean;
	}

	export interface IScrollViewProperties extends SDL.UI.Core.Controls.IControlBaseProperties
	{
		options: IScrollViewOptions;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class ScrollView extends SDL.UI.Core.Controls.ControlBase
	{
		public properties: IScrollViewProperties;

		private $element: JQuery;
		private $scrollChild: JQuery;
		private secondaryScrollBars: {$X?: JQuery; $Y?: JQuery;} = {};
		private $corner: JQuery;
		private styleApplied: boolean;
		private overlayApplied: boolean;
		private childCreated: boolean = false;
		private initChildStyleBottom: string;
		private initChildStyleRight: string;
		private scrollBarChildBottom: number = 0;
		private scrollBarChildRight: number = 0;
		private scrollXEnabled: boolean;
		private scrollYEnabled: boolean;
		private scrollXHidden: boolean;
		private scrollYHidden: boolean;
		private secondaryToMainRatioX: number;
		private secondaryToMainRatioY: number;
		private scrollBarXWidth: number;
		private scrollBarYHeight: number;
		private scrollContentXWidth: number;
		private scrollContentYHeight: number;
		private scrollContentXClientWidth: number;
		private scrollContentYClientHeight: number;
		private scrollBarHandleXSize: number;
		private scrollBarHandleYSize: number;
		private scrollBarHandleXLeftPosition: number;
		private scrollBarHandleYTopPosition: number;
		private scrollHandleLeftPositionCoefficientX: number;
		private scrollHandleTopPositionCoefficientY: number;
		private monitoringInterval: number;
		private scrollButtonSize: number = 18;
		private scrollChildLastScrollLeftPosition: number;
		private scrollChildLastScrollTopPosition: number;
		private scrollBarLastScrollLeftPosition: number;
		private scrollBarLastScrollTopPosition: number;

		constructor(element: HTMLElement, options?: IScrollViewOptions)
		{
			super(element, options || {});
		}

		$initialize(): void
		{
			this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

			if (!SDL.jQuery.browser.macintosh && !SDL.jQuery.browser.mobile)
			{
				var p = this.properties;
				var $element = this.$element = SDL.jQuery(p.element);

				var options = p.options = SDL.jQuery.extend({
						overflowX: "auto",
						overflowY: "auto",
						overlay: false
					}, p.options);

				var scrollTop: number = p.element.scrollTop;
				var scrollLeft: number = p.element.scrollLeft;
				var isBody: boolean = $element.is("body");
				var parent: HTMLElement;
				if (isBody)
				{
					parent = $element.parent()[0];
					scrollTop = scrollTop || parent.scrollTop || 0;	// documentElement rather than body is scrolled in FF and IE
					scrollLeft = scrollLeft || parent.scrollLeft || 0;	// documentElement rather than body is scrolled in FF and IE
				}

				var $scrollChild = ($element[0].nodeType == 9)	// document
					? $element.children("body").attr("data-sdl-scrollview-child", "true")	// can't wrap <body> in another element -> using body as the scrollview child
					: $element.children("[data-sdl-scrollview-child=true]");

				var scrollChild = $scrollChild[0];
				if (!scrollChild)
				{
					$scrollChild = $element.wrapInner("<div data-sdl-scrollview-child='true'></div>").children();
					scrollChild = $scrollChild[0];
					this.childCreated = true;
				}
				else
				{
					this.initChildStyleRight = scrollChild.style.right;
					this.initChildStyleBottom = scrollChild.style.bottom;
				}
				this.$scrollChild = $scrollChild;

				if (!options.overflowX || options.overflowX != "hidden")
				{
					$element.addClass("sdl-scrollview-X-scroll");
				}

				if (!options.overflowY || options.overflowY != "hidden")
				{
					$element.addClass("sdl-scrollview-Y-scroll");
				}

				if (options.style && options.style == "dark" && !$element.hasClass("sdl-scrollview-style-dark"))
				{
					$element.addClass("sdl-scrollview-style-dark");
					this.styleApplied = true;
				}

				options.overlay = (options.overlay + "") == "true";
				if (options.overlay)
				{
					$element.addClass("sdl-scrollview-overlay");
					this.overlayApplied = true;
				}

				if (SDL.jQuery.browser.msie)
				{
					this.scrollButtonSize = 32;
				}

				$element.addClass("sdl-scrollview");

				scrollChild.scrollTop = scrollTop;
				scrollChild.scrollLeft = scrollLeft;
				p.element.scrollTop = p.element.scrollLeft = 0;
				if (isBody)
				{
					parent.scrollTop = parent.scrollLeft = 0;
					SDL.jQuery($element[0].ownerDocument).scroll(this.cancelScroll);
				}
				$element.scroll(this.cancelScroll);

				this.recalculate();
				// could use ResizeTrigger to detect resize of the element but 
				// there's no event to detect when the size of elements contents have changed -> using interval
				this.monitoringInterval = window.setInterval(this.getDelegate(this.recalculate), 150);

				this.onScrollChild();
				$scrollChild.scroll(this.getDelegate(this.onScrollChild));
			}
		}

		public update(options?: IScrollViewOptions): void
		{
			if (options && !SDL.jQuery.browser.macintosh && !SDL.jQuery.browser.mobile)
			{
				this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

				var $element = this.$element;

				options = this.properties.options;
				if (options.overflowX)
				{
					if (options.overflowX == "hidden")
					{
						$element.removeClass("sdl-scrollview-X-scroll");
					}
					else
					{
						$element.addClass("sdl-scrollview-X-scroll");
					}
				}

				if (options.overflowY)
				{
					if (options.overflowY == "hidden")
					{
						$element.removeClass("sdl-scrollview-Y-scroll");
					}
					else
					{
						$element.addClass("sdl-scrollview-Y-scroll");
					}
				}

				if (options.style)
				{
					if (options.style == "dark")
					{
						if (!this.$element.hasClass("sdl-scrollview-style-dark"))
						{
							$element.addClass("sdl-scrollview-style-dark");
							this.styleApplied = true;
						}
					}
					else
					{
						$element.removeClass("sdl-scrollview-style-dark");
						this.styleApplied = false;
					}
				}

				options.overlay = (options.overlay + "") == "true";
				if (options.overlay)
				{
					if (!this.$element.hasClass("sdl-scrollview-overlay"))
					{
						$element.addClass("sdl-scrollview-overlay");
						this.overlayApplied = true;
					}
				}
				else
				{
					$element.removeClass("sdl-scrollview-overlay");
					this.overlayApplied = false;
				}

				this.recalculate();
			}
		}

		private getSecondaryScrollBar(direction: string): JQuery
		{
			var scrollBar: JQuery = (<{[direction: string]: JQuery}>this.secondaryScrollBars)["$" + direction];
			if (!scrollBar)
			{
				scrollBar = (<{[direction: string]: JQuery}>this.secondaryScrollBars)["$" + direction] =
						SDL.jQuery("<div class='sdl-scrollview-" + direction + "-scroll-wrapper'><div></div><div></div><div></div><div><div></div></div></div>")
							.appendTo(this.$element)
							.children(":last-child");
				/*
					<div>						<!--	sdl-scrollview-[X|Y]-scroll-wrapper		-->
						<div></div>				<!--	sdl-scrollview-scroll-[up|left]			-->
						<div></div>				<!--	sdl-scrollview-scroll-[down|right]		-->
						<div></div>				<!--	sdl-scrollview-scroll-handle			-->
						<div>					<!--	sdl-scrollview-secondary-scroll			-->
							<div></div>			<!--	sdl-scrollview-secondary-scroll-content	-->
						</div>
					</div>
				*/
				scrollBar.scroll(this.getDelegate(direction == "X" ? this.onSecondaryScrollX : this.onSecondaryScrollY))
					.mousemove(this.getDelegate(direction == "X" ? this.onScrollWrapperMouseMoveX : this.onScrollWrapperMouseMoveY))
					.mousedown(this.getDelegate(direction == "X" ? this.onScrollWrapperMouseDownX : this.onScrollWrapperMouseDownY))
					.mouseup(this.getDelegate(direction == "X" ? this.onScrollWrapperMouseUpX : this.onScrollWrapperMouseUpY))
					.mouseleave(this.getDelegate(direction == "X" ? this.onScrollWrapperMouseLeaveX : this.onScrollWrapperMouseLeaveY));

				if (this.secondaryScrollBars.$X && this.secondaryScrollBars.$Y)
				{
					this.$corner = SDL.jQuery("<div class='sdl-scrollview-corner'></div>").appendTo(this.$element);
				}

				return scrollBar;
			}
			else
			{
				return scrollBar;
			}
		}

		private updateScrollBars()
		{
			var scrollChild = this.$scrollChild[0];
			if (scrollChild.offsetHeight && scrollChild.offsetWidth)
			{
				var overlay = this.$element.hasClass("sdl-scrollview-overlay");
				var changed: boolean;

				var scrollBarSizeX: number = this.scrollXEnabled ? (scrollChild.offsetHeight - this.scrollContentYClientHeight) : 0;
				var scrollBarChildBottom = (overlay || !scrollBarSizeX || this.scrollXHidden) ? -scrollBarSizeX : (15 - scrollBarSizeX);
				if (this.scrollBarChildBottom != scrollBarChildBottom)
				{
					this.scrollBarChildBottom = scrollBarChildBottom;
					scrollChild.style.bottom = scrollBarChildBottom + "px";
					changed = true;
				}

				var scrollBarSizeY: number = this.scrollYEnabled ? (scrollChild.offsetWidth - this.scrollContentXClientWidth) : 0;
				var scrollBarChildRight = (overlay || !scrollBarSizeY || this.scrollYHidden) ? -scrollBarSizeY : (15 - scrollBarSizeY);
				if (this.scrollBarChildRight != scrollBarChildRight)
				{
					this.scrollBarChildRight = scrollBarChildRight;
					scrollChild.style.right = scrollBarChildRight + "px";
					changed = true;
				}

				if (changed)	// after changing bottom/right, the reported size of the scrollbar might change (results in an infinite update) ->
								// stick with the bigger size
				{
					var newScrollBarSizeX = this.scrollXEnabled ? (scrollChild.offsetHeight - scrollChild.clientHeight) : 0;
					if (newScrollBarSizeX < scrollBarSizeX)
					{
						this.scrollBarChildBottom = (overlay || !newScrollBarSizeX || this.scrollXHidden) ? -newScrollBarSizeX : (15 - newScrollBarSizeX);
					}
				
					var newScrollBarSizeY = this.scrollYEnabled ? (scrollChild.offsetWidth - scrollChild.clientWidth) : 0;
					if (newScrollBarSizeY < scrollBarSizeY)
					{
						this.scrollBarChildRight = (overlay || !newScrollBarSizeY || this.scrollYHidden) ? -newScrollBarSizeY : (15 - newScrollBarSizeY);
					}
				}
			}
		}

		private recalculate()
		{
			var scrollChild: HTMLElement = this.$scrollChild[0];
			if (scrollChild.offsetHeight && scrollChild.offsetWidth)
			{
				this.scrollXEnabled = this.$element.hasClass("sdl-scrollview-X-scroll");
				this.scrollYEnabled = this.$element.hasClass("sdl-scrollview-Y-scroll");

				var scrollBar: HTMLElement;
				var secondaryContent: HTMLElement;
				var scrollHandle: HTMLElement;
				var xUpdate = false;
				var yUpdate = false;

				if (this.scrollXEnabled)
				{
					scrollBar = this.getSecondaryScrollBar("X")[0];

					if (scrollBar.scrollLeft == 0 && this.scrollBarHandleXLeftPosition != this.scrollButtonSize)	// scroll position might have been reset without an event
					{
						this.scrollBarHandleXLeftPosition = this.scrollButtonSize;
						(<HTMLElement>scrollBar.previousSibling).style.left = this.scrollButtonSize + "px";
					}

					secondaryContent = <HTMLElement>scrollBar.firstChild;

					if (this.scrollContentXWidth != scrollChild.scrollWidth || this.scrollContentXClientWidth != scrollChild.clientWidth || scrollBar.offsetWidth != this.scrollBarXWidth)
					{
						xUpdate = true;
						this.scrollBarXWidth = scrollBar.offsetWidth;
						this.scrollContentXWidth = scrollChild.scrollWidth;
						this.scrollContentXClientWidth = scrollChild.clientWidth;

						if (this.scrollContentXClientWidth >= (scrollChild.scrollWidth - 1))
						{
							if (!this.scrollXHidden)
							{
								this.scrollXHidden = true;
								this.$element.addClass("sdl-scrollview-X-scroll-hidden");
							}
						}
						else
						{
							if (this.scrollXHidden)
							{
								this.scrollXHidden = false;
								this.$element.removeClass("sdl-scrollview-X-scroll-hidden");
							}

							this.secondaryToMainRatioX = this.scrollBarXWidth / this.scrollContentXClientWidth;
							var contentWidth = Math.round(scrollChild.scrollWidth * this.secondaryToMainRatioX);
							if (secondaryContent.offsetWidth != contentWidth)
							{
								secondaryContent.style.width = contentWidth + "px";
							}

							this.scrollHandleLeftPositionCoefficientX = (this.scrollBarXWidth - this.scrollButtonSize * 2) / contentWidth;
							var handleWidth = Math.round(this.scrollHandleLeftPositionCoefficientX * this.scrollBarXWidth);
							var handleSpaceCorrectionX: number;
							if (handleWidth < 10)
							{
								handleSpaceCorrectionX = 10 - handleWidth;
								handleWidth = 10;
								this.scrollHandleLeftPositionCoefficientX -= (handleSpaceCorrectionX / contentWidth);
							}
							else
							{
								handleSpaceCorrectionX = 0;
							}

							scrollHandle = <HTMLElement>scrollBar.previousSibling;
							if (scrollHandle.offsetWidth != handleWidth)
							{
								this.scrollBarHandleXSize = handleWidth;
								scrollHandle.style.width = handleWidth + "px";
							}
						}
					}
				}
				else if (this.scrollYEnabled)
				{
					this.scrollContentXWidth = undefined;
					this.scrollContentXClientWidth = scrollChild.clientWidth;
				}

				if (this.scrollYEnabled)
				{
					scrollBar = this.getSecondaryScrollBar("Y")[0];
					secondaryContent = <HTMLElement>scrollBar.firstChild;

					if (scrollBar.scrollTop == 0 && this.scrollBarHandleYTopPosition != this.scrollButtonSize)	// scroll position might have been reset without an event
					{
						this.scrollBarHandleYTopPosition = this.scrollButtonSize;
						(<HTMLElement>scrollBar.previousSibling).style.top = this.scrollButtonSize + "px";
					}

					if (this.scrollContentYHeight != scrollChild.scrollHeight || this.scrollContentYClientHeight != scrollChild.clientHeight || scrollBar.offsetHeight != this.scrollBarYHeight)
					{
						yUpdate = true;
						this.scrollBarYHeight = scrollBar.offsetHeight;
						this.scrollContentYHeight = scrollChild.scrollHeight;
						this.scrollContentYClientHeight = scrollChild.clientHeight;

						if (this.scrollContentYClientHeight >= (scrollChild.scrollHeight - 1))
						{
							if (!this.scrollYHidden)
							{
								this.scrollYHidden = true;
								this.$element.addClass("sdl-scrollview-Y-scroll-hidden");
							}
						}
						else
						{
							if (this.scrollYHidden)
							{
								this.scrollYHidden = false;
								this.$element.removeClass("sdl-scrollview-Y-scroll-hidden");
							}

							this.secondaryToMainRatioY = this.scrollBarYHeight / this.scrollContentYClientHeight;
							var contentHeight = Math.round(scrollChild.scrollHeight * this.secondaryToMainRatioY);
							if (secondaryContent.offsetHeight != contentHeight)
							{
								secondaryContent.style.height = contentHeight + "px";
							}

							this.scrollHandleTopPositionCoefficientY = (this.scrollBarYHeight - this.scrollButtonSize * 2) / contentHeight;
							var handleHeight = Math.round(this.scrollHandleTopPositionCoefficientY * this.scrollBarYHeight);
							var handleSpaceCorrectionY: number;
							if (handleHeight < 10)
							{
								handleSpaceCorrectionY = 10 - handleHeight;
								handleHeight = 10;
								this.scrollHandleTopPositionCoefficientY -= (handleSpaceCorrectionY / contentHeight);
							}
							else
							{
								handleSpaceCorrectionY = 0;
							}

							scrollHandle = <HTMLElement>scrollBar.previousSibling;
							if (scrollHandle.offsetHeight != handleHeight)
							{
								this.scrollBarHandleYSize = handleHeight;
								scrollHandle.style.height = handleHeight + "px";
							}
						}
					}
				}
				else if (this.scrollXEnabled)
				{
					this.scrollContentYHeight = undefined;
					this.scrollContentYClientHeight = scrollChild.clientHeight;
				}

				this.updateScrollBars();

				if (xUpdate || yUpdate)
				{
					this.onScrollChild();
					if (xUpdate)
					{
						this.onSecondaryScrollX();
					}
					if (yUpdate)
					{
						this.onSecondaryScrollY();
					}
				}
			}
		}

		private cancelScroll(e: JQueryEventObject)
		{
			var element = <HTMLElement>e.target;
			if (element.nodeType == 9)	// document -> reset both documentElement (FF and IE) and body (Chrome)
			{
				var html = (<Document><any>element).documentElement;
				html.scrollLeft = html.scrollTop = 0;

				element = (<Document><any>element).body;
			}
			element.scrollLeft = element.scrollTop = 0;
		}

		private onScrollChild()
		{
			var scrollChild = <HTMLElement>this.$scrollChild[0];
			var $scrollBar: JQuery;

			this.scrollChildLastScrollLeftPosition = scrollChild.scrollLeft;
			if (this.scrollXEnabled)
			{
				$scrollBar = this.getSecondaryScrollBar("X");
				var scrollBarScrollLeftPosition = $scrollBar.scrollLeft();
				if (!scrollBarScrollLeftPosition ||												// if 0, it might mean the element was reset to 0 without an event
						this.scrollBarLastScrollLeftPosition == scrollBarScrollLeftPosition)	// [ != ] would mean that the element was scrolled but the event wasn't handled yet, we'll do no update this time
				{
					
					var newSecondatryScrollLeft = Math.round(scrollChild.scrollLeft * this.secondaryToMainRatioX);
					if (scrollBarScrollLeftPosition != newSecondatryScrollLeft)
					{
						$scrollBar.scrollLeft(newSecondatryScrollLeft);
					}
				}
			}

			this.scrollChildLastScrollTopPosition = scrollChild.scrollTop;
			if (this.scrollYEnabled)
			{
				$scrollBar = this.getSecondaryScrollBar("Y");
				var scrollBarScrollTopPosition = $scrollBar.scrollTop();
				if (!scrollBarScrollTopPosition ||												// if 0, it might mean the element was reset to 0 without an event
						this.scrollBarLastScrollTopPosition == scrollBarScrollTopPosition)	// [ != ] would mean that the element was scrolled but the event wasn't handled yet, we'll do no update this time
				{
					var newSecondatryScrollTop = Math.round(scrollChild.scrollTop * this.secondaryToMainRatioY);
					if (scrollBarScrollTopPosition != newSecondatryScrollTop)
					{
						$scrollBar.scrollTop(newSecondatryScrollTop);
					}
				}
			}
		}

		private onSecondaryScrollX()
		{
			var scrollBar = this.getSecondaryScrollBar("X")[0];
			this.scrollBarLastScrollLeftPosition = scrollBar.scrollLeft;
			if (this.scrollXEnabled)
			{
				var childScrollLeftPosition = this.$scrollChild.scrollLeft();

				if (!childScrollLeftPosition ||											// if 0, it might mean the element was reset to 0 without an event
						this.scrollChildLastScrollLeftPosition == childScrollLeftPosition)	// [ != ] would mean that the element was scrolled but the event wasn't handled yet, we'll do no update this time
				{
					// updating scroll handle position
					this.scrollBarHandleXLeftPosition = scrollBar.scrollLeft * this.scrollHandleLeftPositionCoefficientX + this.scrollButtonSize;
					(<HTMLElement>scrollBar.previousSibling).style.left = this.scrollBarHandleXLeftPosition + "px";

					var newScrollLeft = Math.round(scrollBar.scrollLeft / this.secondaryToMainRatioX);
					if (childScrollLeftPosition != newScrollLeft)
					{
						this.$scrollChild.scrollLeft(newScrollLeft);
					}
				}
			}
		}

		private onSecondaryScrollY()
		{
			var scrollBar = this.getSecondaryScrollBar("Y")[0];
			this.scrollBarLastScrollTopPosition = scrollBar.scrollTop;

			if (this.scrollYEnabled)
			{
				var childScrollTopPosition = this.$scrollChild.scrollTop();
				if (!childScrollTopPosition ||											// if 0, it might mean the element was reset to 0 without an event
						this.scrollChildLastScrollTopPosition == childScrollTopPosition)	// [ != ] would mean that the element was scrolled but the event wasn't handled yet, we'll do no update this time
				{
					// updating scroll handle position
					this.scrollBarHandleYTopPosition = scrollBar.scrollTop * this.scrollHandleTopPositionCoefficientY + this.scrollButtonSize;
					(<HTMLElement>scrollBar.previousSibling).style.top = this.scrollBarHandleYTopPosition + "px";

					var newScrollTop = Math.round(scrollBar.scrollTop / this.secondaryToMainRatioY);
					if (childScrollTopPosition != newScrollTop)
					{
						this.$scrollChild.scrollTop(newScrollTop);
					}
				}
			}
		}

		private onScrollWrapperMouseMoveX(e: JQueryEventObject)
		{
			var left = e.offsetX || (<any>e.originalEvent).layerX || 0;
			var scrollBarWrapper = this.getSecondaryScrollBar("X").parent();
			
			if (left < this.scrollButtonSize)
			{
				scrollBarWrapper.addClass("hover-left").removeClass("hover-right hover-handle");
			}
			else if (left > this.scrollBarXWidth - this.scrollButtonSize)
			{
				scrollBarWrapper.addClass("hover-right").removeClass("hover-left hover-handle");
			}
			else if (left > this.scrollBarHandleXLeftPosition && left < this.scrollBarHandleXLeftPosition + this.scrollBarHandleXSize)
			{
				scrollBarWrapper.addClass("hover-handle").removeClass("hover-left hover-right");
			}
			else
			{
				scrollBarWrapper.removeClass("hover-left hover-right hover-handle");
			}

			if (SDL.jQuery.browser.msie)
			{
				scrollBarWrapper.removeClass("pressed-left pressed-right pressed-handle");
			}
		}

		private onScrollWrapperMouseLeaveX(e: JQueryEventObject)
		{
			this.getSecondaryScrollBar("X").parent().removeClass("hover-left hover-right hover-handle pressed-left pressed-right pressed-handle");
		}

		private onScrollWrapperMouseDownX(e: JQueryEventObject)
		{
			var left = e.offsetX || (<any>e.originalEvent).layerX || 0;
			var scrollBarWrapper = this.getSecondaryScrollBar("X").parent();
			
			if (left < this.scrollButtonSize)
			{
				scrollBarWrapper.addClass("pressed-left");
			}
			else if (left > this.scrollBarXWidth - this.scrollButtonSize)
			{
				scrollBarWrapper.addClass("pressed-right");
			}
			else if (left > this.scrollBarHandleXLeftPosition && left < this.scrollBarHandleXLeftPosition + this.scrollBarHandleXSize)
			{
				scrollBarWrapper.addClass("pressed-handle");
			}
		}

		private onScrollWrapperMouseUpX(e: JQueryEventObject)
		{
			this.getSecondaryScrollBar("X").parent().removeClass("pressed-left pressed-right pressed-handle");
		}

		private onScrollWrapperMouseMoveY(e: JQueryEventObject)
		{
			var top = e.offsetY || (<any>e.originalEvent).layerY || 0;
			var scrollBarWrapper = this.getSecondaryScrollBar("Y").parent();
			
			if (top < this.scrollButtonSize)
			{
				scrollBarWrapper.addClass("hover-up").removeClass("hover-down hover-handle");
			}
			else if (top > this.scrollBarYHeight - this.scrollButtonSize)
			{
				scrollBarWrapper.addClass("hover-down").removeClass("hover-up hover-handle");
			}
			else if (top > this.scrollBarHandleYTopPosition && top < this.scrollBarHandleYTopPosition + this.scrollBarHandleYSize)
			{
				scrollBarWrapper.addClass("hover-handle").removeClass("hover-up hover-down");
			}
			else
			{
				scrollBarWrapper.removeClass("hover-up hover-down hover-handle");
			}

			if (SDL.jQuery.browser.msie)
			{
				scrollBarWrapper.removeClass("pressed-up pressed-down pressed-handle");
			}
		}

		private onScrollWrapperMouseLeaveY(e: JQueryEventObject)
		{
			this.getSecondaryScrollBar("Y").parent().removeClass("hover-up hover-down hover-handle pressed-up pressed-down pressed-handle");
		}

		private onScrollWrapperMouseDownY(e: JQueryEventObject)
		{
			var top = e.offsetY || (<any>e.originalEvent).layerY || 0;
			var scrollBarWrapper = this.getSecondaryScrollBar("Y").parent();
			
			if (top < this.scrollButtonSize)
			{
				scrollBarWrapper.addClass("pressed-up");
			}
			else if (top > this.scrollBarYHeight - this.scrollButtonSize)
			{
				scrollBarWrapper.addClass("pressed-down");
			}
			else if (top > this.scrollBarHandleYTopPosition && top < this.scrollBarHandleYTopPosition + this.scrollBarHandleYSize)
			{
				scrollBarWrapper.addClass("pressed-handle");
			}
		}

		private onScrollWrapperMouseUpY(e: JQueryEventObject)
		{
			this.getSecondaryScrollBar("Y").parent().removeClass("pressed-up pressed-down pressed-handle");
		}

		private cleanUp()
		{
			if (!SDL.jQuery.browser.macintosh && !SDL.jQuery.browser.mobile)
			{
				window.clearInterval(this.monitoringInterval);

				var $element = this.$element;
				var isBody = $element.is("body");
				var scrollChild = this.$scrollChild[0];
				var scrollTop: number = scrollChild.scrollTop;
				var scrollLeft: number = scrollChild.scrollLeft;

				// remove event handlers
				this.$scrollChild.off("scroll", this.removeDelegate(this.onScrollChild));
				if (isBody)
				{
					SDL.jQuery($element[0].ownerDocument).off("scroll", this.cancelScroll);
				}
				$element.off("scroll", this.cancelScroll);

				// remove child elements
				if (this.secondaryScrollBars.$X)
				{
					this.secondaryScrollBars.$X
						.off("scroll", this.removeDelegate(this.onSecondaryScrollX))
						.off("mousemove", this.removeDelegate(this.onScrollWrapperMouseMoveX))
						.off("mousedown", this.removeDelegate(this.onScrollWrapperMouseDownX))
						.off("mouseup", this.removeDelegate(this.onScrollWrapperMouseUpX))
						.off("mouseleave", this.removeDelegate(this.onScrollWrapperMouseLeaveX))
						.parent().remove();
					this.secondaryScrollBars.$X = null;
				}

				if (this.secondaryScrollBars.$Y)
				{
					this.secondaryScrollBars.$Y
						.off("scroll", this.removeDelegate(this.onSecondaryScrollY))
						.off("mousemove", this.removeDelegate(this.onScrollWrapperMouseMoveY))
						.off("mousedown", this.removeDelegate(this.onScrollWrapperMouseDownY))
						.off("mouseup", this.removeDelegate(this.onScrollWrapperMouseUpY))
						.off("mouseleave", this.removeDelegate(this.onScrollWrapperMouseLeaveY))
						.parent().remove();
					this.secondaryScrollBars.$Y = null;
				}

				if (this.$corner)
				{
					this.$corner.remove();
				}

				if (this.childCreated)
				{
					this.$element.unwrapInner();
				}
				else
				{
					scrollChild.style.bottom = this.initChildStyleBottom;
					scrollChild.style.right = this.initChildStyleRight;
				}

				// restore styles
				$element.removeClass("sdl-scrollview sdl-scrollview-X-scroll sdl-scrollview-X-scroll-hidden sdl-scrollview-Y-scroll sdl-scrollview-Y-scroll-hidden sdl-scrollview");

				if (this.styleApplied)
				{
					$element.removeClass("sdl-scrollview-style-dark");
				}

				if (this.overlayApplied)
				{
					$element.removeClass("sdl-scrollview-overlay");
				}

				// keep scroll position
				var $scrollElement = isBody ? $element.parent().addBack() : $element;	// documentElement rather than body is scrolled in FF and IE
				if (scrollTop)
				{
					$scrollElement.scrollTop(scrollTop);
				}

				if (scrollLeft)
				{
					$scrollElement.scrollLeft(scrollLeft);
				}

				this.$element = this.$scrollChild = this.$corner = null;
			}
		}
	}

	ScrollView.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function disposeInterface()
	{
		this.cleanUp();
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.ScrollView", ScrollView);
}