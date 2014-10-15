/// <reference path="../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />

module LVF.Views
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Main extends SDL.UI.Core.Views.ViewBase
    {
        constructor(element: HTMLElement, settings?: any)
        {
            super(element, settings);

            this._initialize();
        }

        public getRenderOptions()
        {
            return this;
        }

        public render(callback?: () => void): void
        {
            var _this = this;
            var cb = function()
            {
                _this._setPageHeight();
                callback()
            };
            this.callBase("SDL.UI.Core.Views.ViewBase", "render", [cb])
        }

        private _initialize()
        {
            var _this = this;
            SDL.jQuery(window).on("resize", function(){
                _this._setPageHeight();
            })
        }

        private _setPageHeight()
        {
            //alert("set page height");
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Views.Main", Main)
}

