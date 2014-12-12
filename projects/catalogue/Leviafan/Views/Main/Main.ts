/// <reference path="../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../Common/Library/Core/Event/EventRegister.d.ts" />
/// <reference path="../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../../../Common/Library/UI/Core.Knockout/Libraries/knockout/knockout.d.ts" />
/// <reference path="../../../Common/Library/Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../../Common/Library/Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../Models/Factory.ts" />
/// <reference path="../../Models/Store.ts" />
/// <reference path="../../ViewModels/Store.ts" />
/// <reference path="../../ViewModelItems/Store.ts" />

module LVF.Views
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Main extends SDL.UI.Core.Views.ViewBase
    {
        private viewModel: SDL.UI.Core.Knockout.ViewModels.ViewModel;

        constructor(element: HTMLElement, settings?: any)
        {
            super(element, settings);

            this._initialize();
        }

        public getRenderOptions(): any
        {
            debugger;
            var item: any = new LVF.ViewModelItems.Store(LVF.Models.Factory.getSystemRoot());

            return this.viewModel = new LVF.ViewModels.Store(item);
        }

        public getViewModel(): SDL.UI.Core.Knockout.ViewModels.ViewModel
        {
            return this.viewModel
        }

        public render(callback ?: () => void): void
        {
            var _this = this;
            var cb = function ()
            {
                _this._setPageHeight();
                callback()
            };

            (<any>this).callBase("SDL.UI.Core.Views.ViewBase", "render", [cb])
        }

        private _initialize()
        {
            var _this = this;
            SDL.jQuery(window).on("resize", function ()
            {
                _this._setPageHeight();
            })
        }

        private _setPageHeight()
        {
            //alert("set page height");
        }

    }

    SDL.Client.Types.OO.createInterface("LVF.Views.Main", Main);

    SDL.UI.Core.Knockout.BindingHandlers.enableKnockoutObservableSettings("LVF.Views.Main");
}

