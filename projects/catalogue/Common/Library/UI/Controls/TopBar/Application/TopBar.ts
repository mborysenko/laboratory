/// <reference path="../../../SDL.Client.Core/Application/Application.d.ts" />
/// <reference path="../../../SDL.Client.Core/Application/ApplicationHost.d.ts" />
/// <reference path="../../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../TopBar.ts" />

module SDL.UI.Controls.Application
{
	export interface ITopBar extends SDL.Client.Types.IObjectWithEvents
	{
		setOptions(options: SDL.UI.Controls.ITopBarOptions): void;
	}

	var topBar: SDL.UI.Controls.TopBar;

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class TopBarClass extends SDL.Client.Types.ObjectWithEvents implements ITopBar
	{
		private optionsToApply: SDL.UI.Controls.ITopBarOptions;
		$initialize()
		{
			this.callBase("SDL.Client.Types.ObjectWithEvents", "$initialize");
			if (SDL.Client.Application.isHosted && SDL.Client.Application.ApplicationHost.isSupported("showTopBar"))
			{
				SDL.Client.Application.ApplicationHost.addEventListener("topbarevent", this.getDelegate((e: {type: string; data: { type: string; data: any }}) =>
					{
						this.fireEvent(e.data.type, e.data.data);
					}));
				SDL.Client.Application.ApplicationHost.showTopBar();
			}
			else
			{
				topBar = null;
				var topBarElement: HTMLDivElement = document.createElement("div");
				document.body.appendChild(topBarElement);

				SDL.Client.Resources.ResourceManager.load("SDL.UI.Controls.TopBar", () =>
					{
						var options: SDL.UI.Controls.ITopBarOptions;
						if (this.optionsToApply)
						{
							options = this.optionsToApply;
							this.optionsToApply = null;
						}

						SDL.UI.Core.Renderers.ControlRenderer.renderControl("SDL.UI.Controls.TopBar", topBarElement, options, (control: SDL.UI.Controls.TopBar) =>
						{
							topBar = control;
							SDL.Client.Event.EventRegister.addEventHandler(window, "unload", () => { topBar.dispose(); });
							SDL.Client.Event.EventRegister.addEventHandler(topBar, "*", this.getDelegate((e: SDL.Client.Event.Event) =>
							{
								this.fireEvent(e.type, e.data);
							}));

							if (this.optionsToApply)
							{
								topBar.update(this.optionsToApply);
								this.optionsToApply = null;
							}
						});
					});
			}
		}

		setOptions(options: SDL.Client.Application.ITopBarOptions): void
		{
			if (topBar === undefined)
			{
				SDL.Client.Application.ApplicationHost.setTopBarOptions(options);
			}
			else if (topBar)
			{
				topBar.update(options);
			}
			else
			{
				this.optionsToApply = options;
			}
		}
	}

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Application.TopBarClass", TopBarClass);

	// using [new SDL.UI.Controls.Application["TopBarClass"]()] instead of [new TopBarClass()]
	// because [new TopBarClass()] would refer to the closure, not the interface defined in the line above
	export var TopBar: ITopBar = new (<any>SDL.UI.Controls.Application)["TopBarClass"]();
}