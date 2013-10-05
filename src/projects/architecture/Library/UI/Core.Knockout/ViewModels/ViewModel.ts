/// <reference path="..\..\SDL.Client.Core\Types\Types.d.ts" />
/// <reference path="..\..\SDL.Client.Core\Models\Models.d.ts" />
/// <reference path="ViewModelBase.ts" />
/// <reference path="ViewModelItem.ts" />

module SDL.UI.Core.Knockout.ViewModels
{
	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class ViewModel extends ViewModelBase
	{
		item: ViewModelItem;

		constructor(item: ViewModelItem)
		{
			super();
			this.item = item;
		}
	}

	ViewModel.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Core$ViewModels$Knockout$ViewModel$disposeInterface()
	{
		if (this.item)
		{
			//(<ViewModelItem>this.item).dispose();	// the responsibility to dispose the view model item is on the one who has created it
			this.item = undefined;
		}
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Core.Knockout.ViewModels.ViewModel", ViewModel);
}