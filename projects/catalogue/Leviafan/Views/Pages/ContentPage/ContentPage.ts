/// <reference path="../../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />

module LVF.Views.Pages
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class ContentPage extends SDL.UI.Core.Views.ViewBase
    {
        constructor(element: HTMLElement, settings?: any)
        {
            debugger;
            super(element, settings);
        }

        public getRenderOptions()
        {
            var p: any = this.properties;
            var store = LVF.Models.Factory.getSystemRoot();
            var list: Models.ProductList = store.getCollectionList();
            var item: ViewModelItems.CollectionList = new LVF.ViewModelItems.CollectionList(list);

            var view = p.model = new LVF.ViewModels.CollectionList(item);

            list.load(true);

            return view;
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Views.Pages.ContentPage", ContentPage)
}

