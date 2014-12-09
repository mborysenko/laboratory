/// <reference path="../../Common/Library/UI/Core.Knockout/ViewModels/ViewModel.d.ts" />
/// <reference path="../../Common/Library/Core/Application/ApplicationHost.d.ts" />
/// <reference path="../Models/ProductList.ts" />
/// <reference path="../ViewModelItems/ProductList.ts" />

module LVF.ViewModels
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class ProductList extends SDL.UI.Core.Knockout.ViewModels.ViewModel
    {
        public title: KnockoutObservable<string>;

        constructor(item: SDL.UI.Core.Knockout.ViewModels.ViewModelItem, view?: SDL.UI.Core.Views.ViewBase)
        {
            super(item, view);

            this.title = ko.observable(this.localize("products.page.title"));
        }

    }
    SDL.Client.Types.OO.createInterface("LVF.ViewModels.ProductList", ProductList);
}