/// <reference path="../../Common/Library/UI/Core.Knockout/ViewModels/ViewModel.d.ts" />
/// <reference path="../../Common/Library/Core/Application/ApplicationHost.d.ts" />
/// <reference path="../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../Models/ProductList.ts" />
/// <reference path="../ViewModelItems/ProductList.ts" />

module LVF.ViewModels
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export interface IActionOptions
    {
        control?: string;
        handler?: () => void;
        title?: string;
        controlOptions?: any;
        classes: string;
    }

    export interface IActions
    {
        top?: Array<IActionOptions>;
        bottom?: Array<IActionOptions>;
    }

    export class ProductList extends SDL.UI.Core.Knockout.ViewModels.ViewModel
    {
        public title: KnockoutObservable<string>;
        public actions: IActions;

        constructor(item: SDL.UI.Core.Knockout.ViewModels.ViewModelItem, view?: SDL.UI.Core.Views.ViewBase)
        {
            super(item, view);

            this.actions = {
                top: [
                    {
                        title: "Add Product",
                        handler: function handler()
                        {
                            alert("Add Product triggered");
                        },
                        control: 'button',
                        classes: "b-button __action"
                    },
                    {
                        title: "Duplicate",
                        handler: () =>
                        {
                            alert("Duplicate triggered");
                        },
                        control: 'button',
                        classes: "b-button"
                    }
                ],
                bottom: []
            };

            this.title = ko.observable(this.localize("products.page.title"));
        }

        public getActions(section: string): Array<IActionOptions>
        {
            return section && this.actions[section] ? this.actions[section] : [];
        }

    }
    SDL.Client.Types.OO.createInterface("LVF.ViewModels.ProductList", ProductList);
}