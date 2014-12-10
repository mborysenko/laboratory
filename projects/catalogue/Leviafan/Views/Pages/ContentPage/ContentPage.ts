/// <reference path="../../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../../../../Common/Library/UI/Core.Knockout/Libraries/knockout/knockout.d.ts" />
/// <reference path="../../../../Common/Library/Core/Libraries/jQuery/jQuery.d.ts" />

module LVF.Views.Pages
{
    eval(SDL.Client.Types.OO.enableCustomInheritance);

    export class ContentPage extends SDL.UI.Core.Views.ViewBase
    {
        public nestedView: KnockoutObservable<string>;
        public loading: KnockoutObservable<boolean>;
        public title: KnockoutObservable<string>;

        constructor(element: HTMLElement, settings?: any)
        {
            debugger;
            super(element, settings);

            this.nestedView = ko.observable(this.properties.settings.nestedView);
            this.loading = ko.observable(true);
            this.title = ko.observable("Content Page");
        }

        public render()
        {
            var p = this.properties;
            SDL.UI.Core.Renderers.ViewRenderer.renderView(p.settings.nestedView, SDL.jQuery("#page-content", this.getElement()), null);
            return this.callBase("SDL.UI.Core.Views.ViewBase", "render", arguments);
        }

        public getRenderOptions()
        {
            return this;
        }
    }

    SDL.Client.Types.OO.createInterface("LVF.Views.Pages.ContentPage", ContentPage)
}

