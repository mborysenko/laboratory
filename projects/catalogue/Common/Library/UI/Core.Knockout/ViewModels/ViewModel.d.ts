/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Models/Models.d.ts" />
/// <reference path="ViewModelBase.d.ts" />
/// <reference path="ViewModelItem.d.ts" />
declare module SDL.UI.Core.Knockout.ViewModels {
    class ViewModel extends ViewModelBase {
        public item: ViewModelItem;
        constructor(item: ViewModelItem);
    }
}
