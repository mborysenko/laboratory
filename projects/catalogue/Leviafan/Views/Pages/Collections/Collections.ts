/// <reference path="../../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../../../ViewModelItems/CollectionList.ts" />
/// <reference path="../../../Models/CollectionList.ts" />
/// <reference path="../../../Models/Factory.ts" />

module LVF.Views.Pages
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Collections extends SDL.UI.Core.Views.ViewBase
    {
        constructor(element: HTMLElement, settings?: any)
        {
            super(element, settings);
        }

        public getRenderOptions()
        {
            var p: any = this.properties;
            var store = LVF.Models.Factory.getSystemRoot();
            var list: Models.CollectionList = store.getCollectionList();
            var item: ViewModelItems.CollectionList = new LVF.ViewModelItems.CollectionList(list);

            var view = p.model = new LVF.ViewModels.CollectionList(item);

            list.load(true);

            return view;
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Views.Pages.Collections", Collections)
}

