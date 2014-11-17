/// <reference path="../../Common/Library/UI/Core.Knockout/ViewModels/ViewModel.d.ts" />
/// <reference path="../../Common/Library/Core/Application/ApplicationHost.d.ts" />
/// <reference path="../Models/ProductList.ts" />
/// <reference path="../ViewModels/ProductList.ts" />
/// <reference path="../Models/ProductList.ts" />

module LVF.ViewModelItems
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class ProductList extends SDL.UI.Core.Knockout.ViewModels.ViewModelItem
    {
        constructor(item: Models.ProductList)
        {
            debugger;
            var properties: { [property: string]: SDL.UI.Core.Knockout.ViewModels.IPropertyDef; } = {
                items: {
                    events: ["load"]
                },
                loading: {
                    events: ["loading", "load", "loadfailed"]
                },
                loaded: {
                    events: ["load", "unload"]
                },
                count: {
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
    }

    SDL.Client.Types.OO.createInterface("LVF.ViewModelItems.ProductList", ProductList);
}