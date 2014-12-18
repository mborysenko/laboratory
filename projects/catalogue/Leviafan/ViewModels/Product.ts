/// <reference path="../../Common/Library/UI/Core.Knockout/ViewModels/ViewModel.d.ts" />
/// <reference path="../../Common/Library/Core/Application/ApplicationHost.d.ts" />
/// <reference path="../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../Models/ProductList.ts" />
/// <reference path="../ViewModelItems/ProductList.ts" />

module LVF.ViewModels
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Product extends SDL.UI.Core.Knockout.ViewModels.ViewModel
    {
        public title: KnockoutObservable<string>;
        public actions: IActions;
        public externalOptions: any;

        constructor(item: SDL.UI.Core.Knockout.ViewModels.ViewModelItem, view?: SDL.UI.Core.Views.ViewBase)
        {
            super(item, view);

            var p: any = this.properties;
            this.actions = {
                top: [
                    {
                        title: "Save",
                        handler: function handler()
                        {
                            alert("Save Product triggered");
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

            this.title = ko.computed(function ()
            {
                return this.item.name();
            }, this);
            p.subscriptions = [];
        }

        public openModal(id: string): void
        {
            var options: any = this.getExternalOptions();

            options.isModalOpened(true);
            options.modalOptions({
                innerView: "LVF.Views.Pages.ProductDetails",
                data: {
                    id: id
                }
            });
        }

        public getActions(section: string): Array<IActionOptions>
        {
            return section && this.actions[section] ? this.actions[section] : [];
        }

        public setExternalOptions(options: any): void
        {
            this.externalOptions = options;
        }

        public getExternalOptions(): any
        {
            return this.externalOptions;
        }

    }

    Product.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function ()
    {
        if(ko.isComputed(this.title))
        {
            this.title.dispose();
            this.title = null;
        }
        this.externalOptions = null;
        this.item.dispose();
        this.item = null;


        var p = this.properties;
        for (var i = 0, len = p.subscriptions.length; i < len; i++)
        {
            // Dispose all subscriptions
            p.subscriptions[i].dispose();
        }
    });

    SDL.Client.Types.OO.createInterface("LVF.ViewModels.Product", Product);
}