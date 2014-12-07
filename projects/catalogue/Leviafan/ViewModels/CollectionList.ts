/// <reference path="../../Common/Library/UI/Core.Knockout/ViewModels/ViewModel.d.ts" />
/// <reference path="../../Common/Library/Core/Application/ApplicationHost.d.ts" />
/// <reference path="../Models/ProductList.ts" />
/// <reference path="../ViewModelItems/ProductList.ts" />

module LVF.ViewModels
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class CollectionList extends SDL.UI.Core.Knockout.ViewModels.ViewModel
    {

    }
    SDL.Client.Types.OO.createInterface("LVF.ViewModels.CollectionList", CollectionList);
}