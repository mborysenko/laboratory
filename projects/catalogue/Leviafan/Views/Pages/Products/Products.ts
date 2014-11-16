/// <reference path="../../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../../../Models/Factory.ts" />

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
            debugger;
            var store = LVF.Models.Factory.getSystemRoot();
            var list: any = store.getProductList();

            //var model = this.properties.model = new SDL.Authoring.ViewModels.EngineList(list);

            list.load();

            return list;
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Views.Pages.Products", Products)
}

