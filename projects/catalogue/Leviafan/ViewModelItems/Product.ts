/// <reference path="../../Common/Library/UI/Core.Knockout/ViewModels/ViewModel.d.ts" />
/// <reference path="../../Common/Library/UI/Core.Knockout/ViewModels/ViewModelItem.d.ts" />
/// <reference path="../../Common/Library/Core/Application/ApplicationHost.d.ts" />
/// <reference path="../../Common/Library/Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../Models/Product.ts" />
/// <reference path="../ViewModels/Product.ts" />
/// <reference path="../Models/Product.ts" />

module LVF.ViewModelItems
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Product extends SDL.UI.Core.Knockout.ViewModels.ViewModelItem
    {
        constructor(item: Models.Product)
        {
            var properties: { [property: string]: SDL.UI.Core.Knockout.ViewModels.IPropertyDef; } = {
                loading: {
                    events: ["loading", "load", "loadfailed"]
                },
                loaded: {
                    events: ["load", "unload"]
                },
                id: {
                    events: ["load", "unload"]
                }
            };

            var methods: { [property: string]: SDL.UI.Core.Knockout.ViewModels.IMethodDef; } = {
                load: {},
                reload: {
                    method: "load",
                    args: [true]
                }
            };

            super(item, properties, methods);
        }

        private _onLoadHandler(evt: JQueryEventObject): void
        {
        }

    }

    SDL.Client.Types.OO.createInterface("LVF.ViewModelItems.Product", Product);
}