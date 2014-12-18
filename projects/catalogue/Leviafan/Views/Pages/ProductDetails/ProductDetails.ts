/// <reference path="../../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../../../Models/Factory.ts" />
/// <reference path="../../../ViewModels/ProductList.ts" />
/// <reference path="../../../ViewModelItems/ProductList.ts" />

module LVF.Views.Pages
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class ProductDetails extends SDL.UI.Core.Views.ViewBase
    {
        constructor(element: HTMLElement, settings?: any)
        {
            super(element, settings);
        }

        public getRenderOptions(): any
        {
            var p: any = this.properties;
            var s: any = p.settings;
            var product = LVF.Models.Factory.getItem(s.id);
            var item: ViewModelItems.Product = new LVF.ViewModelItems.Product(product);

            var viewModel = p.model = new LVF.ViewModels.Product(item, this);

            product.load(true);

            return viewModel;
        }

        public getModel()
        {
            return this.properties.model;
        }
    }

    ProductDetails.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function ()
    {
        var p = this.properties;

        p.model.dispose();
    });

    SDL.Client.Types.OO.createInterface("LVF.Views.Pages.ProductDetails", ProductDetails);
    SDL.UI.Core.Knockout.BindingHandlers.enableKnockoutObservableSettings("LVF.Views.Pages.ProductDetails");


}

