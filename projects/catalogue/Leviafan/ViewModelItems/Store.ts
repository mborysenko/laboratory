/// <reference path="../../Common/Library/UI/Core.Knockout/ViewModels/ViewModel.d.ts" />
/// <reference path="../../Common/Library/UI/Core.Knockout/ViewModels/ViewModelItem.d.ts" />
/// <reference path="../../Common/Library/Core/Application/ApplicationHost.d.ts" />
/// <reference path="../../Common/Library/Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../Models/Store.ts" />
/// <reference path="../ViewModels/Store.ts" />
/// <reference path="../Models/Store.ts" />

module LVF.ViewModelItems
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Store extends SDL.UI.Core.Knockout.ViewModels.ViewModelItem
    {
        public items: KnockoutObservableArray<any>;
        public _items: KnockoutObservableArray<any>;

        constructor(item: Models.Store)
        {
            this.items = ko.observableArray();

            var properties: { [property: string]: SDL.UI.Core.Knockout.ViewModels.IPropertyDef; } = {};
            var methods: { [property: string]: SDL.UI.Core.Knockout.ViewModels.IMethodDef; } = {};

            super(item, properties, methods);
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.ViewModelItems.Store", Store);
}