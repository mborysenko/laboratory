/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
/// <reference path="../Button/Button.jQuery.ts" />

module SDL.UI.Controls
{
	export interface IActionBarAction
	{
		title: string;
		action?: string;
		handler?: () => void;
		purpose?: ButtonPurpose;
		iconClass?: IButtonIconClassOption;
		disabled?: boolean;
	}

	export interface IActionBarActionFlag
	{
		label: string;
		selected: boolean;
	}

	export interface IActionBarOptions
	{
		actions?: IActionBarAction[];
		actionFlag?: IActionBarActionFlag;
	}

	export interface IActionBarProperties extends SDL.UI.Core.Controls.IControlBaseProperties
	{
		options: IActionBarOptions;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class ActionBar extends SDL.UI.Core.Controls.ControlBase
	{
		public properties: IActionBarProperties;

		private $element: JQuery;
		private $actionFlagCheckbox: JQuery;

		constructor(element: HTMLElement, options?: IActionBarOptions)
		{
			super(element, options || {});
		}

		$initialize(): void
		{
			this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

			var p = this.properties;
			var $element = this.$element = SDL.jQuery(p.element);
			p.options = SDL.jQuery.extend({}, p.options);

			if (p.options.actions && p.options.actions.length || p.options.actionFlag)
			{
				if (p.options.actionFlag)
				{
					this.createActionsFlagCheckbox();
				}

				if (p.options.actions)
				{
					var $lastInsertedElement: JQuery;		// new button will be added before this last insrted element (can be a button or a button separator)
					var isCancelAdded: boolean = false;		// only one 'cancel' button (last in the actions array) will be placed as right-most
					for (var i = p.options.actions.length - 1; i >= 0; i--)
					{
						var actionOptions = p.options.actions[i];
						if (!isCancelAdded && actionOptions.action == "cancel")
						{
							isCancelAdded = true;
							var $insertElement = this.insertActionButton(actionOptions, null, p.options.actions.length > 2);
							if (!$lastInsertedElement)
							{
								$lastInsertedElement = $insertElement;
							}
						}
						else
						{
							$lastInsertedElement = this.insertActionButton(actionOptions, $lastInsertedElement);
						}
					}
				}
			}

			$element.addClass("sdl-actionbar");
		}

		public update(options?: IActionBarOptions): void
		{
			var p = this.properties;
			var prevOptions = p.options;
			options = SDL.jQuery.extend({}, options);

			this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

			if ((!p.options.actions || !p.options.actions.length) && !p.options.actionFlag)
			{
				this.removeActionButtons();
			}
			else
			{
				var $actions: JQuery;

				// we'll try to keep the existing buttons
				var $lastInsertedElement: JQuery;
				var $prevButton: JQuery;		// existing button that can be used for a new action added next
				var $lastCancelButton: JQuery;	// previously create cancel button placed as right-most
				var $cancelSeparator: JQuery;	// reference to the separator before the last cancel button (if there are more than 2 buttons)

				var $buttons = this.$element.children("button");

				if ($buttons.length)	// there are previously created buttons -> try to reuse them
				{
					var $lastButton = $prevButton = $buttons.last();
					if ($lastButton.length && $lastButton.data("action").action == "cancel")
					{
						$lastCancelButton = $lastInsertedElement = $lastButton;
						$prevButton = $lastButton.prev();
						if (!$prevButton.is("button"))
						{
							if ($prevButton.is("div"))	// separator
							{
								$lastInsertedElement = $cancelSeparator = $prevButton;
								$prevButton = $cancelSeparator.prev("button");
							}
							else
							{
								$prevButton = null;
							}
						}
					}
				}

				if (p.options.actionFlag)
				{
					if (!this.$actionFlagCheckbox)
					{
						this.createActionsFlagCheckbox();
					}
					else
					{
						if (p.options.actionFlag.selected != null)
						{
							var checked = p.options.actionFlag.selected && p.options.actionFlag.selected.toString() != "false";
							if ((<HTMLInputElement>this.$actionFlagCheckbox[0]).checked != checked)
							{
								(<HTMLInputElement>this.$actionFlagCheckbox[0]).checked = checked;
							}
						}

						if (p.options.actionFlag.label != null)
						{
							var span = this.$actionFlagCheckbox.next("span");
							if (span.text() != p.options.actionFlag.label)
							{
								span.text(p.options.actionFlag.label);
							}
						}
					}
				}
				else
				{
					this.removeActionsFlagCheckbox();
				}

				if (p.options.actions)
				{
					var isCancelAdded: boolean = false;
					for (var i = p.options.actions.length - 1; i >= 0; i--)
					{
						var actionOptions = p.options.actions[i];
						if (!isCancelAdded && actionOptions.action == "cancel")
						{
							isCancelAdded = true;
							var $insertElement: JQuery;

							if ($lastCancelButton)
							{
								this.updateButtonData($lastCancelButton, actionOptions);
								$insertElement = (!$cancelSeparator && p.options.actions.length > 2)
									? this.insertSeparator($lastCancelButton)
									: $lastCancelButton;

								if (!$lastInsertedElement || $lastInsertedElement == $lastCancelButton)
								{
									$lastInsertedElement = $insertElement;
								}
							}
							else
							{
								$insertElement = this.insertActionButton(actionOptions, null, p.options.actions.length > 2);
								if (!$lastInsertedElement)
								{
									$lastInsertedElement = $insertElement;
								}
							}
						}
						else if ($prevButton && $prevButton.length)
						{
							this.updateButtonData($prevButton, actionOptions);
							$lastInsertedElement = $prevButton;
							$prevButton = $prevButton.prev("button");
						}
						else
						{
							$lastInsertedElement = this.insertActionButton(actionOptions, $lastInsertedElement);
						}
					}
				}

				if ($lastCancelButton && !isCancelAdded)	// remove previous cancel button if there's no cancel button anymore
				{
					this.removeActionButton($lastCancelButton);
				}

				if ($cancelSeparator && (!isCancelAdded || p.options.actions.length <= 2))	// remove previous cancel button separator if it's not needed anymore
				{
					$cancelSeparator.remove();
				}

				if ($prevButton)
				{
					this.removeActionButton($prevButton.prevAll("button").addBack());
				}
			}
		}

		public getActionFlag(): boolean
		{
			return this.$actionFlagCheckbox ? ((<HTMLInputElement>this.$actionFlagCheckbox[0]).checked) : null;
		}

		private createActionsFlagCheckbox()
		{
			if (!this.$actionFlagCheckbox)
			{
				var actionFlagData = this.properties.options.actionFlag;

				var $actionsFlagLabel = SDL.jQuery("<label></label>").prependTo(this.$element);
				var $actionsFlagText = SDL.jQuery("<span></span>").appendTo($actionsFlagLabel).text(actionFlagData.label || "")
				this.$actionFlagCheckbox = SDL.jQuery("<input type='checkbox' />")
					.attr("checked", actionFlagData.selected && actionFlagData.selected.toString() != "false")
					.click(this.getDelegate(this.onActionFlagClick))
					.prependTo($actionsFlagLabel);
			}
		}

		private removeActionsFlagCheckbox()
		{
			if (this.$actionFlagCheckbox)
			{
				this.$actionFlagCheckbox.off("click", this.removeDelegate(this.onActionFlagClick)).parent().remove();
				this.$actionFlagCheckbox = null;
			}
		}

		private onActionFlagClick(e: JQueryEventObject)
		{
			if (this.$actionFlagCheckbox)
			{
				this.fireEvent("actionflagchange", { actionFlag: (<HTMLInputElement>this.$actionFlagCheckbox[0]).checked });
				this.fireEvent("propertychange", { property: "actionFlag.selected", value: (<HTMLInputElement>this.$actionFlagCheckbox[0]).checked });
			}
		}

		private onActionClick(e: JQueryEventObject)
		{
			if (this.properties.options.actions)
			{
				var button: Button = <any>e.target;
				var action: IActionBarAction = SDL.jQuery(button.getElement()).data("action");
				if (action)
				{
					if (SDL.Client.Type.isFunction(action.handler))
					{
						action.handler();
					}
					this.fireEvent("action", {
							action: action.action,
							actionFlag: this.getActionFlag()
						});
				}
			}
		}

		private insertActionButton(actionOptions: IActionBarAction, $insertBefore: JQuery, insertSeparator: boolean = false): JQuery
		{
			var $button = SDL.jQuery("<button></button>");

			if ($insertBefore)
			{
				$button.insertBefore($insertBefore);
			}
			else
			{
				this.$element.append($button);
			}

			this.addButtonData($button, actionOptions);
			$button.button({
						disabled: actionOptions.disabled,
						iconClass: actionOptions.iconClass,
						purpose: actionOptions.purpose
					}).click(this.getDelegate(this.onActionClick));

			return insertSeparator ? this.insertSeparator($button) : $button;
		}

		private insertSeparator($button: JQuery): JQuery
		{
			return SDL.jQuery("<div></div>").insertBefore($button);
		}

		private addButtonData($button: JQuery, actionOptions: IActionBarAction): void
		{
			$button.data("action", {handler: actionOptions.handler, action: actionOptions.action}).text(actionOptions.title);
		}

		private updateButtonData($button: JQuery, actionOptions: IActionBarAction): void
		{
			var data = $button.data("action");
			data.handler = actionOptions.handler;
			data.action = actionOptions.action;
			data.disabled = actionOptions.disabled;
			data.iconClass = SDL.jQuery.extend({}, actionOptions.iconClass);
			if ($button.text() != actionOptions.title)
			{
				$button.text(actionOptions.title);
			}

			$button.button({
				disabled: actionOptions.disabled,
				iconClass: actionOptions.iconClass,
				purpose: actionOptions.purpose
			});
		}

		private removeActionButtons()
		{
			this.removeActionsFlagCheckbox();
			this.removeActionButton(this.$element.children("button"));
			this.$element.empty();
		}

		private removeActionButton($button: JQuery)
		{
			(<JQueryButton>$button.button()
					.off("click", this.getDelegate(this.onActionClick)))
					.dispose()
				.removeData().remove();
		}

		private cleanUp()
		{
			var $element = this.$element;
			var options: IActionBarOptions = this.properties.options;

			this.$element.removeClass("sdl-actionbar");

			this.removeActionButtons();

			this.$element = null;
		}
	}

	ActionBar.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$ActionBar$disposeInterface()
	{
		this.cleanUp();
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.ActionBar", ActionBar);
} 