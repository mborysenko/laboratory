/// <reference path="../../../SDL.Client.UI.Core/Views/ViewBase.d.ts" />
/// <reference path="../../../SDL.Client.UI.Core.Knockout/ViewModels/ViewModelBase.d.ts" />

module SDL.UI.Views
{
	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class ErrorPage extends SDL.UI.Core.Views.ViewBase
	{
		private _viewModel: SDL.UI.Core.Knockout.ViewModels.ViewModelBase;

		getRenderOptions()
		{
			var model: any = this._viewModel = new SDL.UI.Core.Knockout.ViewModels.ViewModelBase();
			model.title = this.properties.settings.title || null;
			model.description = this.properties.settings.description || null;
			model.details = this.properties.settings.details || null;

			model.detailsShown = ko.observable(false);
			model.showDetails = function ()
			{
				model.detailsShown(true);
			};
			model.hideDetails = function ()
			{
				model.detailsShown(false);
			};

			return model;
		}
	}

	ErrorPage.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function disposeInterface()
	{
		if (this._viewModel)
		{
			this._viewModel.dispose();
			this._viewModel = null;
		}
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Views.ErrorPage", ErrorPage);
} 