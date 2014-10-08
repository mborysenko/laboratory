/// <reference path="../../SDL.Client.UI.Core/Controls/FocusableControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Css/ZIndexManager.d.ts" />
/// <reference path="../ActionBar/ActionBar.jQuery.ts" />

module SDL.UI.Controls
{
	export interface IDialogOptions extends IActionBarOptions
	{
		visible?: boolean;
		title: string;
	}

	export interface IDialogProperties extends SDL.UI.Core.Controls.IFocusableControlBaseProperties
	{
		options: IDialogOptions;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class Dialog extends SDL.UI.Core.Controls.FocusableControlBase
	{
		public properties: IDialogProperties;

		private $element: JQuery;
		private $actionbar: JQuery;
		private isVisible: boolean;
		private $header: JQuery;

		static $screen: JQuery;
		static shownDialogs: Dialog[] = [];

		constructor(element: HTMLElement, options?: IDialogOptions)
		{
			super(element, options || {});
		}

		$initialize(): void
		{
			this.callBase("SDL.UI.Core.Controls.FocusableControlBase", "$initialize");

			var p = this.properties;
			var $element = this.$element = SDL.jQuery(p.element);

			$element.addClass("sdl-dialog");

			if (p.options.title)
			{
				this.createHeaderBar();
			}

			if (p.options.actions && p.options.actions.length || p.options.actionFlag)
			{
				this.createActionBar();
			}

			if (p.options.visible != null && p.options.visible.toString() == "false")	// show by default, unless visibility is set to false or "false"
			{
				this.hide();
			}
			else
			{
				this.show();
			}
		}

		public update(options?: IDialogOptions): void
		{
			this.callBase("SDL.UI.Core.Controls.FocusableControlBase", "update", [options]);

			var p = this.properties;

			if (p.options.visible != null && p.options.visible.toString() == "false")
			{
				if ((!p.options.actions || !p.options.actions.length) && !p.options.actionFlag)
				{
					this.removeActionBar();
				}
				this.hide();
			}
			else if (p.options.visible || this.isVisible)
			{
				if (p.options.title)
				{
					this.createHeaderBar();
				}
				else
				{
					this.removeHeaderBar();
				}

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

				SDL.UI.Core.Css.ZIndexManager.setNextZIndex(this.properties.element, true);
				Dialog.shownDialogs.push(this);

				Dialog.updateScreen();
				

				setTimeout(() =>	// timeout to allow the content to finish rendering for proper dimensions
					{
						this.$element.removeClass("sdl-dialog-hidden")
							.keydown(this.getDelegate(this.onKeyDown));
						this.position();
						SDL.jQuery(window).on("resize", this.getDelegate(this.position));
						this.startCaptureFocus();
						this.fireEvent("propertychange", { property: "visible", value: true });
						this.fireEvent("show");
					});
			}
		}

		public hide(): void
		{
			if (this.isVisible != false)
			{
				this.isVisible = false;
				this.$element.addClass("sdl-dialog-hidden");
				this.onHide();
				this.fireEvent("propertychange", { property: "visible", value: false });
				this.fireEvent("hide");
			}
		}

		private createHeaderBar()
		{
			var options = this.properties.options;
			if (!this.$header)
			{
				this.$header = SDL.jQuery("<div class='sdl-dialog-header'><label></label><button>&times;</button></div>").prependTo(this.$element);
				this.$header.children("button").button().click(this.getDelegate(this.executeCloseAction));
			}
			this.$header.children(":first-child").text(options.title || "");
		}

		private removeHeaderBar()
		{
			if (this.$header)
			{
				(<JQueryButton>this.$header.children("button").button()
					.off("click", this.getDelegate(this.executeCloseAction)))
					.dispose();

				this.$header.remove();
				this.$header = null;
			}
		}

		private position()
		{
			var body = document.body;
			var element = this.properties.element;

			element.style.left = ((body.clientWidth - element.offsetWidth) >> 1) + "px";	// >> 1 is division by 2
			element.style.top = ((body.clientHeight - element.offsetHeight) >> 1) + "px";
		}

		private onHide()
		{
			SDL.jQuery(window).off("resize", this.getDelegate(this.position));
			this.stopCaptureFocus();
			this.$element.off("keydown", this.getDelegate(this.onKeyDown));

			SDL.UI.Core.Css.ZIndexManager.releaseZIndex(this.properties.element);
			
			var index = Dialog.shownDialogs.indexOf(this);
			if (index != -1)
			{
				Dialog.shownDialogs.splice(index, 1);
			}

			Dialog.updateScreen();
		}

		public handleFocusOut()
		{
			if (Dialog.getTopmostDialog() == this)
			{
				this.$element.focus();
			}
		}

		public getActionsFlag(): boolean
		{
			return this.$actionbar ? this.$actionbar.actionBar().getActionFlag() : null;
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

		private createActionBar()
		{
			var options = this.properties.options;
			this.$actionbar = SDL.jQuery("<div class='sdl-dialog-actionbar'></div>")
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

		private static updateScreen()
		{
			if (Dialog.shownDialogs.length)
			{
				if (!Dialog.$screen)
				{
					Dialog.$screen = SDL.jQuery("<div class='sdl-dialog-screen'></div>");
				}

				var topmostDialogElement: HTMLElement = Dialog.getTopmostDialog().getElement();
				var screen: HTMLElement = Dialog.$screen[0];

				SDL.UI.Core.Css.ZIndexManager.insertZIndexBefore(screen, topmostDialogElement);
				if (screen.parentElement != topmostDialogElement.parentElement)
				{
					topmostDialogElement.parentElement.insertBefore(screen, topmostDialogElement.parentElement.firstChild);
				}

				try
				{
					topmostDialogElement.focus();
				}
				catch (err)
				{}
			}
			else if (Dialog.$screen)
			{
				SDL.UI.Core.Css.ZIndexManager.releaseZIndex(Dialog.$screen[0]);
				Dialog.$screen.remove();
				Dialog.$screen = null;
			}
		}

		private static getTopmostDialog(): Dialog
		{
			var topmostDialog: Dialog;
			var topmostDialogElement: HTMLElement;
			if (Dialog.shownDialogs.length)
			{
				var newZIndex = -1;
				for (var i = Dialog.shownDialogs.length - 1; i >= 0; i--)
				{
					var dialogElement = Dialog.shownDialogs[i].getElement();
					var zIndex = SDL.UI.Core.Css.ZIndexManager.getZIndex(dialogElement);
					if (zIndex > newZIndex)
					{
						topmostDialog = Dialog.shownDialogs[i];
						topmostDialogElement = dialogElement;
						newZIndex = zIndex;
					}
				}
			}
			return topmostDialog;
		}

		private cleanUp()
		{
			var $element = this.$element;

			this.onHide();
			this.removeHeaderBar();
			this.removeActionBar();
			$element.removeClass("sdl-dialog sdl-dialog-hidden");

			this.$element = null;
		}
	}

	Dialog.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Dialog$disposeInterface()
	{
		this.cleanUp();
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Dialog", Dialog);
} 