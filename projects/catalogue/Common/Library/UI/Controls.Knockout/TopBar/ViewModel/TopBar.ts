/// <reference path="../../../SDL.Client.Core/Application/Application.d.ts" />
/// <reference path="../../../SDL.Client.UI.Core.Knockout/ViewModels/ViewModelBase.d.ts" />
/// <reference path="../../../SDL.Client.UI.Controls/TopBar/Application/TopBar.d.ts" />

module SDL.UI.Controls.Knockout.Application.ViewModels
{
	export interface ITopBarRibbonTab
	{
		id: KnockoutObservable<string>;
		label: KnockoutObservable<string>;
		hidden?: KnockoutObservable<boolean>;
	}

	export interface ITopBarButtonPosition
	{
		left?: KnockoutObservable<number>;
		right?: KnockoutObservable<number>;
	}

	export interface ITopBarButtonOptions
	{
		hidden?: KnockoutObservable<boolean>;
		selected?: KnockoutObservable<boolean>;
		position?: ITopBarButtonPosition;
	}

	export interface ITopBarButtonWithValueOptions extends ITopBarButtonOptions
	{
		value?: KnockoutObservable<number>;
	}

	export interface ITopBarButtonUserOptions extends ITopBarButtonOptions
	{
		isLoggedIn?: KnockoutObservable<boolean>;
		isPicture?: KnockoutObservable<boolean>;
		pictureUrl?: KnockoutObservable<string>;
	}

	export interface ITopBarButtons
	{
		workflows?: ITopBarButtonWithValueOptions;
		notifications?: ITopBarButtonWithValueOptions;
		messages?: ITopBarButtonWithValueOptions;
		user?: ITopBarButtonUserOptions;
		search?: ITopBarButtonOptions;
		help?: ITopBarButtonOptions;
		close?: KnockoutObservable<boolean>;
	}

	export interface ITopBar
	{
		ribbonTabs?: KnockoutObservableArray<ITopBarRibbonTab>;
		selectedRibbonTabId?: KnockoutObservable<string>;
		buttons?: ITopBarButtons;
		onCloseClick?: () => void;
	};

	eval(SDL.Client.Types.OO.enableCustomInheritance);
    export class TopBar extends SDL.UI.Core.Knockout.ViewModels.ViewModelBase implements ITopBar
	{
		public ribbonTabs: KnockoutObservableArray<ITopBarRibbonTab>;
		public selectedRibbonTabId: KnockoutObservable<string>;
		public buttons: ITopBarButtons;

		public onCloseClick: () => void;

		private computedOptions: KnockoutComputed<SDL.UI.Controls.ITopBarOptions>;
	
		constructor(ribbonTabs?: ITopBarRibbonTab[], selectedRibbonTabId?: KnockoutObservable<string>, buttons?: ITopBarButtons)
		{
			super();

			this.ribbonTabs = ko.observableArray(<any[]>ribbonTabs || []);
			this.selectedRibbonTabId = ko.isObservable(this.selectedRibbonTabId) ? selectedRibbonTabId : ko.observable(<any>selectedRibbonTabId);
			this.buttons = buttons;
		}

		$initialize()
		{
			SDL.Client.Event.EventRegister.addEventHandler(SDL.UI.Controls.Application.TopBar, "*", this.getDelegate(this.onTopBarEvent));
			this.computedOptions = ko.computed(this.getDelegate(this.pushTopBarOptions));
		}

		private pushTopBarOptions(): SDL.UI.Controls.ITopBarOptions
		{
			var topBarOptions: SDL.UI.Controls.ITopBarOptions = <SDL.UI.Controls.ITopBarOptions>{
				ribbonTabs: <SDL.UI.Controls.ITopBarRibbonTab[]>SDL.UI.Core.Knockout.Utils.unwrapRecursive(this.ribbonTabs),
				selectedRibbonTabId: this.selectedRibbonTabId(),
				buttons: <SDL.UI.Controls.ITopBarButtons>SDL.UI.Core.Knockout.Utils.unwrapRecursive(this.buttons)
			};
			SDL.UI.Controls.Application.TopBar.setOptions(topBarOptions);
			return topBarOptions;
		}

		private onTopBarEvent(e: SDL.Client.Event.Event)
		{
			switch (e.type)
			{
				case "ribbonselectionchange":
					this.selectedRibbonTabId(e.data.id);
					break;
				case "clickbutton":
					if (e.data.button == "close"  && this.onCloseClick)
					{
						this.onCloseClick();
					}
					break;
				case "showbutton":
					var buttonOptions = <ITopBarButtonOptions>(<any>this.buttons)[e.data.button];
					if (buttonOptions)
					{
						if (e.data.button == "close")
						{
							if (ko.isObservable(this.buttons.close))
							{
								this.buttons.close(true);
							}
						}
						else if (ko.isObservable(buttonOptions.hidden))
						{
							buttonOptions.hidden(false);
						}
					}
					break;
				case "hidebutton":
					var buttonOptions = <ITopBarButtonOptions>(<any>this.buttons)[e.data.button];
					if (buttonOptions)
					{
						if (e.data.button == "close")
						{
							if (ko.isObservable(this.buttons.close))
							{
								this.buttons.close(false);
							}
						}
						else if (ko.isObservable(buttonOptions.hidden))
						{
							buttonOptions.hidden(true);
						}
					}
					break;
				case "selectbutton":
					var buttonOptions = <ITopBarButtonOptions>(<any>this.buttons)[e.data.button];
					if (buttonOptions && ko.isObservable(buttonOptions.selected))
					{
						buttonOptions.selected(true);
					}
					break;
				case "unselectbutton":
					var buttonOptions = <ITopBarButtonOptions>(<any>this.buttons)[e.data.button];
					if (buttonOptions && ko.isObservable(buttonOptions.selected))
					{
						buttonOptions.selected(false);
					}
					break;
				case "positionbutton":
					var buttonOptions = <ITopBarButtonOptions>(<any>this.buttons)[e.data.button];
					if (buttonOptions)
					{
						if (ko.isObservable(buttonOptions.position.left))
						{
							buttonOptions.position.left(e.data.position.left);
						}
						if (ko.isObservable(buttonOptions.position.right))
						{
							buttonOptions.position.right(e.data.position.right);
						}
					}
					break;
					
			}
		}
	}

	TopBar.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function disposeInterface()
	{
		var _this: any = this;

		if (_this.computedOptions)
		{
			(<KnockoutComputed<SDL.UI.Controls.ITopBarOptions>>_this.computedOptions).dispose();
			_this.computedOptions = null;
		}
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Knockout.Application.ViewModels.TopBar", TopBar);
}