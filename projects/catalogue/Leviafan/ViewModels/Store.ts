/// <reference path="../../Common/Library/UI/Core.Knockout/ViewModels/ViewModel.d.ts" />
/// <reference path="../../Common/Library/Core/Application/ApplicationHost.d.ts" />
/// <reference path="../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../Models/ProductList.ts" />
/// <reference path="../ViewModelItems/ProductList.ts" />

module LVF.ViewModels
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Store extends SDL.UI.Core.Knockout.ViewModels.ViewModel
    {
        public currentPage: KnockoutObservable<string>;

        public isModalWindowOpened: KnockoutObservable<boolean>;
        public modalWindowOptions: KnockoutObservable<any>;

        constructor(item: SDL.UI.Core.Knockout.ViewModels.ViewModelItem, view?: SDL.UI.Core.Views.ViewBase)
        {
            super(item, view);

            this.currentPage = ko.observable("LVF.Views.Pages.Products");

            this.isModalWindowOpened = ko.observable(false);
            this.modalWindowOptions = ko.observable();
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.ViewModels.Store", Store);
}