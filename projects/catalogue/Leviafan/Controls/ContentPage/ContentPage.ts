/// <reference path="../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../../../Common/Library/UI/Core/Controls/ControlBase.d.ts" />
/// <reference path="../../../Common/Library/UI/Core.Knockout/Libraries/knockout/knockout.d.ts" />
/// <reference path="../../../Common/Library/Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../../Common/Library/Core/Libraries/jQuery/SDL.jQuery.d.ts" />

module LVF.Controls{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class ContentPage extends SDL.UI.Core.Controls.ControlBase
    {
        constructor(element: HTMLElement, options?: any)
        {
            super(element, options);
        }

        public render()
        {
        }

        public update(options: any): void
        {
            debugger;
            console.log(options);
            this.callBase("SDL.UI.Core.Controls.ControlBase", "update", arguments);
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Controls.ContentPage", ContentPage);
}
