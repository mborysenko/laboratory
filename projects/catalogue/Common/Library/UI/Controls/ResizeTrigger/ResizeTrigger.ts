// http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/

/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />

module SDL.UI.Controls
{
	export interface IResizeTriggerProperties extends SDL.UI.Core.Controls.IControlBaseProperties
	{
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class ResizeTrigger extends SDL.UI.Core.Controls.ControlBase
	{
		private scrollTriggers: HTMLDivElement;
		private resettingTriggers: boolean;
		private prevWidth: number;
		private prevHeight: number;
		private afterScrollExecuteRequest: number;
		private executeAfterDelay: (fn: () => void) => number;
		private cancelExecuteAfterDelay: (request: number) => void;

		constructor(element: HTMLElement, options?: any)
		{
			super(element, options);
		}

		$initialize(): void
		{
			this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

			this.scrollTriggers = <HTMLDivElement>SDL.jQuery("<div class='sdl-resizetrigger-triggers'><div><div></div></div><div></div></div>")
				.appendTo(this.properties.element)[0];

			this.prevWidth = this.properties.element.offsetWidth;
			this.prevHeight = this.properties.element.offsetHeight;
			this.resetTriggers();

			this.executeAfterDelay = (window.requestAnimationFrame || (<any>window).webkitRequestAnimationFrame || ((fn: () => void) => window.setTimeout(fn, 20))).bind(window);
			this.cancelExecuteAfterDelay = (window.cancelAnimationFrame || (<any>window).webkitCancelAnimationFrame || window.clearTimeout).bind(window);

			this.scrollTriggers.addEventListener("scroll", this.getDelegate(this.onScroll), true);
		}

		private resetTriggers()
		{
			if (!this.resettingTriggers)
			{
				this.resettingTriggers = true;

				// when element is increased in size -> scroll position in 'expand' element will become 0
				// as the contained 'expandChild' element (initialliy 1 px larger) will fit into the dimentions of 'expand' element
				// -> it will trigger scroll event
				var expand: HTMLElement = <HTMLElement>this.scrollTriggers.firstElementChild;
				var expandChild: HTMLElement = <HTMLElement>expand.firstElementChild;

				expandChild.style.width = expand.offsetWidth + 1 + 'px';
				expandChild.style.height = expand.offsetHeight + 1 + 'px';
				expand.scrollLeft = expand.scrollWidth;	// initialize to > 0
				expand.scrollTop = expand.scrollHeight;	// initialize to > 0

				// when element is reduced in size, scroll position will be reduced -> will trigger scroll event
				var contract: HTMLElement = <HTMLElement>this.scrollTriggers.lastElementChild;
				contract.scrollLeft = contract.scrollWidth;	// initialize to maximum
				contract.scrollTop = contract.scrollHeight;	// initialize to maximum

				this.resettingTriggers = false;
			}
		}

		private onScroll(e: JQueryEventObject)
		{
			if (!this.resettingTriggers)
			{
				if (this.afterScrollExecuteRequest)
				{
					this.cancelExecuteAfterDelay(this.afterScrollExecuteRequest);
				}

				this.afterScrollExecuteRequest = this.executeAfterDelay(this.getDelegate(this.onAfterScroll));
			}
		}

		private onAfterScroll()
		{
			this.afterScrollExecuteRequest = null;
			this.resetTriggers();
			if (this.isSizeChanged())
			{
				this.prevWidth = this.properties.element.offsetWidth;
				this.prevHeight = this.properties.element.offsetHeight;
				this.fireEvent("resize");
			}
		}

		private isSizeChanged()
		{
			return this.properties.element.offsetWidth != this.prevWidth ||
				this.properties.element.offsetHeight != this.prevHeight;
		}

		private cleanUp()
		{
			if (this.scrollTriggers)
			{
				this.scrollTriggers.removeEventListener("scroll", this.removeDelegate(this.onScroll), true);
				if (this.afterScrollExecuteRequest)
				{
					this.cancelExecuteAfterDelay(this.afterScrollExecuteRequest);
				}
				SDL.jQuery(this.scrollTriggers).remove();
				this.scrollTriggers = null;
			}
		}
	}

	ResizeTrigger.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$ResizeTrigger$disposeInterface()
	{
		this.cleanUp();
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.ResizeTrigger", ResizeTrigger);
}