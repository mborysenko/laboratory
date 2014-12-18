/// <reference path="../../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../../../Models/Factory.ts" />
/// <reference path="../../../ViewModels/ProductList.ts" />
/// <reference path="../../../ViewModelItems/ProductList.ts" />

module LVF.Views.Pages
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Products extends SDL.UI.Core.Views.ViewBase
    {
        constructor(element: HTMLElement, settings?: any)
        {
            super(element, settings);
        }

        public getRenderOptions(): any
        {
            var p: any = this.properties;
            var s: any = p.settings;
            var store = LVF.Models.Factory.getSystemRoot();
            var list: Models.ProductList = store.getProductList();
            var item: ViewModelItems.ProductList = new LVF.ViewModelItems.ProductList(list);

            var viewModel = p.model = new LVF.ViewModels.ProductList(item, this);
            viewModel.setExternalOptions(s);

            list.load(true);

            return viewModel;
        }

        public getModel()
        {
            return this.properties.model;
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Views.Pages.Products", Products);
    SDL.UI.Core.Knockout.BindingHandlers.enableKnockoutObservableSettings("LVF.Views.Pages.Products");


}

