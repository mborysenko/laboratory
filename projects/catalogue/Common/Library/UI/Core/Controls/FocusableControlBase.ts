/// <reference path="ControlBase.ts" />
/// <reference path="../Event/Constants.d.ts" />

module SDL.UI.Core.Controls
{
	export interface IFocusableControlBaseProperties extends IControlBaseProperties
	{
		$element: JQuery;
		initialTabIndex: string;
		capturingFocus: boolean;
		handlingResize: boolean;
		handlingScrollElement: HTMLElement;
		isPausedCaptureFocus: boolean;
		checkFocusedElementTimeout: number;
		isWindowFocusOut: boolean;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class FocusableControlBase extends ControlBase
	{
		public properties: IFocusableControlBaseProperties;

		$initialize(): void
		{
			this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

			this.properties.$element = SDL.jQuery(this.properties.element);
		}

		public handleFocusOut()
		{
			// override this method in the deriving class
		}

		public startCaptureFocus(triggerOnResize: boolean = false, triggerOnScroll?: HTMLElement)
		{
			var p = this.properties;
			if (!p.capturingFocus)
			{
				p.capturingFocus = true;

				p.initialTabIndex = p.$element.attr("tabIndex") || null;
				if (!p.initialTabIndex)
				{
					p.$element.attr("tabIndex", "0");	// make element 'focusable'
				}
				
				window.addEventListener("mousedown", this.getDelegate(this.onMouseDown), true);
				SDL.jQuery(window).on("focusin", this.getDelegate(this.onWindowFocusIn));	// detect when focus leaves an element in the window
				SDL.jQuery(window).on("focusout", this.getDelegate(this.onWindowFocusOut));	// detect when focus goes to an element in the window
			}

			if (triggerOnResize && !p.handlingResize)
			{
				p.handlingResize = true;
				window.addEventListener("resize", this.getDelegate(this.onResize));
			}

			if (triggerOnScroll && !p.handlingScrollElement)
			{
				p.handlingScrollElement = triggerOnScroll;
				window.addEventListener("scroll", this.getDelegate(this.onScroll), true);
			}

			p.isPausedCaptureFocus = false;

			this.stopWindowFocusOut();
			this.checkFocusedElement(() => p.$element.focus());
		}

		public stopCaptureFocus()
		{
			var p = this.properties;
			if (p.capturingFocus)
			{
				p.capturingFocus = false;
				window.removeEventListener("mousedown", this.getDelegate(this.onMouseDown), true);

				if (p.handlingResize)
				{
					p.handlingResize = false;
					window.removeEventListener("resize", this.getDelegate(this.onResize));
				}

				if (p.handlingScrollElement)
				{
					p.handlingScrollElement = null;
					window.removeEventListener("scroll", this.getDelegate(this.onScroll), true);
				}

				this.cancelCheckFocusedElementAfterDelay();

				p.isWindowFocusOut = false;
				SDL.jQuery(window).off("focusin", this.getDelegate(this.onWindowFocusIn));
				SDL.jQuery(window).off("focusout", this.getDelegate(this.onWindowFocusOut));

				this.cancelCheckFocusedElementAfterDelay();

				if (p.initialTabIndex)
				{
					p.$element.attr("tabIndex", p.initialTabIndex);
				}
				else
				{
					p.$element.removeAttr("tabIndex");
				}
			}
		}

		public pauseCaptureFocus()
		{
			this.properties.isPausedCaptureFocus = true;
		}

		private checkFocusedElement(focusOutHandler?: () => void)
		{
			var p = this.properties;

			this.cancelCheckFocusedElementAfterDelay();

			if (p.capturingFocus && !p.isPausedCaptureFocus)
			{
				if (p.element.contains(<HTMLElement>document.activeElement))
				{
					// focus is inside the element
					if (p.isWindowFocusOut)
					{
						// when focus goes into an iframe, there's no event triggered when the iframe loses the focus (Chrome and FF)
						// -> monitor it with timeout
						this.checkFocusedElementAfterDelay(500);
					}
				}
				else if (p.isWindowFocusOut && (!document.activeElement || document.activeElement == document.body))
				{
					// focus is not in the window
					// focus will not be fired if click in an iframe inside the window
					// -> monitor it with timeout
					this.checkFocusedElementAfterDelay(500);
				}
				else
				{
					focusOutHandler ? focusOutHandler() : this.handleFocusOut();
				}
			}
		}

		private onMouseDown(e: Event)
		{
			if (!this.properties.element.contains(<HTMLElement>e.target))
			{
				this.handleFocusOut();
			}
		}

		private onWindowFocusOut(e: any)
		{
			var p = this.properties;
			if (p.capturingFocus && !p.isPausedCaptureFocus)
			{
				p.isWindowFocusOut = true;

				if (!e || !e.relatedTarget)
				{
					this.checkFocusedElementAfterDelay();
				}
				else if (!p.element.contains(e.relatedTarget))
				{
					this.handleFocusOut();
				}
				else
				{
					// focusin will not be fired if click in an iframe inside the window
					// -> monitor it with timeout
					this.checkFocusedElementAfterDelay(500);
				}
			}
		}

		private onWindowFocusIn()
		{
			this.stopWindowFocusOut();
			this.checkFocusedElementAfterDelay();
		}

		private stopWindowFocusOut()
		{
			this.properties.isWindowFocusOut = false;
		}

		private checkFocusedElementAfterDelay(delay?: number)
		{
			var p = this.properties;
			if (p.capturingFocus && !p.isPausedCaptureFocus)
			{
				if (!p.checkFocusedElementTimeout)
				{
					p.checkFocusedElementTimeout = window.setTimeout(this.checkFocusedElement.bind(this), delay);
				}
				else if (!delay)
				{
					window.clearTimeout(p.checkFocusedElementTimeout);
					p.checkFocusedElementTimeout = window.setTimeout(this.checkFocusedElement.bind(this), delay);
				}
			}
		}

		private cancelCheckFocusedElementAfterDelay()
		{
			var p = this.properties;
			if (p.checkFocusedElementTimeout)
			{
				window.clearTimeout(p.checkFocusedElementTimeout);
				p.checkFocusedElementTimeout = null;
			}
		}

		private onScroll(e: JQueryEventObject)
		{
			var p = this.properties;
			if (!p.isPausedCaptureFocus &&
				(e.target == p.handlingScrollElement || (<HTMLElement>e.target).contains(p.handlingScrollElement)))
			{
				// trigger focusout if scrolling is not inside the element
				this.handleFocusOut();
			}
		}

		private onResize(e: JQueryEventObject)
		{
			if (!this.properties.isPausedCaptureFocus)
			{
				this.handleFocusOut();
			}
		}
	}

	FocusableControlBase.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$FocusableControlBase$disposeInterface()
	{
		this.stopCaptureFocus();
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Core.Controls.FocusableControlBase", FocusableControlBase);
} 