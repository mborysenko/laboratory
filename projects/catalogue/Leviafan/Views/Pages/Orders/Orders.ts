/// <reference path="../../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />

module LVF.Views.Pages
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Orders extends SDL.UI.Core.Views.ViewBase
    {
        constructor(element: HTMLElement, settings?: any)
        {
            super(element, settings);
        }

        public getRenderOptions()
        {
            return this;
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Views.Pages.Orders", Orders)
}

