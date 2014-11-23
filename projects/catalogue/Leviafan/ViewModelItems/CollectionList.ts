/// <reference path="../../Common/Library/UI/Core.Knockout/ViewModels/ViewModel.d.ts" />
/// <reference path="../../Common/Library/Core/Application/ApplicationHost.d.ts" />
/// <reference path="../Models/ProductList.ts" />
/// <reference path="../ViewModelItems/ProductList.ts" />

module LVF.ViewModelItems
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class CollectionList extends SDL.UI.Core.Knockout.ViewModels.ViewModelItem
    {
        public items: KnockoutObservableArray<any>;
        public _items: KnockoutObservableArray<any>;

        constructor(item: Models.ProductList)
        {
            this.items = ko.observableArray();

            var properties: { [property: string]: SDL.UI.Core.Knockout.ViewModels.IPropertyDef; } = {
                _items: {
                    getter: "getItems",
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

        public _onEvent(evt: JQueryEventObject): void
        {
            this.callBase("SDL.UI.Core.Knockout.ViewModels.ViewModelItem", "_onEvent", [evt]);

            switch (evt.type)
            {
                case "load":
                    this._onLoadHandler(evt);
                    break;
                default:
            }
        }

        private _onLoadHandler(evt: JQueryEventObject): void
        {
            var list: any = this._items();

            if (list)
            {
                this.items.removeAll();
                for (var i = 0, len = list.length; i < len; i++)
                {
                    this.items.push(list[i]);
                }
            }
        }
    }
    SDL.Client.Types.OO.createInterface("LVF.ViewModelItems.CollectionList", CollectionList);
}