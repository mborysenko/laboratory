/**
 * Created with PhpStorm.
 * User: mborysenko
 * Date: 15.10.2014
 * Time: 10:16
 * To change this template use File | Settings | File Templates.
 */
/// <reference path="../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />

module LVF.Views
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class Navigation extends SDL.UI.Core.Views.ViewBase
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

    SDL.Client.Types.OO.createInterface("LVF.Views.Navigation", Navigation)
}


